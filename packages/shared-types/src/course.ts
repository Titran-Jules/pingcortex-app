import { UUID } from "./uuid";

export type AnalysisStatus = 'PENDING' | 'ANALYZING' | 'READY' | 'FAILED'

export interface CourseResponse {
    id: UUID;
    title: string;
    description: string;
    isActive: boolean;
    analysisStatus: AnalysisStatus
}

export interface CourseCreation {
    title: string;
    description: string;
}

export interface CourseUpdate {
    title: string;
    description: string;
}

export interface CourseActiveUpdate {
    isActive: boolean;
}