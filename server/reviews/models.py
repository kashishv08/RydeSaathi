from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from rides.models import Ride
from django.conf import settings
import uuid

# Create your models here.
class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ride = models.ForeignKey(to=Ride, on_delete=models.CASCADE, null=True, blank=True, related_name="ratings")
    given_by = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="rating_given")
    given_to = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="ratings_receiver")
    stars = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("ride", "given_by", "given_to")