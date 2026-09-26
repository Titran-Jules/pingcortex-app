import axios, {AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';
import { RefreshResponse, ErrorResponse } from '@pingcortex/shared-types';

export interface ApiClientConfig {
    baseUrl?: string;
    getRefreshToken: () => Promise<string | null>;
    setRefreshToken: (token: string | null) => Promise<void>;
    onUnauthenticated?: () => void;
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
    const api: AxiosInstance = axios.create({
        baseURL: config.baseUrl || 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (reqConfig: InternalAxiosRequestConfig) => {
            const token = tokenStore.getAccessToken();
            if (token && reqConfig.headers) {
                reqConfig.headers.Authorization = `Bearer ${token}`;
            }
            return reqConfig;
        },
        (error) => Promise.reject(error)
    );
}