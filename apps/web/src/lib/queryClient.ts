import { QueryClient } from "@tanstack/react-query";
import { getApiError } from "@pingcortex/api-client";

export const shouldRetry = (failureCount: number, error: unknown) => {
    const { status } = getApiError(error);

    if (status !== undefined && status < 500 && status !== 408 && status !== 429) {
        return false;
    }
    return failureCount < 2;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: shouldRetry,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
});
