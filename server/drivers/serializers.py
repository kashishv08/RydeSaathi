from rest_framework import serializers
from .models import Vehicle, DriverProfile

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["id", "vehicle_type", "plate_number"]

class DLSerializer(serializers.Serializer):
    dl_image = serializers.ImageField(required=False)


class DriverProfileSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)

    class Meta:
        model = DriverProfile
        fields = ["user", "vehicle", "dl_image", "status", "verified", "verification_note", "current_city"]
        read_only_fields = ["user", "verified", "verification_note", "verified_at"]
