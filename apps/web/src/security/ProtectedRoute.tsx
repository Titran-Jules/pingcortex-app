import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

export const ProtectedRoute = () => {
    const { status } = useAuth();
    const location = useLocation();

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-container-bg" role="status" aria-label="Chargement en cours">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-neu-flat"></div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/login" replace state={{ from: location }}/>;
    }
    return <Outlet />
};