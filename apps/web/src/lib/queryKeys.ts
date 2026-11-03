export const queryKeys = {
    courses: {
        detail: (courseId: string) => ['courses', 'detail', courseId] as const,
        list: ['courses', 'list'] as const,
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
