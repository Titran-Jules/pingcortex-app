import { UUID } from "./uuid";

export type ContentType = 'SUMMARY' | 'NOTES' | 'PDF';

export interface MaterialCreate {
    content: string;
    type: ContentType;
}

export interface MaterialResponse {
    id: UUID;
    content: string;
    type: ContentType;
    createdAt: string;
}