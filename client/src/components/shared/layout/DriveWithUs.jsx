import { motion } from "framer-motion";
import { ArrowRight, Car, Clock, Wallet } from "lucide-react";

const PRIMARY = "hsl(169, 59%, 31%)";
const ACCENT = "hsl(14, 83%, 62%)";
const BG = "hsl(43, 38%, 96%)";
const CARD_BG = "hsl(44, 44%, 99%)";
const FG = "hsl(193, 43%, 15%)";
const MUTED = "hsl(193, 15%, 45%)";
const BORDER = "hsl(38, 24%, 86%)";

export default function DriveWithUs() {
    return (
        <section className="py-24 px-6 border-t" style={{ background: BG, borderColor: BORDER }}>
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-10 rounded-3xl relative overflow-hidden min-h-[380px] flex flex-col justify-between border"
                    style={{
                        background: `linear-gradient(160deg, var(--clr-primary-subtle), ${CARD_BG})`,
                        borderColor: "color-mix(in srgb, var(--clr-primary) 20%, transparent)",
                        boxShadow: "0 8px 40px rgba(27,54,58,0.08)",
                    }}
                >
                    <div
                        className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-2xl pointer-events-none"
                        style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)" }}
                    />
                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>Driver Partner</span>
                        <h3 className="text-3xl md:text-4xl font-black mt-2 leading-tight" style={{ color: FG, fontFamily: "'Manrope', sans-serif" }}>
                            Your road. <br /> Your upside.
                        </h3>
                    </div>

                    <div className="space-y-4 my-8 relative z-10">
                        <div className="flex items-center gap-3 text-sm" style={{ color: MUTED }}>
                            <Clock className="w-5 h-5" style={{ color: PRIMARY }} />
                            <span>Choose when to go online</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm" style={{ color: MUTED }}>
                            <Car className="w-5 h-5" style={{ color: PRIMARY }} />
                            <span>See the fare before you accept</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm" style={{ color: MUTED }}>
                            <Wallet className="w-5 h-5" style={{ color: ACCENT }} />
                            <span>Get paid weekly, hassle-free</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 relative z-10"
                        style={{
                            background: `linear-gradient(90deg, ${PRIMARY}, hsl(169,59%,22%))`,
                            boxShadow: "0 4px 24px hsl(169,59%,31%,0.3)",
                            color: "var(--clr-card)",
                        }}
                    >
                        <span>Explore driver mode</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: MUTED }}>Everyday Convenience</span>
                    <h2 className="text-4xl font-black tracking-tight" style={{ color: FG, fontFamily: "'Manrope', sans-serif" }}>
                        For every kind of day. <br />
                        <span style={{ color: MUTED, fontWeight: 400, fontSize: "1.5rem" }}>From chai runs to airport runs.</span>
                    </h2>

                    <div className="space-y-4 pt-4">
                        {[
                            { title: "Every ride, safer", desc: "Trip sharing, verified drivers, and 24/7 help integrated into every ride." },
                            { title: "Built for your day", desc: "Reliable pickups from your first chai to the last night train." },
                            { title: "Saath, not solo", desc: "A community-driven mobility network looking out for every rider." },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-6 rounded-2xl border hover:shadow-md transition-all"
                                style={{ background: CARD_BG, borderColor: BORDER }}
                            >
                                <h4 className="font-bold text-lg mb-1" style={{ color: FG }}>{item.title}</h4>
                                <p className="text-sm" style={{ color: MUTED }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
