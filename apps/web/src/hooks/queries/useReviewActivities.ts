import { useQueries } from '@tanstack/react-query';
import type { ActivityType } from '@pingcortex/shared-types';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const useReviewActivities = (
    conceptIds: string[]
): Map<string, ActivityType | undefined> => {
    const entries: Array<[string, ActivityType | undefined]> = useQueries({
        queries: conceptIds.map((conceptId) => ({
            queryKey: queryKeys.reviews.activity(conceptId),
            queryFn: () => api.feynman.getNextReviewActivity(conceptId),
        })),
    }).map((query, index) => [conceptIds[index], query.data?.suggestedActivity]);

    return new Map<string, ActivityType | undefined>(entries);
};
