import { Spinner } from '@heroui/react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserProfile } from '../../hooks/auth';

function PublicRoute() {
    const { data: userData, isError, isPending } = useUserProfile();
    if (isPending) {
        return <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-xs text-muted">Large</span>
        </div>
    }

    if (!isError && userData?.data) {
        const role = userData.data.role;
        return <Navigate to={role == 'DRIVER' ? "/driver" : "/ride/search"} replace />
    }
    return (
        <Outlet />
    )
}

export default PublicRoute