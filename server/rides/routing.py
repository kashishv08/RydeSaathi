from django.urls import re_path
from .consumers import DriverConsumer, RideConsumer

websocket_urlpatterns = [
    re_path(r"ws/driver/(?P<driver_id>[^/]+)/$", DriverConsumer.as_asgi()),
    re_path(r"ws/rider/(?P<rider_id>[^/]+)/$", RideConsumer.as_asgi()),
]