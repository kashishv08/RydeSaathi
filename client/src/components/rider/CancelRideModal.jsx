"use client";

import { Button, Modal } from "@heroui/react";
import { Check } from "lucide-react";
import { useState } from "react";

export function CancelRideModal({ children, onConfirm }) {
    const [reason, setReason] = useState("other");

    const reasons = [
        "Driver is taking too long",
        "Driver asked me to cancel",
        "Driver is going the wrong way",
        "Changed my mind",
        "Other"
    ];

    const handleConfirm = (closeModal) => {
        onConfirm(reason);
        closeModal();
    };

    return (
        <Modal>
            {/* The trigger button (children) must be the first child for HeroUI Modal */}
            {children}
            <Modal.Backdrop>
                <Modal.Container placement="bottom">
                    <Modal.Dialog className="sm:max-w-md w-full mb-0 rounded-t-2xl sm:mb-auto sm:rounded-xl">
                        <Modal.CloseTrigger />
                        <Modal.Header className="text-center pt-6 pb-2">
                            <Modal.Heading className="text-2xl font-bold text-black">Cancel Ride</Modal.Heading>
                            <p className="mt-2 text-sm text-gray-500">
                                Please let us know why you are cancelling this ride.
                            </p>
                        </Modal.Header>
                        <Modal.Body className="p-0">
                            <div className="flex flex-col w-full max-h-[60vh] overflow-y-auto">
                                {reasons.map((r, index) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setReason(r)}
                                        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${index !== reasons.length - 1 ? 'border-b border-gray-100' : ''
                                            } hover:bg-gray-50`}
                                    >
                                        <span className={`text-lg ${reason === r ? 'text-black font-medium' : 'text-gray-700'}`}>
                                            {r}
                                        </span>
                                        {reason === r && (
                                            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                                                <Check size={14} className="text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="flex-col gap-3 px-6 pt-6 pb-8">
                            <Button
                                type="button"
                                slot="close"
                                className="w-full bg-black text-white py-6 text-xl rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                                onPress={() => handleConfirm(() => { })}
                            >
                                Confirm Cancellation
                            </Button>
                            <Button
                                type="button"
                                slot="close"
                                variant="secondary"
                                className="w-full py-6 text-xl rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-black border-none transition-colors"
                            >
                                Keep Ride
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}