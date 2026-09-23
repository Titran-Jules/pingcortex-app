import { UUID } from "./uuid";

export interface ReviewDueResponse {
    coneptId: UUID;
    conceptName: string;
    courseId: UUID;
    courseTitle: string;
    nextReviewAt: string;
    intervalDays: number;
}

export interface ReviewCompletion {
    success: boolean;
}

export interface ReviewScheduleResponse {
    id: UUID;
    conceptId: UUID;
    nextReviewAt: string;
    intervalDays: number;
}