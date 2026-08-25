import axiosInstance from "../services/axiosClient";

export const createReviewApi = async (data) => {
    const response = await axiosInstance.post("api/reviews/create/", data);
    return response.data;
};
