import { toast } from "@heroui/react";
import { ChevronDown, ChevronUp, Percent } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LocationInputGroup from '../../components/rider/LocationInputGroup';
import NearDriver from '../../components/rider/NearDriver';
import RequestingRideModal from '../../components/rider/RequestingRideModal';
import RideListShimmer from '../../components/rider/RideListShimmer';
import StaticRouteMap from '../../components/shared/StaticRouteMap';
import Navbar from "../../components/shared/layout/Navbar";
import { useFetchRoutePolyline, useRideSearch } from '../../hooks/rider';

export default function RideSearch() {
    const { state } = useLocation();
    const [pickupCoords, setPickupCoords] = useState(state?.pickup || null);
    const [dropCoords, setDropCoords] = useState(state?.drop || null);
    const [searchTriggered, setSearchTriggered] = useState(!!state?.pickup && !!state?.drop);
    const [isRouteExpanded, setIsRouteExpanded] = useState(!searchTriggered);
    const [activeInput, setActiveInput] = useState(null);
    const [cachedOptions, setCachedOptions] = useState(null);
    const [isRequestingRide, setIsRequestingRide] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        if (rideData?.data?.options) {
            setCachedOptions(rideData.data.options);
        }
    }, [rideData]);

    useEffect(() => {
        if (error) {
            toast.warning("There is no route available for the given location");
            setPickupCoords()
            setDropCoords()
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

                                    <LocationInputGroup
                                        extraClasses="mb-6"
                                        containerRef={locationInputsRef}
                                        activeInput={activeInput}
                                        setActiveInput={setActiveInput}
                                        pickupCoords={pickupCoords}
                                        setPickupCoords={setPickupCoords}
                                        dropCoords={dropCoords}
                                        setDropCoords={setDropCoords}
                                        setSearchTriggered={setSearchTriggered}
                                    />

                                    <button
                                        onClick={() => {
                                            if (!pickupCoords || !dropCoords) {
                                                toast.warning("Please select both pickup and dropoff locations.");
                                                return;
                                            }
                                            if (pickupCoords.lat === dropCoords.lat && pickupCoords.lon === dropCoords.lon) {
                                                toast.warning("Pickup and drop-off locations cannot be the same.");
                                                return;
                                            }
                                            setCachedOptions(null);
                                            setSearchTriggered(true);
                                            setIsRouteExpanded(false);
                                        }}
                                        disabled={isRouteFetching || isRideFetching || !routeData}
                                        className="w-full bg-black text-white font-bold text-lg py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                    >
                                        {(isRideFetching) && (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {isRideFetching ? "Searching..." : "Search"}
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

                                            <LocationInputGroup
                                                containerRef={locationInputsRef}
                                                activeInput={activeInput}
                                                setActiveInput={setActiveInput}
                                                pickupCoords={pickupCoords}
                                                setPickupCoords={setPickupCoords}
                                                dropCoords={dropCoords}
                                                setDropCoords={setDropCoords}
                                                setSearchTriggered={setSearchTriggered}
                                            />
                                        </div>
                                    )}

                                    {(!cachedOptions || isRouteFetching || isRideFetching) ? (
                                        <RideListShimmer />
                                    ) : (
                                        <div className="flex-1 flex flex-col relative">
                                            <NearDriver
                                                options={cachedOptions}
                                                onRequest={(selectedOption) => {
                                                    setIsRequestingRide(true);

                                                    const ridePayload = {
                                                        pickup_lat: pickupCoords.lat,
                                                        pickup_lng: pickupCoords.lon,
                                                        drop_lat: dropCoords.lat,
                                                        drop_lng: dropCoords.lon,
                                                        pickup_address: pickupCoords.name,
                                                        drop_address: dropCoords.name,
                                                        vehicle_type: selectedOption.vehicle_type,
                                                        route_geometry: routeData.geometry,
                                                        route_duration_min: Math.round(routeData.durationSeconds / 60),
                                                        route_distance_km: parseFloat((routeData.distanceMeters / 1000).toFixed(2)),
                                                        amount: selectedOption.fare
                                                    }
                                                    setTimeout(() => {
                                                        navigate('/ride/create', { state: { ridePayload: ridePayload } });
                                                    }, 2000);
                                                }}
                                            />
                                            <RequestingRideModal isOpen={isRequestingRide} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 relative bg-white min-h-0 overflow-hidden p-6">
                        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                            <StaticRouteMap pickup={pickupCoords} drop={dropCoords} routeData={routeData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

