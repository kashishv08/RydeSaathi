import { CreditCard } from 'lucide-react';
import { useRideDetails } from '../../hooks/rider';
import { toast } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY

export default function PaymentRider() {
    const navigate = useNavigate()
    const { data: rideDetail } = useRideDetails();
    const ride = rideDetail?.data;
    console.log(ride);

    const handlePayment = () => {
        if (!ride?.payment?.razorpay_order_id) {
            alert("No Razorpay order ID found for this ride.");
            return;
        }

        var options = {
            "key": RAZORPAY_KEY,
            "currency": "INR",
            "name": "Uber Clone",
            "description": "Ride Payment",
            "order_id": ride.payment.razorpay_order_id,
            "handler": function (response) {
                console.log("Payment Success locally!", response);
                toast.success("Payment Success :)")
                navigate("/ride/search");
            },
            "prefill": {
                "name": ride.rider_email?.split('@')[0] || "Rider",
                "email": ride.rider_email || "testrider@test.com",
            },
            "theme": {
                "color": "#000000"
            }
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            console.error("Payment Failed", response.error);
            alert("Payment failed: " + response.error.description);
        });
        rzp1.open();
    };

    return (
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white flex flex-col h-full items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Ride Completed!</h2>
            <p className="text-gray-600 text-base mb-8">Please complete your payment of <span className="font-bold text-black">₹{ride?.amount}</span> to finish.</p>

            <button
                onClick={handlePayment}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                Pay with Razorpay
            </button>
        </div>
    );
}
