from rides.notify import notify_rider_of_status
from django.http import HttpResponse
from rest_framework.views import APIView
from django.shortcuts import render
from .services import verify_webhook_signature
import json
from .models import Payment
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class PaymentWebhookView(APIView):
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        webhook_signature = request.headers.get("X-Razorpay-Signature")

        if not webhook_signature:
            return HttpResponse(status=400)
        else: 
            print("Webhook" , webhook_signature)

        payload = request.body
        print("payload", payload)
        is_valid = verify_webhook_signature(webhook_signature, payload)
        if not is_valid:
            return Response("No valid Signature")
        else:
            print("is_verified", is_valid)

        try:
            data = json.loads(payload)
            print("data", data)
            event = data.get("event")

            print("event", event)

            if event == "order.paid":
                payment_entity = data["payload"]["payment"]["entity"]

                order_id = payment_entity.get("order_id")
                payment_id = payment_entity.get("id")
                print("order_id", order_id)
                print("payment_id", payment_id)
             
                payment = Payment.objects.get(razorpay_order_id=order_id)
                if payment.status != Payment.Status.PAID:
                    payment.status = Payment.Status.PAID
                    payment.razorpay_payment_id = payment_id 
                    payment.paid_at = timezone.now()
                    payment.razorpay_signature = webhook_signature
                    payment.save(update_fields=['status', 'razorpay_payment_id', 'paid_at', 'razorpay_signature'])

                print("payment websocket start")
                notify_rider_of_status(payment.ride.id, "PAYMENT_SUCCESSFULL")
                print("payment websocket over")
                
        except Payment.DoesNotExist:
            return Response("Payment needs to instantiate")
        
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
