import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

const PRIMARY = "hsl(169, 59%, 31%)";
const ACCENT = "hsl(14, 83%, 62%)";
const BG = "hsl(43, 38%, 96%)";
const CARD_BG = "hsl(44, 44%, 99%)";
const FG = "hsl(193, 43%, 15%)";
const MUTED = "hsl(193, 15%, 45%)";
const BORDER = "hsl(38, 24%, 86%)";

const stats = [
    { label: "Saathi support", value: "24/7", accent: PRIMARY },
    { label: "Verified partners", value: "1.8L+", accent: ACCENT },
    { label: "Avg pickup time", value: "8 min", accent: PRIMARY },
    { label: "Rider rating", value: "4.8/5", accent: ACCENT },
];

export default function SaferTogether() {
    return (
        <section className="py-24 px-6 relative overflow-hidden border-t" style={{ background: BG, borderColor: BORDER }}>
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[140px] pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(169,59%,31%,0.06), transparent 70%)" }}
            />
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider border mb-6"
                        style={{
                            background: "var(--clr-primary-subtle)",
                            borderColor: "color-mix(in srgb, var(--clr-primary) 20%, transparent)",
                            color: PRIMARY,
                        }}
                    >
                        <ShieldCheck className="w-4 h-4" /> SAFER TOGETHER
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6"
                        style={{ color: FG, fontFamily: "'Manrope', sans-serif" }}
                    >
                        A ride is better when you can breathe easy.
                    </h2>
                    <p className="text-lg mb-8 leading-relaxed" style={{ color: MUTED }}>
                        Your route is shared, your driver is verified, and help is never more than a tap away. Because the city belongs to all of us.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors group"
                        style={{
                            background: `linear-gradient(90deg, ${PRIMARY}, hsl(169,59%,22%))`,
                            boxShadow: "0 4px 28px hsl(169,59%,31%,0.3)",
                            color: "var(--clr-card)",
                        }}
                    >
                        <span>Try a Safer Ride</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-2xl border hover:shadow-md transition-all"
                            style={{ background: CARD_BG, borderColor: BORDER }}
                        >
                            <div
                                className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight"
                                style={{ color: stat.accent }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: MUTED }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
