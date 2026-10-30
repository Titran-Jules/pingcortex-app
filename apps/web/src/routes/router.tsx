import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../security/ProtectedRoute";
import { GuestRoute } from "../security/GuestRoute";
import { AppLayout } from "../layouts/AppLayout";
import { authRoutes } from "./authRoutes";
import { devRoutes } from "./devRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { NotFoundPage } from "../errors/NotFoundPage";
import { RouteErrorPage } from "../errors/RouteErrorPage";

export const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <RouteErrorPage />,
        children: [
            { element: <GuestRoute />, children: authRoutes },
            ...devRoutes,
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <AppLayout />,
                        errorElement: <RouteErrorPage />,
                        children: [
                            ...dashboardRoutes,
                            { path: '*', element: <NotFoundPage /> },
                        ],
                    },
                ],
            },
        ],
    },
]);
