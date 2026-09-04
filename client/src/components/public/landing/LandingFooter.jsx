import { Logo } from "./SharedUI";

export default function LandingFooter() {
    return (
        <footer className="border-t border-[#e5dfd1] px-5 py-7 md:px-10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
                <Logo />
                <span className="text-xs font-medium text-[#82918b]">Made for the way India moves</span>
                <span className="text-xs font-bold text-[#31585a]">© {new Date().getFullYear()} RydeSaathi</span>
            </div>
        </footer>
    );
}
