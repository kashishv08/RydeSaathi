import axiosInstance from "../services/axiosClient";

export const logoutRequest = async () => {
    const res = await axiosInstance.post("/api/auth/logout/");
    return res;
}

export const sendOtp = async (creds) => {
    const res = await axiosInstance.post("/api/auth/send-otp/", creds)
    return res
}

export const verifyOtp = async (creds) => {
    const res = await axiosInstance.post("/api/auth/verify-otp/", creds)
    return res
}

export const userProfile = async () => {
    const res = await axiosInstance.get("/api/auth/me/")
    return res
}