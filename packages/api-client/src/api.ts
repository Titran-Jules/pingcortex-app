import type { ApiKeyCreate, ApiKeyResponse, LoginRequest, LoginResponse, UserRegister, UserResponse, ApiKeyActive, CourseResponse, CourseCreation, UUID, CourseUpdate, CourseActiveUpdate, MaterialResponse, MaterialCreate, ConceptResponse, MasteryResponse, QuizQuestionResponse, QuizAttemptResponse, QuizAttemptCreate, NextActivityResponse, FeynmanSubmissionCreate, FeynmanSubmissionResponse, ChatSessionResponse, ChatMessageResponse, ChatMessageCreation, ChatExchangeResponse, ReviewDueResponse, ReviewCompletion, ReviewScheduleResponse } from "@pingcortex/shared-types";
import type { AxiosInstance } from "axios";

export class PingCortexApi {
    private client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this.client = client;
    }

    auth = {
        login: (credentials: LoginRequest) =>
            this.client.post<LoginResponse>('/auth/login', credentials).then((res) => res.data),

        register: (data: UserRegister) =>
            this.client.post<UserResponse>('/auth/register', data).then((res) => res.data),

        logout: (refreshToken?: string) =>
            this.client.post<void>('/auth/logout', refreshToken ? { refreshToken } : undefined),
    };

    user = {
        getProfile: () =>
            this.client.get<UserResponse>('/users/me').then((res) => res.data),

        getApiKeys: () =>
            this.client.get<ApiKeyResponse[]>('/users/me/api-keys').then((res) => res.data),

        addApiKey: (data: ApiKeyCreate) =>
            this.client.post<ApiKeyResponse>('/users/me/api-keys', data).then((res) => res.data),

        toggleApiKeyActive: (apiKeyId: string, data: ApiKeyActive) =>
            this.client.patch<ApiKeyResponse>(`/users/me/api-keys/${apiKeyId}`, data).then((res) => res.data),

        deleteApiKey: (apiKeyId: string) =>
            this.client.delete<void>(`/users/me/api-keys/${apiKeyId}`),
    };

    course = {
        getCourses: () =>
            this.client.get<CourseResponse[]>('/courses').then((res) => res.data),

        addCourse: (data: CourseCreation) =>
            this.client.post<CourseResponse>('/courses', data).then((res) => res.data),

        getCourseById: (courseId: UUID) =>
            this.client.get<CourseResponse>(`/courses/${courseId}`).then((res) => res.data),

        updateCourse: (courseId: UUID, data: CourseUpdate) =>
            this.client.patch<CourseResponse>(`/courses/${courseId}`, data).then((res) => res.data),

        updateCourseActivity: (courseId: UUID, data: CourseActiveUpdate) =>
            this.client.patch<CourseResponse>(`/courses/${courseId}/active`, data).then((res) => res.data),

        getMaterialsByCourseId: (courseId: UUID) =>
            this.client.get<MaterialResponse[]>(`/courses/${courseId}/materials`).then((res) => res.data),

        addMaterialByCourseId: (courseId: UUID, data: MaterialCreate) =>
            this.client.post<MaterialResponse>(`/courses/${courseId}/`, data).then((res) => res.data),
    };

    concept = {
        getConceptsByCourseId: (courseId: UUID) =>
            this.client.get<ConceptResponse[]>(`/courses/${courseId}/concepts`).then((res) => res.data),

        coveredConcept: (courseId: UUID, conceptId: UUID) =>
            this.client.post<ConceptResponse>(`/courses/${courseId}/concepts/${conceptId}/confirm-coverage`).then((res) => res.data),

        revertCoverageConcept: (courseId: UUID, conceptId: UUID) =>
            this.client.post<ConceptResponse>(`/courses/${courseId}/concepts/${conceptId}/revert-coverage`).then((res) => res.data),

        advanceCoverageConcept: (courseId: UUID, conceptId: UUID) =>
            this.client.post<ConceptResponse>(`/courses/${courseId}/concepts/${conceptId}/advance`).then((res) => res.data),

        getMastery: (conceptId: UUID) =>
            this.client.get<MasteryResponse>(`/concepts/${conceptId}/mastery`).then((res) => res.data),
    };

    quiz = {
        getQuizQuestion: (conceptId: UUID) =>
            this.client.post<QuizQuestionResponse>(`/concepts/${conceptId}/quiz`).then((res) => res.data),

        submitAnswer: (questionId: UUID, data: QuizAttemptCreate) =>
            this.client.post<QuizAttemptResponse>(`/quiz-questions/${questionId}/attempts`, data).then((res) => res.data),
    };

    feynman = {
        getNextReviewActivity: (conceptId: UUID) =>
            this.client.get<NextActivityResponse>(`/concepts/${conceptId}/next-review-activity`).then((res) => res.data),

        submitFeynmanExplanation: (conceptId: UUID, data: FeynmanSubmissionCreate) =>
            this.client.post<FeynmanSubmissionResponse>(`/concepts/${conceptId}/feynman-submissions`, data).then((res) => res.data),
    };

    chat = {
        addNewChatSession: (courseId: UUID) =>
            this.client.post<ChatSessionResponse>(`/courses/${courseId}/chat-sessions`).then((res) => res.data),

        getMessagesBySessionId: (sessionId: UUID) =>
            this.client.get<ChatMessageResponse[]>(`/chat-sessions/${sessionId}/messages`).then((res) => res.data),

        sendNewMessage: (sessionId: UUID, data: ChatMessageCreation) =>
            this.client.post<ChatExchangeResponse>(`/chat-sessions/${sessionId}/messages`, data).then((res) => res.data),
    };

    review =  {
        getReviewToday: () =>
            this.client.get<ReviewDueResponse>('/reviews/today').then((res) => res.data),

        markConceptReviewAsDone: (conceptId: UUID, data: ReviewCompletion) =>
            this.client.post<ReviewScheduleResponse>(`/reviews/${conceptId}/complete`, data).then((res) => res.data),
    }
}