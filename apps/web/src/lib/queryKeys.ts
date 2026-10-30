export const queryKeys = {
    courses: {
        detail: (courseId: string) => ['courses', 'detail', courseId] as const,
        list: ['courses', 'list'] as const,
    },
    reviews: {
        today: ['reviews', 'today'] as const,
    },
    usage: {
        summary: ['usage', 'summary'] as const,
    },
};
