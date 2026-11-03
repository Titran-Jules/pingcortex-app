import type {
    ActivityType,
    CourseProgressResponse,
    ReviewDueResponse,
} from '@pingcortex/shared-types';

export interface DashboardUser {
    firstName: string;
    quote: string;
    author: string;
}

/**
 * Révision à faire aujourd'hui : la base vient de GET /reviews/today,
 * l'activité suggérée vient de GET /concepts/{id}/next-review-activity
 * (à agréger côté client ou côté backend plus tard).
 */
export interface DashboardReview extends ReviewDueResponse {
    suggestedActivity: ActivityType;
}

export interface DashboardMockData {
    user: DashboardUser;
    coursesProgress: CourseProgressResponse[];
    todayReviews: DashboardReview[];
}

export const MOCK_DASHBOARD_DATA: DashboardMockData = {
    user: {
        firstName: 'Jules Titran',
        quote: 'Pour réussir en technologie, la réalité doit prendre le pas sur les relations publiques, car la nature ne peut être bernée.',
        author: 'Richard Feynman',
    },
    coursesProgress: [
        {
            courseId: 'c1a2b3d4-e5f6-7890-1234-567890abcdef',
            title: 'Architecture Spring Boot & Bases de Données',
            isActive: true,
            analysisStatus: 'READY',
            totalConcepts: 14,
            coveredConcepts: 12,
            inProgressConcepts: 2,
            masteredConcepts: 9,
            averageMastery: 86,
            dueReviewCount: 1,
        },
        {
            courseId: 'f47ac10b-58cc-4372-a567-0e02b2c3d4e5',
            title: 'Protocoles réseaux : OSI, TCP/IP et routage',
            isActive: true,
            analysisStatus: 'READY',
            totalConcepts: 15,
            coveredConcepts: 14,
            inProgressConcepts: 1,
            masteredConcepts: 11,
            averageMastery: 74,
            dueReviewCount: 1,
        },
        {
            courseId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            title: 'Gestion de projet Agile',
            isActive: false,
            analysisStatus: 'READY',
            totalConcepts: 12,
            coveredConcepts: 7,
            inProgressConcepts: 4,
            masteredConcepts: 3,
            averageMastery: 41,
            dueReviewCount: 0,
        },
    ],
    todayReviews: [
        {
            conceptId: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
            conceptName: 'Injection de dépendances et beans scoppés',
            courseId: 'c1a2b3d4-e5f6-7890-1234-567890abcdef',
            courseTitle: 'Architecture Spring Boot & Bases de Données',
            nextReviewAt: '2026-11-03T08:00:00Z',
            intervalDays: 6,
            suggestedActivity: 'QUIZ',
        },
        {
            conceptId: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
            conceptName: 'Couche liaison : ethernet et commutation',
            courseId: 'f47ac10b-58cc-4372-a567-0e02b2c3d4e5',
            courseTitle: 'Protocoles réseaux : OSI, TCP/IP et routage',
            nextReviewAt: '2026-11-03T12:00:00Z',
            intervalDays: 9,
            suggestedActivity: 'FEYNMAN',
        },
    ],
};
