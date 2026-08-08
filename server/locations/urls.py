from django.urls import path
from .views import DriverPingView
urlpatterns = [
    path("ping/", DriverPingView.as_view(), name="driver-ping")
]