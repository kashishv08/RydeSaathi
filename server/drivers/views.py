from locations.geo import clear_cached_city
from locations.geo import remove_driver_loc
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.shortcuts import render
from .models import DriverProfile
from rest_framework.response import Response
from .serializers import DriverProfileSerializer, DLSerializer, VehicleSerializer
from .services import submit_dl

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



