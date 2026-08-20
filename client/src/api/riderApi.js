import { axiosInstanceNoAuth } from "../services/axiosClient"
const AUTOCOMPLETE_API = import.meta.env.VITE_AUTOCOMPLETE_API;


export const autoCompleteAddressApi = async (search) => {
    const res = await axiosInstanceNoAuth.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${search}&apiKey=${AUTOCOMPLETE_API}&limit=5&format=json`)
    return res;
}