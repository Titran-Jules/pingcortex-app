import type React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet ,useLocation } from "react-router-dom";

export const GuestRoute: React.FC = () => {
    const { status } = useAuth();
    const location = useLocation();

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-container-bg" role="status" aria-label="Chargement en cours">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-neu-flat"></div>
            </div>
        );
    }

    if (status === 'authenticated') {
        const stateFrom = (location.state as { from?: { pathname: string; search?: string }}).from;
        const redirectTo = stateFrom ? `${stateFrom.pathname}${stateFrom.search || ''}` : '/dashboard';
        return <Navigate to={redirectTo} replace />
    }
    return <Outlet />;
};