import { useState } from 'react';
import { useSendOtp, useVerifyOtp } from '../../hooks/auth';
import { InputOTP } from "@heroui/react";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setemail] = useState()
    const [otp, setOtp] = useState("")
    const { mutate: sendOtpMutate, error, isError } = useSendOtp()
    const { mutate: verifyOtpMutate, error: verifyerror, isError: isVerifyError } = useVerifyOtp()

    function handleSendOtp(e) {
        e.preventDefault()
        sendOtpMutate({ email, purpose: "login" }, {
            onSuccess: () => {
                setStep(2);
            },
        })
    }

    function handleVerifyOtp(e) {
        e.preventDefault()
        verifyOtpMutate({ email, otp }, {
            onSuccess: (res) => {
                const role = res.data.role;
                if (role === "DRIVER") {
                    navigate("/");
                } else {
                    navigate("/");
                }
            }
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="card card--default w-[320px] max-w-full bg-white shadow-lg rounded-xl p-5 border border-gray-200">

                <div className="card__header flex w-full items-center justify-center flex-col gap-2 relative">
                    <span className="avatar avatar--md bg-gray-100 rounded-full p-2 mb-2">
                        <span className="avatar__fallback avatar__fallback--default text-gray-600">
                            <svg aria-hidden="true" height="24" role="img" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M8 8.5c3.85 0 7 2.5 7 4.5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2c0-2 3.15-4.5 7-4.5M8 10c-1.61 0-3.064.526-4.092 1.234C2.798 12.001 2.5 12.733 2.5 13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5c0-.267-.297-1-1.408-1.766C11.064 10.526 9.609 10 8 10m0-9a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7m0 1.5a2 2 0 1 0 0 4a2 2 0 0 0 0-4"></path>
                            </svg>
                        </span>
                    </span>
                    <h3 className="card__title font-bold text-xl text-gray-900">
                        {step === 1 ? "Create an account" : "Verify Email"}
                    </h3>

                    <button className="close-button absolute -end-2 -top-2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </button>
                </div>

                <div className="card__content w-full gap-3 flex flex-col mt-4">
                    {step === 1 ? (
                        <>
                            <p className="text-center text-sm font-medium text-gray-500 mb-2">
                                Enter your email to receive a verification code.
                            </p>
                            <form action="" method="post" onSubmit={handleSendOtp}>
                                <input
                                    onChange={(e) => setemail(e.target.value)}
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                />


                                <button type='submit' className="button button--md button--primary w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition-colors mt-1">
                                    Send Code
                                </button>
                                {isError && (
                                    <div className="mt-2 text-red-500 text-sm text-center font-medium">
                                        <span>{error?.response?.data?.error || error?.response?.data?.email?.[0] || error?.message || "An error occurred"}</span>
                                    </div>
                                )}

                                <Link to={"/register"} className="text-center text-sm font-medium text-gray-500 hover:text-black mt-2 transition-colors">
                                    Dont have Account? Register
                                </Link>

                            </form>
                        </>
                    ) : (
                        <>
                            <p className="text-center text-sm font-medium text-gray-500 mb-2">
                                We sent a 6-digit code to your email.
                            </p>

                            <form action="" method="post" onSubmit={handleVerifyOtp} className="flex flex-col items-center gap-4 w-full">
                                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                    <InputOTP.Group>
                                        <InputOTP.Slot index={0} />
                                        <InputOTP.Slot index={1} />
                                        <InputOTP.Slot index={2} />
                                    </InputOTP.Group>
                                    <InputOTP.Separator />
                                    <InputOTP.Group>
                                        <InputOTP.Slot index={3} />
                                        <InputOTP.Slot index={4} />
                                        <InputOTP.Slot index={5} />
                                    </InputOTP.Group>
                                </InputOTP>

                                <button type="submit" className="button button--md button--primary w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition-colors mt-2">
                                    Verify & Login
                                </button>
                                {isVerifyError && (
                                    <div className="mt-2 text-red-500 text-sm text-center font-medium">
                                        <span>{verifyerror?.response?.data?.error || verifyerror?.response?.data?.otp?.[0] || verifyerror?.message || "Invalid OTP. Please try again."}</span>
                                    </div>
                                )}
                            </form>

                            <button onClick={() => setStep(1)} className="text-center text-sm font-medium text-gray-500 hover:text-black mt-2 transition-colors">
                                Wrong email? Go back
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;