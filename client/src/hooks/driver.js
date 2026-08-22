import { useMutation, useQuery } from "@tanstack/react-query";
import { driverPing, driverProfile, driverToggleMode } from "../api/driverApi";

export const useDriverProfile = (options = {}) => {
    return useQuery({
        queryKey: ["driver-profile"],
        queryFn: driverProfile,
        retry: false,
        ...options
    })
}

export const useDriverPing = () => {
    return useMutation({
        mutationFn: (loc) => driverPing(loc),
        retry: false,
    })
}

export const useDriverToggle = () => {
    return useMutation({
        mutationFn: (mode) => driverToggleMode(mode),
        retry: false
    })
}