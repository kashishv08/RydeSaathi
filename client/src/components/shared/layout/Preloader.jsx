import { AnimatePresence, motion } from "framer-motion";
import { Car } from "lucide-react";
import { useEffect, useState } from "react";

export default function Preloader({ onComplete }) {
    const [textIndex, setTextIndex] = useState(0);
    const messages = ["Connecting paths...", "Ensuring your safety...", "Welcome to RydeSaathi"];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => {
                if (prev === messages.length - 1) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800);
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-4"
        >
            <div className="relative flex items-center justify-center mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-t-2 border-b-2 border-white/80"
                />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                    className="absolute text-white"
                >
                    <Car className="w-10 h-10" />
                </motion.div>
            </div>

            <div className="h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={textIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-lg font-medium text-gray-300 tracking-wide text-center"
                    >
                        {messages[textIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}