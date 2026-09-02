from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from locations.geo import clear_cached_city
from locations.geo import remove_driver_loc
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from django.shortcuts import render
from .models import DriverProfile, Vehicle
from rest_framework.response import Response
from .serializers import DriverProfileSerializer, DLSerializer, VehicleSerializer
from .services import submit_dl
from rides.permission import IsDriver
from rest_framework import status as  http_status
from rest_framework.permissions import AllowAny

User = get_user_model()

# Create your views here.

class DriverProfileCreateView(APIView):
    def get(self, request):
        profile,_ = DriverProfile.objects.get_or_create(user=request.user) # second return value is "created" and firts is driverprofile object
        print("profile", profile)
        serializer = DriverProfileSerializer(profile)
        return Response(serializer.data)

class SubmitDLView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = DLSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile,_ = DriverProfile.objects.get_or_create(user=request.user) # second return value is "created" and firts is driverprofile object
        profile = submit_dl(profile, serializer.validated_data.get("dl_image"))

        return Response(DriverProfileSerializer(profile).data)

class DriverToggleOnlineView(APIView):
    def post(self, request):
        profile = request.user.driverprofile
        if not profile and not profile.verified:
            return Response({"error": "Driver is not verified"})

        is_online = request.data.get("online", False)
        if is_online:
            profile.status = DriverProfile.Status.AVAILABLE
            profile.save()
        else:
            profile.status = DriverProfile.Status.OFFLINE
            remove_driver_loc(profile.current_city, str(request.user.id))
            clear_cached_city(request.user.id)
            profile.current_city = ""
            profile.save(update_fields=["status", "current_city"])    
        return Response(f"The driver status is now : {profile.status}")  

class DriverProfileComplete(APIView):
    parser_classes = [MultiPartParser, FormParser,JSONParser]
    permission_classes =  [IsDriver]
    def patch(self, request):
        try:
            driverData = request.data
            print("driverData==============================", driverData)
            user = request.user
            user.first_name = driverData.get("first_name", user.first_name)
            user.last_name = driverData.get("last_name", user.last_name)
            user.phone = driverData.get("phone", user.phone)
            if "avatar" in request.FILES:
                user.avatar = request.FILES["avatar"]
            user.save(update_fields=["first_name", "last_name", "phone", "avatar"])
            profile, _ = DriverProfile.objects.get_or_create(user=user)
            vehicle = VehicleSerializer(data=driverData)
            vehicle.is_valid(raise_exception=True)
            vehicle.save()
            profile.vehicle = vehicle.instance
            profile.save(update_fields=["vehicle"])
            return Response({"message": "Profile updated successfully!"}, status=http_status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=http_status.HTTP_400_BAD_REQUEST)




