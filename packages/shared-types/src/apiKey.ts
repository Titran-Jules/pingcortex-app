import type { UUID } from "./uuid";

export type Provider = 'GEMINI' | 'ANTHROPIC' | 'OPENAI';

export interface ApiKeyCreate {
    provider: Provider;
    apiKey: string;
}

export interface ApiKeyResponse {
    id: UUID;
    provider: Provider;
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