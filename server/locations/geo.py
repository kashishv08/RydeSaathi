import redis 
from django.conf import settings
import uuid

redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

def _key(city: str) -> str:
    return f"drivers:live:{city.lower()}"

def update_driver_location(lat:float, lng:float, driver_id:uuid, city:str) -> None:
    redis_client.geoadd(_key(city), (lng, lat, str(driver_id)))

def remove_driver_loc(city:str, driver_id:str) -> None:
    redis_client.zrem(_key(city), driver_id)


def get_nearby_driver_ids(city:str, lng:float, lat:float, radius: float=3, count:int=20)->list[str]:
    return redis_client.geosearch(
        name=_key(city),
        longitude=lng,
        latitude=lat,
        radius=radius,
        unit="km",
        count=count,
        sort="ASC",
    )

def get_drivers_locations(city, drivers):
    return redis_client.geopos(_key(city), *[str(d.user.id) for d in drivers])

def set_driver_offer_lock(driver_id, ride_id):
    lock_key = f"driver:offer:{driver_id}"
    return redis_client.set(lock_key, str(ride_id),nx=True, ex=30)

def set_ride_offer_batch_lock(ride_id, driver_ids):
    lock_key = f"ride:offer_batch:{ride_id}"
    return redis_client.set(lock_key, ",".join(driver_ids), ex=30)

def get_ride_from_key(driver_id):
    key = f"driver:offer:{driver_id}"
    return redis_client.get(key)

def delete_key(key):
    redis_client.delete(key)

def get_drivers_from_key(ride_id):
    key = f"ride:offer_batch:{ride_id}"  
    return redis_client.get(key)

def get_cached_city(driver_id):
    key = f"driver:city:{driver_id}"
    return redis_client.get(key)

def set_cached_city(city, driver_id):
    key = f"driver:city:{driver_id}"
    redis_client.set(key, city, ex=300)

def clear_cached_city(driver_id):
    key = f"driver:city:{driver_id}"
    redis_client.delete(key)