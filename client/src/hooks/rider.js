import { useQuery } from "@tanstack/react-query";
import { autoCompleteAddressApi } from "../api/riderApi";

function useAutoCompleteAdd(search) {
    return useQuery({
        queryKey: ["autocomplete-address", search],
        queryFn: () => autoCompleteAddressApi(search),
        enabled: !!search && search.length > 2,
        retry: false
    })
}

export default useAutoCompleteAdd