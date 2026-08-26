import React from "react";
import { motion } from "framer-motion";
import { Car, Wallet, Clock, ArrowRight } from "lucide-react";

export default function DriveWithUs() {
    return (
        <section className="py-24 px-6 bg-gray-50 text-gray-900 border-t border-gray-100">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-black text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden min-h-[380px] flex flex-col justify-between"
                >
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Driver Partner</span>
                        <h3 className="text-3xl md:text-4xl font-black mt-2 leading-tight">
                            Your road. <br /> Your upside.
                        </h3>
                    </div>

                    <div className="space-y-4 my-8 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span>Choose when to go online</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Car className="w-5 h-5 text-gray-400" />
                            <span>See the fare before you accept</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Wallet className="w-5 h-5 text-gray-400" />
                            <span>Get paid weekly, hassle-free</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors relative z-10"
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
                    <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Everyday Convenience</span>
                    <h2 className="text-4xl font-black tracking-tight text-gray-900">
                        For every kind of day. <br />
                        <span className="text-gray-500 font-normal text-2xl">From chai runs to airport runs.</span>
                    </h2>

                    <div className="space-y-4 pt-4">
                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-lg mb-1">Every ride, safer</h4>
                            <p className="text-gray-600 text-sm">Trip sharing, verified drivers, and 24/7 help integrated into every ride.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-lg mb-1">Built for your day</h4>
                            <p className="text-gray-600 text-sm">Reliable pickups from your first chai to the last night train.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-lg mb-1">Saath, not solo</h4>
                            <p className="text-gray-600 text-sm">A community-driven mobility network looking out for every rider.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}