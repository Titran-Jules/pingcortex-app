export const queryKeys = {
    courses: {
        detail: (courseId: string) => ['courses', 'detail', courseId] as const,
        list: ['courses', 'list'] as const,
        materials: (courseId: string) => ['courses', 'detail', courseId, 'materials'] as const,
        concepts: (courseId: string) => ['courses', 'detail', courseId, 'concepts'] as const,
        chatSessions: (courseId: string) => ['courses', courseId, 'chat-sessions'] as const,
        chatMessages: (sessionId: string) => ['chats', sessionId, 'messages'] as const,
    },
    dashboard: {
        progress: ['dashboard', 'progress'] as const,
    },
    reviews: {
        activity: (conceptId: string) => ['concepts', conceptId, 'next-review-activity'] as const,
        today: ['reviews', 'today'] as const,
    },
    usage: {
        summary: ['usage', 'summary'] as const,
    },
    apiKeys: {
        list: ['api-keys', 'list'] as const,
    },
};
