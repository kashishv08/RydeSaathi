from .views import PaymentWebhookView
from django.urls import path

urlpatterns = [
    path("webhook/", PaymentWebhookView.as_view(), name="payment-webhook")
]