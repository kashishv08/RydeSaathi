import axiosInstance from "../services/axiosClient";

export const loginRequest = async (creds) => {
    const response = await axiosInstance.post("/api/auth/login/", creds);
    return response;
};

export const logoutRequest = async () => {
    const res = await axiosInstance.post("/api/auth/logout/");
    return res;
}

export const registerReq = async (creds) => {
    const res = await axiosInstance.post("/api/auth/register/", creds)
    return res
}