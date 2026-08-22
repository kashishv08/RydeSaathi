import axiosInstance from "../services/axiosClient"

export const driverProfile = async () => {
    const res = await axiosInstance.get("/api/drivers/me")
    return res;
}

export const driverPing = async (loc) => {
    const res = await axiosInstance.post("/api/locations/ping/", loc)
    return res;
}

export const driverToggleMode = async (mode) => {
    const res = await axiosInstance.post("/api/drivers/toggle-online/", mode)
    return res;
}