import type { AnalysisStatus } from "./course";
import type { UUID } from "./uuid";

export interface CourseProgressResponse {
    courseId: UUID;
    title: string;
    isActive: boolean;
    analysisStatus: AnalysisStatus;
    totalConcepts: number;
    coveredConcepts: number;
    inProgressConcepts: number;
    masteredConcepts: number;
    averageMastery: number;
    dueReviewCount: number;
}