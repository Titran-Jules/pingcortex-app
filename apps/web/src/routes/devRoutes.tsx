import type { RouteObject } from "react-router-dom";

export const devRoutes: RouteObject[] = import.meta.env.DEV ?
    [{
        path: '/dev/components',
        lazy: async () => {
            const { ComponentsPage } = await import('../pages/dev/ComponentsPage');
            return { Component: ComponentsPage };
        }
    }] : [];