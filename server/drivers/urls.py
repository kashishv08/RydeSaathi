from django.urls import path
from .views import DriverProfileCreateView, SubmitDLView

urlpatterns = [
    path("me/", DriverProfileCreateView.as_view(), name="driver-profile-me"),
    path("dl-submit/", SubmitDLView.as_view(), name="driver-dl-submit"),
]
