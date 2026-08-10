from django.contrib.admin import options
from lib2to3.pgen2 import driver
from asgiref import local
from asgiref import local
from django.core.exceptions import ValidationError
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
from .fare import cal_fare
from locations.geo import get_nearby_driver_ids, get_drivers_locations
from drivers.models import DriverProfile
from .permission import IsRider
import logging
logger = logging.getLogger(__name__)

# Create your views here.
class RideCreateView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        serializer = RideCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created_ride = serializer.save(rider=request.user)

        route = engine.get_route(float(created_ride.pickup_lat), float(created_ride.pickup_lng), float(created_ride.drop_lat), float(created_ride.drop_lng))
        created_ride.route_geometry = route["geometry"]
        created_ride.route_distance_km = route["distance_km"]
        created_ride.route_duration_min = route["duration_min"]

        pickup_address = get_location_from_coord(created_ride.pickup_lat, created_ride.pickup_lng)["address"]
        drop_address = get_location_from_coord(created_ride.drop_lat, created_ride.drop_lng)["address"]
        created_ride.pickup_address = pickup_address
        created_ride.drop_address = drop_address

        created_ride.save(update_fields=["drop_address","pickup_address","route_geometry", "route_distance_km", "route_duration_min"])
        
        find_and_offer_driver(created_ride)

        ride = RideSerializer(created_ride)
        return Response(ride.data, status=http_status.HTTP_201_CREATED)


class RideDetailView(APIView):
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
            ride = transition_ride(ride_id, serializer.validated_data["status"])
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
        pickup_lat = request.query_params.get("pickup_lat")
        pickup_lng = request.query_params.get("pickup_lng")
        drop_lat = request.query_params.get("drop_lat")
        drop_lng = request.query_params.get("drop_lng")

        route = engine.get_route(pickup_lat, pickup_lng, drop_lat, drop_lng)
        distance_km = route["distance_km"]
        duration_min = route["duration_min"]
        geometry = route["geometry"]

        city = get_location_from_coord(pickup_lat, pickup_lng)["city"]
        logger.warning(f"{city}========================")
        nearby_drivers_ids = get_nearby_driver_ids(city, float(pickup_lng), float(pickup_lat))

        eligible_drivers = DriverProfile.objects.filter(user_id__in=nearby_drivers_ids, status=DriverProfile.Status.AVAILABLE, verified=True, vehicle__isnull=False,).select_related("vehicle")

        raw_location = get_drivers_locations(city, eligible_drivers)
        driver_eta = engine.batch_eta_minutes(pickup_lat, pickup_lng, raw_location)

        obj = zip(eligible_drivers, driver_eta)
        best_eta = {}

        for driver, eta in obj:
            if driver.vehicle.vehicle_type not in best_eta:
                vehicle_type = driver.vehicle.vehicle_type
                best_eta[vehicle_type] = eta
            else:
                best_eta[vehicle_type] = min(best_eta[vehicle_type], eta)

        options = []

        for vehicle_type, eta in best_eta.items():
            options.append({
                "vehicle_type": vehicle_type,
                "pickup_eta":eta,
                "duration_min": duration_min,
                "distance_km": distance_km
            })

        options.sort(key=lambda x:x["pickup_eta"])
        return Response({"options": options, "geometry": geometry})

