import { Spinner } from "@heroui/react";
import { useUserProfile } from "../../hooks/auth"
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
    const { data: userData, isError, isPending } = useUserProfile();

    if (isPending) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Loading</span>
                </div>
            </div>
        );
    }

    if (isError || !userData?.data) {
        return <Navigate to="/login" />;
    }

    const role = userData.data.role;
    if (allowedRole && role != allowedRole) {
        if (role == "DRIVER") {
            return <Navigate to={"/driver"} />
        } else {
            return <Navigate to={"/ride/search"} />
        }
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute