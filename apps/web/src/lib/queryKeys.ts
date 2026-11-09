export const queryKeys = {
    courses: {
        detail: (courseId: string) => ['courses', 'detail', courseId] as const,
        list: ['courses', 'list'] as const,
        materials: (courseId: string) => ['courses', courseId, 'materials'] as const,
        concepts: (courseId: string) => ['courses', courseId, 'concepts'] as const,
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
};
