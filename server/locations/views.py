from rest_framework.views import APIView
from django.shortcuts import render
from .geo import update_driver_location
from rides.permission import IsDriver
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class DriverPingView(APIView):
    permission_classes = [IsDriver]
    def post(self, request):
        profile = request.user.driverprofile
        lat = request.data.get("lat")
        lng = request.data.get("lng")
        update_driver_location(lat,lng,profile.user.id,profile.current_city)
        return Response(status=status.HTTP_200_OK)