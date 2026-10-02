import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { authRoutes } from "./authRoutes";

export const router = createBrowserRouter([
    ...authRoutes,
    {
        element: <AppLayout />,
        children: []
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
]);