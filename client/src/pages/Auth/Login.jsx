import { useState, useEffect, useRef } from 'react';
import { useSendOtp, useVerifyOtp } from '../../hooks/auth';

import { toast } from "sonner";
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';

const OTP_EXPIRY_SECONDS = 120;

function OtpTimer({ onResend, isSending }) {
    const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
    const intervalRef = useRef(null);

    const startTimer = () => {
        setSecondsLeft(OTP_EXPIRY_SECONDS);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleResend = () => {
        onResend();
        startTimer();
    };

    const progress = (secondsLeft / OTP_EXPIRY_SECONDS) * 100;
    const expired = secondsLeft === 0;

    const getColor = () => {
        if (secondsLeft > 60) return 'var(--clr-primary)';
        if (secondsLeft > 30) return 'hsl(40, 80%, 45%)';
        return 'hsl(1, 75%, 55%)';
    };

    return (
        <div className="space-y-2.5">
            {/* Animated progress bar */}
            <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--clr-border)' }}>
                <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{
                        width: `${progress}%`,
                        background: getColor(),
                        boxShadow: expired ? 'none' : `0 0 8px ${getColor()}99`,
                    }}
                />
            </div>

            {/* Timer text + Resend button */}
            <div className="flex items-center justify-between">
                {expired ? (
                    <span className="text-xs font-medium" style={{ color: 'var(--clr-muted)' }}>
                        Didn't get the code?
                    </span>
                ) : (
                    <span className="text-xs font-medium" style={{ color: 'var(--clr-muted)' }}>
                        Resend in{' '}
                        <span className="font-bold tabular-nums" style={{ color: getColor() }}>
                            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                        </span>
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={!expired || isSending}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                        color: expired ? 'var(--clr-primary)' : 'var(--clr-muted)',
                        background: expired ? 'hsl(174,58%,29%,0.08)' : 'transparent',
                        border: `1px solid ${expired ? 'hsl(174,58%,29%,0.2)' : 'transparent'}`,
                    }}
                >
                    <RotateCcw className={`w-3 h-3 ${isSending ? 'animate-spin' : ''}`} />
                    {isSending ? 'Sending...' : 'Resend'}
                </button>
            </div>
        </div>
    );
}

/* ── Custom OTP Input ──────────────────────────────────────────── */
function OtpInput({ value, onChange, autoFocus }) {
    const inputRefs = useRef([]);
    const digits = value.padEnd(6, ' ').split('').slice(0, 6);

    const focusSlot = (i) => inputRefs.current[i]?.focus();

    const handleKeyDown = (e, i) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const arr = value.split('');
            if (arr[i] && arr[i].trim()) {
                arr[i] = '';
                onChange(arr.join('').trimEnd());
            } else if (i > 0) {
                arr[i - 1] = '';
                onChange(arr.join('').trimEnd());
                focusSlot(i - 1);
            }
        } else if (e.key === 'ArrowLeft' && i > 0) focusSlot(i - 1);
        else if (e.key === 'ArrowRight' && i < 5) focusSlot(i + 1);
    };

    const handleInput = (e, i) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        if (!char) return;
        const arr = value.padEnd(6, '').split('');
        arr[i] = char;
        onChange(arr.join('').slice(0, 6).trimEnd());
        if (i < 5) focusSlot(i + 1);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        focusSlot(Math.min(pasted.length, 5));
    };

    useEffect(() => { if (autoFocus) focusSlot(0); }, [autoFocus]);

    return (
        <div className="flex gap-3 w-full justify-center">
            {[0, 1, 2, 3, 4, 5].map((i) => {
                const filled = value.length > i;
                return (
                    <input
                        key={i}
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={filled ? value[i] : ''}
                        onKeyDown={e => handleKeyDown(e, i)}
                        onInput={e => handleInput(e, i)}
                        onPaste={handlePaste}
                        onChange={() => { }}
                        className="w-12 h-12 text-center text-lg font-bold rounded-xl outline-none transition-all duration-150 border-2"
                        style={{
                            borderColor: filled ? 'var(--clr-primary)' : 'var(--clr-border)',
                            background: filled ? 'hsl(174,58%,29%,0.06)' : 'hsl(0,0%,98%)',
                            color: 'var(--clr-foreground)',
                            caretColor: 'transparent',
                        }}
                        onFocus={e => { e.target.style.borderColor = 'var(--clr-primary)'; e.target.style.boxShadow = '0 0 0 3px hsl(174,58%,29%,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = filled ? 'var(--clr-primary)' : 'var(--clr-border)'; e.target.style.boxShadow = 'none'; }}
                    />
                );
            })}
        </div>
    );
}

function Login() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setemail] = useState("")
    const [otp, setOtp] = useState("")
    const { mutate: sendOtpMutate, isPending: isSending } = useSendOtp()
    const { mutate: verifyOtpMutate, isPending: isVerifying } = useVerifyOtp()

    function handleSendOtp(e) {
        e.preventDefault()
        sendOtpMutate({ email, purpose: "login" }, {
            onSuccess: () => { setStep(2); },
            onError: (err) => {
                toast.error(err?.response?.data?.error || err?.response?.data?.email?.[0] || err?.message || "An error occurred");
            }
        })
    }

    function handleResendOtp() {
        sendOtpMutate({ email, purpose: "login" }, {
            onSuccess: () => {
                setOtp("");
                toast.success("A new code has been sent to your email.");
            },
            onError: (err) => {
                toast.error(err?.response?.data?.error || err?.message || "Failed to resend code.");
            }
        });
    }

    function handleVerifyOtp(e) {
        e.preventDefault()
        verifyOtpMutate({ email, otp }, {
            onSuccess: (res) => {
                const role = res.data.role;
                if (role === "DRIVER") { navigate("/driver"); }
                else { navigate("/ride/search"); }
            },
            onError: (err) => {
                toast.error(err?.response?.data?.error || err?.response?.data?.otp?.[0] || err?.message || "Invalid OTP. Please try again.");
            }
        })
    }

    return (
        <div className="flex min-h-screen bg-white font-sans grain">
            {/* Left Image Section */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[var(--clr-card)]">
                <img
                    src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop"
                    alt="Login"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <h2 className="text-4xl font-bold mb-4">Welcome back to RydeSaathi.</h2>
                    <p className="text-lg text-white/80 max-w-md">
                        Sign in to continue your journey. Access your ride history, manage your profile, and hit the road.
                    </p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-24 relative">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <div className="w-12 h-12 text-white rounded-xl flex items-center justify-center mb-6 shadow-md"
                            style={{ background: 'linear-gradient(135deg, var(--clr-primary), hsl(169,59%,20%))' }}
                        >
                            {step === 1 ? <Mail className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {step === 1 ? "Sign In" : "Verify Email"}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {step === 1
                                ? "Enter your email to access your account"
                                : `We sent a 6-digit code to ${email}`
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
                                        onChange={(e) => setemail(e.target.value)}
                                        value={email}
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending || !email}
                                className="cursor-pointer w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, var(--clr-primary), hsl(169,59%,20%))',
                                    color: 'var(--clr-card)',
                                    boxShadow: '0 4px 16px hsl(169,59%,31%,0.3)',
                                }}
                            >
                                {isSending ? "Sending code..." : "Continue"}
                                {!isSending && <ArrowRight className="w-4 h-4" />}
                            </button>

                            <div className="text-center mt-6">
                                <span className="text-sm text-gray-500">Don't have an account? </span>
                                <Link to={"/register"} className="cursor-pointer text-sm font-semibold hover:underline transition-all" style={{ color: 'var(--clr-primary)' }}>
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">

                            {/* OTP Boxes */}
                            <OtpInput value={otp} onChange={setOtp} autoFocus />

                            {/* Countdown timer + Resend */}
                            <OtpTimer onResend={handleResendOtp} isSending={isSending} />

                            <button
                                type="submit"
                                disabled={isVerifying || otp.length < 6}
                                className="cursor-pointer w-full py-3.5 rounded-xl font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, var(--clr-primary), hsl(169,59%,20%))',
                                    color: 'var(--clr-card)',
                                    boxShadow: '0 4px 16px hsl(169,59%,31%,0.25)',
                                }}
                            >
                                {isVerifying ? "Verifying..." : "Verify & Sign In"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="cursor-pointer flex items-center gap-2 text-sm font-medium transition-colors justify-center w-full"
                                style={{ color: 'var(--clr-muted)' }}>
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

export default Login;