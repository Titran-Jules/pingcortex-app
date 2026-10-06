import type { RouteObject } from 'react-router-dom';
import { OverviewPage } from '../pages/dashboard/OverviewPage';
import { CourseDetailPage } from '../pages/dashboard/CourseDetailPage';
import { ApiKeyManager } from '../pages/settings/ApiKeyManager';

export const dashboardRoutes: RouteObject = {
  path: '/',
  children: [
    { index: true, element: <OverviewPage /> },
    { path: 'dashboard', element: <OverviewPage /> },
    { path: 'courses', element: <CourseDetailPage /> },
    { path: 'settings', element: <ApiKeyManager/> },
  ],
};