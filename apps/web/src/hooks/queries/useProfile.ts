import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserUpdate } from '@pingcortex/shared-types';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profile: UserUpdate) => api.user.updateProfile(profile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.usage.summary });
        },
    });
};
