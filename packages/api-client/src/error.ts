import axios from 'axios';
import type { ErrorResponse } from '@pingcortex/shared-types';

export interface ApiError {
    status?: number;
    code?: string;
    message?: string;
    isNetworkError: boolean;
    isTimeout: boolean;
}

export const getApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError<ErrorResponse>(error)) {
        if (!error.response) {
            const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
            return { isNetworkError: !isTimeout, isTimeout, message: error.message };
        } 
        const data = error.response.data as Partial<ErrorResponse> | string | undefined;
        const body = typeof data === 'object' && data !== null ? data: undefined;
        return {
            status: error.response.status,
            code: body?.code,
            message: body?.message,
            isNetworkError: false,
            isTimeout: false,
        };
    }
    return {
        isNetworkError: false,
        isTimeout: false,
        message: error instanceof Error ? error.message : undefined,
    };
};
