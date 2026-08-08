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

        created_ride.save(update_fields=["route_geometry", "route_distance_km", "route_duration_min"])
        
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
        try:
            confirm_offer_accept(str(request.user.id), str(ride_id))
        except ValidationError as e:
            return Response(
                {"error": e.message if hasattr(e, "message") else str(e)},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        ride = get_object_or_404(Ride, pk=ride_id)
        return Response(RideSerializer(ride).data)

