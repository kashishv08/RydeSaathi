import { useMutation } from "@tanstack/react-query";
import { loginRequest, registerReq } from "../api/authApi";
import { set_token } from "../utils/tokenStore";

const useLogin = () => {
    return useMutation({
        mutationFn: loginRequest,
        onSuccess: (response) => {
            console.log("data", response.data);
            set_token(response.data.access);
        },
        onError: (error) => {
            console.error(error);
        }
    });
}

export const useRegister = () => {
    return useMutation({
        mutationFn: registerReq,
        onSuccess: (res) => {
            set_token(res.data.access);
        }
    });
}

export default useLogin;