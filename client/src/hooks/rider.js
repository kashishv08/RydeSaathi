import { useQuery } from "@tanstack/react-query";
import { autoCompleteAddressApi, fetchRoutePolylineApi, rideSearchApi } from "../api/riderApi";

function useAutoCompleteAdd(search) {
    return useQuery({
        queryKey: ["autocomplete-address", search],
        queryFn: () => autoCompleteAddressApi(search),
        enabled: !!search && search.length > 2,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useFetchRoutePolyline({ pickup, drop, enabled = true }) {
    return useQuery({
        queryKey: ["fetchingPolyline", { pickup, drop }],
        queryFn: () => fetchRoutePolylineApi({ pickup, drop }),
        enabled: enabled && !!pickup && !!drop,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useRideSearch(loc) {
    return useQuery({
        queryKey: ["ride-search", loc],
        queryFn: () => rideSearchApi(loc),
        enabled: (loc?.enabled !== false) && !!loc?.pickup && !!loc?.distance_km,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    })
}

export default useAutoCompleteAdd

