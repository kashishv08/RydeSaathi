from django.urls import path
from .views import DriverProfileCreateView, SubmitDLView, DriverToggleOnlineView

urlpatterns = [
    path("me/", DriverProfileCreateView.as_view(), name="driver-profile-me"),
    path("dl-submit/", SubmitDLView.as_view(), name="driver-dl-submit"),
    path("toggle-online", DriverToggleOnlineView.as_view(), name="toggle-online")

]
