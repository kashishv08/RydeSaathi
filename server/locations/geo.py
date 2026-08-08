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
