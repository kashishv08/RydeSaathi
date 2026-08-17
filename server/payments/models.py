from django.db import models
import uuid
from rides.models import Ride

# Create your models here.
class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = ("PENDING","Pending")
        PAID = ("PAID","Paid")
        FAILED = ("FAILED","Failed")


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ride = models.OneToOneField(to=Ride, on_delete=models.CASCADE, related_name="ride_payment")
    amount = models.DecimalField(max_digits=10, decimal_places=2, )
    razorpay_order_id = models.CharField(max_length=255, null=True, unique=True)
    razorpay_payment_id = models.CharField(max_length=255, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(default=Status.PENDING, choices=Status.choices, max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment for Ride {self.ride.id} - {self.status}"
