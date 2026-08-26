import { toast } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationInput from "../ui/LocationInput";

const PRIMARY = "hsl(169, 59%, 31%)";
const ACCENT = "hsl(14, 83%, 62%)";

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
        <section className="relative pt-12 pb-36 px-6 overflow-hidden min-h-[85vh] flex items-center"
            style={{ background: "hsl(43, 38%, 96%)" }}
        >
            {/* Ambient glow field */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -top-32 -left-40 w-[32rem] h-[32rem] rounded-full blur-[120px]"
                    style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--clr-primary) 12%, transparent), transparent 70%)" }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-[120px]"
                    style={{ background: "radial-gradient(circle, hsl(14,83%,62%,0.1), transparent 70%)" }}
                />
                <div className="absolute inset-0 opacity-[0.18]">
                    <img
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                        alt="City traffic"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to r, var(--clr-bg) 30%, hsl(43,38%,96%,0.7) 60%, hsl(43,38%,96%,0.3))" }} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-20 grid md:grid-cols-2 gap-12 items-center w-full">
                <div className="relative pl-8 md:pl-10">
                    {/* Animated route line */}
                    <div className="hidden md:flex flex-col items-center absolute left-0 top-2 bottom-2 w-3">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: PRIMARY, boxShadow: `0 0 10px 3px hsl(169,59%,31%,0.45)` }}
                        />
                        <div className="relative flex-1 w-px my-1.5 overflow-hidden"
                            style={{ background: `linear-gradient(to bottom, ${PRIMARY}80, hsl(14,83%,62%,0.5) )` }}
                        >
                            <motion.span
                                className="absolute left-1/2 -translate-x-1/2 w-1 h-6 rounded-full"
                                style={{ background: "hsl(193,43%,15%,0.6)" }}
                                animate={{ top: ["0%", "88%"] }}
                                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <span
                            className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                            style={{ background: ACCENT, boxShadow: `0 0 10px 3px hsl(14,83%,62%,0.4)` }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider backdrop-blur-md mb-6 border"
                            style={{
                                background: "var(--clr-primary-subtle)",
                                borderColor: "color-mix(in srgb, var(--clr-primary) 20%, transparent)",
                                color: PRIMARY,
                            }}
                        >
                            <Sparkles className="w-3.5 h-3.5" /> REDEFINING COMMUTE
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
                            style={{ color: "hsl(193, 43%, 15%)", fontFamily: "'Manrope', sans-serif" }}
                        >
                            Go anywhere <br className="hidden md:block" />
                            with{" "}
                            <span
                                className="text-transparent bg-clip-text"
                                style={{ backgroundImage: `linear-gradient(to right, ${PRIMARY}, hsl(169,59%,45%), ${ACCENT})` }}
                            >
                                RydeSaathi
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 max-w-md font-light leading-relaxed"
                            style={{ color: "hsl(193, 15%, 45%)" }}
                        >
                            Request a ride, hop in, and experience seamless travel across the city with real-time tracking.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="rounded-2xl p-8 max-w-md w-full border"
                    style={{
                        background: "hsl(44, 44%, 99%)",
                        borderColor: "hsl(38, 24%, 86%)",
                        boxShadow: "0 8px 40px rgba(27,54,58,0.1)",
                    }}
                >
                    <div className="space-y-5">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
                            style={{ color: "hsl(193, 43%, 15%)", fontFamily: "'Manrope', sans-serif" }}
                        >
                            <Compass className="w-5 h-5" style={{ color: PRIMARY }} /> Book Your Ride
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
                            className="w-full rounded-xl py-4 font-semibold transition-all flex items-center justify-center gap-2 group"
                            style={{
                                background: `linear-gradient(90deg, ${PRIMARY}, hsl(169,59%,22%))`,
                                boxShadow: "0 4px 28px hsl(169,59%,31%,0.35)",
                                color: "hsl(44, 44%, 99%)",
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
