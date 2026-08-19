import axiosInstance from "../services/axiosClient"

export const driverProfile = async () => {
    const res = await axiosInstance.get("/api/drivers/me")
    return res;
}

export const driverPing = async () => {
    const res = await axiosInstance.post("/api/locations/ping/", { "lat": "3456", "lng": "2345" })
    return res;
}

export const driverPing1 = async () => {
    const res = await axiosInstance.post("/api/locations/ping/", { "lat": 3456, "lng": 2345 })
    return res;
}

export const driverPing2 = async () => {
    const res = await axiosInstance.post("/api/locations/ping/", { lat: 3456, lng: 2345 })
    return res;
}