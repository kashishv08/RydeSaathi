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


