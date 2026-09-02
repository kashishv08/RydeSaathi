import { useMutation, useQuery } from "@tanstack/react-query";
import { completeDriverProfile, driverPing, driverProfile, driverToggleMode, transitionRide } from "../api/driverApi";

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

export const useTransitionRide = () => {
    return useMutation({
        mutationFn: (ride) => transitionRide(ride),
        retry: false,
        refetchOnWindowFocus: false,
    })
}

export const useDriverProfileComplete = () => {
    return useMutation({
        mutationFn: (driverData) => completeDriverProfile(driverData),
        retry: false,
        refetchOnWindowFocus: false,
    })
}