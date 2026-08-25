import { axiosInstanceNoAuth } from "../services/axiosClient";
const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export const reverseGeocodeApi = async (lat, lon) => {
    const res = await axiosInstanceNoAuth.get(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`
    );
    return res.data.display_name;
}

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
