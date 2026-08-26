import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Navigation } from "lucide-react";

const PRIMARY = "hsl(169, 59%, 31%)";
const PRIMARY_MID = "hsl(169, 59%, 42%)";
const ACCENT = "hsl(14, 83%, 62%)";
const BG = "hsl(43, 38%, 96%)";
const CARD_BG = "hsl(44, 44%, 99%)";
const FG = "hsl(193, 43%, 15%)";
const MUTED = "hsl(193, 15%, 45%)";
const BORDER = "hsl(38, 24%, 86%)";

const steps = [
    {
        num: "01",
        title: "Tell us where",
        desc: "Drop a pin or type a landmark you know.",
        icon: MapPin,
        accent: PRIMARY,
    },
    {
        num: "02",
        title: "Choose your way",
        desc: "A quick bike, an auto with room, or a car.",
        icon: Navigation,
        accent: PRIMARY_MID,
    },
    {
        num: "03",
        title: "Go with ease",
        desc: "Track your Saathi and settle in.",
        icon: CheckCircle2,
        accent: ACCENT,
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 px-6 relative" style={{ background: BG }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-extrabold uppercase tracking-widest"
                        style={{ color: MUTED }}
                    >
                        A Better Way Across Town
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mt-3 tracking-tight"
                        style={{ color: FG, fontFamily: "'Manrope', sans-serif" }}
                    >
                        Less waiting. <br />
                        <span style={{ color: MUTED, fontWeight: 400 }}>More living.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 leading-relaxed"
                        style={{ color: MUTED }}
                    >
                        From your first tap to the final hello, every part of your ride is made to feel predictable.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.4, delay: idx * 0.15 }}
                                className="p-8 rounded-3xl border relative group overflow-hidden transition-all hover:shadow-lg"
                                style={{ background: CARD_BG, borderColor: BORDER }}
                            >
                                <div className="absolute top-4 right-6 text-6xl font-black transition-colors"
                                    style={{ color: "hsl(38,24%,90%)" }}
                                >
                                    {step.num}
                                </div>
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                                    style={{
                                        background: `${step.accent}18`,
                                        border: `1px solid ${step.accent}40`,
                                        boxShadow: `0 0 24px ${step.accent}20`,
                                    }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: step.accent }} />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: FG }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{step.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
