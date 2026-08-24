import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { autoCompleteAddressApi, fetchRoutePolylineApi, rideCreateApi, rideDetailApi, rideSearchApi } from "../api/riderApi";
import { rideAcceptDriver } from "../api/driverApi";

function useAutoCompleteAdd(search) {
    return useQuery({
        queryKey: ["autocomplete-address", search],
        queryFn: () => autoCompleteAddressApi(search),
        enabled: !!search && search.length > 2,
        retry: false,
        refetchOnWindowFocus: false,

    })
}

export function useFetchRoutePolyline({ pickup, drop, enabled = true }) {
    return useQuery({
        queryKey: ["fetchingPolyline", { pickup, drop }],
        queryFn: () => fetchRoutePolylineApi({ pickup, drop }),
        enabled: enabled && !!pickup && !!drop,
        retry: false,
        refetchOnWindowFocus: false,

    })
}

export function useRideSearch(loc) {
    return useQuery({
        queryKey: ["ride-search", loc],
        queryFn: () => rideSearchApi(loc),
        enabled: (loc?.enabled !== false) && !!loc?.pickup && !!loc?.distance_km,
        retry: false,
        refetchOnWindowFocus: false,
    })
}

export function useRideCreate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ride) => rideCreateApi(ride),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ride-detail"] });
        },
        retry: false,
    })
}

export function useRideAcceptDriver() {
    return useMutation({
        mutationFn: (ride_id) => rideAcceptDriver(ride_id),
        retry: false,
        refetchOnWindowFocus: false,
    })
}

export function useRideDetails() {
    return useQuery({
        queryKey: ["ride-detail"],
        queryFn: rideDetailApi,
        retry: false,
        refetchOnWindowFocus: false,
    })
}

export default useAutoCompleteAdd

