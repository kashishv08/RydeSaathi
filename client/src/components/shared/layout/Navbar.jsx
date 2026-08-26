import { Link, useNavigate } from "react-router-dom"
import { logoutRequest } from "../../../api/authApi";
import { useUserProfile } from "../../../hooks/auth";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { ArrowUpRightFromSquare } from "lucide-react";


function Navbar() {
    const { data, isError } = useUserProfile()
    const navigate = useNavigate();

    function handleLogout() {
        logoutRequest();
    }

    const isDriver = data?.data?.role === "DRIVER";

    function handleMenuAction(key) {
        if (key === "dashboard") {
            navigate(isDriver ? "/driver" : "/ride/search");
        } else if (key === "profile") {
            navigate(isDriver ? "/driver/profile" : "/ride/profile");
        } else if (key === "switch_role") {
            navigate(isDriver ? "/ride/search" : "/driver");
        } else if (key === "logout") {
            handleLogout();
        }
    }

    return (
        <header className="bg-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link to={"/"} className="text-2xl font-bold tracking-tight">RydeSaathi</Link>
                <nav className="hidden md:flex gap-6 font-medium text-sm">
                    <Link to="/ride/search" className="hover:text-gray-300 transition-colors">Ride</Link>
                    <Link to="/driver" className="hover:text-gray-300 transition-colors">Drive</Link>
                    <a href="#" className="hover:text-gray-300 transition-colors">Business</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">About</a>
                </nav>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
                {isError || !data ? (
                    <>
                        <Link to="/login" className="hidden md:block hover:text-gray-300 transition-colors">Log in</Link>
                        <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="hidden md:block text-gray-300">
                            <Dropdown>
                                <Dropdown.Trigger className="rounded-full cursor-pointer hover:opacity-80 transition-opacity">
                                    <Avatar>
                                        <Avatar.Image
                                            alt={data?.data?.email || "User"}
                                            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
                                        />
                                        <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
                                    </Avatar>
                                </Dropdown.Trigger>
                                <Dropdown.Popover>
                                    <div className="px-3 pt-3 pb-1">
                                        <div className="flex items-center gap-2">
                                            <Avatar size="sm">
                                                <Avatar.Image
                                                    alt="User"
                                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
                                                />
                                                <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
                                            </Avatar>
                                            <div className="flex flex-col gap-0">
                                                <p className="text-sm leading-5 font-medium">{data.data.email}</p>
                                                <p className="text-xs leading-none text-muted">{data.data.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Dropdown.Menu onAction={handleMenuAction}>
                                        <Dropdown.Item key="dashboard" textValue="Dashboard" onPress={() => handleMenuAction("dashboard")}>
                                            <div className="cursor-pointer">{isDriver ? "Driver Dashboard" : "Ride Dashboard"}</div>
                                        </Dropdown.Item>
                                        <Dropdown.Item key="profile" textValue="Profile" onPress={() => handleMenuAction("profile")}>
                                            <div className="cursor-pointer">Profile</div>
                                        </Dropdown.Item>
                                        <Dropdown.Item key="switch_role" textValue={isDriver ? "Switch to Rider" : "Switch to Driver"} onPress={() => handleMenuAction("switch_role")}>
                                            <div className="cursor-pointer">{isDriver ? "Switch to Rider" : "Switch to Driver"}</div>
                                        </Dropdown.Item>
                                        <Dropdown.Item key="logout" textValue="Logout" variant="danger" onPress={() => handleMenuAction("logout")}>
                                            <div className="flex w-full items-center justify-between gap-2 cursor-pointer">
                                                <div className="cursor-pointer">Log Out</div>
                                                <ArrowUpRightFromSquare className="size-3.5 text-danger" />
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </span>
                    </>
                )}
            </div>

        </header>
    )
}

export default Navbar