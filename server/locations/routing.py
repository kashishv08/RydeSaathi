from haversine import haversine, Unit
import requests
from django.conf import settings
import logging
logger = logging.getLogger(__name__)


class RoutingEngine:
    def batch_eta_minutes(self, from_lat, from_lng, destinations: list[tuple[float, float]]) -> list[float]:
        raise NotImplementedError


class HaversineRoutingEngine(RoutingEngine):
    AVG_SPEED_KMPH = 25

    def _distance_km(self, lat1, lng1, lat2, lng2):
        return round(haversine((lat1, lng1), (lat2, lng2), unit=Unit.KILOMETERS), 2)

    def batch_eta_minutes(self, from_lat, from_lng, destinations: list) -> list:
        return [
            round((self._distance_km(from_lat, from_lng, lat, lng) / self.AVG_SPEED_KMPH) * 60, 1)
            for lat, lng in destinations
        ]


class LocationIQRoutingEngine(RoutingEngine):
    BASE_URL = "https://us1.locationiq.com/v1/matrix/driving"

    def batch_eta_minutes(self, from_lat, from_lng, destinations: list) -> list:
        """
        from_lat, from_lng : pickup point (will be source, index 0)
        destinations       : list of (lat, lng) tuples — driver positions
        returns            : list of ETAs in minutes, one per driver, same order
        """
        coords = f"{from_lng},{from_lat};" + ";".join(
            f"{lng},{lat}" for lat, lng in destinations 
        )

        resp = requests.get(
            f"{self.BASE_URL}/{coords}",
            params={
                "key": settings.LOCATIONIQ_KEY,
                "sources": "0",        
                "annotations": "duration",
                "fallback_speed": 25,
            },
            timeout=5
        )
        resp.raise_for_status()
        data = resp.json()
        duration_secs = data["durations"][0][1:]

        return [
            round(d / 60, 1) if d is not None else 9999
            for d in duration_secs
        ]


class ResilientRoutingEngine(RoutingEngine):
    """
    Tries LocationIQ first. Falls back to Haversine on any error.
    Ensures ETA calculation always works even if API is down or rate-limited.
    """
    def __init__(self):
        self.primary = LocationIQRoutingEngine()
        self.fallback = HaversineRoutingEngine()

    def batch_eta_minutes(self, *args, **kwargs):
        try:
            result = self.primary.batch_eta_minutes(*args, **kwargs)
            logger.info(f"[Routing] LocationIQ ETAs: {result}")
            return result
        except Exception as e:
            logger.warning(f"[Routing] LocationIQ failed ({e}), using Haversine fallback")
            return self.fallback.batch_eta_minutes(*args, **kwargs)


engine = ResilientRoutingEngine()