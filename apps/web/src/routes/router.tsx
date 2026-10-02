import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";

export const router = createBrowserRouter([
    ...authRoutes,
    {
        element: <AppLayout />,
        children: [dashboardRoutes]
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
]);