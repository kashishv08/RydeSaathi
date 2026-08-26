import { toast } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Car,
    ChevronDown,
    ChevronUp,
    Clock,
    MapPin,
    Navigation,
    Search as SearchIcon,
    Sparkles
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LocationInputGroup from "../../components/rider/LocationInputGroup";
import NearDriver from "../../components/rider/NearDriver";
import RequestingRideModal from "../../components/rider/RequestingRideModal";
import RideListShimmer from "../../components/rider/RideListShimmer";
import StaticRouteMap from "../../components/shared/StaticRouteMap";
import Navbar from "../../components/shared/layout/Navbar";
import { useFetchRoutePolyline, useRideSearch } from "../../hooks/rider";

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
        enabled: !!(pickupCoords && dropCoords),
    });

    const distance_km = routeData?.distanceMeters ? routeData.distanceMeters / 1000 : null;
    const duration_min = routeData?.durationSeconds ? routeData.durationSeconds / 60 : null;

    const { data: rideData, error: rideError, isFetching: isRideFetching } = useRideSearch({
        pickup: pickupCoords,
        distance_km,
        duration_min,
        enabled: searchTriggered && !!routeData && !error,
    });

    useEffect(() => {
        if (rideData?.data?.options) {
            setCachedOptions(rideData.data.options);
        }
    }, [rideData]);

    useEffect(() => {
        if (error) {
            toast.warning("There is no route available for the given location");
            setPickupCoords(null);
            setDropCoords(null);
        }
    }, [error]);

    useEffect(() => {
        if (rideError) {
            const msg = rideError?.response?.data?.message || "No drivers available near your location";
            toast.warning(msg);
        }
    }, [rideError]);

    const handleSearchSubmit = () => {
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
    };

    return (
        <>
            <div
                className="h-screen flex flex-col overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0f0f14 0%,#13131a 60%,#0d0d12 100%)" }}
            >
                <Navbar />

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">

                    {/* ── Left Sidebar ──────────────────────────────────────── */}
                    <motion.div
                        initial={{ x: -28, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="w-full md:w-[460px] shrink-0 z-10 flex flex-col h-full min-h-0 relative border-r"
                        style={{
                            background: "linear-gradient(180deg,#13131f 0%,#0f0f1a 100%)",
                            borderColor: "rgba(139,92,246,0.12)",
                        }}
                    >
                        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 flex flex-col relative custom-scrollbar">
                            <AnimatePresence mode="wait">

                                {/* ── SEARCH FORM MODE ────────────────────── */}
                                {!searchTriggered ? (
                                    <motion.div
                                        key="search-mode"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="flex flex-col h-full gap-6"
                                    >
                                        {/* Hero heading */}
                                        <div>
                                            <motion.span
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3"
                                                style={{
                                                    background: "rgba(139,92,246,0.1)",
                                                    border: "1px solid rgba(139,92,246,0.22)",
                                                    color: "#a78bfa",
                                                }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                                Instant Booking
                                            </motion.span>
                                            <motion.h2
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.15 }}
                                                className="text-4xl font-black tracking-tight text-white"
                                            >
                                                Get a ride
                                            </motion.h2>
                                            <motion.p
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-sm text-gray-500 mt-1"
                                            >
                                                Enter your pickup &amp; dropoff to see available drivers
                                            </motion.p>
                                        </div>

                                        {/* Location inputs */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.22 }}
                                        >
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
                                        </motion.div>

                                        {/* Route info pills (if route loaded) */}
                                        {distance_km && duration_min && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-3"
                                            >
                                                <div
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                                    style={{
                                                        background: "rgba(139,92,246,0.08)",
                                                        border: "1px solid rgba(139,92,246,0.18)",
                                                        color: "#a78bfa",
                                                    }}
                                                >
                                                    <Navigation className="w-3 h-3" />
                                                    {distance_km.toFixed(1)} km
                                                </div>
                                                <div
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                                    style={{
                                                        background: "rgba(16,185,129,0.08)",
                                                        border: "1px solid rgba(16,185,129,0.18)",
                                                        color: "#34d399",
                                                    }}
                                                >
                                                    <Clock className="w-3 h-3" />
                                                    {Math.round(duration_min)} mins
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Search CTA */}
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleSearchSubmit}
                                            disabled={isRouteFetching || isRideFetching || !routeData}
                                            className="w-full font-bold text-sm py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 mt-auto text-white"
                                            style={{
                                                background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
                                                boxShadow: "0 6px 28px rgba(124,58,237,0.35)",
                                            }}
                                        >
                                            {isRideFetching ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <SearchIcon className="w-4 h-4" />
                                            )}
                                            <span>{isRideFetching ? "Finding Rides…" : "Search Rides"}</span>
                                            {!isRideFetching && <ArrowRight className="w-4 h-4 opacity-70" />}
                                        </motion.button>
                                    </motion.div>

                                ) : (

                                    /* ── RESULTS MODE ───────────────────────── */
                                    <motion.div
                                        key="results-mode"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="flex flex-col h-full gap-5"
                                    >
                                        {/* Title + stats */}
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-black text-white tracking-tight">
                                                Choose a ride
                                            </h2>
                                            {distance_km && duration_min && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                                        style={{
                                                            background: "rgba(139,92,246,0.1)",
                                                            border: "1px solid rgba(139,92,246,0.2)",
                                                            color: "#a78bfa",
                                                        }}
                                                    >
                                                        <Navigation className="w-2.5 h-2.5" />
                                                        {distance_km.toFixed(1)} km
                                                    </span>
                                                    <span
                                                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                                        style={{
                                                            background: "rgba(16,185,129,0.1)",
                                                            border: "1px solid rgba(16,185,129,0.2)",
                                                            color: "#34d399",
                                                        }}
                                                    >
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {Math.round(duration_min)} min
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Collapsible Route Card */}
                                        <div className="relative">
                                            {!isRouteExpanded ? (
                                                <motion.div
                                                    layoutId="route-card"
                                                    onClick={() => setIsRouteExpanded(true)}
                                                    className="rounded-2xl p-4 cursor-pointer flex items-center justify-between group transition-all"
                                                    style={{
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: "1px solid rgba(255,255,255,0.08)",
                                                    }}
                                                    whileHover={{ borderColor: "rgba(139,92,246,0.25)" }}
                                                >
                                                    <div className="flex items-start gap-3.5 overflow-hidden flex-1">
                                                        <div className="flex flex-col items-center mt-0.5 shrink-0 gap-0.5">
                                                            <div
                                                                className="w-4 h-4 rounded-full flex items-center justify-center"
                                                                style={{ background: "rgba(139,92,246,0.2)" }}
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                                            </div>
                                                            <div
                                                                className="w-[2px] h-4 rounded-full"
                                                                style={{ background: "linear-gradient(to bottom,rgba(139,92,246,0.6),rgba(16,185,129,0.6))" }}
                                                            />
                                                            <div
                                                                className="w-4 h-4 rounded-md flex items-center justify-center"
                                                                style={{ background: "rgba(16,185,129,0.18)" }}
                                                            >
                                                                <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-gray-300 truncate">
                                                                {pickupCoords?.name || "Pickup Location"}
                                                            </p>
                                                            <p className="text-sm font-semibold text-gray-300 truncate border-t pt-2"
                                                                style={{ borderColor: "rgba(255,255,255,0.06)" }}
                                                            >
                                                                {dropCoords?.name || "Dropoff Location"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center ml-3 shrink-0 transition-colors"
                                                        style={{ background: "rgba(255,255,255,0.05)" }}
                                                    >
                                                        <ChevronDown className="text-gray-400" size={16} />
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    layoutId="route-card"
                                                    className="rounded-2xl p-5"
                                                    style={{
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: "1px solid rgba(139,92,246,0.2)",
                                                    }}
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="font-bold text-base text-white flex items-center gap-2">
                                                            <Car className="w-4 h-4 text-violet-400" />
                                                            Edit Route
                                                        </h3>
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setIsRouteExpanded(false)}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                                            style={{ background: "rgba(255,255,255,0.07)" }}
                                                        >
                                                            <ChevronUp size={16} className="text-gray-400" />
                                                        </motion.button>
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
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Ride Options */}
                                        {!cachedOptions || isRouteFetching || isRideFetching ? (
                                            <RideListShimmer />
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex-1 flex flex-col relative"
                                            >
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
                                                            amount: selectedOption.fare,
                                                        };
                                                        setTimeout(() => {
                                                            navigate("/ride/create", { state: { ridePayload } });
                                                        }, 2000);
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Ambient violet bottom glow */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                            style={{ background: "linear-gradient(to top,rgba(139,92,246,0.07),transparent)" }}
                        />
                    </motion.div>

                    {/* ── Right Map Pane ────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.55, delay: 0.15 }}
                        className="flex-1 relative min-h-0 overflow-hidden md:p-4 p-0"
                        style={{ background: "#0d0d12" }}
                    >
                        <div
                            className="w-full h-full relative md:rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: "0 0 0 1px rgba(139,92,246,0.1),0 24px 80px rgba(0,0,0,0.55)",
                            }}
                        >
                            <StaticRouteMap pickup={pickupCoords} drop={dropCoords} routeData={routeData} />
                        </div>
                    </motion.div>
                </div>
            </div>

            <RequestingRideModal isOpen={isRequestingRide} />
        </>
    );
}