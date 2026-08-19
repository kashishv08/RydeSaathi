import { useQuery } from "@tanstack/react-query";
import { driverProfile } from "../api/driverApi";

export const useDriverProfile = (options = {}) => {
    return useQuery({
        queryKey: ["driver-profile"],
        queryFn: driverProfile,
        retry: false,
        ...options
    })
}
