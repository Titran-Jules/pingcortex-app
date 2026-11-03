import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const isAnalysisInProgress = (status: string | undefined) =>
    status === 'PENDING' || status === 'ANALYZING';

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
