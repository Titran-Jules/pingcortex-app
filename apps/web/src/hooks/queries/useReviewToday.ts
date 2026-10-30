import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const useReviewToday = () =>
    useQuery({
        queryKey: queryKeys.reviews.today,
        queryFn: () => api.review.getReviewToday(),
    });
