import { Avatar, Dropdown } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, RefreshCw, User } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { logoutRequest } from "../../../api/authApi";
import { useUserProfile } from "../../../hooks/auth";
import { useRideDetails } from "../../../hooks/rider";
import { RIDE_STATUS } from "../../../constants";

const PRIMARY = "var(--clr-primary)";
const ACCENT = "var(--clr-accent)";

function ProfileButton() {
    const { data, isError } = useUserProfile();
    const navigate = useNavigate();
    const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
    const { data: rideData } = useRideDetails();

    const user = data?.data;
    const isDriver = user?.role === "DRIVER";
    const roleColor = isDriver ? PRIMARY : ACCENT;

    const rideStatus = rideData?.data?.status;
    const isAllowLogout = !rideStatus || rideStatus === RIDE_STATUS.CANCELLED || rideStatus === RIDE_STATUS.COMPLETED;
    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

    async function handleLogout() {
        try {
            await logoutRequest();
        } catch (e) {
            console.error("Logout failed", e);
        }
        window.location.href = "/";
    }

    function handleMenuAction(key) {
        if (key === "profile") {
            navigate(isDriver ? "/driver/profile" : "/ride/profile");
        } else if (key === "switch_role") {
            if (!isAllowLogout) setIsBlockedModalOpen(true);
            else setIsSwitchModalOpen(true);
        } else if (key === "logout") {
            if (!isAllowLogout) setIsBlockedModalOpen(true);
            else handleLogout();
        }
    }
    return (
        <div className="flex items-center gap-4">
            {isError || !user ? (
                <div className="flex items-center gap-3">
                    <Link
                        to="/register"
                        className="cursor-pointer hidden px-3 py-2 text-sm font-bold text-[#31585a] hover:text-[#1f756d] sm:block"

                    >
                        Log in
                    </Link>
                </div>
            ) : (
                <>
                    <Dropdown placement="bottom-end">
                        <Dropdown.Trigger className="rounded-full outline-none">
                            <Avatar
                                as="button"
                                className="h-10 w-10 cursor-pointer ring-2 transition-all"
                                style={{ "--tw-ring-color": `${roleColor}55` }}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                fallback={user?.email?.slice(0, 2).toUpperCase() || "U"}
                            />
                        </Dropdown.Trigger>
                        <Dropdown.Popover
                            className="min-w-[250px] rounded-2xl border p-1.5 shadow-2xl backdrop-blur-2xl"
                            style={{ borderColor: "hsl(38, 24%, 86%)", background: "hsl(44, 44%, 99%)" }}
                        >
                            {/* User Header Info */}
                            <div className="flex items-center gap-3 border-b px-3.5 py-3" style={{ borderColor: "hsl(38, 24%, 86%)" }}>
                                <Avatar
                                    className="h-9 w-9 ring-1"
                                    style={{ "--tw-ring-color": `${roleColor}66` }}
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                    fallback={user?.email?.slice(0, 2).toUpperCase() || "U"}
                                />
                                <div className="flex flex-col truncate">
                                    <p className="truncate text-sm font-semibold" style={{ color: "hsl(193, 43%, 15%)" }}>{user.email}</p>
                                    <span
                                        className="mt-0.5 w-fit rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                        style={{ color: roleColor, background: `${roleColor}1A` }}
                                    >
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            {/* Dropdown Actions */}
                            <Dropdown.Menu
                                aria-label="Profile Actions"
                                className="mt-1"
                                itemClasses={{
                                    base: "rounded-xl py-2 px-3 text-sm transition-colors outline-none cursor-pointer",
                                }}
                            >

                                <Dropdown.Item key="profile" onPress={() => handleMenuAction("profile")}>
                                    <div className="flex items-center gap-3" style={{ color: "hsl(193, 15%, 45%)" }}>
                                        <User className="h-4 w-4" />
                                        <span style={{ color: "hsl(193, 43%, 15%)" }}>Profile</span>
                                    </div>
                                </Dropdown.Item>

                                <Dropdown.Item key="switch_role" onPress={() => handleMenuAction("switch_role")}>
                                    <div className="flex items-center gap-3" style={{ color: PRIMARY }}>
                                        <RefreshCw className="h-4 w-4" />
                                        <span>{isDriver ? "Switch to Rider" : "Switch to Driver"}</span>
                                    </div>
                                </Dropdown.Item>

                                <Dropdown.Item
                                    key="logout"
                                    onPress={() => handleMenuAction("logout")}
                                    className="mt-1 border-t pt-2.5"
                                    style={{ borderColor: "hsl(38, 24%, 86%)", color: "hsl(1, 72%, 52%)" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOut className="h-4 w-4" />
                                        <span>Log Out</span>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>

                    {typeof document !== 'undefined' && createPortal(
                        <AnimatePresence>
                            {isSwitchModalOpen && (
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsSwitchModalOpen(false)}
                                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#fffaf0] p-6 shadow-2xl"
                                    >
                                        <h3 className="font-display text-xl font-extrabold text-[#17383c]">Switch Role</h3>
                                        <p className="mt-3 text-sm leading-6 text-[#52716b]">
                                            To switch to a <span className="font-bold">{isDriver ? "Rider" : "Driver"}</span> account, you need to log out of your current account and log in with an email registered for that role.
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-[#52716b]">
                                            Do you want to log out now?
                                        </p>

                                        <div className="mt-8 flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => setIsSwitchModalOpen(false)}
                                                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#52716b] transition-colors hover:bg-[#e7dfce]/50 cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => { setIsSwitchModalOpen(false); handleLogout(); }}
                                                className="rounded-xl bg-[#e57453] px-5 py-2.5 text-sm font-bold text-[#fff8e8] shadow-[0_4px_12px_rgba(229,116,83,.2)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                            {isBlockedModalOpen && (
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsBlockedModalOpen(false)}
                                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#fffaf0] p-6 shadow-2xl"
                                    >
                                        <h3 className="font-display text-xl font-extrabold text-[#17383c]">Action Blocked</h3>
                                        <p className="mt-3 text-sm leading-6 text-[#52716b]">
                                            You cannot log out or switch roles during an active ride.
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-[#52716b]">
                                            Please complete or cancel your current ride first.
                                        </p>

                                        <div className="mt-8 flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => setIsBlockedModalOpen(false)}
                                                className="rounded-xl bg-[#e57453] px-5 py-2.5 text-sm font-bold text-[#fff8e8] shadow-[0_4px_12px_rgba(229,116,83,.2)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                                            >
                                                Understood
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>,
                        document.body
                    )}
                </>
            )}
        </div>
    )
}

export default ProfileButton