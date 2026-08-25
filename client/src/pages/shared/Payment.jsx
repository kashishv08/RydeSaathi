import { toast } from "@heroui/react";

function Payment() {

    async function completeRideAndPay(e) {
        e.preventDefault();

        var options = {
            "key": "rzp_test_TQVGHVwNlS2cP1",
            "currency": "INR",
            "name": "Uber Clone",
            "description": "Ride Payment",
            "order_id": "order_TQmBhJpjGIsGNh",
            "handler": async function (response) {
                console.log("Payment Success!", response);
                toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id);
            },
            "prefill": {
                "name": "testrider@test.com",
                "email": "testrider@test.com",
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            console.error("Payment Failed", response.error);
            toast.warning("Payment failed: " + response.error.description);
        });
        rzp1.open();
    }

    return (
        <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
            <button onClick={completeRideAndPay} style={{ padding: "10px 15px", cursor: "pointer" }} className="border-bg-uber-black">
                Complete Ride & Pay
            </button>
        </div>
    )
}

export default Payment