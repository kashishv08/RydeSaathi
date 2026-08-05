from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Ride
from django.db import transaction
from django.utils import timezone

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

def transition_ride(ride_id, new_status):
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
        else :
            ride.save(update_fields=["status"])

        return ride 

def assign_driver(ride_id, driver_id):
    with transaction.atomic():
        ride = Ride.objects.select_for_update().get(pk=ride_id)
        if ride.status != Ride.Status.REQUESTED:
            raise ValidationError(f"Can only assign a driver to a REQUESTED ride. Current: {ride.status}.")
        ride.driver_id = driver_id
        ride.save(update_fields=["driver"])

        return transition_ride(ride_id, Ride.Status.ACCEPTED)