import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { authRoutes } from "./authRoutes";
import { devRoutes } from "./devRoutes";
import { dashboardRoutes } from "./dashboardRoutes";

export const router = createBrowserRouter([
    ...authRoutes,
    ...devRoutes,
    {
        element: <AppLayout />,
        children: [dashboardRoutes]
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
]);