import type { ApiKeyCreate, ApiKeyResponse, LoginRequest, LoginResponse, UserRegister, UserResponse, ApiKeyActive, CourseResponse, CourseCreation, UUID, CourseUpdate, CourseActiveUpdate, MaterialResponse, MaterialCreate, ConceptResponse, MasteryResponse, QuizQuestionResponse, QuizAttemptResponse, QuizAttemptCreate, NextActivityResponse, FeynmanSubmissionCreate, FeynmanSubmissionResponse, ChatSessionResponse, ChatMessageResponse, ChatMessageCreation, ChatExchangeResponse, ReviewDueResponse, UsageSummaryResponse, UserUpdate, CourseProgressResponse } from "@pingcortex/shared-types";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

export class PingCortexApi {
    private client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this.client = client;
    }

    auth = {
        login: (credentials: LoginRequest, config?: AxiosRequestConfig) =>
            this.client.post<LoginResponse>('/auth/login', credentials, config).then((res) => res.data),

        register: (data: UserRegister, config?: AxiosRequestConfig) =>
            this.client.post<UserResponse>('/auth/register', data, config).then((res) => res.data),

        logout: (refreshToken?: string, config?: AxiosRequestConfig) =>
            this.client.post<void>('/auth/logout', refreshToken ? { refreshToken } : undefined, config),
    };

    user = {
        getProfile: (config?: AxiosRequestConfig) =>
            this.client.get<UserResponse>('/users/me', config).then((res) => res.data),

        updateProfile: (data: UserUpdate, config?: AxiosRequestConfig) =>
            this.client.patch<UserResponse>('/users/me', data, config).then((res) => res.data),

        getApiKeys: (config?: AxiosRequestConfig) =>
            this.client.get<ApiKeyResponse[]>('/users/me/api-keys', config).then((res) => res.data),

        addApiKey: (data: ApiKeyCreate, config?: AxiosRequestConfig) =>
            this.client.post<ApiKeyResponse>('/users/me/api-keys', data, config).then((res) => res.data),

        toggleApiKeyActive: (apiKeyId: string, data: ApiKeyActive, config?: AxiosRequestConfig) =>
            this.client.patch<ApiKeyResponse>(`/users/me/api-keys/${apiKeyId}`, data, config).then((res) => res.data),

        deleteApiKey: (apiKeyId: string, config?: AxiosRequestConfig) =>
            this.client.delete<void>(`/users/me/api-keys/${apiKeyId}`, config),

        getUsageSummary: (config?: AxiosRequestConfig) =>
            this.client.get<UsageSummaryResponse>('/users/me/usage', config).then((res) => res.data),
    };

    course = {
        getCourses: (config?: AxiosRequestConfig) =>
            this.client.get<CourseResponse[]>('/courses', config).then((res) => res.data),

        addCourse: (data: CourseCreation, config?: AxiosRequestConfig) =>
            this.client.post<CourseResponse>('/courses', data, {
                ...config,
                timeout: 90_000,
            }).then((res) => res.data),
        
        reRunAnalysis: (courseId: UUID, config?: AxiosRequestConfig) =>
            this.client.post<CourseResponse>(`/courses/${courseId}/analyze`, config).then((res) => res.data),

        getCourseById: (courseId: UUID, config?: AxiosRequestConfig) =>
            this.client.get<CourseResponse>(`/courses/${courseId}`, config).then((res) => res.data),

        updateCourse: (courseId: UUID, data: CourseUpdate, config?: AxiosRequestConfig) =>
            this.client.patch<CourseResponse>(`/courses/${courseId}`, data, config).then((res) => res.data),

        updateCourseActivity: (courseId: UUID, data: CourseActiveUpdate, config?: AxiosRequestConfig) =>
            this.client.patch<CourseResponse>(`/courses/${courseId}/active`, data, config).then((res) => res.data),

        getMaterialsByCourseId: (courseId: UUID, config?: AxiosRequestConfig) =>
            this.client.get<MaterialResponse[]>(`/courses/${courseId}/materials`, config).then((res) => res.data),

        addMaterialByCourseId: (courseId: UUID, data: MaterialCreate, config?: AxiosRequestConfig) =>
            this.client.post<MaterialResponse>(`/courses/${courseId}/materials`, data, config).then((res) => res.data),
    };

    concept = {
        getConceptsByCourseId: (courseId: UUID, config?: AxiosRequestConfig) =>
            this.client.get<ConceptResponse[]>(`/courses/${courseId}/concepts`, config).then((res) => res.data),

        coveredConcept: (courseId: UUID, conceptId: UUID, config?: AxiosRequestConfig) =>
            this.client.post<ConceptResponse>(`/courses/${courseId}/concepts/${conceptId}/confirm-coverage`, config).then((res) => res.data),

        revertCoverageConcept: (courseId: UUID, conceptId: UUID, config?: AxiosRequestConfig) =>
            this.client.post<ConceptResponse>(`/courses/${courseId}/concepts/${conceptId}/revert-coverage`, config).then((res) => res.data),

        advanceCoverageConcept: (courseId: UUID, conceptId: UUID, config?: AxiosRequestConfig) =>
            this.client.post<ConceptResponse>(`/courses/${courseId}/concepts/${conceptId}/advance`, config).then((res) => res.data),

        getMastery: (conceptId: UUID, config?: AxiosRequestConfig) =>
            this.client.get<MasteryResponse>(`/concepts/${conceptId}/mastery`, config).then((res) => res.data),
    };

    quiz = {
        getQuizQuestion: (conceptId: UUID, config?: AxiosRequestConfig) =>
            this.client.post<QuizQuestionResponse>(`/concepts/${conceptId}/quiz`, config).then((res) => res.data),

        submitAnswer: (questionId: UUID, data: QuizAttemptCreate, config?: AxiosRequestConfig) =>
            this.client.post<QuizAttemptResponse>(`/quiz-questions/${questionId}/attempts`, data, config).then((res) => res.data),
    };

    feynman = {
        getNextReviewActivity: (conceptId: UUID, config?: AxiosRequestConfig) =>
            this.client.get<NextActivityResponse>(`/concepts/${conceptId}/next-review-activity`, config).then((res) => res.data),

        submitFeynmanExplanation: (conceptId: UUID, data: FeynmanSubmissionCreate, config?: AxiosRequestConfig) =>
            this.client.post<FeynmanSubmissionResponse>(`/concepts/${conceptId}/feynman-submissions`, data, {
                ...config,
                timeout: 90_000,
            }).then((res) => res.data),
    };

    chat = {
        getChatSessions: (courseId: UUID, config?: AxiosRequestConfig) =>
            this.client.get<ChatSessionResponse[]>(`/courses/${courseId}/chat-sessions`, config).then((res) => res.data),

        addNewChatSession: (courseId: UUID, config?: AxiosRequestConfig) =>
            this.client.post<ChatSessionResponse>(`/courses/${courseId}/chat-sessions`, config).then((res) => res.data),

        getMessagesBySessionId: (sessionId: UUID, config?: AxiosRequestConfig) =>
            this.client.get<ChatMessageResponse[]>(`/chat-sessions/${sessionId}/messages`, config).then((res) => res.data),

        sendNewMessage: (sessionId: UUID, data: ChatMessageCreation, config?: AxiosRequestConfig) =>
            this.client.post<ChatExchangeResponse>(`/chat-sessions/${sessionId}/messages`, data, {
                ...config,
                timeout: 90_000,
            }).then((res) => res.data),
    };

    review =  {
        getReviewToday: (config?: AxiosRequestConfig) =>
            this.client.get<ReviewDueResponse[]>('/reviews/today', config).then((res) => res.data),
    };

    dashboard = {
        getCourseProgress: (isActive?: boolean, config?: AxiosRequestConfig) =>
            this.client.get<CourseProgressResponse[]>(`/dashboard?isActive=${isActive}`, config).then((res) => res.data), 
    };
}