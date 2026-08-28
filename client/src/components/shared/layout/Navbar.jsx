
import { Car } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileButton from "../../public/landing/ProfileButton";

const PRIMARY = "var(--clr-primary)";
const FONT_DISPLAY = "'Manrope', sans-serif";


export default function Navbar() {

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
                </div>

                {/* Right Action / Profile */}
                <ProfileButton />

            </div>
        </header>
    );
}
