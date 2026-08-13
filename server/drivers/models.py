from django.db import models
import uuid
from django.conf import settings

# Create your models here.

class VehicleType(models.TextChoices):
        MOTO = "MOTO", "Moto"
        AUTO = "AUTO", "Auto"
        UBER_GO = "UBER_GO", "Uber Go"
        PREMIER = "PREMIER", "Premier"
        UBER_XL = "UBER_XL", "Uber XL"

class Vehicle(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)
    plate_number = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return f"{self.plate_number} ({self.vehicle_type})"
        

class DriverProfile(models.Model):
    class Status(models.TextChoices):
        PENDING_VERIFICATION = "PENDING", "Pending"
        AVAILABLE = "AVAILABLE", "Available"
        ON_RIDE = "ON_RIDE", "On Ride"
        OFFLINE = "OFFLINE", "Offline"
        SUSPENDED = "SUSPENDED", "Suspended"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    vehicle = models.OneToOneField(Vehicle, on_delete=models.SET_NULL,null=True, blank=True)
    dl_image = models.ImageField(upload_to="dl_uploads/", null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING_VERIFICATION)
    current_city = models.CharField(max_length=50, blank=True, db_index=True)
    verified = models.BooleanField(default=False)
    verification_note = models.CharField(max_length=255, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)

    def __str__(self):
        return f"DriverProfile({self.user})"
