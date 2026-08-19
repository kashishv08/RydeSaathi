// import { motion } from 'framer-motion';
import { useState } from 'react';
import useLogin from '../../hooks/auth';
import Navbar from '../../components/layout/Navbar';
import { useDriverProfile } from '../../hooks/driver';
import { driverPing, driverPing1, driverPing2 } from '../../api/driverApi';

export default function Login() {
    const { mutate, isPending, isError } = useLogin();
    const { data, refetch } = useDriverProfile({ enabled: false });

    const [creds, setCreds] = useState({
        email: "",
        password: ""
    });

    function handleLogin() {
        mutate(creds);
    }

    function handleUserProfile() {
        refetch().then(res => console.log(res.data));
    }

    function handleDriverPing() {
        console.log("Firing 3 requests simultaneously...");
        Promise.all([
            driverPing(),
            driverPing1(),
            driverPing2()
        ])
        .then(() => console.log("All requests succeeded!"))
        .catch(err => console.error("At least one request failed:", err));
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <button onClick={handleUserProfile}>User Profile</button>
            <button onClick={handleDriverPing}>Driver ping</button>

            <input type="email" onChange={(e) => setCreds((prev) => ({
                ...prev,
                email: e.target.value
            }))} />
            <input type="password" onChange={(e) => setCreds((prev) => ({
                ...prev,
                password: e.target.value
            }))} />

            <button onClick={handleLogin} disabled={isPending}>Submit</button>


            {/* <main className="flex-1 flex flex-col max-w-md w-full mx-auto mt-8">
                <motion.div

                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <>
                        <h1 className="text-2xl font-medium mb-6">Enter your mobile number</h1>
                        <form >
                            <div className="flex border-2 border-black rounded-lg overflow-hidden focus-within:border-black mb-6">
                                <div className="px-4 py-3 bg-gray-50 border-r border-gray-200 flex items-center font-medium">
                                    🇺🇸 +1
                                </div>
                                <input
                                    type="tel"

                                    placeholder="Mobile number"
                                    className="flex-1 px-4 py-3 outline-none font-medium text-lg"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white font-medium text-lg py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex justify-between items-center px-6"
                            >
                                <span>Continue</span>
                                <span className="material-symbols-rounded text-xl">arrow_forward</span>
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <button className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-black font-medium py-3.5 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    Continue with Google
                                </button>
                                <button className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-black font-medium py-3.5 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.8 1.58-.06 2.82.52 3.65 1.5-3.21 1.6-2.58 5.76.62 6.95-.7 1.83-1.63 3.58-2.93 4.52zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                                    Continue with Apple
                                </button>
                            </div>
                        </div>
                    </>
                    <>
                        <h1 className="text-2xl font-medium mb-2">Enter the 4-digit code sent to you at:</h1>
                        <p className="text-gray-600 mb-8 font-medium">{"phone"}</p>

                        <form>
                            <div className="flex gap-4 mb-8">
                                {[0, 1, 2, 3].map((i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        className="w-16 h-16 text-center text-2xl font-bold bg-gray-100 rounded-lg focus:bg-white focus:border-2 focus:border-black outline-none transition-colors"
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-full mb-8 hover:bg-gray-200 transition-colors"
                            >
                                I didn't receive a code
                            </button>

                            <button
                                type="submit"
                                className="w-full bg-black text-white font-medium text-lg py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex justify-between items-center px-6"
                            >
                                <span>Verify</span>
                                <span className="material-symbols-rounded text-xl">arrow_forward</span>
                            </button>
                        </form>
                    </>
                </motion.div>
            </main> */}
        </div>
    );
}
