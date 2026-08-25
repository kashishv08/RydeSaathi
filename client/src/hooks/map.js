import { useQuery } from "@tanstack/react-query";
import { reverseGeocodeApi } from "../api/riderApi";

export function useReverseGeocode(lat, lon) {
    return useQuery({
        queryKey: ["reverse-geocode", lat, lon],
        queryFn: () => reverseGeocodeApi(lat, lon),
        enabled: !!lat && !!lon,
        refetchOnWindowFocus: false,
        staleTime: 60000,
    });
}
