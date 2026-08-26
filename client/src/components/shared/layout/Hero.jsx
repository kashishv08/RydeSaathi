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
        <section className="relative bg-[#0A0A0F] text-white pt-12 pb-36 px-6 overflow-hidden min-h-[85vh] flex items-center">
            {/* Ambient glow field */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -top-32 -left-40 w-[32rem] h-[32rem] rounded-full blur-[120px]"
                    style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)" }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-[120px]"
                    style={{ background: "radial-gradient(circle, rgba(16,185,129,0.16), transparent 70%)" }}
                />
                <div className="absolute inset-0 opacity-[0.35]">
                    <img
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                        alt="City traffic"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/85 to-[#0A0A0F]/40" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-20 grid md:grid-cols-2 gap-12 items-center w-full">
                <div className="relative pl-8 md:pl-10">
                    {/* Signature: animated route line, pickup -> drop-off */}
                    <div className="hidden md:flex flex-col items-center absolute left-0 top-2 bottom-2 w-3">
                        <span
                            className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0"
                            style={{ boxShadow: "0 0 10px 3px rgba(139,92,246,0.55)" }}
                        />
                        <div className="relative flex-1 w-px my-1.5 overflow-hidden bg-gradient-to-b from-[#8B5CF6]/60 via-white/15 to-[#10B981]/60">
                            <motion.span
                                className="absolute left-1/2 -translate-x-1/2 w-1 h-6 rounded-full bg-white/90 blur-[0.5px]"
                                animate={{ top: ["0%", "88%"] }}
                                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <span
                            className="w-2.5 h-2.5 rounded-[3px] bg-[#10B981] shrink-0"
                            style={{ boxShadow: "0 0 10px 3px rgba(16,185,129,0.5)" }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-semibold tracking-wider text-gray-300 backdrop-blur-md mb-6 border border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> REDEFINING COMMUTE
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                            Go anywhere <br className="hidden md:block" />
                            with{" "}
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#a78bfa] to-[#10B981]"
                            >
                                RydeSaathi
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-md font-light leading-relaxed">
                            Request a ride, hop in, and experience seamless travel across the city with real-time tracking.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="rounded-2xl p-8 max-w-md w-full border border-white/10"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
                    }}
                >
                    <div className="space-y-5">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                            <Compass className="w-5 h-5 text-[#8B5CF6]" /> Book Your Ride
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
                            className="w-full text-white rounded-xl py-4 font-semibold transition-all flex items-center justify-center gap-2 group"
                            style={{
                                background: "linear-gradient(90deg, #8B5CF6, #7C3AED)",
                                boxShadow: "0 4px 28px rgba(139,92,246,0.4)",
                            }}
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
