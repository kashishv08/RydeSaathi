import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

const stats = [
    { label: "Saathi support", value: "24/7" },
    { label: "Verified partners", value: "1.8L+" },
    { label: "Avg pickup time", value: "8 min" },
    { label: "Rider rating", value: "4.8/5" },
];

export default function SaferTogether() {
    return (
        <section className="py-24 px-6 bg-black text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wider text-gray-300 border border-white/10 mb-6">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> SAFER TOGETHER
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                        A ride is better when you can breathe easy.
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Your route is shared, your driver is verified, and help is never more than a tap away. Because the city belongs to all of us.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-8 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-200 transition-colors shadow-lg group"
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
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all"
                        >
                            <div className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}