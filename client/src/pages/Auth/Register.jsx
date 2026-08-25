import { useState } from 'react';
import { useSendOtp, useVerifyOtp } from '../../hooks/auth';
import { InputOTP } from "@heroui/react";
import { toast } from "sonner";
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft, User, Car } from 'lucide-react';

function Register() {
    const navigate = useNavigate();
    // step 0: Role Selection, step 1: Email, step 2: OTP
    const [step, setStep] = useState(0);
    const [otp, setOtp] = useState("");
    const [form, setForm] = useState({
        email: "",
        role: "RIDER",
        purpose: "Register"
    })
    const { mutate, error, isError, isPending: isSending } = useSendOtp()
    const { mutate: verifyOtpMutate, error: verifyerror, isError: isVerifyError, isPending: isVerifying } = useVerifyOtp()

    function handleSendOtp(e) {
        e.preventDefault()
        mutate(form, {
            onSuccess: () => {
                setStep(2);
            },
            onError: (err) => {
                toast.error(err?.response?.data?.error || err?.response?.data?.email?.[0] || err?.message || "An error occurred");
            }
        })
    }

    function handleVerifyOtp(e) {
        e.preventDefault()
        verifyOtpMutate({ email: form.email, otp }, {
            onSuccess: (res) => {
                const role = res.data.role;
                if (role === "DRIVER") {
                    navigate("/driver");
                } else {
                    navigate("/ride/search");
                }
            },
            onError: (err) => {
                toast.error(err?.response?.data?.error || err?.response?.data?.otp?.[0] || err?.message || "Invalid OTP. Please try again.");
            }
        })
    }

    const selectRole = (role) => {
        setForm((prev) => ({ ...prev, role }));
        setStep(1);
    }

    const getSideImage = () => {
        if (form.role === "DRIVER") {
            return "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"; // Driver/Steering wheel
        }
        return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"; // City/Cab/Rider
    }

    // Step 0: Role Selection
    if (step === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2 text-center">Join RydeSaathi</h1>
                    <p className="text-gray-500 mb-10 text-center">Choose how you want to use the platform</p>

                    <div className="grid md:grid-cols-2 gap-6 w-full px-4">
                        {/* Rider Card */}
                        <div
                            onClick={() => selectRole("RIDER")}
                            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all group flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                                <User className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Ride with us</h2>
                            <p className="text-gray-500 text-sm">Book rides easily and reach your destination safely and comfortably.</p>
                            <div className="mt-8 text-black font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Get Started <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Driver Card */}
                        <div
                            onClick={() => selectRole("DRIVER")}
                            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all group flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                                <Car className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Drive & Earn</h2>
                            <p className="text-gray-500 text-sm">Join our network of drivers, set your own schedule, and earn on your terms.</p>
                            <div className="mt-8 text-black font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Get Started <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <span className="text-sm text-gray-500">Already have an account? </span>
                        <Link to={"/login"} className="text-sm font-semibold text-black hover:underline transition-all">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Step 1 & 2: Split Screen Layout
    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left Image Section (Hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2 relative bg-black">
                <img
                    src={getSideImage()}
                    alt="Registration"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        {form.role === "DRIVER" ? "Your car, your business." : "Your ride, your rules."}
                    </h2>
                    <p className="text-lg text-white/80">
                        {form.role === "DRIVER"
                            ? "Join our community of partners and start earning today with complete flexibility."
                            : "Experience seamless travel across the city with top-rated drivers and comfortable rides."}
                    </p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-24 relative">
                {/* Back button */}
                <button
                    onClick={() => step === 2 ? setStep(1) : setStep(0)}
                    className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-black/10">
                            {step === 1 ? (form.role === "DRIVER" ? <Car className="w-6 h-6" /> : <User className="w-6 h-6" />) : <ShieldCheck className="w-6 h-6" />}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {step === 1 ? `Join as ${form.role === "RIDER" ? "Rider" : "Driver"}` : "Verify Email"}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {step === 1
                                ? "Enter your email to receive a verification code"
                                : `We sent a 6-digit code to ${form.email}`
                            }
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        onChange={(e) => setForm((prev) => ({ ...prev, "email": e.target.value }))}
                                        value={form.email}
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending || !form.email}
                                className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/20"
                            >
                                {isSending ? "Sending code..." : "Continue"}
                                {!isSending && <ArrowRight className="w-4 h-4" />}
                            </button>

                            <div className="text-center mt-6">
                                <span className="text-sm text-gray-500">Already have an account? </span>
                                <Link to={"/login"} className="text-sm font-semibold text-black hover:underline transition-all">
                                    Log in
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">

                            <div className="w-full py-2">
                                <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                                    <InputOTP.Group>
                                        <InputOTP.Slot index={0} className="w-12 h-14 text-lg font-bold border-gray-200 rounded-lg" />
                                        <InputOTP.Slot index={1} className="w-12 h-14 text-lg font-bold border-gray-200 rounded-lg" />
                                        <InputOTP.Slot index={2} className="w-12 h-14 text-lg font-bold border-gray-200 rounded-lg" />
                                    </InputOTP.Group>
                                    <InputOTP.Separator className="text-gray-300" />
                                    <InputOTP.Group>
                                        <InputOTP.Slot index={3} className="w-12 h-14 text-lg font-bold border-gray-200 rounded-lg" />
                                        <InputOTP.Slot index={4} className="w-12 h-14 text-lg font-bold border-gray-200 rounded-lg" />
                                        <InputOTP.Slot index={5} className="w-12 h-14 text-lg font-bold border-gray-200 rounded-lg" />
                                    </InputOTP.Group>
                                </InputOTP>
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifying || otp.length < 6}
                                className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-black/10"
                            >
                                {isVerifying ? "Verifying..." : "Verify & Complete"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors justify-center w-full mt-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Wrong email? Go back
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;