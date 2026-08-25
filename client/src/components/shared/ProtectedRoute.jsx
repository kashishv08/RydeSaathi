import { Spinner } from "@heroui/react";
import { useUserProfile } from "../../hooks/auth"
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
    const { data: userData, isError, isPending } = useUserProfile();

    if (isPending) {
        return <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-xs text-muted">Large</span>
        </div>
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