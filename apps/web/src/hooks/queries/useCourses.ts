import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';
import type { CourseCreation, CourseResponse } from '@pingcortex/shared-types';

const ANALYSIS_IN_PROGRESS = (course: Pick<CourseResponse, 'analysisStatus'>) =>
    course.analysisStatus === 'PENDING' || course.analysisStatus === 'ANALYZING';

export const useCourses = () =>
    useQuery({
        queryKey: queryKeys.courses.list,
        queryFn: () => api.course.getCourses(),
        refetchInterval: (query) =>
            query.state.data?.some(ANALYSIS_IN_PROGRESS) ? 5_000 : false,
    });

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (course: CourseCreation) => api.course.addCourse(course),
        onSuccess: (created) => {
            queryClient.setQueryData<CourseResponse[]>(queryKeys.courses.list, (courses) =>
                courses ? [created, ...courses] : undefined
            );
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.usage.summary });
        },
    });
};

export const useUpdateCourseActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, isActive }: { courseId: string; isActive: boolean }) =>
            api.course.updateCourseActivity(courseId, { isActive }),
        onMutate: async ({ courseId, isActive }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.courses.list });
            const previous = queryClient.getQueryData<CourseResponse[]>(queryKeys.courses.list);

            queryClient.setQueryData<CourseResponse[]>(queryKeys.courses.list, (courses) =>
                courses?.map((course) =>
                    course.id === courseId
                        ? { ...course, isActive }
                        : isActive
                          ? { ...course, isActive: false }
                          : course
                )
            );

            return { previous };
        },
        onError: (_error, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.courses.list, context.previous);
            }
        },
        onSettled: (course) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.list });
            if (course) {
                queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(course.id) });
            }
        },
    });
};

export const useRerunAnalysis = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => api.course.reRunAnalysis(courseId),
        onSuccess: (course) => {
            queryClient.setQueryData(queryKeys.courses.detail(course.id), course);
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(course.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.usage.summary });
        },
    });
};
