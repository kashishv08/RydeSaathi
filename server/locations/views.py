from rest_framework.views import APIView
from django.shortcuts import render
from .geo import update_driver_location
from rides.permission import IsDriver
from rest_framework.response import Response
from rest_framework import status
from rides.services import get_location_from_coord

# Create your views here.
class DriverPingView(APIView):
    permission_classes = [IsDriver]
    def post(self, request):
        profile = request.user.driverprofile
        lat = request.data.get("lat")
        lng = request.data.get("lng")
        city = get_location_from_coord(lat, lng)["city"]

        if profile.current_city != city:
            profile.current_city = city
            profile.save(update_fields=["current_city"])

        update_driver_location(lat, lng, profile.user.id, city)
        return Response(status=status.HTTP_200_OK)