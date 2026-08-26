import { Spinner } from '@heroui/react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserProfile } from '../../hooks/auth';

function PublicRoute() {
    const { data: userData, isError, isPending } = useUserProfile();
    if (isPending) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                    <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: 'var(--clr-primary)' }}></div>
                    <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Loading</span>
                </div>
            </div>
        );
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