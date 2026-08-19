import { Link } from "react-router-dom"
import { logoutRequest } from "../../api/authApi"

function Navbar() {
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
                <Link to="/login" className="hidden md:block hover:text-gray-300 transition-colors">Log in</Link>
                <button onClick={handleLogout} className="hidden md:block hover:text-gray-300 transition-colors">Log out</button>
                <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    Sign up
                </Link>
            </div>
        </header>
    )
}

export default Navbar