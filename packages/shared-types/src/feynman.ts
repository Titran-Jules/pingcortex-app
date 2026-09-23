import { UUID } from "./uuid";

export interface FeynmanSubmissionCreate {
    explanationText: string;
}

export interface FeynmanCriterionEvaluation {
    name: string;
    score: number;
    comment: string;
}

export interface FeynmanEvaluation {
    criteria: FeynmanCriterionEvaluation;
    overallFeedback: string;
    misconceptions: string[];
}

export interface FeynmanSubmissionResponse {
    id: UUID;
    explanationText: string;
    aiEvaluation: FeynmanEvaluation;
    score: number;
    createdAt: string;
}