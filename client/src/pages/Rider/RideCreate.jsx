import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    Car,
    CheckCircle2,
    MapPin,
    Navigation,
    ShieldCheck,
    Sparkles,
    Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DriverArriving from "../../components/rider/DriverArriving";
import FindingDriver from "../../components/rider/FindingDriver";
import PaymentRider from "../../components/rider/PaymentRider";
import ActiveTrackingMap from "../../components/shared/ActiveTrackingMap";
import Navbar from "../../components/shared/layout/Navbar";
import RideRating from "../../components/shared/RideRating";
import StaticRouteMap from "../../components/shared/StaticRouteMap";

import { RIDE_STATUS } from "../../constants";
import { useTransitionRide } from "../../hooks/driver";
import { useFetchRoutePolyline, useRideCreate, useRideDetails } from "../../hooks/rider";
import { useActiveRideWebSocket } from "../../hooks/useActiveRideWebSocket";
import { getDynamicEtaMins } from "../../utils/geoHelpers";
import { getConnectingTime } from "../../utils/vehicleHelpers";

// ── Pulse ring for sonar effect during search ────────────────────────────────
const PulseRing = ({ delay = 0 }) => (
    <motion.div
        className="absolute rounded-full border"
        style={{ width: 72, height: 72, borderColor: "hsl(169,59%,31%,0.25)" }}
        initial={{ scale: 0.5, opacity: 0.7 }}
        animate={{ scale: 2.8, opacity: 0 }}
        transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
    />
);

// ── Step progress indicator ──────────────────────────────────────────────────
const STEPS = [
    { key: "finding", label: "Searching" },
    { key: "found", label: "Driver Found" },
    { key: "in_progress", label: "En Route" },
    { key: "completed", label: "Arrived" },
];
const stepOrder = ["finding", "found", "in_progress", "completed", "paid"];

function StepProgress({ rideState }) {
    const currentIdx = stepOrder.indexOf(rideState);
    return (
        <div className="flex items-center w-full">
            {STEPS.map((step, i) => {
                const stepIdx = stepOrder.indexOf(step.key);
                const isCompleted = currentIdx > stepIdx;
                const isActive =
                    rideState === step.key ||
                    (rideState === "paid" && step.key === "completed");
                return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <motion.div
                                animate={{
                                    scale: isActive ? [1, 1.2, 1] : 1,
                                    backgroundColor: isCompleted
                                        ? "var(--clr-primary)"
                                        : isActive
                                        ? "var(--clr-primary)"
                                        : "var(--clr-border)",
                                }}
                                transition={{
                                    duration: 0.4,
                                    repeat: isActive ? Infinity : 0,
                                    repeatDelay: 1.5,
                                }}
                                className="w-3 h-3 rounded-full"
                            />
                            <span
                                className={`text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap`}
                                style={{
                                    color: isActive || isCompleted ? "var(--clr-primary)" : "var(--clr-muted)"
                                }}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className="flex-1 h-[2px] mx-1 rounded-full overflow-hidden bg-gray-700 mb-4">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: "var(--clr-primary)" }}
                                    initial={{ width: "0%" }}
                                    animate={{
                                        width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                                    }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_CFG = {
    finding: {
        Icon: Sparkles,
        label: "Dispatching",
        cls: "bg-amber-500/10 border-amber-400/30 text-amber-400",
        spin: false,
        pulse: true,
    },
    found: {
        Icon: Car,
        label: "Driver En Route",
        cls: "bg-blue-500/10 border-blue-400/30 text-blue-400",
        spin: false,
        pulse: false,
    },
    in_progress: {
        Icon: Navigation,
        label: "On Trip",
        cls: "bg-emerald-500/10 border-emerald-400/30 text-emerald-400",
        spin: true,
        pulse: false,
    },
    completed: {
        Icon: CheckCircle2,
        label: "Arrived",
        cls: "bg-gray-500/10 border-gray-500/30 text-gray-300",
        spin: false,
        pulse: false,
    },
    paid: {
        Icon: CheckCircle2,
        label: "Arrived",
        cls: "bg-gray-500/10 border-gray-500/30 text-gray-300",
        spin: false,
        pulse: false,
    },
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function RideCreate() {
    const location = useLocation();
    const navigate = useNavigate();

    const [payload] = useState(location.state?.ridePayload);

    useEffect(() => {
        if (location.state?.ridePayload) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const [driverloc, setDriverloc] = useState(null);
    const [initialDriverLoc, setInitialDriverLoc] = useState(null);
    const [rideState, setRideState] = useState("finding");
    const [findingText, setFindingText] = useState("Finding drivers nearby");
    const [activeRideId, setActiveRideId] = useState(null);

    const { mutateAsync: rideCreateAsync } = useRideCreate();
    const { data: rideDetailResponse, refetch: refetchRideDetails } = useRideDetails();

    const [ride, setRide] = useState(rideDetailResponse?.data || null);

    useEffect(() => {
        if (rideDetailResponse?.data) {
            setRide(rideDetailResponse.data);
        }
    }, [rideDetailResponse?.data]);

    const { mutate: transitionRide } = useTransitionRide();

    const pickupCoords = ride
        ? {
            lat: parseFloat(ride.pickup_lat),
            lon: parseFloat(ride.pickup_lng),
            name: ride.pickup_address,
        }
        : null;

    const dropCoords = ride
        ? {
            lat: parseFloat(ride.drop_lat),
            lon: parseFloat(ride.drop_lng),
            name: ride.drop_address,
        }
        : null;

    const routeData = ride?.route_geometry
        ? {
            geometry: ride.route_geometry,
            durationSeconds: ride.route_duration_min * 60,
            distanceMeters: ride.route_distance_km * 1000,
        }
        : null;

    const hasCreatedRide = useRef(false);

    // Dynamically fetch route from driver's current location to destination
    const driverDest = rideState === "found" ? pickupCoords : dropCoords;
    const { data: driverRouteData } = useFetchRoutePolyline({
        pickup: driverloc ?? null,
        drop: driverDest ?? null,
        enabled: (rideState === "found" || rideState === "in_progress") && !!driverloc && !!driverDest,
    });

    useActiveRideWebSocket(activeRideId, setRideState, setDriverloc, setInitialDriverLoc, refetchRideDetails);

    useEffect(() => {
        if (!payload || hasCreatedRide.current) return;
        hasCreatedRide.current = true;

        const createRide = async () => {
            try {
                const res = await rideCreateAsync(payload);
                setActiveRideId(res.data.id);
            } catch (err) {
                console.error("[RideCreate] failed:", err);
                navigate("/ride/search");
            }
        };
        createRide();
    }, [payload, navigate, rideCreateAsync]);

    useEffect(() => {
        if (!payload && rideDetailResponse && !rideDetailResponse.data && !activeRideId) {
            navigate("/ride/search", { replace: true });
        }
    }, [payload, rideDetailResponse, activeRideId, navigate]);

    useEffect(() => {
        if (!ride) return;

        setActiveRideId(ride.id);
        if (ride.status === RIDE_STATUS.ACCEPTED || ride.status === RIDE_STATUS.ARRIVED) {
            setRideState("found");
        } else if (ride.status === RIDE_STATUS.IN_PROGRESS) {
            setRideState("in_progress");
        } else if (ride.status === RIDE_STATUS.COMPLETED) {
            setRideState("completed");
        }

        if (ride.driver_location) {
            const loc = { lat: ride.driver_location.lat, lon: ride.driver_location.lng };
            setDriverloc(loc);
            setInitialDriverLoc((prev) => prev || loc);
        }
    }, [ride]);

    useEffect(() => {
        if (rideState !== "finding") return;

        const messages = [
            "Finding drivers nearby",
            () => `Connecting you with a driver by ${getConnectingTime()}`,
            "We'll update you as soon as we can",
        ];

        let currentIndex = 0;
        const cycleTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % messages.length;
            const msg = messages[currentIndex];
            setFindingText(typeof msg === "function" ? msg() : msg);
        }, 4000);

        const timeoutTimer = setTimeout(() => setRideState("timeout"), 60000);

        return () => {
            clearInterval(cycleTimer);
            clearTimeout(timeoutTimer);
        };
    }, [rideState]);

    useEffect(() => {
        if (!activeRideId) return;
        const interval = setInterval(() => {
            if (rideState === "in_progress") {
                refetchRideDetails();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [activeRideId, rideState, refetchRideDetails]);

    const handleRatingComplete = () => {
        toast.success("Ride completed successfully!");
        navigate("/ride/search", { replace: true });
    };

    const handleCancel = (reason = "other") => {
        const transitionPayload = {
            ride_id: activeRideId,
            status: RIDE_STATUS.CANCELLED,
            cancel_reason: reason,
        };
        transitionRide(transitionPayload);
        navigate("/ride/search");
    };

    const statusCfg = STATUS_CFG[rideState] ?? null;

    return (
        <div
            className="h-screen flex flex-col overflow-hidden grain"
            style={{ background: "var(--clr-bg)" }}
        >
            <Navbar />

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0 relative">

                {/* ── Left Panel ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ x: -28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.48, ease: "easeOut" }}
                    className="w-full md:w-[460px] shrink-0 z-20 flex flex-col h-full min-h-0 relative border-r"
                    style={{
                        background: "var(--clr-card)",
                        borderColor: "var(--clr-border)",
                    }}
                >
                    <div className="p-5 overflow-y-auto overflow-x-hidden flex-1 flex flex-col gap-5 custom-scrollbar">

                        {/* ── Security + Status Header ───────────────────── */}
                        <div
                            className="flex items-center justify-between px-4 py-3 rounded-2xl"
                            style={{
                                background: "color-mix(in srgb, var(--clr-primary) 6%, transparent)",
                                border: "1px solid color-mix(in srgb, var(--clr-primary) 14%, transparent)",
                            }}
                        >
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                                    style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)" }}
                                >
                                    <ShieldCheck className="w-4 h-4" style={{ color: "var(--clr-primary)" }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                        Live Security
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <motion.div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ background: "var(--clr-primary)" }}
                                            animate={{ opacity: [1, 0.25, 1] }}
                                            transition={{ duration: 1.4, repeat: Infinity }}
                                        />
                                        <span className="text-[10px] font-semibold" style={{ color: "var(--clr-primary)" }}>Tracked</span>
                                    </div>
                                </div>
                            </div>

                            {statusCfg && (
                                <motion.span
                                    key={rideState}
                                    initial={{ scale: 0.82, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase ${statusCfg.cls}`}
                                >
                                    <statusCfg.Icon
                                        className={`w-3 h-3 ${statusCfg.spin ? "animate-spin" : ""} ${statusCfg.pulse ? "animate-pulse" : ""}`}
                                    />
                                    {statusCfg.label}
                                </motion.span>
                            )}
                        </div>

                        {/* ── Step progress bar ──────────────────────────── */}
                        {rideState !== "timeout" && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.22 }}
                                className="px-1 pt-1"
                            >
                                <StepProgress rideState={rideState} />
                            </motion.div>
                        )}

                        {/* ── Route summary pills ────────────────────────── */}
                        {pickupCoords && dropCoords && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.32 }}
                                className="flex flex-col gap-2 px-1"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'color-mix(in srgb, var(--clr-primary) 15%, transparent)', border: `1px solid color-mix(in srgb, var(--clr-primary) 35%, transparent)` }}
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ background: "var(--clr-primary)" }} />
                                    </div>
                                    <p className="text-xs text-gray-400 truncate leading-tight">
                                        {pickupCoords.name}
                                    </p>
                                </div>
                                <div
                                    className="ml-[9px] w-[2px] h-4 rounded-full"
                                    style={{
                                        background:
                                            "linear-gradient(to bottom,hsl(169,59%,31%,0.6),hsl(14,83%,62%,0.6))",
                                    }}
                                />
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'color-mix(in srgb, var(--clr-accent) 15%, transparent)', border: `1px solid color-mix(in srgb, var(--clr-accent) 30%, transparent)` }}
                                    >
                                        <MapPin className="w-3 h-3" style={{ color: "var(--clr-accent)" }} />
                                    </div>
                                    <p className="text-xs text-gray-400 truncate leading-tight">
                                        {dropCoords.name}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Dynamic State Panels ───────────────────────── */}
                        <AnimatePresence mode="wait">
                            {rideState === "finding" && (
                                <motion.div
                                    key="finding-container"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.32 }}
                                >
                                    <FindingDriver
                                        pickup={pickupCoords?.name}
                                        drop={dropCoords?.name}
                                        fare={ride?.amount ?? 0.0}
                                        statusText="Ride requested"
                                        subText={findingText}
                                        onCancel={handleCancel}
                                    />
                                </motion.div>
                            )}

                            {rideState === "timeout" && (
                                <motion.div
                                    key="timeout-container"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.92 }}
                                    transition={{ duration: 0.32 }}
                                    className="rounded-3xl p-8 flex flex-col items-center text-center my-auto"
                                    style={{
                                        background:
                                            "var(--clr-card)",
                                        border: "1px solid var(--clr-border)",
                                    }}
                                >
                                    <div className="relative mb-6">
                                        <motion.div
                                            className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
                                            style={{
                                                background: "color-mix(in srgb, var(--clr-warning) 10%, transparent)",
                                                border: "1px solid color-mix(in srgb, var(--clr-warning) 22%, transparent)",
                                            }}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <AlertCircle className="w-9 h-9" style={{ color: "var(--clr-warning)" }} />
                                        </motion.div>
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl"
                                            style={{ background: "rgba(251,191,36,0.06)" }}
                                            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>

                                    <h2 className="text-2xl font-black mb-2" style={{ color: "var(--clr-foreground)" }}>
                                        High Demand in Area
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs">
                                        All nearby drivers are currently on trips. Thank you for your patience while we continue searching.
                                    </p>

                                    <motion.button
                                        whileHover={{ scale: 1.03, y: -1 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleCancel("timeout")}
                                        className="w-full flex items-center justify-center gap-2.5 text-white font-bold text-sm py-4 rounded-2xl transition-all"
                                        style={{
                                            background: "var(--clr-primary)",
                                            boxShadow: "0 4px 22px color-mix(in srgb, var(--clr-primary) 35%, transparent)",
                                        }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Return to Ride Search
                                    </motion.button>
                                </motion.div>
                            )}

                            {rideState === "found" && (
                                <motion.div
                                    key="found-container"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.32 }}
                                >
                                    <DriverArriving
                                        onCancel={handleCancel}
                                        isInProgress={false}
                                        pickupEtaMins={
                                            driverloc && driverRouteData && pickupCoords
                                                ? getDynamicEtaMins(driverloc, pickupCoords, driverRouteData.durationSeconds)
                                                : null
                                        }
                                    />
                                </motion.div>
                            )}

                            {rideState === "in_progress" && (
                                <motion.div
                                    key="in-progress-container"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.32 }}
                                >
                                    <DriverArriving
                                        onCancel={handleCancel}
                                        isInProgress={true}
                                        destEtaMins={
                                            driverloc && driverRouteData && dropCoords
                                                ? getDynamicEtaMins(driverloc, dropCoords, driverRouteData.durationSeconds)
                                                : null
                                        }
                                    />
                                </motion.div>
                            )}

                            {rideState === "completed" && (
                                <motion.div
                                    key="completed-container"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.32 }}
                                >
                                    <PaymentRider />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Ambient violet bottom glow */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none rounded-b-none"
                        style={{ background: "linear-gradient(to top,hsl(169,59%,31%,0.05),transparent)" }}
                    />
                </motion.div>

                {/* ── Right Map Panel ─────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.15 }}
                    className="flex-1 relative min-h-0 overflow-hidden md:p-4 p-0"
                    style={{ background: "var(--clr-bg)" }}
                >
                    <div
                        className="w-full h-full relative md:rounded-2xl overflow-hidden"
                        style={{
                            boxShadow:
                                "0 0 0 1px var(--clr-border),0 4px 24px rgba(27,54,58,0.08)",
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {(rideState === "finding" || rideState === "timeout") && (
                                <motion.div
                                    key="static-map"
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.42 }}
                                    className="w-full h-full"
                                >
                                    <StaticRouteMap
                                        pickup={pickupCoords}
                                        drop={dropCoords}
                                        routeData={routeData}
                                    />
                                </motion.div>
                            )}

                            {rideState === "found" && (
                                <motion.div
                                    key="tracking-map-pickup"
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.42 }}
                                    className="w-full h-full"
                                >
                                    <ActiveTrackingMap
                                        startPoint={initialDriverLoc}
                                        endPoint={pickupCoords}
                                        routeData={driverRouteData}
                                        driverLocation={driverloc}
                                        role="RIDER"
                                        showEtaBadge={true}
                                    />
                                </motion.div>
                            )}

                            {(rideState === "in_progress" || rideState === "completed" || rideState === "paid") && (
                                <motion.div
                                    key="tracking-map-destination"
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.42 }}
                                    className="w-full h-full"
                                >
                                    <ActiveTrackingMap
                                        startPoint={pickupCoords}
                                        endPoint={dropCoords}
                                        routeData={driverRouteData}
                                        driverLocation={driverloc}
                                        role="RIDER"
                                        showEtaBadge={true}
                                        isCompleted={rideState === "completed" || rideState === "paid"}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Live signal badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm z-10"
                            style={{
                                background: "hsl(44,44%,99%,0.72)",
                                border: "1px solid var(--clr-border)",
                            }}
                        >
                            <motion.div
                                className="w-2 h-2 rounded-full bg-emerald-400"
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--clr-foreground)' }}>
                                Live
                            </span>
                            <Wifi className="w-3 h-3 text-gray-500" />
                        </motion.div>

                        {/* Sonar pulse overlay during search */}
                        {rideState === "finding" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <div className="relative flex items-center justify-center">
                                    <PulseRing delay={0} />
                                    <PulseRing delay={0.75} />
                                    <PulseRing delay={1.5} />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ── Post-Ride Rating Modal ───────────────────────────────────── */}
            {rideState === "paid" && (
                <RideRating
                    rideId={activeRideId}
                    role="RIDER"
                    personName={ride?.driver?.first_name || ride?.driver?.user?.first_name}
                    personRole="Driver"
                    onComplete={handleRatingComplete}
                />
            )}
        </div>
    );
}