import razorpay
from django.conf import settings
import logging
logger = logging.getLogger(__name__)

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_order(amount, receipt):
    DATA = {
        "amount": int(amount * 100),
        "currency": "INR",
        "receipt": str(receipt),
    }
    return client.order.create(data=DATA)["id"]
     
def verify_webhook_signature(webhook_signature, payload):
    try:
        client.utility.verify_webhook_signature(
            str(payload, "utf-8"), webhook_signature, settings.RAZORPAY_WEBHOOK_SECRET
        )
    except razorpay.errors.SignatureVerificationError:
        logger.error("Invalid Razorpay Webhook signature.")
        return False
    return True