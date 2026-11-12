import React, { useMemo } from 'react';
import { Button, NeumorphicCard, ProgressBar, PromptInput, ActivityBadge } from '@pingcortex/ui';
import {
    BrainCircuit,
    CalendarClock,
    PlayCircle,
    Plus,
    RotateCcw,
    Sparkles,
    TriangleAlert,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { ActivityType } from '@pingcortex/shared-types';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardProgress } from '../../hooks/queries/useDashboardProgress';
import { useReviewActivities } from '../../hooks/queries/useReviewActivities';
import { useReviewToday } from '../../hooks/queries/useReviewToday';
import { getErrorMessage } from '../../errors/getErrorMessage';

interface DashboardReview {
    conceptId: string;
    conceptName: string;
    courseTitle: string;
    nextReviewAt: string;
    intervalDays: number;
    suggestedActivity?: ActivityType;
}

const ACTIVITY_ACTION: Record<ActivityType, string> = {
    QUIZ: 'Répondre au quiz',
    FEYNMAN: 'Faire la tentative Feynman',
};

const ReviewCard: React.FC<{ review: DashboardReview }> = ({ review }) => (
    <article className="flex flex-col gap-3 rounded-2xl bg-core-bg p-4 shadow-neu-pressed-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
            <ActivityBadge activity={review.suggestedActivity} />
            <div className="space-y-0.5">
                <h4 className="text-sm font-bold leading-snug text-main-text">{review.conceptName}</h4>
                <p className="text-[11px] text-sub-text">{review.courseTitle}</p>
            </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sub-text">
                <CalendarClock size={13} />
                Tous les {review.intervalDays} j
            </span>
            <Button variant="secondary" size="sm">
                {review.suggestedActivity ? ACTIVITY_ACTION[review.suggestedActivity] : 'Réviser ce concept'}
            </Button>
        </div>
    </article>
);

const SectionErrorNotice: React.FC<{ error: unknown; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-core-bg px-4 py-3 shadow-neu-pressed-sm">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-sub-text">
            <TriangleAlert size={14} className="text-amber-500" />
            {getErrorMessage(error)}
        </span>
        <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={13} />} onClick={onRetry}>
            Réessayer
        </Button>
    </div>
);

const DashboardError: React.FC<{ error: unknown; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-core-bg py-16 shadow-neu-flat">
        <TriangleAlert className="text-amber-500" size={28} />
        <p className="text-sm font-bold text-sub-text">{getErrorMessage(error)}</p>
        <Button variant="secondary" size="sm" leftIcon={<RotateCcw size={14} />} onClick={onRetry}>
            Réessayer
        </Button>
    </div>
);

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        data: coursesProgress,
        isPending: coursesPending,
        isError: coursesError,
        error: coursesApiError,
        refetch: refetchCourses,
    } = useDashboardProgress();
    const {
        data: todayReviews,
        isPending: reviewsPending,
        isError: reviewsError,
        error: reviewsApiError,
        refetch: refetchReviews,
    } = useReviewToday();

    const firstName = user?.name.split(' ').filter((_,i) => i > 0).join(' ');
    const isLoading = coursesPending || reviewsPending;

    const conceptIds = useMemo(
        () => Array.from(new Set(todayReviews?.map((review) => review.conceptId) ?? [])),
        [todayReviews]
    );
    const activities = useReviewActivities(conceptIds);

    const reviews: DashboardReview[] = useMemo(
        () =>
            todayReviews?.map((review) => ({
                conceptId: review.conceptId,
                conceptName: review.conceptName,
                courseTitle: review.courseTitle,
                nextReviewAt: review.nextReviewAt,
                intervalDays: review.intervalDays,
                suggestedActivity: activities.get(review.conceptId),
            })) ?? [],
        [todayReviews, activities]
    );

    const activeCourses = coursesProgress?.filter((course) => course.isActive).length ?? 0;
    const totalConcepts = coursesProgress?.reduce((total, course) => total + course.totalConcepts, 0) ?? 0;
    const masteredConcepts = coursesProgress?.reduce((total, course) => total + course.masteredConcepts, 0) ?? 0;
    const inProgressConcepts = coursesProgress?.reduce((total, course) => total + course.inProgressConcepts, 0) ?? 0;
    const toCoverConcepts =
        coursesProgress?.reduce(
            (total, course) => total + Math.max(0, course.totalConcepts - course.coveredConcepts),
            0
        ) ?? 0;
    const globalMastery =
        coursesProgress && totalConcepts > 0
            ? Math.round(
                  coursesProgress.reduce((total, course) => total + course.averageMastery * course.totalConcepts, 0) /
                      totalConcepts
              )
            : 0;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <div className="h-32 animate-pulse rounded-3xl bg-container-bg" />
                    <div className="h-20 animate-pulse rounded-3xl bg-container-bg" />
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="h-20 animate-pulse rounded-2xl bg-container-bg" />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="mx-auto flex h-64 w-64 animate-pulse rounded-full bg-container-bg" />
                    <div className="h-64 animate-pulse rounded-3xl bg-container-bg" />
                </div>
            </div>
        );
    }

    if ((coursesError || reviewsError) && !coursesProgress && !todayReviews) {
        return (
            <DashboardError
                error={coursesApiError ?? reviewsApiError}
                onRetry={() => {
                    if (coursesError) refetchCourses();
                    if (reviewsError) refetchReviews();
                }}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2 justify-between">
                <div className='flex flex-col gap-6'>
                    <NeumorphicCard variant="convex" className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black tracking-tight text-main-text">
                                Bon retour, <span className="text-primary-strong">{firstName}</span>
                            </h2>
                            <p className="text-xs text-sub-text">
                                {reviews.length > 0 ? (
                                    <>
                                        <span className="font-bold text-secondary">{reviews.length} activités</span> à
                                        réviser aujourd'hui, sur {activeCourses}{' '}
                                        {activeCourses > 1 ? 'cours actifs' : 'cours actif'}.
                                    </>
                                ) : (
                                    <>Tout est à jour : aucune révision programmée aujourd'hui.</>
                                )}
                            </p>
                        </div>
                        <Button
                            variant="generate"
                            isGlowing
                            leftIcon={<PlayCircle size={16} />}
                            disabled={reviews.length === 0}
                            onClick={() => navigate('/review')}
                        >
                            Démarrer les révisions
                        </Button>
                    </NeumorphicCard>

                    <NeumorphicCard variant="flat" className="flex flex-col gap-4 p-6">
                        <div className="flex items-center justify-between border-b border-main-text/10 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-main-text">
                                <BrainCircuit size={18} className="text-secondary" /> Révisions du jour
                            </h3>
                            {reviews.length > 0 && (
                                <span className="text-xs font-medium text-sub-text">
                                    {reviews.length} {reviews.length > 1 ? 'activités restantes' : 'activité restante'}
                                </span>
                            )}
                        </div>

                        {reviewsError && <SectionErrorNotice error={reviewsApiError} onRetry={refetchReviews} />}

                        {reviews.length === 0 ? (
                            <div className='h-75 flex flex-col items-center justify-center gap-4 rounded-2xl bg-core-bg p-4 text-sm text-sub-text shadow-neu-pressed-sm'>
                                <span className='text-6xl font-bold'>
                                    :/
                                </span>
                                <p className='w-80 text-center font-semibold'>
                                    Rien à réviser aujourd'hui : revenez dès qu'une révision sera programmée.
                                </p>

                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {reviews.map((review) => (
                                    <ReviewCard key={review.conceptId} review={review} />
                                ))}
                            </div>
                        )}
                    </NeumorphicCard>

                </div>

                <PromptInput
                    onSubmit={(val) => console.log('Réponse envoyée :', val)}
                    suggestions={[
                        'Fais-moi un quiz sur le dernier concept révisé',
                        'Résume mes révisions de la semaine',
                        'Propose-moi un exercice Feynman',
                    ]}
                    placeholder="Posez une question sur vos cours ou demandez l'activité suivante…"
                />
            </div>

            <aside className="flex flex-col gap-6">
                <NeumorphicCard variant="flat" className="flex flex-col items-center gap-5 p-6">
                    <ProgressBar
                        variant="circular"
                        size={170}
                        value={globalMastery}
                        label="Maîtrise globale"
                        subLabel={`${masteredConcepts} / ${totalConcepts} concepts maîtrisés`}
                    />
                    <dl className="grid w-full grid-cols-3 gap-2 text-center">
                        <div className="space-y-0.5">
                            <dd className="text-lg font-black tabular-nums text-main-text">{masteredConcepts}</dd>
                            <dt className="text-[10px] font-bold uppercase tracking-wide text-sub-text">Maîtrisés</dt>
                        </div>
                        <div className="space-y-0.5">
                            <dd className="text-lg font-black tabular-nums text-main-text">{inProgressConcepts}</dd>
                            <dt className="text-[10px] font-bold uppercase tracking-wide text-sub-text">En cours</dt>
                        </div>
                        <div className="space-y-0.5">
                            <dd className="text-lg font-black tabular-nums text-main-text">{toCoverConcepts}</dd>
                            <dt className="text-[10px] font-bold uppercase tracking-wide text-sub-text">À couvrir</dt>
                        </div>
                    </dl>
                </NeumorphicCard>

                <NeumorphicCard variant="flat" className="flex flex-col gap-4 p-6 h-100">
                    {coursesError && <SectionErrorNotice error={coursesApiError} onRetry={refetchCourses} />}
                    <h3 className="flex items-center gap-2 border-b border-main-text/10 pb-3 text-sm font-bold text-main-text">
                        <Sparkles size={16} className="text-primary" /> Progression des cours
                    </h3>
                    {coursesProgress?.length === 0 && 
                        <div className='w-full h-40 flex flex-col items-center justify-center gap-4'>
                            <span className='font-semibold text-sm'>Vous n'avez pas encore de cours</span>
                            <NavLink to="/courses">
                                <Button variant='primary' className='rounded-4xl'>
                                    <Plus size={24} className='text-on-primary'/>
                                </Button>
                            </NavLink>
                        </div>
                    }
                    <div className="flex flex-col gap-3">
                        {coursesProgress?.map((course) => (
                            <ProgressBar
                                key={course.courseId}
                                variant="linear"
                                label={course.title}
                                subLabel={`${course.coveredConcepts}/${course.totalConcepts} couverts · ${course.masteredConcepts} maîtrisés${
                                    course.dueReviewCount > 0 ? ` · ${course.dueReviewCount} à réviser` : ''
                                }`}
                                value={course.averageMastery}
                                max={100}
                            />
                        ))}
                    </div>
                </NeumorphicCard>
            </aside>
        </div>
    );
};
