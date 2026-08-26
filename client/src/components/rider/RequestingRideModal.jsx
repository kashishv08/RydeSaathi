import { motion, AnimatePresence } from 'framer-motion';

const Ring = ({ delay, scale }) => (
    <motion.div
        className="absolute rounded-full"
        style={{ border: '1.5px solid rgba(139,92,246,0.4)', inset: 0 }}
        initial={{ scale: 0.7, opacity: 0.9 }}
        animate={{ scale, opacity: 0 }}
        transition={{ duration: 2.2, delay, repeat: Infinity, ease: 'easeOut' }}
    />
);

export default function RequestingRideModal({ isOpen }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
                >
                    <motion.div
                        initial={{ scale: 0.88, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        {/* Sonar pulse icon */}
                        <div className="relative flex items-center justify-center w-28 h-28">
                            <Ring delay={0} scale={2.6} />
                            <Ring delay={0.7} scale={2.6} />
                            <Ring delay={1.4} scale={2.6} />

                            <motion.div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                                style={{
                                    background: 'rgba(139,92,246,0.15)',
                                    border: '1.5px solid rgba(139,92,246,0.4)',
                                }}
                                animate={{
                                    boxShadow: [
                                        '0 0 0px rgba(139,92,246,0)',
                                        '0 0 28px rgba(139,92,246,0.5)',
                                        '0 0 0px rgba(139,92,246,0)',
                                    ]
                                }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {/* Violet spinner */}
                                <div
                                    className="w-7 h-7 rounded-full animate-spin"
                                    style={{
                                        border: '3px solid rgba(139,92,246,0.2)',
                                        borderTopColor: '#8b5cf6',
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            <motion.h3
                                className="text-2xl font-black text-white tracking-tight mb-1"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                Requesting your ride
                            </motion.h3>
                            <p className="text-sm font-medium" style={{ color: 'rgba(167,139,250,0.8)' }}>
                                Connecting you to a driver nearby…
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
