import { motion } from "framer-motion";
import { ArrowRight, Car, Clock, Wallet } from "lucide-react";

export default function DriveWithUs() {
    return (
        <section className="py-24 px-6 bg-[#0A0A0F] text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-10 rounded-3xl relative overflow-hidden min-h-[380px] flex flex-col justify-between border border-white/10"
                    style={{
                        background: "linear-gradient(160deg, rgba(139,92,246,0.12), rgba(255,255,255,0.03))",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                    }}
                >
                    <div
                        className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-2xl pointer-events-none"
                        style={{ background: "rgba(139,92,246,0.25)" }}
                    />
                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#a78bfa]">Driver Partner</span>
                        <h3 className="text-3xl md:text-4xl font-black mt-2 leading-tight">
                            Your road. <br /> Your upside.
                        </h3>
                    </div>

                    <div className="space-y-4 my-8 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Clock className="w-5 h-5 text-[#8B5CF6]" />
                            <span>Choose when to go online</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Car className="w-5 h-5 text-[#8B5CF6]" />
                            <span>See the fare before you accept</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Wallet className="w-5 h-5 text-[#10B981]" />
                            <span>Get paid weekly, hassle-free</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 relative z-10 text-white"
                        style={{
                            background: "linear-gradient(90deg, #8B5CF6, #7C3AED)",
                            boxShadow: "0 4px 24px rgba(139,92,246,0.4)",
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
                    <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500">Everyday Convenience</span>
                    <h2 className="text-4xl font-black tracking-tight text-white">
                        For every kind of day. <br />
                        <span className="text-gray-500 font-normal text-2xl">From chai runs to airport runs.</span>
                    </h2>

                    <div className="space-y-4 pt-4">
                        {[
                            { title: "Every ride, safer", desc: "Trip sharing, verified drivers, and 24/7 help integrated into every ride." },
                            { title: "Built for your day", desc: "Reliable pickups from your first chai to the last night train." },
                            { title: "Saath, not solo", desc: "A community-driven mobility network looking out for every rider." },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                                style={{ background: "rgba(255,255,255,0.03)" }}
                            >
                                <h4 className="font-bold text-lg mb-1 text-white">{item.title}</h4>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
