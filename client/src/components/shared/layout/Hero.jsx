import { toast } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationInput from "../ui/LocationInput";

export default function Hero() {
    const [pickupCoords, setPickupCoords] = useState({});
    const [dropCoords, setDropCoords] = useState({});
    const navigate = useNavigate();

    function handleSearchClick() {
        if (pickupCoords?.lat && dropCoords?.lat) {
            if (pickupCoords.lat === dropCoords.lat && pickupCoords.lon === dropCoords.lon) {
                toast.warning("Pickup and drop-off locations cannot be the same.");
                return;
            }
            navigate("/ride/search", { state: { pickup: pickupCoords, drop: dropCoords } });
        } else {
            navigate("/ride/search");
        }
    }

    return (
        <section className="relative bg-black text-white pt-12 pb-36 px-6 overflow-hidden min-h-[85vh] flex items-center">
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                    alt="City traffic"
                    className="w-full h-full object-cover scale-105 animate-pulse"
                    style={{ animationDuration: "10s" }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-20 grid md:grid-cols-2 gap-12 items-center w-full">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider text-gray-300 backdrop-blur-md mb-6 border border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> REDEFINING COMMUTE
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                            Go anywhere with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">RydeSaathi</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md font-light leading-relaxed">
                            Request a ride, hop in, and experience seamless travel across the city with real-time tracking.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 text-black max-w-md w-full shadow-2xl border border-white/20"
                >
                    <div className="space-y-5">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Compass className="w-5 h-5" /> Book Your Ride
                        </h2>
                        <div className="relative space-y-4">
                            <LocationInput
                                placeholder="Enter pickup location"
                                onSelectLocation={setPickupCoords}
                            />
                            <LocationInput
                                placeholder="Enter destination"
                                onSelectLocation={setDropCoords}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSearchClick}
                            className="w-full bg-black text-white rounded-xl py-4 font-semibold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg group"
                        >
                            <span>See prices</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}