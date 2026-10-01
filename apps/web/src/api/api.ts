import { createApiClient, PingCortexApi } from "@pingcortex/api-client";

const httpClient = createApiClient({
    baseUrl: import.meta.env.VITE_API_URL,
    getRefreshToken: async () => localStorage.getItem("rt"),
    setRefreshToken: async (token) => {
        if (token) localStorage.setItem('rt', token);
        else localStorage.removeItem('rt');
    },
    onUnauthenticated: () => {
        window.location.href = '/login';
    },
});

export const api = new PingCortexApi(httpClient);