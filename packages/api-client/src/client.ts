import axios, {type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';
import type { RefreshResponse, ErrorResponse } from '@pingcortex/shared-types';

interface BaseConfig {
    baseUrl?: string;
    timeout?: number;
    onUnauthenticated?: () => void;
}

interface BodyModeConfig extends BaseConfig {
    refreshMode?: 'body';
    getRefreshToken: () => Promise<string | null>;
    setRefreshToken: (token: string | null) => Promise<void>;
}

interface CookieModeConfig extends BaseConfig {
    refreshMode: 'cookie';
}

export type ApiClientConfig = BodyModeConfig | CookieModeConfig;

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
    const useCookie = config.refreshMode === 'cookie';
    const api: AxiosInstance = axios.create({
        baseURL: config.baseUrl || 'http://localhost:8080/api',
        withCredentials: useCookie,
        timeout: config.timeout ?? 30_000,
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
                originalRequest._retry = true;
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
                let body: { refreshToken: string } | undefined;
                if (config.refreshMode !== 'cookie') {
                    const refreshToken = await config.getRefreshToken();
                    if (!refreshToken) {
                        throw new Error("New refresh token available");
                    }
                    body = { refreshToken };
                }
                const {data} = await axios.post<RefreshResponse>(
                    `${api.defaults.baseURL}/auth/refresh`,
                    body,
                    {headers: {'Content-Type' : 'application/json'}, withCredentials: useCookie}
                );
                tokenStore.setAccessToken(data.accessToken);

                if (config.refreshMode !== 'cookie' && data.refreshToken) {
                    await config.setRefreshToken(data.refreshToken);
                }

                processQueue(null, data.accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStore.clearAccessToken();

                if (config.refreshMode !== 'cookie') {
                    await config.setRefreshToken(null);
                }

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