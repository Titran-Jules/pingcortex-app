import type { RouteObject } from "react-router-dom";

export const authRoutes: RouteObject[] = [
    {
        path: '/login',
        lazy: async () => ({ Component: (await import('../pages/auth/LoginPage')).LoginPage }),
    },
    {
        path: '/register',
        lazy: async () => ({ Component: (await import('../pages/auth/RegisterPage')).RegisterPage }),
    },
];
