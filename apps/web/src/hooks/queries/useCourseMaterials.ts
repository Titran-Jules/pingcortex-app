import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MaterialCreate, MaterialResponse } from '@pingcortex/shared-types';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const useCourseMaterials = (courseId: string | undefined) =>
    useQuery({
        queryKey: queryKeys.courses.materials(courseId ?? ''),
        queryFn: () => api.course.getMaterialsByCourseId(courseId ?? ''),
        enabled: Boolean(courseId),
    });

export const useAddCourseMaterial = (courseId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (material: MaterialCreate) => api.course.addMaterialByCourseId(courseId ?? '', material),
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: queryKeys.courses.materials(courseId ?? '') });
        },
        onSuccess: (material) => {
            if (!courseId) return;
            queryClient.setQueryData<MaterialResponse[]>(
                queryKeys.courses.materials(courseId),
                (materials) => [...(materials ?? []), material]
            );
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(courseId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.usage.summary });
        },
    });
};
