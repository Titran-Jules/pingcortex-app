import { UUID } from "./uuid";

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuizOptionPublic {
    id: UUID;
    text: string;
}

export interface QuizQuestionResponse {
    id: UUID;
    questionText: string;
    difficulty: Difficulty;
    options: QuizOptionPublic[];
}

export interface QuizAttemptCreate {
    selectedOptionId: UUID;
}

export interface QuizAttemptResponse {
    isCorrect: boolean;
    correctionOptionId: UUID;
    newMastery: number;
}