import { createApiClient, PingCortexApi } from "@pingcortex/api-client";
import { sessionHint } from "./sessionHint";

export const UNAUTHENTICATED_EVENT = 'pingcortex:unauthenticated';

const baseUrl = import.meta.env.VITE_API_URL;
if (import.meta.env.PROD && !baseUrl) throw new Error('VITE_API_URL est requis en production');

export const api = new PingCortexApi(
    createApiClient({
        refreshMode: 'cookie',
        baseUrl: baseUrl ?? '/api',
        onUnauthenticated: () => {
            sessionHint.clear();
            window.dispatchEvent(new Event(UNAUTHENTICATED_EVENT));
        },
    })
);
