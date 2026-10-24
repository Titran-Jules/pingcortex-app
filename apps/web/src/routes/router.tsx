import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../security/ProtectedRoute";
import { GuestRoute } from "../security/GuestRoute";
import { AppLayout } from "../layouts/AppLayout";
import { authRoutes } from "./authRoutes";
import { devRoutes } from "./devRoutes";
import { dashboardRoutes } from "./dashboardRoutes";

export const router = createBrowserRouter([
    { element: <GuestRoute />, children: authRoutes },
    ...devRoutes,
    { element: <ProtectedRoute />, children: [{ element: <AppLayout />, children: [dashboardRoutes] }] },
    { path: '*', element: <Navigate to="/dashboard" replace /> },
]);