import axios from 'axios';
import { clear_token, get_token, set_token } from '../utils/tokenStore';

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {
    const token = get_token();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

let isRefreshing = false;
let failedQueue = []

function processQueue(error, token) {
    if (failedQueue.length <= 0) return;
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token)
        }
    });
    failedQueue = [];
}

axiosInstance.interceptors.response.use(
    function (response) { return response; },
    async function (error) {
        const originalReq = error.config;
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (originalReq._retry) {
            return Promise.reject(error);
        }

        originalReq._retry = true;
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then((newAccessToken) => {
                originalReq.headers.Authorization = `Bearer ${newAccessToken}`
                return axiosInstance(originalReq);
            }).catch((err) => Promise.reject(err));
        }
        isRefreshing = true;
        try {
            const response = await axios.post("http://localhost:8000/api/auth/token/refresh/", {}, {
                withCredentials: true
            });
            const newAccessToken = response.data.access;
            set_token(newAccessToken);
            processQueue(null, newAccessToken);
            originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalReq);
        } catch (error) {
            processQueue(error, null);
            clear_token();
            return Promise.reject(error);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;