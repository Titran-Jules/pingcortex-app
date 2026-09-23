import { UUID } from "./uuid";

export type CoverageStatus = 'NOT_COVERAGE' | 'ANTICIPATED_COVERED' | 'COVERED';

export interface ConceptResponse {
    id: UUID;
    name: string;
    description: string;
    position: number;
    coverageStatus: CoverageStatus;
    suggestedCoverage: boolean;
}

export interface MasteryResponse {
    conceptId: UUID;
    masteryLevel: number;
    lastReviewedAt: string;
}