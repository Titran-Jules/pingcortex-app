import React from 'react';
import { Badge, Button, NeumorphicCard, ProgressBar, PromptInput } from '@pingcortex/ui';
import {
    BrainCircuit,
    CalendarClock,
    Edit3,
    HelpCircle,
    PlayCircle,
    Sparkles,
} from 'lucide-react';
import type { ActivityType } from '@pingcortex/shared-types';
import { MOCK_DASHBOARD_DATA, type DashboardReview } from './mockDashboardData';

const ACTIVITY_META: Record<ActivityType, { label: string; icon: React.ReactNode }> = {
    QUIZ: { label: 'Quiz', icon: <HelpCircle size={13} /> },
    FEYNMAN: { label: 'Feynman', icon: <Edit3 size={13} /> },
};

const ACTIVITY_VARIANT: Record<ActivityType, 'primary' | 'secondary'> = {
    QUIZ: 'primary',
    FEYNMAN: 'secondary',
};

const ACTIVITY_ACTION: Record<ActivityType, string> = {
    QUIZ: 'Répondre au quiz',
    FEYNMAN: 'Faire la tentative Feynman',
};

const ReviewCard: React.FC<{ review: DashboardReview }> = ({ review }) => {
    const { label, icon } = ACTIVITY_META[review.suggestedActivity];

    return (
        <article className="flex flex-col gap-3 rounded-2xl bg-core-bg p-4 shadow-neu-pressed-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <Badge variant={ACTIVITY_VARIANT[review.suggestedActivity]} size="sm" leftIcon={icon}>
                    {label}
                </Badge>
                <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-main-text leading-snug">{review.conceptName}</h4>
                    <p className="text-[11px] text-sub-text">{review.courseTitle}</p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end sm:shrink-0">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sub-text">
                    <CalendarClock size={13} />
                    Tous les {review.intervalDays} j
                </span>
                <Button variant="secondary" size="sm">
                    {ACTIVITY_ACTION[review.suggestedActivity]}
                </Button>
            </div>
        </article>
    );
};

export const DashboardPage: React.FC = () => {
    const { user, coursesProgress, todayReviews } = MOCK_DASHBOARD_DATA;

    const totalCourses = coursesProgress.length;
    const totalConcepts = coursesProgress.reduce(
        (total, course) => total + course.totalConcepts,
        0
    );
    const masteredConcepts = coursesProgress.reduce(
        (total, course) => total + course.masteredConcepts,
        0
    );
    const inProgressConcepts = coursesProgress.reduce(
        (total, course) => total + course.inProgressConcepts,
        0
    );
    const toCoverConcepts = Math.max(
        0,
        coursesProgress.reduce((total, course) => total + (course.totalConcepts - course.coveredConcepts), 0)
    );
    const globalMastery =
        totalConcepts > 0
            ? Math.round(
                  coursesProgress.reduce(
                      (total, course) => total + course.averageMastery * course.totalConcepts,
                      0
                  ) / totalConcepts
              )
            : 0;
    const dueReviewCount = todayReviews.length;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2 justify-between">
                <div className='flex flex-col gap-12'>
                    <NeumorphicCard variant="convex" className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black tracking-tight text-main-text">
                                Bon retour parmi, <span className="text-primary-strong">{user.firstName}</span>
                            </h2>
                            <p className="text-xs text-sub-text">
                                {dueReviewCount > 0 ? (
                                    <>
                                        <span className="font-bold text-secondary">{dueReviewCount} activités</span> à
                                        réviser aujourd'hui, sur {totalCourses} {totalCourses > 1 ? 'cours actifs' : 'cours actif'}.
                                    </>
                                ) : (
                                    <>Tout est à jour : aucune révision programmée aujourd'hui.</>
                                )}
                            </p>
                        </div>
                        <Button variant="generate" isGlowing leftIcon={<PlayCircle size={16} />}>
                            Démarrer les révisions
                        </Button>
                    </NeumorphicCard>

                    <NeumorphicCard variant="flat" className="flex flex-col gap-4 p-6">
                        <div className="flex items-center justify-between border-b border-main-text/10 pb-3">
                            <h3 className="flex items-center gap-2 text-base font-bold text-main-text">
                                <BrainCircuit size={18} className="text-secondary" /> Révisions du jour
                            </h3>
                            {dueReviewCount > 0 && (
                                <span className="text-xs font-medium text-sub-text">
                                    {dueReviewCount} {dueReviewCount > 1 ? 'activités restantes' : 'activité restante'}
                                </span>
                            )}
                        </div>

                        {dueReviewCount === 0 ? (
                            <p className="rounded-2xl bg-core-bg p-4 text-sm text-sub-text shadow-neu-pressed-sm">
                                Rien à réviser aujourd'hui : revenez dès qu'une rénovation sera programmée.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {todayReviews.map((review) => (
                                    <ReviewCard key={review.conceptId} review={review} />
                                ))}
                            </div>
                        )}
                    </NeumorphicCard>
                </div>

                <PromptInput
                    onSubmit={(val) => console.log('Prompt envoyé :', val)}
                    suggestions={[
                        'Fais-moi un quiz sur le dernier concept révisé',
                        'Résume mes révisions de la semaine',
                        'Propose-moi un exercice Feynman',
                    ]}
                    placeholder="Posez une question sur vos cours ou demandez l'activité suivante…"
                />
            </div>

            <aside className="flex flex-col gap-6">
                <NeumorphicCard variant="flat" className="flex flex-col gap-5 p-6">
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

                <NeumorphicCard variant="flat" className="flex flex-col gap-4 p-6">
                    <h3 className="flex items-center gap-2 border-b border-main-text/10 pb-3 text-sm font-bold text-main-text">
                        <Sparkles size={16} className="text-primary" /> Progression des cours
                    </h3>
                    <div className="flex flex-col gap-3 h-75 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1
                                    [&::-webkit-scrollbar-track]:bg-sub-text/10
                                    [&::-webkit-scrollbar-thumb]:bg-sub-text/40
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    hover:[&::-webkit-scrollbar-thumb]:bg-sub-text/50"
                    >
                        {coursesProgress.map((course) => (
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
