from rest_framework import serializers
from .models import Ride

class RideCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ride
        fields = ["pickup_lat","pickup_lng","drop_lat","drop_lng", "vehicle_type", "route_geometry", "route_duration_min" , "route_distance_km", "pickup_address", "drop_address","amount"]

class RideSerializer(serializers.ModelSerializer):
    rider_email  = serializers.EmailField(source="rider.email", read_only=True)
    driver_email = serializers.EmailField(source="driver.email", read_only=True, allow_null=True)
    driver_details = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    driver_location = serializers.SerializerMethodField()
    route_geometry = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = [
            "id", "status", "rider_email", "driver_email",
            "pickup_lat", "pickup_lng", "drop_lat", "drop_lng",
            "amount", "city","pickup_address", "drop_address",
            "requested_at", "accepted_at", "arrived_at","vehicle_type",
            "started_at", "completed_at", "cancelled_at","route_geometry", "route_distance_km", "route_duration_min",
            "payment", "driver_details", "driver_location", "ride_otp"
        ]

    def get_payment(self, obj):
        if hasattr(obj, 'ride_payment'):
            return {
                "id": obj.ride_payment.id,
                "razorpay_order_id": obj.ride_payment.razorpay_order_id,
                "status": obj.ride_payment.status
            }
        return None

    def get_driver_details(self, obj):
        if obj.driver:
            driver = obj.driver
            details = {
                "name": f"{driver.first_name} {driver.last_name}".strip() or driver.email.split("@")[0],
                "phone": driver.phone,
                "rating": driver.rating_avg,
            }
            
            if hasattr(driver, 'driverprofile') and driver.driverprofile.vehicle:
                vehicle = driver.driverprofile.vehicle
                details["vehicle_type"] = vehicle.vehicle_type
                details["plate_number"] = vehicle.plate_number
            
            return details
        return None

    def get_route_geometry(self, obj):
        """Always return route_geometry as a dict, never as a raw JSON string."""
        import json
        geom = obj.route_geometry
        if not geom:
            return None
        if isinstance(geom, str):
            try:
                return json.loads(geom)
            except (ValueError, TypeError):
                return None
        return geom  

    def get_driver_location(self, obj):
        if obj.driver and obj.status in [Ride.Status.ACCEPTED, Ride.Status.ARRIVED, Ride.Status.IN_PROGRESS]:
            try:
                from locations.geo import get_drivers_locations, get_cached_city
                city = get_cached_city(obj.driver.id)
                if not city and hasattr(obj.driver, 'driverprofile'):
                    city = obj.driver.driverprofile.current_city
                if city:
                    loc = get_drivers_locations(city, [obj.driver])
                    if loc and loc[0]:
                        return {"lat": loc[0][1], "lng": loc[0][0]} # Redis returns (lon, lat)
            except Exception as e:
                pass
        return None

class RideTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Ride.Status.choices)
    cancel_reason = serializers.CharField(required=False, allow_blank=True, default=None)

class RideDriverAssignSerializer(serializers.Serializer):
    driver_id = serializers.UUIDField()