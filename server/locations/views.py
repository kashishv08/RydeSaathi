from rest_framework.views import APIView
from django.shortcuts import render
from .geo import update_driver_location, get_cached_city, set_cached_city
from rides.permission import IsDriver
from rest_framework.response import Response
from rest_framework import status
from rides.services import get_location_from_coord
from rides.models import Ride
from rides.notify import notify_rider_of_driver_loc

# Create your views here.
class DriverPingView(APIView):
    permission_classes = [IsDriver]
    def post(self, request):
        profile = request.user.driverprofile
        lat = request.data.get("lat")
        lng = request.data.get("lng")

        city = get_cached_city(profile.user.id) 
        if not city:
            city = get_location_from_coord(lat, lng)["city"]
            print(city)
            if city:
                set_cached_city(city, profile.user.id)

                if profile.current_city != city:
                    profile.current_city = city
                    profile.save(update_fields=["current_city"])

        if city:
            update_driver_location(lat, lng, profile.user.id, city)

        active_ride = Ride.objects.filter(
            driver=request.user,
            status__in=[Ride.Status.ACCEPTED, Ride.Status.ARRIVED, Ride.Status.IN_PROGRESS]
        ).order_by('-requested_at').first()

        if active_ride:
            notify_rider_of_driver_loc(lat, lng, active_ride)
        return Response({"driver_id": profile.user.id},status=status.HTTP_200_OK)