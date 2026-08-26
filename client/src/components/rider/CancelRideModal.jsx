"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";
import { cloneElement, useState } from "react";

export function CancelRideModal({ children, onConfirm }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("Driver is taking too long");

    const reasons = [
        "Driver is taking too long",
        "Driver asked me to cancel",
        "Driver is going the wrong way",
        "Changed my mind",
        "Other",
    ];

    const handleConfirm = () => {
        onConfirm(reason);
        setIsOpen(false);
    };

    // Clone the trigger child to inject the onClick opener
    const trigger = cloneElement(children, {
        onClick: (e) => {
            e.stopPropagation();
            setIsOpen(true);
        },
    });

    return (
        <>
            {trigger}

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="fixed inset-0 z-[100]"
                            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            key="sheet"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed bottom-0 left-0 right-0 z-[101] flex justify-center"
                        >
                            <div
                                className="w-full max-w-lg rounded-t-3xl pb-10 pt-5 px-6 flex flex-col"
                                style={{
                                    background: "linear-gradient(180deg,#1a1a2e 0%,#13131f 100%)",
                                    border: "1px solid rgba(139,92,246,0.18)",
                                    borderBottom: "none",
                                }}
                            >
                                {/* Drag handle */}
                                <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />

                                {/* Header */}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                                            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
                                        >
                                            <AlertTriangle className="w-4.5 h-4.5 text-red-400" />
                                        </div>
                                        <h2 className="text-lg font-black text-white tracking-tight">Cancel Ride</h2>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ background: "rgba(255,255,255,0.07)" }}
                                    >
                                        <X className="w-4 h-4 text-gray-400" />
                                    </motion.button>
                                </div>

                                <p className="text-sm text-gray-500 mb-5">
                                    Let us know why you're cancelling this ride.
                                </p>

                                {/* Reason list */}
                                <div className="flex flex-col gap-2 mb-6">
                                    {reasons.map((r) => {
                                        const selected = reason === r;
                                        return (
                                            <motion.button
                                                key={r}
                                                type="button"
                                                onClick={() => setReason(r)}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
                                                style={{
                                                    background: selected
                                                        ? "rgba(139,92,246,0.1)"
                                                        : "rgba(255,255,255,0.03)",
                                                    border: selected
                                                        ? "1px solid rgba(139,92,246,0.4)"
                                                        : "1px solid rgba(255,255,255,0.07)",
                                                }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <span
                                                    className="text-sm font-semibold"
                                                    style={{ color: selected ? "#c4b5fd" : "rgba(255,255,255,0.6)" }}
                                                >
                                                    {r}
                                                </span>
                                                {selected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-5 h-5 rounded-full flex items-center justify-center"
                                                        style={{ background: "rgba(139,92,246,0.8)" }}
                                                    >
                                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="button"
                                        onClick={handleConfirm}
                                        className="w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                                        style={{
                                            background: "linear-gradient(135deg,#dc2626,#991b1b)",
                                            boxShadow: "0 4px 20px rgba(220,38,38,0.3)",
                                        }}
                                    >
                                        Confirm Cancellation
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full py-3.5 rounded-2xl font-bold text-sm"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            color: "rgba(255,255,255,0.6)",
                                        }}
                                    >
                                        Keep Ride
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}