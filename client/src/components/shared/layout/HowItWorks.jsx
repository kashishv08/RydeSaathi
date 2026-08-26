import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, CheckCircle2 } from "lucide-react";

const steps = [
    {
        num: "01",
        title: "Tell us where",
        desc: "Drop a pin or type a landmark you know.",
        icon: MapPin,
    },
    {
        num: "02",
        title: "Choose your way",
        desc: "A quick bike, an auto with room, or a car.",
        icon: Navigation,
    },
    {
        num: "03",
        title: "Go with ease",
        desc: "Track your Saathi and settle in.",
        icon: CheckCircle2,
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 px-6 bg-white relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-extrabold uppercase tracking-widest text-gray-400"
                    >
                        A Better Way Across Town
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-gray-900"
                    >
                        Less waiting. <br />
                        <span className="text-gray-400">More living.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 mt-4 leading-relaxed"
                    >
                        From your first tap to the final hello, every part of your ride is made to feel predictable.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.4, delay: idx * 0.15 }}
                                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all relative group overflow-hidden"
                            >
                                <div className="absolute top-4 right-6 text-6xl font-black text-gray-200/50 group-hover:text-black/10 transition-colors">
                                    {step.num}
                                </div>
                                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}