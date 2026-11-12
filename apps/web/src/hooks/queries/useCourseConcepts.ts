import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ConceptResponse, UUID } from '@pingcortex/shared-types';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const useCourseConcepts = (courseId: string | undefined) =>
    useQuery({
        queryKey: queryKeys.courses.concepts(courseId ?? ''),
        queryFn: () => api.concept.getConceptsByCourseId(courseId ?? ''),
        enabled: Boolean(courseId),
    });

const useCoverageMutation = (
    courseId: string,
    queryClient: ReturnType<typeof useQueryClient>,
    mutationFn: (conceptId: UUID) => Promise<ConceptResponse>
) =>
    useMutation({
        mutationFn,
        onSuccess: (updated) => {
            const key = queryKeys.courses.concepts(courseId);
            queryClient.setQueryData<ConceptResponse[]>(key, (concepts) =>
                concepts?.map((concept) => (concept.id === updated.id ? updated : concept))
            );
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(courseId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.progress });
            queryClient.invalidateQueries({ queryKey: queryKeys.reviews.today });
        },
    });

export const useConfirmConceptCoverage = (courseId: string | undefined) => {
    const queryClient = useQueryClient();
    return useCoverageMutation(courseId ?? '', queryClient, (conceptId) =>
        api.concept.coveredConcept(courseId ?? '', conceptId)
    );
};

export const useAdvanceConceptCoverage = (courseId: string | undefined) => {
    const queryClient = useQueryClient();
    return useCoverageMutation(courseId ?? '', queryClient, (conceptId) =>
        api.concept.advanceCoverageConcept(courseId ?? '', conceptId)
    );
};

export const useRevertConceptCoverage = (courseId: string | undefined) => {
    const queryClient = useQueryClient();
    return useCoverageMutation(courseId ?? '', queryClient, (conceptId) =>
        api.concept.revertCoverageConcept(courseId ?? '', conceptId)
    );
};
