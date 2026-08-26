import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useRideDetails } from '../../hooks/rider';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
const PRIMARY = 'hsl(169, 59%, 31%)';
const ACCENT = 'hsl(14, 83%, 62%)';
const FG = 'hsl(193, 43%, 15%)';
const MUTED = 'hsl(193, 15%, 45%)';
const CARD_BG = 'hsl(44, 44%, 99%)';
const BORDER = 'hsl(38, 24%, 86%)';

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
            theme: { color: "hsl(169, 59%, 31%)" },
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
                    style={{ background: 'hsl(169,59%,31%,0.1)', border: `1.5px solid hsl(169,59%,31%,0.3)` }}
                    animate={{ boxShadow: ['0 0 0px hsl(169,59%,31%,0)', '0 0 24px hsl(169,59%,31%,0.35)', '0 0 0px hsl(169,59%,31%,0)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                />
                <CheckCircle className="w-10 h-10 relative z-10" style={{ color: PRIMARY }} />
            </motion.div>

            {/* Title + Amount */}
            <div className="text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    className="text-2xl font-black tracking-tight mb-1"
                    style={{ color: FG, fontFamily: "'Manrope', sans-serif" }}
                >
                    Ride Completed!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="text-sm"
                    style={{ color: MUTED }}
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
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'hsl(169,59%,31%,0.1)', border: `1px solid color-mix(in srgb, var(--clr-primary) 20%, transparent)` }}
                    >
                        <CreditCard className="w-4 h-4" style={{ color: PRIMARY }} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Payment</p>
                        <p className="text-sm font-bold" style={{ color: FG }}>Razorpay</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Total</p>
                    <p className="text-2xl font-black tracking-tight" style={{ color: FG }}>₹{ride?.amount || '—'}</p>
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
                className="w-full flex items-center justify-center gap-2 font-bold text-sm py-4 rounded-2xl"
                style={{
                    background: `linear-gradient(135deg, ${PRIMARY}, hsl(169,59%,20%))`,
                    boxShadow: '0 6px 28px hsl(169,59%,31%,0.35)',
                    color: 'var(--clr-card)',
                }}
            >
                <Zap className="w-4 h-4" />
                Pay with Razorpay
            </motion.button>
        </motion.div>
    );
}
