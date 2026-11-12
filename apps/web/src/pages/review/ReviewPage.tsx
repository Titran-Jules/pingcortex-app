import React, { useMemo, useState } from 'react';
import { Badge, Button, NeumorphicCard, ProgressBar, ActivityBadge } from '@pingcortex/ui';
import { BrainCircuit, CalendarClock, CheckCircle2, PlayCircle, RotateCcw, TriangleAlert } from 'lucide-react';
import type { ActivityType, ReviewDueResponse } from '@pingcortex/shared-types';
import { useReviewActivities } from '../../hooks/queries/useReviewActivities';
import { useReviewToday } from '../../hooks/queries/useReviewToday';
import { getErrorMessage } from '../../errors/getErrorMessage';
import { QuizActivity } from '../courses/components/QuizActivity';
import { FeynmanActivity } from '../courses/components/FeynmanActivity';
import { formatDayDate } from '../../lib/format';

type ReviewItem = ReviewDueResponse & { activity?: ActivityType };
type Phase = 'idle' | 'running';

const isSameDay = (value: string): boolean => {
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.toDateString() === new Date().toDateString();
};

const formatDueLabel = (review: ReviewDueResponse): string =>
    `${isSameDay(review.nextReviewAt) ? "Aujourd'hui" : formatDayDate(review.nextReviewAt)} · tous les ${review.intervalDays} j`;

const buildSummary = (reviews: ReviewDueResponse[]): string => {
    const total = reviews.length;
    const courseCount = new Set(reviews.map((review) => review.courseId)).size;
    return `${total} ${total > 1 ? 'activités' : 'activité'} · ${courseCount} cours`;
};

const ReviewRow: React.FC<{ review: ReviewItem }> = ({ review }) => (
    <article className="flex flex-col gap-3 rounded-2xl bg-core-bg p-4 shadow-neu-pressed-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
            <ActivityBadge activity={review.activity} />
            <div className="space-y-0.5">
                <h4 className="text-sm font-bold leading-snug text-main-text">{review.conceptName}</h4>
                <p className="text-[11px] text-sub-text">{review.courseTitle}</p>
            </div>
        </div>
        <div className="flex items-center sm:shrink-0 sm:justify-end">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sub-text">
                <CalendarClock size={13} />
                {formatDueLabel(review)}
            </span>
        </div>
    </article>
);

const ReviewError: React.FC<{ error: unknown; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-core-bg py-16 text-center shadow-neu-flat">
        <TriangleAlert className="text-amber-500" size={28} />
        <p className="text-sm font-bold text-sub-text">{getErrorMessage(error)}</p>
        <Button variant="secondary" size="sm" leftIcon={<RotateCcw size={14} />} onClick={onRetry}>
            Réessayer
        </Button>
    </div>
);

const ReviewSkeleton: React.FC = () => (
    <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-2xl bg-container-bg" />
            <div className="h-4 w-44 animate-pulse rounded bg-main-text/10" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
                <div className="h-32 animate-pulse rounded-3xl bg-container-bg" />
                <div className="h-96 animate-pulse rounded-3xl bg-container-bg" />
            </div>
            <div className="mx-auto h-72 w-full animate-pulse rounded-3xl bg-container-bg" />
        </div>
    </div>
);

export const ReviewPage: React.FC = () => {
    const {
        data: todayReviews,
        isPending,
        isError,
        error,
        refetch: refetchReviews,
    } = useReviewToday();

    const conceptIds = useMemo(
        () => Array.from(new Set(todayReviews?.map((review) => review.conceptId) ?? [])),
        [todayReviews]
    );
    const activities = useReviewActivities(conceptIds);

    const dueReviews: ReviewItem[] = useMemo(
        () => todayReviews?.map((review) => ({ ...review, activity: activities.get(review.conceptId) })) ?? [],
        [todayReviews, activities]
    );

    const [phase, setPhase] = useState<Phase>('idle');
    const [currentItem, setCurrentItem] = useState<ReviewDueResponse | null>(null);
    const [sessionTotal, setSessionTotal] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [justCompleted, setJustCompleted] = useState<string | null>(null);
    const [advancing, setAdvancing] = useState(false);

    const startSession = () => {
        if (dueReviews.length === 0) return;
        setPhase('running');
        setSessionTotal(dueReviews.length);
        setCompletedCount(0);
        setJustCompleted(null);
        setCurrentItem(dueReviews[0]);
    };

    const handleActivityCompleted = (item: ReviewDueResponse) => {
        setCompletedCount((count) => count + 1);
        setJustCompleted(item.conceptName);
        void refetchReviews();
    };

    const goNext = async () => {
        if (!currentItem) return;
        setAdvancing(true);
        try {
            const { data: freshReviews } = await refetchReviews();
            const next =
                (freshReviews ?? []).find((review) => review.conceptId !== currentItem.conceptId) ?? null;
            if (next) {
                setCurrentItem(next);
                setJustCompleted(null);
            } else {
                setPhase('idle');
                setCurrentItem(null);
                setJustCompleted(null);
            }
        } finally {
            setAdvancing(false);
        }
    };

    const endSession = () => {
        setPhase('idle');
        setCurrentItem(null);
        setJustCompleted(null);
        void refetchReviews();
    };

    const currentActivity = currentItem ? activities.get(currentItem.conceptId) : undefined;
    const hasNext = dueReviews.some((review) => review.conceptId !== currentItem?.conceptId);

    const railTotal = phase === 'running' ? sessionTotal : dueReviews.length;
    const railDone = phase === 'running' ? completedCount : 0;
    const railRemaining = Math.max(0, railTotal - railDone);

    if (isPending) {
        return <ReviewSkeleton />;
    }

    if (isError && !todayReviews) {
        return <ReviewError error={error} onRetry={() => void refetchReviews()} />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-container-bg text-secondary shadow-neu-flat-sm">
                        <BrainCircuit size={20} />
                    </div>
                    {todayReviews && todayReviews.length > 0 && (
                        <p className="text-xs text-sub-text">{buildSummary(todayReviews)}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                    {phase === 'running' && currentItem ? (
                        <NeumorphicCard variant="flat" className="flex flex-col gap-5 rounded-3xl">
                            <div className="flex items-center justify-between gap-4 border-b border-main-text/10 pb-3">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                                    <BrainCircuit size={16} className="text-secondary" />
                                    Session de révision
                                </h3>
                                <span className="text-[11px] text-sub-text">
                                    {completedCount} / {sessionTotal} terminées
                                </span>
                            </div>

                            {justCompleted && (
                                <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-core-bg p-4 shadow-neu-pressed-sm">
                                    <Badge variant="success" size="sm" leftIcon={<CheckCircle2 size={13} />}>
                                        Révision terminée
                                    </Badge>
                                    <p className="text-xs text-sub-text">
                                        « {justCompleted} » a été révisé. Bien joué !
                                    </p>
                                </div>
                            )}

                            {currentActivity === undefined ? (
                                <div className="h-48 animate-pulse rounded-2xl bg-container-bg" />
                            ) : currentActivity === 'QUIZ' ? (
                                <QuizActivity
                                    key={`${currentItem.conceptId}-quiz`}
                                    courseId={currentItem.courseId}
                                    conceptId={currentItem.conceptId}
                                    conceptName={currentItem.conceptName}
                                    autoGenerate
                                    onCompleted={() => handleActivityCompleted(currentItem)}
                                />
                            ) : (
                                <FeynmanActivity
                                    key={`${currentItem.conceptId}-feynman`}
                                    courseId={currentItem.courseId}
                                    conceptId={currentItem.conceptId}
                                    conceptName={currentItem.conceptName}
                                    onCompleted={() => handleActivityCompleted(currentItem)}
                                />
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-main-text/10 pt-4">
                                <p className="text-[11px] text-sub-text">
                                    {completedCount} sur {sessionTotal} révisions terminées.
                                </p>
                                <div className="flex items-center gap-3">
                                    {hasNext && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            loading={advancing}
                                            onClick={() => {
                                                void goNext();
                                            }}
                                        >
                                            Activité suivante
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="sm" disabled={advancing} onClick={endSession}>
                                        Terminer la session
                                    </Button>
                                </div>
                            </div>
                        </NeumorphicCard>
                    ) : dueReviews.length === 0 ? (
                        <NeumorphicCard variant="flat" className="rounded-3xl">
                            <div className="flex h-75 flex-col items-center justify-center gap-4 rounded-2xl bg-core-bg p-4 text-sm text-sub-text shadow-neu-pressed-sm">
                                <span className="text-6xl font-bold">:)</span>
                                <p className="w-80 text-center font-semibold">
                                    Rien à réviser aujourd'hui : revenez dès qu'une révision sera programmée.
                                </p>
                            </div>
                        </NeumorphicCard>
                    ) : (
                        <>
                            <NeumorphicCard
                                variant="convex"
                                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black tracking-tight text-main-text">
                                        Votre session de révision
                                    </h2>
                                    <p className="text-xs text-sub-text">
                                        <span className="font-bold text-secondary">
                                            {dueReviews.length} {dueReviews.length > 1 ? 'activités' : 'activité'}
                                        </span>{' '}
                                        à réviser aujourd'hui.
                                    </p>
                                </div>
                                <Button
                                    variant="generate"
                                    isGlowing
                                    leftIcon={<PlayCircle size={16} />}
                                    onClick={startSession}
                                >
                                    Démarrer les révisions
                                </Button>
                            </NeumorphicCard>

                            <NeumorphicCard variant="flat" className="flex flex-col gap-4 rounded-3xl">
                                <div className="flex items-center justify-between gap-4 border-b border-main-text/10 pb-3">
                                    <h3 className="flex items-center gap-2 text-base font-bold text-main-text">
                                        <BrainCircuit size={18} className="text-secondary" /> Révisions du jour
                                    </h3>
                                    <span className="text-xs font-medium text-sub-text">
                                        {dueReviews.length}{' '}
                                        {dueReviews.length > 1 ? 'activités restantes' : 'activité restante'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {dueReviews.map((review) => (
                                        <ReviewRow key={review.conceptId} review={review} />
                                    ))}
                                </div>
                            </NeumorphicCard>
                        </>
                    )}
                </div>

                <aside className="flex flex-col gap-6">
                    <NeumorphicCard variant="flat" className="flex flex-col items-center gap-5 p-6">
                        <ProgressBar
                            variant="circular"
                            size={150}
                            value={railDone}
                            max={railTotal > 0 ? railTotal : 1}
                            label="Session du jour"
                            subLabel={`${railDone} / ${railTotal}`}
                            caption="révisées"
                        />
                        <dl className="grid w-full grid-cols-3 gap-2 text-center">
                            <div className="space-y-0.5">
                                <dd className="text-lg font-black tabular-nums text-main-text">{railTotal}</dd>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-sub-text">
                                    Programmées
                                </dt>
                            </div>
                            <div className="space-y-0.5">
                                <dd className="text-lg font-black tabular-nums text-main-text">{railDone}</dd>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-sub-text">
                                    Terminées
                                </dt>
                            </div>
                            <div className="space-y-0.5">
                                <dd className="text-lg font-black tabular-nums text-main-text">{railRemaining}</dd>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-sub-text">
                                    Restantes
                                </dt>
                            </div>
                        </dl>
                    </NeumorphicCard>
                </aside>
            </div>
        </div>
    );
};
