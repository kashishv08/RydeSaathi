import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/shared/layout/Navbar";
import LocationInput from "../../components/shared/ui/LocationInput";
import { useFetchRoutePolyline, useRideSearch } from '../../hooks/rider';
import { toast } from "@heroui/react";
import NearDriver from '../../components/rider/NearDriver';
import { ChevronDown, ChevronUp, Percent } from 'lucide-react';
const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export default function RideSearch() {
    const { state } = useLocation();
    const [pickupCoords, setPickupCoords] = useState(state?.pickup || null);
    const [dropCoords, setDropCoords] = useState(state?.drop || null);
    const [searchTriggered, setSearchTriggered] = useState(!!state?.pickup && !!state?.drop);
    const [isRouteExpanded, setIsRouteExpanded] = useState(!searchTriggered);
    const [activeInput, setActiveInput] = useState(null);
    const [cachedOptions, setCachedOptions] = useState(null);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const locationInputsRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (locationInputsRef.current && !locationInputsRef.current.contains(event.target)) {
                setActiveInput(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { data: routeData, error, isFetching: isRouteFetching } = useFetchRoutePolyline({ 
        pickup: pickupCoords, 
        drop: dropCoords, 
        enabled: !!(pickupCoords && dropCoords) 
    });

    const distance_km = routeData?.distanceMeters ? routeData.distanceMeters / 1000 : null;
    const duration_min = routeData?.durationSeconds ? routeData.durationSeconds / 60 : null;

    const { data: rideData, error: rideError, isFetching: isRideFetching } = useRideSearch({
        pickup: pickupCoords,
        distance_km,
        duration_min,
        enabled: searchTriggered && !!routeData && !error
    });
    console.log(rideData, rideError)

    useEffect(() => {
        if (rideData?.data?.options) {
            setCachedOptions(rideData.data.options);
        }
    }, [rideData]);

    useEffect(() => {
        if (mapRef.current) return;
        window.locationiq.key = LOCATIONIQ_KEY;

        const map = new window.maplibregl.Map({
            container: mapContainerRef.current,
            style: window.locationiq.getLayer("Streets"),
            zoom: 13,
            center: [77.2090, 28.6139]
        });

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !pickupCoords || !dropCoords || !routeData) return;

        function drawRoute() {
            const geometry = routeData.geometry;
            const durationMins = Math.ceil(routeData.durationSeconds / 60);

            if (map.getSource('route')) {
                map.removeLayer('route');
                map.removeSource('route');
            }

            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];

            map.addSource('route', {
                'type': 'geojson',
                'data': { 'type': 'Feature', 'properties': {}, 'geometry': geometry }
            });

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': { 'line-join': 'round', 'line-cap': 'round' },
                'paint': { 'line-color': '#000000', 'line-width': 4 }
            });

            const startEl = document.createElement('div');
            startEl.className = 'flex items-center bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer';
            startEl.innerHTML = `
                <div class="bg-black text-white px-3 py-2 text-center text-sm font-bold leading-tight">
                    ${durationMins}<br/>min
                </div>
                <div class="px-4 py-2 font-semibold text-black whitespace-nowrap">
                    From ${pickupCoords.name || "Pickup"} &gt;
                </div>
            `;
            const startMarker = new window.maplibregl.Marker({ element: startEl, offset: [0, -20] })
                .setLngLat([pickupCoords.lon, pickupCoords.lat])
                .addTo(map);

            const endEl = document.createElement('div');
            endEl.className = 'bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2 font-semibold text-black whitespace-nowrap cursor-pointer';
            endEl.innerHTML = `To ${dropCoords.name || "Dropoff"} &gt;`;

            const endMarker = new window.maplibregl.Marker({ element: endEl, offset: [0, -20] })
                .setLngLat([dropCoords.lon, dropCoords.lat])
                .addTo(map);

            markersRef.current = [startMarker, endMarker];

            const bounds = new window.maplibregl.LngLatBounds()
                .extend([pickupCoords.lon, pickupCoords.lat])
                .extend([dropCoords.lon, dropCoords.lat]);
            map.fitBounds(bounds, { padding: 100 });
        }

        drawRoute();
    }, [pickupCoords, dropCoords, routeData]);

    useEffect(() => {
        if (error) {
            toast.warning("There is no route available for the given location");
            const map = mapRef.current;
            if (map) {
                if (map.getSource('route')) {
                    map.removeLayer('route');
                    map.removeSource('route');
                }
                markersRef.current.forEach(m => m.remove());
                markersRef.current = [];
            }
        }
    }, [error]);

    useEffect(() => {
        if (rideError) {
            const msg = rideError?.response?.data?.message || "No drivers available near your location";
            toast.warning(msg);
        }
    }, [rideError]);



    return (
        <>

            <div className="h-screen flex flex-col overflow-hidden">
                <Navbar />
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-white min-h-0">

                    {/* Left Sidebar - Scrollable */}
                    <div className="w-full md:w-[450px] shrink-0 z-10 flex flex-col h-full border-r border-gray-200 bg-white relative min-h-0">
                        <div className="p-6 overflow-y-auto flex-1 flex flex-col relative">
                            {!searchTriggered ? (
                                // SEARCH MODE (Screenshots 1 & 2)
                                <>
                                    <h2 className="text-3xl font-bold mb-6 text-black">Get a ride</h2>
                                    
                                    <div className="bg-[#e6f4ea] text-[#137333] px-3 py-2 rounded-lg text-sm font-medium flex items-center mb-4">
                                        <Percent size={14} className="mr-2" />
                                        9% off your next ride. Up to ₹1,000 per ride.
                                    </div>

                                    <div className="space-y-3 relative mb-6" ref={locationInputsRef}>
                                        <div className="absolute left-[20px] top-10 bottom-10 w-0.5 bg-black z-0"></div>
                                        <div className={`relative ${activeInput === 'pickup' || activeInput === null ? 'z-20' : 'z-10'}`}>
                                            <LocationInput
                                                placeholder="Pickup location"
                                                initialValue={pickupCoords?.name || ""}
                                                isActive={activeInput === 'pickup'}
                                                onFocus={() => setActiveInput('pickup')}
                                                onSelectLocation={(loc) => {
                                                    setPickupCoords(loc);
                                                }}
                                            />
                                        </div>
                                        <div className={`relative ${activeInput === 'dropoff' ? 'z-20' : 'z-10'}`}>
                                            <LocationInput
                                                placeholder="Dropoff location"
                                                initialValue={dropCoords?.name || ""}
                                                isActive={activeInput === 'dropoff'}
                                                onFocus={() => setActiveInput('dropoff')}
                                                onSelectLocation={(loc) => {
                                                    setDropCoords(loc);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            if (!pickupCoords || !dropCoords) {
                                                toast.warning("Please select both pickup and dropoff locations.");
                                                return;
                                            }
                                            setSearchTriggered(true);
                                            setIsRouteExpanded(false);
                                        }}
                                        disabled={isRouteFetching || isRideFetching}
                                        className="w-full bg-black text-white font-bold text-lg py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                    >
                                        {(isRouteFetching || isRideFetching) && (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {isRouteFetching || isRideFetching ? "Searching..." : "Search"}
                                    </button>
                                </>
                            ) : (
                                // RESULT MODE (Screenshots 3 & 4)
                                <>
                                    <h2 className="text-3xl font-bold mb-6 text-black">Choose a ride</h2>
                                    
                                    {!isRouteExpanded ? (
                                        // COLLAPSED (Screenshot 3)
                                        <div
                                            onClick={() => setIsRouteExpanded(true)}
                                            className="border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors mb-4"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-base font-medium text-black truncate pr-4 leading-tight">
                                                    {pickupCoords?.name || 'Pickup'} &rarr; {dropCoords?.name || 'Dropoff'}
                                                </div>
                                                <ChevronDown className="shrink-0 text-black mt-1" size={20} />
                                            </div>
                                            <div className="text-sm text-gray-500 mb-3">Leave Now</div>
                                            <div className="bg-[#e6f4ea] text-[#137333] px-3 py-2 rounded-lg text-sm font-medium flex items-center">
                                                <Percent size={14} className="mr-2" />
                                                9% off your next ride. Up to ₹1,000 per ride.
                                            </div>
                                        </div>
                                    ) : (
                                        // EXPANDED (Screenshot 4)
                                        <div className="border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-lg">Ride details</h3>
                                                <div className="p-1 hover:bg-gray-100 rounded-full cursor-pointer transition-colors" onClick={() => setIsRouteExpanded(false)}>
                                                    <ChevronUp size={20} className="text-black" />
                                                </div>
                                            </div>
                                            
                                            <div className="bg-[#e6f4ea] text-[#137333] px-3 py-2 rounded-lg text-sm font-medium flex items-center mb-4">
                                                <Percent size={14} className="mr-2" />
                                                9% off your next ride. Up to ₹1,000 per ride.
                                            </div>

                                            <div className="space-y-3 relative" ref={locationInputsRef}>
                                                <div className="absolute left-[20px] top-10 bottom-10 w-0.5 bg-black z-0"></div>
                                                <div className={`relative ${activeInput === 'pickup' || activeInput === null ? 'z-20' : 'z-10'}`}>
                                                    <LocationInput
                                                        placeholder="Pickup location"
                                                        initialValue={pickupCoords?.name || ""}
                                                        isActive={activeInput === 'pickup'}
                                                        onFocus={() => setActiveInput('pickup')}
                                                        onSelectLocation={(loc) => {
                                                            setPickupCoords(loc);
                                                            setSearchTriggered(false); // Revert to Search Mode
                                                        }}
                                                    />
                                                </div>
                                                <div className={`relative ${activeInput === 'dropoff' ? 'z-20' : 'z-10'}`}>
                                                    <LocationInput
                                                        placeholder="Dropoff location"
                                                        initialValue={dropCoords?.name || ""}
                                                        isActive={activeInput === 'dropoff'}
                                                        onFocus={() => setActiveInput('dropoff')}
                                                        onSelectLocation={(loc) => {
                                                            setDropCoords(loc);
                                                            setSearchTriggered(false); // Revert to Search Mode
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {cachedOptions && (
                                        <div className="flex-1 flex flex-col relative">
                                            {(isRouteFetching || isRideFetching) && (
                                                <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center rounded-xl">
                                                    <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <NearDriver options={cachedOptions} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Map - Fixed */}
                    <div className="flex-1 relative bg-white min-h-0 overflow-hidden p-6">
                        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

