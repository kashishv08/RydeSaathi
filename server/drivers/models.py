from django.db import models
import uuid
from django.conf import settings

# Create your models here.

class Vehicle(models.Model):
    class VehicleType(models.TextChoices):
        MINI = "MINI", "Mini"
        SEDAN = "SEDAN", "Sedan"
        SUV = "SUV", "SUV"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)
    plate_number = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return f"{self.plate_number} ({self.vehicle_type})"
        

class DriverProfile(models.Model):
    class Status(models.TextChoices):
        PENDING_VERIFICATION = "PENDING", "Pending"
        AVAILABLE = "AVAILABLE", "Available"
        OFFLINE = "OFFLINE", "Offline"
        SUSPENDED = "SUSPENDED", "Suspended"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    vehicle = models.OneToOneField(to=Vehicle, on_delete=models.SET_NULL,null=True, blank=True)
    dl_image = models.ImageField(upload_to="dl_uploads/", null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING_VERIFICATION)
    current_city = models.CharField(max_length=50, blank=True, db_index=True)
    verified = models.BooleanField(default=False)
    verification_note = models.CharField(max_length=255, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"DriverProfile({self.user})"
