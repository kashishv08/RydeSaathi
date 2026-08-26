"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";
import { cloneElement, useState, useEffect } from "react";
import { createPortal } from "react-dom";

const PRIMARY = 'var(--clr-primary)';
const FG = 'var(--clr-foreground)';
const MUTED = 'var(--clr-muted)';
const CARD_BG = 'var(--clr-card)';
const BORDER = 'var(--clr-border)';

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

            {typeof document !== "undefined" && createPortal(
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
                                className="fixed inset-0 z-[1000]"
                                style={{ background: "rgba(27,54,58,0.4)", backdropFilter: "blur(6px)" }}
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Centered Modal */}
                            <motion.div
                                key="modal"
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="fixed inset-0 z-[1001] flex items-center justify-center p-4 sm:p-6"
                            >
                                <div
                                    className="w-full max-w-lg rounded-3xl pb-6 pt-5 px-6 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
                                    style={{
                                        background: CARD_BG,
                                        border: `1px solid ${BORDER}`,
                                        boxShadow: "0 24px 80px rgba(27,54,58,0.12)",
                                    }}
                                >

                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                                style={{ background: "hsl(1,72%,52%,0.1)", border: "1px solid hsl(1,72%,52%,0.25)" }}
                                            >
                                                <AlertTriangle className="w-4.5 h-4.5" style={{ color: "var(--clr-destructive)" }} />
                                            </div>
                                            <h2 className="text-lg font-black tracking-tight" style={{ color: FG }}>Cancel Ride</h2>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsOpen(false)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ background: "var(--clr-border)" }}
                                        >
                                            <X className="w-4 h-4" style={{ color: MUTED }} />
                                        </motion.button>
                                    </div>

                                    <p className="text-sm mb-5" style={{ color: MUTED }}>
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
                                                            ? "var(--clr-primary-subtle)"
                                                            : "var(--clr-bg)",
                                                        border: selected
                                                            ? "1px solid color-mix(in srgb, var(--clr-primary) 35%, transparent)"
                                                            : `1px solid ${BORDER}`,
                                                    }}
                                                    whileTap={{ scale: 0.99 }}
                                                >
                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{ color: selected ? PRIMARY : MUTED }}
                                                    >
                                                        {r}
                                                    </span>
                                                    {selected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-5 h-5 rounded-full flex items-center justify-center"
                                                            style={{ background: PRIMARY }}
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
                                            className="w-full py-3.5 rounded-2xl font-bold text-sm"
                                            style={{
                                                background: "color-mix(in srgb, var(--clr-destructive) 4%, var(--clr-card))",
                                                boxShadow: "0 4px 20px color-mix(in srgb, var(--clr-destructive) 15%, transparent)",
                                                border: "1px solid var(--clr-destructive)",
                                                color: "var(--clr-destructive)",
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
                                                background: "var(--secondary)",
                                                color: "var(--clr-foreground)",
                                            }}
                                        >
                                            Keep Ride
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}