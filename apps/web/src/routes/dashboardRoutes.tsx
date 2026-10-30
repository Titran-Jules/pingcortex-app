import type { RouteObject } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import type { RouteTitleHandle } from '../hooks/useRouteTitle';

export const dashboardRoutes: RouteObject[] = [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    {
        path: 'dashboard',
        handle: { title: 'Tableau de bord' } satisfies RouteTitleHandle,
        lazy: async () => ({ Component: (function Dashboard () {return (<div></div>)}) }),
    },
    {
        path: 'courses',
        handle: { title: 'Mes cours' } satisfies RouteTitleHandle,
        lazy: async () => ({ Component: (function Dashboard () {return (<div></div>)}) }),
    },
    {
        path: 'courses/:courseId',
        handle: { title: 'Cours', courseTitle: true } satisfies RouteTitleHandle,
        lazy: async () => ({ Component: (function Dashboard () {return (<div></div>)}) }),
    },
    {
        path: 'review',
        handle: { title: 'Révision' } satisfies RouteTitleHandle,
        lazy: async () => ({ Component: (function Dashboard () {return (<div></div>)}) }),
    },
    {
        path: 'settings',
        handle: { title: 'Paramètres' } satisfies RouteTitleHandle,
        lazy: async () => ({ Component: (function Dashboard () {return (<div></div>)}) }),
    },
];
