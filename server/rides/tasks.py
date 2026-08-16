from celery import shared_task
from django.utils import timezone
import logging
logger = logging.getLogger(__name__)  # ← .getLogger(), not logging() directly

@shared_task(bind=True, max_retries=0, name="rides.check_batch_timeout")
def check_batch_timeout(self, ride_id, attempt, already_offered_ids):
    from .models import Ride
    try:
        ride = Ride.objects.get(pk=ride_id)
    except Ride.DoesNotExist:
        logger.warning(f"No Ride : {ride_id} is Found")
        return

    if ride.status != Ride.Status.REQUESTED:
        logger.info(f"Ride {ride_id} is now {ride.status}. No retry Needed")
        return

    radius_km = 3 + (attempt * 2)
    logger.info(f"Retrying with radius:{radius_km}, excluding {len(already_offered_ids)} drivers")

    from .matching import find_and_offer_driver
    new_driver_ids = find_and_offer_driver(ride, radius_km, already_offered_ids)

    if new_driver_ids:
        all_offered = list(set(already_offered_ids + new_driver_ids))
        check_batch_timeout.apply_async(
            args=[ride_id, attempt+1, all_offered],
            countdown = 30
        )
        logger.info(f"New batch is Scheduled. Total Offered drivers : {len(all_offered)}")
    else:
        logger.warning(f"No new drivers found in {radius_km}km.")


@shared_task(name="rides.expire_ride_window")
def expire_ride_window(ride_id):
    logger.info(f"5 mint window expired for ride = {ride_id}")
    from .models import Ride
    from locations.geo import get_drivers_from_key, delete_key

    try:
        ride = Ride.objects.get(pk=ride_id)
    except Ride.DoesNotExist:
        logger.warning(f"No Ride : {ride_id} is Found")
        return

    if ride.status != Ride.Status.REQUESTED:
        logger.info(f"Ride {ride_id} is already {ride.status}. No retry Needed")
        return

    logger.warning(f"No driver accepted the ride. Auto cancelling")

    ride.status = Ride.Status.CANCELLED
    ride.cancel_reason = "No drivers available in your area. Please try again."
    ride.cancelled_at = timezone.now()
    ride.save(update_fields=["status", "cancel_reason", "cancelled_at"])

    batch = get_drivers_from_key(str(ride_id))
    if batch:
        for d in batch.split(","):
            from rides.notify import notify_driver_offer_cancelled
            delete_key(f"driver:offer:{d}")
            notify_driver_offer_cancelled(d, ride_id, ride)
        from locations.geo import delete_key as _del
        _del(f"ride:offer_batch:{ride_id}")

    from rides.notify import notify_rider_of_status
    notify_rider_of_status(ride_id, "NO_DRIVERS")

    logger.info(f"Ride {ride_id} auto-cancelled. Rider notified.")

