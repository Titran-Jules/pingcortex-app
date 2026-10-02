import type { RouteObject } from 'react-router-dom';
import { OverviewPage } from '../pages/dashboard/OverviewPage';
import { CourseDetailPage } from '../pages/dashboard/CourseDetailPage';

export const dashboardRoutes: RouteObject = {
  path: '/',
  children: [
    { index: true, element: <OverviewPage /> },
    { path: 'dashboard', element: <OverviewPage /> },
    { path: 'courses', element: <CourseDetailPage /> },
  ],
};