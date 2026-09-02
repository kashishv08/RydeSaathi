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

export const rideAcceptDriver = async (ride_id) => {
    const res = await axiosInstance.post(`/api/rides/${ride_id}/accept-offer/`)
    return res;
}

export const transitionRide = async (ride) => {
    const res = await axiosInstance.patch(`/api/rides/${ride.ride_id}/transition/`, { status: ride.status, cancel_reason: ride.cancel_reason || "" })
    return res;
}

export const completeDriverProfile = async (driverData) => {
    const res = await axiosInstance.patch("/api/drivers/onboarding/", driverData)
    return res;
}