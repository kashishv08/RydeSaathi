from rest_framework import serializers
from .models import Ride

class RideCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ride
        fields = ["pickup_lat","pickup_lng","drop_lat","drop_lng", "city"]

class RideSerializer(serializers.ModelSerializer):
    rider_email  = serializers.EmailField(source="rider.email", read_only=True)
    driver_email = serializers.EmailField(source="driver.email", read_only=True, allow_null=True)
    class Meta:
        model = Ride
        fields = [
            "id", "status", "rider_email", "driver_email",
            "pickup_lat", "pickup_lng", "drop_lat", "drop_lng",
            "amount", "city",
            "requested_at", "accepted_at", "arrived_at",
            "started_at", "completed_at", "cancelled_at","route_geometry", "route_distance_km", "route_duration_min",
        ]

class RideTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Ride.Status.choices)

class RideDriverAssignSerializer(serializers.Serializer):
    driver_id = serializers.UUIDField()