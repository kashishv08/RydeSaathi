
import { Avatar, Dropdown } from "@heroui/react";
import { LogOut, Car, LayoutDashboard, User, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutRequest } from "../../../api/authApi";
import { useUserProfile } from "../../../hooks/auth";

const FONT_DISPLAY = "'Sora', sans-serif";

export default function Navbar() {
    const { data, isError } = useUserProfile();
    const navigate = useNavigate();

    const user = data?.data;
    const isDriver = user?.role === "DRIVER";
    const roleColor = isDriver ? "#22C55E" : "#8B5CF6";

    function handleLogout() {
        logoutRequest();
    }

    function handleMenuAction(key) {
        if (key === "dashboard") navigate(isDriver ? "/driver" : "/ride/search");
        else if (key === "profile") navigate(isDriver ? "/driver/profile" : "/ride/profile");
        else if (key === "switch_role") navigate(isDriver ? "/ride/search" : "/driver");
        else if (key === "logout") handleLogout();
    }

    return (
        <header
            className="sticky top-0 z-50 w-full border-b px-6 py-3.5 backdrop-blur-xl"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(10,10,15,0.82)" }}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between">

                {/* Brand & Main Nav */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="group flex items-center gap-2.5">
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105"
                            style={{
                                background: "linear-gradient(135deg,#8B5CF6,#5B21B6)",
                                boxShadow: "0 6px 16px -4px rgba(139,92,246,0.45)",
                            }}
                        >
                            <Car className="h-5 w-5" />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: FONT_DISPLAY }}>
                            Ryde<span style={{ color: "#A78BFA" }}>Saathi</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-7 text-sm font-medium text-gray-400 md:flex">
                        <Link
                            to="/ride/search"
                            className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-violet-400 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            Ride
                        </Link>
                        <Link
                            to="/driver"
                            className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            Drive
                        </Link>
                        <a href="#" className="py-1 text-gray-500 transition-colors hover:text-white">
                            Business
                        </a>
                        <a href="#" className="py-1 text-gray-500 transition-colors hover:text-white">
                            About
                        </a>
                    </nav>
                </div>

                {/* Right Action / Profile */}
                <div className="flex items-center gap-4">
                    {isError || !user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="hidden text-sm font-medium text-gray-300 transition-colors hover:text-white md:block"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
                                style={{
                                    background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                                    boxShadow: "0 8px 20px -6px rgba(139,92,246,0.55)",
                                }}
                            >
                                Sign up
                            </Link>
                        </div>
                    ) : (
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
                                style={{ borderColor: "rgba(255,255,255,0.08)", background: "#101016" }}
                            >
                                {/* User Header Info */}
                                <div className="flex items-center gap-3 border-b px-3.5 py-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                                    <Avatar
                                        className="h-9 w-9 ring-1"
                                        style={{ "--tw-ring-color": `${roleColor}66` }}
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                        fallback={user?.email?.slice(0, 2).toUpperCase() || "U"}
                                    />
                                    <div className="flex flex-col truncate">
                                        <p className="truncate text-sm font-semibold text-white">{user.email}</p>
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
                                    onAction={handleMenuAction}
                                    aria-label="Profile Actions"
                                    className="mt-1"
                                    itemClasses={{
                                        base: "rounded-xl py-2 px-3 text-sm text-gray-300 transition-colors data-[hover=true]:bg-white/[0.06] data-[hover=true]:text-white outline-none cursor-pointer",
                                    }}
                                >
                                    <Dropdown.Item key="dashboard">
                                        <div className="flex items-center gap-3">
                                            <LayoutDashboard className="h-4 w-4 text-gray-500" />
                                            <span>{isDriver ? "Driver Dashboard" : "Ride Dashboard"}</span>
                                        </div>
                                    </Dropdown.Item>

                                    <Dropdown.Item key="profile">
                                        <div className="flex items-center gap-3">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span>Profile</span>
                                        </div>
                                    </Dropdown.Item>

                                    <Dropdown.Item key="switch_role">
                                        <div className="flex items-center gap-3" style={{ color: "#34D399" }}>
                                            <RefreshCw className="h-4 w-4" />
                                            <span>{isDriver ? "Switch to Rider" : "Switch to Driver"}</span>
                                        </div>
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        key="logout"
                                        className="mt-1 border-t pt-2.5 text-red-400 data-[hover=true]:bg-red-500/10 data-[hover=true]:text-red-400"
                                        style={{ borderColor: "rgba(255,255,255,0.08)" }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut className="h-4 w-4" />
                                            <span>Log Out</span>
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    )}
                </div>

            </div>
        </header>
    );
}
