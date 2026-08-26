import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Navigation } from "lucide-react";

const steps = [
    {
        num: "01",
        title: "Tell us where",
        desc: "Drop a pin or type a landmark you know.",
        icon: MapPin,
        accent: "#8B5CF6",
    },
    {
        num: "02",
        title: "Choose your way",
        desc: "A quick bike, an auto with room, or a car.",
        icon: Navigation,
        accent: "#a78bfa",
    },
    {
        num: "03",
        title: "Go with ease",
        desc: "Track your Saathi and settle in.",
        icon: CheckCircle2,
        accent: "#10B981",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 px-6 bg-[#0A0A0F] relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-extrabold uppercase tracking-widest text-gray-500"
                    >
                        A Better Way Across Town
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-white"
                    >
                        Less waiting. <br />
                        <span className="text-gray-500">More living.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 mt-4 leading-relaxed"
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
                                className="p-8 rounded-3xl border border-white/10 relative group overflow-hidden transition-colors hover:border-white/20"
                                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
                            >
                                <div className="absolute top-4 right-6 text-6xl font-black text-white/[0.04] group-hover:text-white/[0.07] transition-colors">
                                    {step.num}
                                </div>
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                                    style={{
                                        background: `${step.accent}1a`,
                                        border: `1px solid ${step.accent}40`,
                                        boxShadow: `0 0 24px ${step.accent}22`,
                                    }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: step.accent }} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
