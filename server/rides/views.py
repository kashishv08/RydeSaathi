from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import status as  http_status
from rest_framework.views import APIView
from .permission import IsRider
from .serializers import RideCreateSerializer, RideSerializer, RideTransitionSerializer, RideDriverAssignSerializer
from rest_framework.response import Response
from .models import Ride
from rest_framework.exceptions import PermissionDenied
from .services import transition_ride, assign_driver

# Create your views here.
class RideCreateView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        serializer = RideCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        update_ride = serializer.save(rider=request.user)
        ride = RideSerializer(update_ride)
        print(ride)
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