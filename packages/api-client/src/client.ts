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

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError<ErrorResponse>) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & {_retry?: boolean};

            if (error.response?.status !== 401 || originalRequest._retry) {
                return Promise.reject(error);
            }
            if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
                return Promise.reject(error);
            }
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((newToken) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await config.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                const {data} = await axios.post<RefreshResponse>(
                    `${api.defaults.baseURL}/auth/refresh`,
                    {refreshToken},
                    {headers: {'Content-Type': 'application/json'}}
                );
                tokenStore.setAccessToken(data.accessToken);

                await config.setRefreshToken(data.refreshToken);

                processQueue(null, data.accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStore.clearAccessToken();
                await config.setRefreshToken(null);

                if (config.onUnauthenticated) {
                    config.onUnauthenticated();
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
    return api;
}