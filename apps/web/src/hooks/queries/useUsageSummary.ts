import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const useUsageSummary = () =>
    useQuery({
        queryKey: queryKeys.usage.summary,
        queryFn: () => api.user.getUsageSummary(),
    });
