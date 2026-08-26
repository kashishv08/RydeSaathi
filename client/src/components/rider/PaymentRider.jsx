import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useRideDetails } from '../../hooks/rider';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export default function PaymentRider() {
    const navigate = useNavigate();
    const { data: rideDetail } = useRideDetails();
    const ride = rideDetail?.data;

    const handlePayment = () => {
        if (!ride?.payment?.razorpay_order_id) {
            toast.warning("No Razorpay order ID found for this ride.");
            return;
        }

        const options = {
            key: RAZORPAY_KEY,
            currency: "INR",
            name: "Uber Clone",
            description: "Ride Payment",
            order_id: ride.payment.razorpay_order_id,
            handler: function (response) {
                console.log("Payment Success locally!", response);
                toast.success("Payment processing... Please wait.");
            },
            prefill: {
                name: ride.rider_email?.split('@')[0] || "Rider",
                email: ride.rider_email || "testrider@test.com",
            },
            theme: { color: "#7c3aed" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', (response) => {
            console.error("Payment Failed", response.error);
            toast.warning("Payment failed: " + response.error.description);
        });
        rzp1.open();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center gap-6 py-4"
        >
            {/* Success icon */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="relative flex items-center justify-center w-20 h-20"
            >
                {/* Glow ring */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1.5px solid rgba(16,185,129,0.3)' }}
                    animate={{ boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 24px rgba(16,185,129,0.4)', '0 0 0px rgba(16,185,129,0)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                />
                <CheckCircle className="w-10 h-10 text-emerald-400 relative z-10" />
            </motion.div>

            {/* Title + Amount */}
            <div className="text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    className="text-2xl font-black text-white tracking-tight mb-1"
                >
                    Ride Completed!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="text-sm text-gray-400"
                >
                    Complete your payment to finish the trip
                </motion.p>
            </div>

            {/* Amount card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.28 }}
                className="w-full rounded-2xl px-5 py-4 flex items-center justify-between"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Payment</p>
                        <p className="text-sm font-bold text-gray-300">Razorpay</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Total</p>
                    <p className="text-2xl font-black text-white tracking-tight">₹{ride?.amount || '—'}</p>
                </div>
            </motion.div>

            {/* Pay button */}
            <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePayment}
                className="w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-4 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                    boxShadow: '0 6px 28px rgba(124,58,237,0.4)',
                }}
            >
                <Zap className="w-4 h-4" />
                Pay with Razorpay
            </motion.button>
        </motion.div>
    );
}
