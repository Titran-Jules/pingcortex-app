import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const useDashboardProgress = () =>
    useQuery({
        queryKey: queryKeys.dashboard.progress,
        queryFn: () => api.dashboard.getCourseProgress(),
    });
