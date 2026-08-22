from django.db import models
from django.conf import settings
import uuid
from drivers.models import VehicleType
# Create your models here.

class Ride(models.Model):
    class Status(models.TextChoices):
        REQUESTED = "REQUESTED", "Requested"
        ACCEPTED = "ACCEPTED", "Accept"
        ARRIVED = "ARRIVED", "Arrived"
        IN_PROGRESS = "IN_PROGRESS", "InProgress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="ride_rider")
    driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name="ride_driver")
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.REQUESTED)
    vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices, default=VehicleType.MOTO, null=True, blank=True)

    pickup_lat = models.DecimalField(max_digits=11, decimal_places=9)
    pickup_lng = models.DecimalField(max_digits=11, decimal_places=9)
    drop_lat = models.DecimalField(max_digits=11, decimal_places=9)
    drop_lng = models.DecimalField(max_digits=11, decimal_places=9)

    pickup_address = models.TextField(null=True, blank=True)
    drop_address = models.TextField(null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    city = models.CharField(max_length=255, db_index=True)
    route_geometry = models.JSONField(null=True, blank=True)
    route_distance_km = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    route_duration_min = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)

    requested_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Trip {self.id} ({self.status})"
