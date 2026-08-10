from django.core.exceptions import ValidationError
from drivers.models import DriverProfile
from locations.geo import get_nearby_driver_ids, get_drivers_locations, set_driver_offer_lock, set_ride_offer_batch_lock, get_ride_from_key,delete_key, get_drivers_from_key
from .models import Ride
import redis 
from django.conf import settings
from locations.routing import engine
from .services import assign_driver
from .notify import notify_driver_of_offer, notify_driver_offer_cancelled
import logging
logger = logging.getLogger(__name__)

BATCH_SIZE = 5

def find_and_offer_driver(ride: Ride) -> list[str]:
    city = ride.city.lower() 
    logger.warning(f"[MATCH] Starting for ride={ride.id} city={city} pickup=({ride.pickup_lat},{ride.pickup_lng})")

    all_near_drivers = get_nearby_driver_ids(city, float(ride.pickup_lng), float(ride.pickup_lat))
    logger.warning(f"[MATCH] Nearby driver IDs from Redis: {all_near_drivers}")

    eligible_drivers = DriverProfile.objects.filter(user_id__in=all_near_drivers, status=DriverProfile.Status.AVAILABLE, verified=True, vehicle__vehicle_type=ride.vehicle_type)
    logger.warning(f"[MATCH] Eligible (available+verified+{ride.vehicle_type}) drivers: {list(eligible_drivers.values_list('user_id', flat=True))}")

    raw_locations = get_drivers_locations(city, eligible_drivers) # returns (lng, lat)

    valid_drivers = []
    destinations = []
    for driver, loc in zip(eligible_drivers, raw_locations):
        if loc:
            valid_drivers.append(driver)
            destinations.append((loc[1], loc[0])) # (lng, lat) to (lat, lng)

    logger.warning(f"[MATCH] Valid drivers with live location: {[str(d.user_id) for d in valid_drivers]}")

    if not valid_drivers:
        logger.warning(f"[MATCH] No available, verified drivers found within 3km of {ride.pickup_lat},{ride.pickup_lng} in {city}!")
        return []

    driver_eta = engine.batch_eta_minutes(ride.pickup_lat, ride.pickup_lng, destinations)
    logger.warning(f"[MATCH] ETAs: {driver_eta}")

    final_driver_obj = dict(zip(valid_drivers, driver_eta))
    ranked_driver = sorted(final_driver_obj.items(), key=lambda item: item[1])
    top_drivers = ranked_driver[:5]

    offered = []
    for driverprofile, ETA in top_drivers:
        if len(offered) >= BATCH_SIZE:
            break
        locked = set_driver_offer_lock(driverprofile.user_id, ride.id)
        logger.warning(f"[MATCH] Lock for driver={driverprofile.user_id} ETA={ETA}min → locked={locked}")
        if locked:
            offered.append(str(driverprofile.user_id))
            notify_driver_of_offer(driverprofile.user_id, ride.id, ride)

    if offered:
        set_ride_offer_batch_lock(ride.id, offered)
        logger.warning(f"[MATCH] Batch lock set for ride={ride.id}, offered to: {offered}")
    return offered

    
def confirm_offer_accept(driver_id, ride_id, ride):
    offered_ride = get_ride_from_key(driver_id)
    if(offered_ride != ride_id):
        raise ValidationError("This offer has expired or is no longer valid")
    try:
        assign_driver(ride_id, driver_id)
    except ValidationError:
        delete_key(f"driver:offer:{driver_id}")
        raise

    delete_key(f"driver:offer:{driver_id}")
    _cancel_other_offers(ride_id, ride, winner_driver_id=driver_id)
    
def _cancel_other_offers(ride_id, ride, winner_driver_id):
    lose_drivers = get_drivers_from_key(ride_id)
    if not lose_drivers:
        return
    for driver_id in lose_drivers.split(","):
        if winner_driver_id == driver_id:
            continue
        delete_key(f"driver:offer:{driver_id}")
        notify_driver_offer_cancelled(driver_id, ride_id, ride)

    delete_key(f"ride:offer_batch:{ride_id}")




