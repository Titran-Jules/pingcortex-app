import { UUID } from "./uuid";

export interface ApiKeyCreate {
    provider: string;
    apiKey: string;
}

export interface ApiKeyResponse {
    id: UUID;
    provider: string;
    isActive: boolean;
    createdAt: string;
}

export interface ApiKeyActive {
    isActive: boolean;
}

export interface UsageSummaryResponse {
    totalTokensIn: number;
    totalTokensOut: number;
    requestCount: number;
    alertThreshold: number;
}