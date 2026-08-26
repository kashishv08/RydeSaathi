
import { Avatar, Dropdown } from "@heroui/react";
import { LogOut, Car, LayoutDashboard, User, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutRequest } from "../../../api/authApi";
import { useUserProfile } from "../../../hooks/auth";

const FONT_DISPLAY = "'Manrope', sans-serif";
const PRIMARY = "var(--clr-primary)";
const ACCENT = "var(--clr-accent)";

export default function Navbar() {
    const { data, isError } = useUserProfile();
    const navigate = useNavigate();

    const user = data?.data;
    const isDriver = user?.role === "DRIVER";
    const roleColor = isDriver ? PRIMARY : ACCENT;

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
            style={{
                borderColor: "hsl(38, 24%, 86%)",
                background: "rgba(253, 250, 242, 0.92)",
            }}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between">

                {/* Brand & Main Nav */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="group flex items-center gap-2.5">
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                            style={{
                                background: `linear-gradient(135deg, ${PRIMARY}, hsl(169, 59%, 22%))`,
                                boxShadow: "0 6px 16px -4px hsl(169, 59%, 31%, 0.45)",
                                color: "hsl(44, 44%, 99%)",
                            }}
                        >
                            <Car className="h-5 w-5" />
                        </span>
                        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: FONT_DISPLAY, color: "hsl(193, 43%, 15%)" }}>
                            Ryde<span style={{ color: PRIMARY }}>Saathi</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-7 text-sm font-medium md:flex" style={{ color: "hsl(193, 15%, 45%)" }}>
                        <Link
                            to="/ride/search"
                            className="relative py-1 transition-colors hover:opacity-100"
                            style={{ color: "hsl(193, 15%, 45%)" }}
                        >
                            Ride
                        </Link>
                        <Link
                            to="/driver"
                            className="relative py-1 transition-colors"
                            style={{ color: "hsl(193, 15%, 45%)" }}
                        >
                            Drive
                        </Link>
                        <a href="#" className="py-1 transition-colors" style={{ color: "hsl(193, 15%, 55%)" }}>
                            Business
                        </a>
                        <a href="#" className="py-1 transition-colors" style={{ color: "hsl(193, 15%, 55%)" }}>
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
                                className="hidden text-sm font-medium transition-colors md:block"
                                style={{ color: "hsl(193, 15%, 45%)" }}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:brightness-110"
                                style={{
                                    background: `var(--clr-primary)`,
                                    boxShadow: "0 8px 24px -6px color-mix(in srgb, var(--clr-primary) 50%, transparent)",
                                    color: "var(--clr-card)",
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
                                    onAction={handleMenuAction}
                                    aria-label="Profile Actions"
                                    className="mt-1"
                                    itemClasses={{
                                        base: "rounded-xl py-2 px-3 text-sm transition-colors outline-none cursor-pointer",
                                    }}
                                >
                                    <Dropdown.Item key="dashboard">
                                        <div className="flex items-center gap-3" style={{ color: "hsl(193, 15%, 45%)" }}>
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span style={{ color: "hsl(193, 43%, 15%)" }}>{isDriver ? "Driver Dashboard" : "Ride Dashboard"}</span>
                                        </div>
                                    </Dropdown.Item>

                                    <Dropdown.Item key="profile">
                                        <div className="flex items-center gap-3" style={{ color: "hsl(193, 15%, 45%)" }}>
                                            <User className="h-4 w-4" />
                                            <span style={{ color: "hsl(193, 43%, 15%)" }}>Profile</span>
                                        </div>
                                    </Dropdown.Item>

                                    <Dropdown.Item key="switch_role">
                                        <div className="flex items-center gap-3" style={{ color: PRIMARY }}>
                                            <RefreshCw className="h-4 w-4" />
                                            <span>{isDriver ? "Switch to Rider" : "Switch to Driver"}</span>
                                        </div>
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        key="logout"
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
                    )}
                </div>

            </div>
        </header>
    );
}
