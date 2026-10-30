import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const isAnalysisInProgress = (status: string | undefined) =>
    status === 'PENDING' || status === 'ANALYZING';

/**
 * Détail d'un cours : refetchInterval 3 s tant que PENDING ou ANALYZING,
 * arrêt sinon (setup prêt à ajouter plus de setters via d'autres onglets).
 */
export const useCourse = (courseId: string | undefined, enabled = true) =>
    useQuery({
        queryKey: queryKeys.courses.detail(courseId ?? ''),
        queryFn: () => api.course.getCourseById(courseId ?? ''),
        enabled: Boolean(courseId) && enabled,
        refetchInterval: (query) =>
            isAnalysisInProgress(query.state.data?.analysisStatus) ? 3_000 : false,
    });

export const invalidateCourseLists = (queryClient: ReturnType<typeof useQueryClient>) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.courses.list });
};
