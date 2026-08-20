import { useMutation, useQuery } from "@tanstack/react-query";
import { sendOtp, userProfile, verifyOtp } from "../api/authApi";
import { set_token } from "../utils/tokenStore";


export const useSendOtp = () => {
    return useMutation({
        mutationFn: sendOtp,
    });
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
        onSuccess: (response) => {
            set_token(response.data.access);
        },
    })
}

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: userProfile,
        retry: false
    })
}
