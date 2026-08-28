import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Logo } from "./SharedUI";
import ProfileButton from "./ProfileButton";
import { useUserProfile } from "../../../hooks/auth";

export default function LandingNavbar() {
    const navigate = useNavigate();

    const { data } = useUserProfile();
    const user = data?.data;
    const isDriver = user?.role === "DRIVER";

    return (
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-10">
            <Logo />
            <div className="hidden items-center gap-8 text-sm font-semibold text-[#52716b] md:flex">
                <a href="#how-it-works" className="hover:text-[#1f756d]">How it works</a>
                <a href="#safety" className="hover:text-[#1f756d]" >Safer together</a>
                <a href="#drive" className="hover:text-[#1f756d]">Drive with us</a>
            </div>
            <div className="flex items-center gap-2">
                <ProfileButton />
                <button
                    onClick={() => navigate(isDriver ? "/driver" : "/ride/search")}
                    className="cursor-pointer focus-ring rounded-xl bg-[#1f756d] px-4 py-2.5 text-sm font-bold text-[#fff8e8] shadow-[0_8px_16px_rgba(31,117,109,.18)] transition-transform hover:-translate-y-0.5"
                >
                    {isDriver ? "Driver Dashboard" : (user ? "Ride Dashboard" : "Book a ride")} <ArrowRight size={15} className="ml-1 inline" />
                </button>
            </div>
        </nav>
    );
}
