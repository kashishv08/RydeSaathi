import axiosInstance, { axiosInstanceNoAuth } from "../services/axiosClient"
const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;


export const autoCompleteAddressApi = async (search) => {
    const res = await axiosInstanceNoAuth.get(`https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${search}&limit=5`)
    return res;
}

export const fetchRoutePolylineApi = async ({ pickup, drop }) => {
    const response = await axiosInstanceNoAuth.get(`https://us1.locationiq.com/v1/directions/driving/${pickup.lon},${pickup.lat};${drop.lon},${drop.lat}?key=${LOCATIONIQ_KEY}&geometries=geojson&overview=full`);
    const data = response.data;
    console.log("data", data)
    return {
        geometry: data.routes[0].geometry,
        durationSeconds: data.routes[0].duration,
        distanceMeters: data.routes[0].distance
    };
}

export const rideSearchApi = async (loc) => {
    const res = await axiosInstance.get("api/rides/search/", {
        params: {
            pickup_lat: loc.pickup.lat,
            pickup_lng: loc.pickup.lon,
            distance_km: loc.distance_km,
            duration_min: loc.duration_min
        }
    });
    return res;
}

export const rideCreateApi = async (ride) => {
    const res = await axiosInstance.post("api/rides/create/", ride);
    return res;
}