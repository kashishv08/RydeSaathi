from django.urls import path
from .views import RideCreateView, RideDetailView, RideTransitionView, RideDriverAssignView, RideDriverAccept

urlpatterns = [
    path("", RideCreateView.as_view(), name="ride-create"),
    path("<uuid:ride_id>/", RideDetailView.as_view(), name="ride-detail"),
    path("<uuid:ride_id>/transition/", RideTransitionView.as_view(), name="ride-transition"),
    path("<uuid:ride_id>/assign-driver/", RideDriverAssignView.as_view(), name="ride-assign-driver"),
    path("<uuid:ride_id>/accept-offer/", RideDriverAccept.as_view(), name="ride-accept-offer"),
]