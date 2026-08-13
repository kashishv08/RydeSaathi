from .models import Review
from django.db.models import Avg
from drivers.models import DriverProfile

def update_driver_rating(driver):
    result = Review.objects.filter(given_to=driver).aggregate(avg_rating=Avg("stars"))
    d = DriverProfile.objects.filter(user=driver).update(average_rating=result["avg_rating"])

    