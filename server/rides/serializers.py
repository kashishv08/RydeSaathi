from rest_framework import serializers
from .models import Ride

class RideCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ride
        fields = ["pickup_lat","pickup_lng","drop_lat","drop_lng", "vehicle_type"]

class RideSerializer(serializers.ModelSerializer):
    rider_email  = serializers.EmailField(source="rider.email", read_only=True)
    driver_email = serializers.EmailField(source="driver.email", read_only=True, allow_null=True)
    payment = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = [
            "id", "status", "rider_email", "driver_email",
            "pickup_lat", "pickup_lng", "drop_lat", "drop_lng",
            "amount", "city","pickup_address", "drop_address",
            "requested_at", "accepted_at", "arrived_at","vehicle_type",
            "started_at", "completed_at", "cancelled_at","route_geometry", "route_distance_km", "route_duration_min",
            "payment",
        ]

    def get_payment(self, obj):
        if hasattr(obj, 'ride_payment'):
            return {
                "id": obj.ride_payment.id,
                "razorpay_order_id": obj.ride_payment.razorpay_order_id,
                "status": obj.ride_payment.status
            }
        return None

class RideTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Ride.Status.choices)
    cancel_reason = serializers.CharField(required=False, allow_blank=True, default=None)

class RideDriverAssignSerializer(serializers.Serializer):
    driver_id = serializers.UUIDField()