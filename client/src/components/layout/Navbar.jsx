import { Link } from "react-router-dom"
import { logoutRequest } from "../../api/authApi"
import { useUserProfile } from "../../hooks/auth";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { ArrowUpRightFromSquare } from "lucide-react";


function Navbar() {
    const { data, isError, error } = useUserProfile()
    function handleLogout() {
        logoutRequest();
    }
    return (
        <header className="bg-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <span className="text-2xl font-bold tracking-tight">RydeSaathi</span>
                <nav className="hidden md:flex gap-6 font-medium text-sm">
                    <a href="#" className="hover:text-gray-300 transition-colors">Ride</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Drive</a>
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
                                <Dropdown.Trigger className="rounded-full">
                                    <Avatar>
                                        <Avatar.Image
                                            alt="Junior Garcia"
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
                                                    alt="Jane"
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
                                    <Dropdown.Menu>
                                        <Dropdown.Item id="dashboard" textValue="Dashboard">
                                            <Label>Dashboard</Label>
                                        </Dropdown.Item>
                                        <Dropdown.Item id="profile" textValue="Profile">
                                            <Label>Profile</Label>
                                        </Dropdown.Item>
                                        <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                                            <button onClick={handleLogout} className="flex w-full items-center justify-between gap-2">
                                                <Label>Log Out</Label>
                                                <ArrowUpRightFromSquare className="size-3.5 text-danger" />
                                            </button>
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