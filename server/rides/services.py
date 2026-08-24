from .utils import generate_otp
from .fare import cal_fare
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Ride
from django.db import transaction
from django.utils import timezone
from geopy.geocoders import Nominatim
from .notify import notify_rider_of_status
from drivers.models import DriverProfile
from payments.services import create_order
from payments.models import Payment

VALID_TRANSITIONS = {
    Ride.Status.REQUESTED: {Ride.Status.ACCEPTED, Ride.Status.CANCELLED},
    Ride.Status.ACCEPTED: {Ride.Status.ARRIVED, Ride.Status.CANCELLED},
    Ride.Status.ARRIVED: {Ride.Status.IN_PROGRESS, Ride.Status.CANCELLED},
    Ride.Status.IN_PROGRESS: {Ride.Status.COMPLETED, Ride.Status.CANCELLED},
    Ride.Status.COMPLETED: set(),
    Ride.Status.CANCELLED: set(),
}

TIMESTAMP_FIELD = {
    Ride.Status.ACCEPTED: "accepted_at",
    Ride.Status.ARRIVED: "arrived_at",
    Ride.Status.IN_PROGRESS: "started_at",
    Ride.Status.COMPLETED: "completed_at",
    Ride.Status.CANCELLED: "cancelled_at",
}

def transition_ride(ride_id, new_status, cancel_reason=None):
    with transaction.atomic():
        ride = Ride.objects.select_for_update().get(pk=ride_id)
        allowed = VALID_TRANSITIONS[ride.status]
        if new_status not in allowed:
            raise ValidationError(f"Cannot transition ride from {ride.status} to {new_status}. " f"Allowed: {', '.join(allowed) if allowed else 'none (terminal state)'}.")
        ride.status = new_status
        ts = TIMESTAMP_FIELD[ride.status]
        if ts:
            setattr(ride, ts, timezone.now()) 
            ride.save(update_fields=["status", ts])
        else:
            ride.save(update_fields=["status"])

        if new_status == Ride.Status.ACCEPTED:
            otp = generate_otp()
            ride.ride_otp = otp
            ride.save(update_fields=["ride_otp"])

        if new_status == Ride.Status.CANCELLED and cancel_reason:
            ride.cancel_reason =  cancel_reason
            ride.save(update_fields=["cancel_reason"])

        if new_status == Ride.Status.COMPLETED:
            razorpay_order_id = create_order(ride.amount, ride.id)
            Payment.objects.create(
                status = Payment.Status.PENDING,
                razorpay_order_id = razorpay_order_id,
                ride = ride,
                amount = ride.amount   
            )
        notify_rider_of_status(ride_id, new_status) 

        if new_status in [Ride.Status.COMPLETED, Ride.Status.CANCELLED]:
            if ride.driver_id:
                DriverProfile.objects.filter(user_id=ride.driver_id).update(
                    status=DriverProfile.Status.AVAILABLE
                )

        return ride

def assign_driver(ride_id, driver_id):
    with transaction.atomic():
        ride = Ride.objects.select_for_update().get(pk=ride_id)
        if ride.status != Ride.Status.REQUESTED:
            raise ValidationError(f"Can only assign a driver to a REQUESTED ride. Current: {ride.status}.")
        ride.driver_id = driver_id
        ride.save(update_fields=["driver"])

        DriverProfile.objects.filter(user_id=driver_id).update(
            status=DriverProfile.Status.ON_RIDE
        )

        return transition_ride(ride_id, Ride.Status.ACCEPTED)

def get_location_from_coord(lat, lon):
    geolocator = Nominatim(user_agent="my_reverse_geocoder_app")
    try:
        coordinates = f"{lat}, {lon}"
        location = geolocator.reverse(coordinates, timeout=10)
        if location and "address" in location.raw:
            address = location.raw["address"]
            
            city = address.get('city') or address.get('town') or address.get('village') or address.get('suburb')
            return {
                "address": address,
                "city": city.lower()
            }
        else:
            return {"address": None, "city": None}
            
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"address":None, "city": None}