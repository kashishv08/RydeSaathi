import axiosInstance from "../services/axiosClient"

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

export const rideDetailApi = async () => {
    const res = await axiosInstance.get("api/rides/");
    return res;
}