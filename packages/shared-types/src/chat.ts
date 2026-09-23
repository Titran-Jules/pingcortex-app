import { UUID } from "./uuid";

export type Role = 'USER' | 'ASSISTANT';

export interface ChatSessionResponse {
    id: UUID;
    courseId: UUID;
    createdAt: string;
}

export interface ChatMessageResponse {
    id: UUID;
    role: Role;
    content: string;
    createdAt: string;
}

export interface ChatMessageCreation {
    content: string;
}

export interface ChatExchangeResponse {
    userMessage: ChatMessageResponse;
    assistantMessage: ChatMessageResponse;
}