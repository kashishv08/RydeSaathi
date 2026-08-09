from django.urls import re_path
from .consumers import DriverConsumer

websocket_urlpatterns = [
    re_path(r"ws/driver/(?P<driver_id>[^/]+)/$", DriverConsumer.as_asgi()),
]