from haversine import haversine, Unit
import requests


class RoutingEngine:
    def get_route(self, from_lat, from_lng, to_lat, to_lng) -> dict:
        raise NotImplementedError

    def batch_eta_minutes(self, from_lat, from_lng, destinations: list[tuple[float, float]]) -> list[float]:
        raise NotImplementedError


class HaversineRoutingEngine(RoutingEngine):
    AVG_SPEED_KMPH = 25

    def _distance_km(self, lat1, lng1, lat2, lng2):
        return round(haversine((lat1, lng1), (lat2, lng2), unit=Unit.KILOMETERS), 2)

    def get_route(self, from_lat, from_lng, to_lat, to_lng) -> dict:
        km = self._distance_km(from_lat, from_lng, to_lat, to_lng)
        return {
            "distance_km": km,
            "duration_min": round((km / self.AVG_SPEED_KMPH) * 60, 1),
            "geometry": [[from_lat, from_lng], [to_lat, to_lng]],
        }

    def batch_eta_minutes(self, from_lat, from_lng, destinations: list) -> list:
        return [
            round((self._distance_km(from_lat, from_lng, lat, lng) / self.AVG_SPEED_KMPH) * 60, 1)
            for lat, lng in destinations
        ]


class OSRMRoutingEngine(RoutingEngine):
    BASE_URL = "http://router.project-osrm.org"

    def get_route(self, from_lat, from_lng, to_lat, to_lng) -> dict:
        url = f"{self.BASE_URL}/route/v1/driving/{from_lng},{from_lat};{to_lng},{to_lat}"
        data = requests.get(url, params={
            "overview": "full",
            "geometries": "geojson",
        }).json()

        route = data["routes"][0]
        geometry = [[lat, lng] for lng, lat in route["geometry"]["coordinates"]]

        return {
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_min": round(route["duration"] / 60, 1),  
            "geometry": geometry,
        }

    def batch_eta_minutes(self, from_lat, from_lng, destinations: list) -> list:
        coords = f"{from_lng},{from_lat};" + ";".join(
            f"{lng},{lat}" for lng, lat in destinations
        )
        url = f"{self.BASE_URL}/table/v1/driving/{coords}"
        data = requests.get(url, params={
            "sources": "0",         
            "annotations": "duration"
        }).json()

        duration_sec = data["durations"][0][1:]
        return [
            round(d / 60, 1) if d is not None else 9999
            for d in duration_sec
        ]


class ResilientRoutingEngine(RoutingEngine):
    def __init__(self):
        self.primary = OSRMRoutingEngine()
        self.fallback = HaversineRoutingEngine()

    def get_route(self, *args, **kwargs):
        try:
            return self.primary.get_route(*args, **kwargs)
        except Exception:
            return self.fallback.get_route(*args, **kwargs)

    def batch_eta_minutes(self, *args, **kwargs):
        try:
            return self.primary.batch_eta_minutes(*args, **kwargs)
        except Exception:
            return self.fallback.batch_eta_minutes(*args, **kwargs)


engine = ResilientRoutingEngine()