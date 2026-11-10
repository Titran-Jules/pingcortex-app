import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiKeyCreate, ApiKeyResponse } from '@pingcortex/shared-types';
import { api } from '../../api/api';
import { queryKeys } from '../../lib/queryKeys';

const applyListUpdate = (
    queryClient: ReturnType<typeof useQueryClient>,
    updater: (keys: ApiKeyResponse[]) => ApiKeyResponse[]
) => {
    queryClient.setQueryData<ApiKeyResponse[]>(queryKeys.apiKeys.list, (keys) =>
        keys ? updater(keys) : keys
    );
};

export const useApiKeys = () =>
    useQuery({
        queryKey: queryKeys.apiKeys.list,
        queryFn: () => api.user.getApiKeys(),
    });

export const useAddApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (apiKey: ApiKeyCreate) => api.user.addApiKey(apiKey),
        onSuccess: (created) => {
            applyListUpdate(queryClient, (keys) => [...keys, created]);
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.usage.summary });
        },
    });
};

export const useToggleApiKeyActive = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ keyId, isActive }: { keyId: string; isActive: boolean }) =>
            api.user.toggleApiKeyActive(keyId, { isActive }),
        onMutate: async ({ keyId, isActive }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.apiKeys.list });
            const previous = queryClient.getQueryData<ApiKeyResponse[]>(queryKeys.apiKeys.list);

            applyListUpdate(queryClient, (keys) =>
                keys.map((key) =>
                    key.id === keyId
                        ? { ...key, isActive }
                        : isActive
                          ? { ...key, isActive: false }
                          : key
                )
            );

            return { previous };
        },
        onError: (_error, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.apiKeys.list, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.list });
        },
    });
};

export const useDeleteApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (keyId: string) => api.user.deleteApiKey(keyId),
        onMutate: async (keyId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.apiKeys.list });
            const previous = queryClient.getQueryData<ApiKeyResponse[]>(queryKeys.apiKeys.list);

            applyListUpdate(queryClient, (keys) => keys.filter((key) => key.id !== keyId));

            return { previous };
        },
        onError: (_error, _keyId, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.apiKeys.list, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.usage.summary });
        },
    });
};
