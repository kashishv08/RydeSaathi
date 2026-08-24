from rest_framework.generics import ListAPIView
from django.core.exceptions import ValidationError
from .fare import cal_fare
from django.shortcuts import get_object_or_404
from rest_framework import status as  http_status
from rest_framework.views import APIView
from .permission import IsRider, IsDriver
from .serializers import RideCreateSerializer, RideSerializer, RideTransitionSerializer, RideDriverAssignSerializer
from rest_framework.response import Response
from .models import Ride
from rest_framework.exceptions import PermissionDenied
from .services import transition_ride, assign_driver
from locations.routing import engine
from .matching import find_and_offer_driver, confirm_offer_accept
from .services import get_location_from_coord
from locations.geo import get_nearby_driver_ids, get_drivers_locations
from drivers.models import DriverProfile
from .permission import IsRider
from django.db.models import Q
from .tasks import check_batch_timeout, expire_ride_window
import logging
logger = logging.getLogger(__name__)

# Create your views here.
class RideCreateView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        serializer = RideCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created_ride = serializer.save(rider=request.user)

        pickup_location = get_location_from_coord(float(created_ride.pickup_lat),float(created_ride.pickup_lng))
        created_ride.city = pickup_location["city"]
        created_ride.save(update_fields=["city"])
        
        offered_driver_ids = find_and_offer_driver(created_ride)
        check_batch_timeout.apply_async(
            args=[str(created_ride.id), 1, offered_driver_ids], countdown=30  # TODO: restore to 30 in prod
        )

        expire_ride_window.apply_async(
            args=[str(created_ride.id)], countdown=60  # TODO: restore to 300 in prod
        )

        ride = RideSerializer(created_ride)
        return Response(ride.data, status=http_status.HTTP_201_CREATED)


class RideDetailView(APIView):
    authentication_classes=[]
    permission_classes = []
    def get(self, request, ride_id):
        ride = get_object_or_404(Ride, pk=ride_id)
        if request.user != ride.rider and request.user != ride.driver:
            raise PermissionDenied("You dont have access to view this ride")
        return Response(RideSerializer(ride).data)

class RideTransitionView(APIView):
    def patch(self, request, ride_id):
        ride = get_object_or_404(Ride, pk=ride_id)
        if request.user != ride.rider and request.user != ride.driver:
            raise PermissionDenied("You dont have access to modify this ride")
        
        serializer = RideTransitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            cancel_reason = serializer.validated_data.get("cancel_reason")
            ride = transition_ride(ride_id, serializer.validated_data["status"], cancel_reason)
        except ValidationError as e:
            return Response({"error":e.message},status=http_status.HTTP_400_BAD_REQUEST)
        return Response(RideSerializer(ride).data)

class RideDriverAssignView(APIView):
    def patch(self, request, ride_id):
        serializer = RideDriverAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            ride = assign_driver(ride_id, serializer.validated_data["driver_id"])
        except (ValidationError, Ride.DoesNotExist) as e:
            return Response({"error": e.message}, status=http_status.HTTP_400_BAD_REQUEST)
        return Response(RideSerializer(ride).data)

class RideDriverAccept(APIView):
    permission_classes = [IsDriver]

    def post(self, request, ride_id):
        ride = get_object_or_404(Ride, pk=ride_id)

        try:
            confirm_offer_accept(str(request.user.id), str(ride_id), ride)
        except ValidationError as e:
            return Response(
                {"error": e.message if hasattr(e, "message") else str(e)},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        ride.refresh_from_db()
        return Response(RideSerializer(ride).data)

class RideSearchView(APIView):
    permission_classes = [IsRider]

    def get(self, request):
        try:
            pickup_lat = request.query_params.get("pickup_lat")
            pickup_lng = request.query_params.get("pickup_lng")
            distance_km = request.query_params.get("distance_km")
            duration_min = request.query_params.get("duration_min")

            if not all([pickup_lat, pickup_lng, distance_km, duration_min]):
                return Response(
                    {"message": "Missing required parameters: pickup_lat, pickup_lng, distance_km, duration_min."},
                    status=http_status.HTTP_400_BAD_REQUEST
                )

            try:
                pickup_lat = float(pickup_lat)
                pickup_lng = float(pickup_lng)
                distance_km = float(distance_km)
                duration_min = float(duration_min)
            except ValueError:
                return Response(
                    {"message": "Invalid parameters. All lat/lng and distance/duration values must be numbers."},
                    status=http_status.HTTP_400_BAD_REQUEST
                )

            logger.warning(f"[RideSearch] params: pickup=({pickup_lat},{pickup_lng}) distance={distance_km} duration={duration_min}")

            try:
                city_result = get_location_from_coord(pickup_lat, pickup_lng)
                city = city_result.get("city")
                if not city:
                    raise ValueError("City could not be resolved from coordinates.")
            except Exception as e:
                logger.error(f"[RideSearch] City resolution failed: {e}")
                return Response(
                    {"message": "Could not determine city from pickup location."},
                    status=http_status.HTTP_422_UNPROCESSABLE_ENTITY
                )

            logger.warning(f"[RideSearch] resolved city: '{city}'")

            try:
                nearby_drivers_ids = get_nearby_driver_ids(city, pickup_lng, pickup_lat)
                logger.warning(f"[RideSearch] nearby_driver_ids from Redis: {nearby_drivers_ids}")
            except Exception as e:
                logger.error(f"[RideSearch] Redis geo lookup failed: {e}")
                return Response(
                    {"message": "Failed to query nearby drivers. Please try again."},
                    status=http_status.HTTP_503_SERVICE_UNAVAILABLE
                )

            if not nearby_drivers_ids:
                return Response(
                    {"message": "No drivers available near your pickup location. Please try again shortly."},
                    status=http_status.HTTP_404_NOT_FOUND
                )

            eligible_drivers = DriverProfile.objects.filter(
                user_id__in=nearby_drivers_ids,
                status=DriverProfile.Status.AVAILABLE,
                verified=True,
                vehicle__isnull=False,
            ).select_related("vehicle")

            logger.warning(f"[RideSearch] eligible_drivers count: {eligible_drivers.count()}")

            if not eligible_drivers.exists():
                return Response(
                    {"message": "No verified drivers with a vehicle are available right now."},
                    status=http_status.HTTP_404_NOT_FOUND
                )

            try:
                raw_location = get_drivers_locations(city, eligible_drivers)
                logger.warning(f"[RideSearch] raw_location from Redis: {raw_location}")
                if not raw_location or all(loc is None for loc in raw_location):
                    raise ValueError("All driver locations are missing from Redis.")
            except Exception as e:
                logger.error(f"[RideSearch] Driver location fetch failed: {e}")
                return Response(
                    {"message": "Could not retrieve driver locations. Please try again."},
                    status=http_status.HTTP_503_SERVICE_UNAVAILABLE
                )

            try:
                destinations = [(loc[1], loc[0]) for loc in raw_location if loc is not None]
                driver_eta = engine.batch_eta_minutes(pickup_lat, pickup_lng, destinations)
                logger.warning(f"[RideSearch] driver_eta: {driver_eta}")
                if not driver_eta:
                    raise ValueError("ETA engine returned empty results.")
            except Exception as e:
                logger.error(f"[RideSearch] ETA calculation failed: {e}")
                return Response(
                    {"message": "Could not calculate driver ETAs. Please try again."},
                    status=http_status.HTTP_503_SERVICE_UNAVAILABLE
                )

            best_eta = {}
            for driver, eta in zip(eligible_drivers, driver_eta):
                vehicle_type = driver.vehicle.vehicle_type
                if vehicle_type not in best_eta:
                    best_eta[vehicle_type] = eta
                else:
                    best_eta[vehicle_type] = min(best_eta[vehicle_type], eta)

            options = [
                {
                    "vehicle_type": vt, 
                    "pickup_eta": eta,
                    "fare": cal_fare(vt, distance_km, duration_min)
                }
                for vt, eta in best_eta.items()
            ]
            options.sort(key=lambda x: x["pickup_eta"])

            logger.warning(f"[RideSearch] final options: {options}")
            return Response({"options": options})

        except Exception as e:
            logger.error(f"[RideSearch] Unhandled EXCEPTION: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)


class CurrentRideView(APIView):
    def get(self, request):
        active_ride = Ride.objects.filter(
            Q(rider=request.user) | Q(driver=request.user)
        ).filter(
            Q(status__in=[Ride.Status.REQUESTED, Ride.Status.ACCEPTED, Ride.Status.ARRIVED, Ride.Status.IN_PROGRESS]) |
            Q(status=Ride.Status.COMPLETED, ride_payment__status="PENDING")
        ).order_by("-requested_at").first()
        if active_ride:
            return Response(RideSerializer(active_ride).data)
        return Response(status=http_status.HTTP_204_NO_CONTENT)

class AllRideView(ListAPIView):
    serializer_class = RideSerializer

    def get_queryset(self):
        return Ride.objects.filter(Q(rider=self.request.user) | Q(driver=self.request.user), status__in=[Ride.Status.COMPLETED, Ride.Status.CANCELLED]).order_by("-requested_at")

        

