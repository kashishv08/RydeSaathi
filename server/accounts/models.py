from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        RIDER = "RIDER","Rider"
        DRIVER = "DRIVER","Driver"

    id =  models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=6, choices=Role.choices, default=Role.RIDER)
    rating_avg = models.DecimalField(max_digits=2, decimal_places=1 , default=5.0)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"
