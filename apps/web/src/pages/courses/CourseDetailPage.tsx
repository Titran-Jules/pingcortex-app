import React, { useState } from 'react';
import { getApiError } from '@pingcortex/api-client';
import { AnalysisStatusBadge, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger, toast } from '@pingcortex/ui';
import {
    BrainCircuit,
    BookOpen,
    ChevronLeft,
    Edit3,
    HelpCircle,
    MessageSquare,
    RefreshCcw,
    RotateCcw,
    TriangleAlert,
} from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import { useCourseMaterials } from '../../hooks/queries/useCourseMaterials';
import { useCourseConcepts } from '../../hooks/queries/useCourseConcepts';
import { useCourse } from '../../hooks/queries/useCourse';
import { useRerunAnalysis } from '../../hooks/queries/useCourses';
import { CourseNotFoundView } from '../../errors/CourseNotFoundView';
import { getErrorMessage } from '../../errors/getErrorMessage';
import { isUuid } from '../../lib/uuid';
import { MaterialsPanel } from './tabs/MaterialsPanel';
import { ConceptsPanel } from './tabs/ConceptsPanel';
import { QuizPanel } from './tabs/QuizPanel';
import { FeynmanPanel } from './tabs/FeynmanPanel';
import { ChatPanel } from './tabs/ChatPanel';

const CourseDetailSkeleton: React.FC = () => (
    <div className="flex flex-col gap-6">
        <div className="h-4 w-24 animate-pulse rounded bg-main-text/10" />
        <div className="flex flex-col gap-2">
            <div className="h-7 w-2/5 animate-pulse rounded bg-main-text/10" />
            <div className="h-4 w-3/5 animate-pulse rounded bg-main-text/10" />
        </div>
        <div className="h-14 animate-pulse rounded-2xl bg-container-bg" />
        <div className="h-10 w-72 animate-pulse rounded-2xl bg-container-bg" />
        <div className="h-64 animate-pulse rounded-3xl bg-container-bg" />
    </div>
);

const CourseDetailError: React.FC<{ error: unknown; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-core-bg py-16 text-center shadow-neu-flat">
        <TriangleAlert className="text-amber-500" size={28} />
        <p className="text-sm font-bold text-sub-text">{getErrorMessage(error)}</p>
        <Button variant="secondary" size="sm" leftIcon={<RotateCcw size={14} />} onClick={onRetry}>
            Réessayer
        </Button>
    </div>
);

export const CourseDetailPage: React.FC = () => {
    const routeParams = useParams();
    const courseId = routeParams['courseId'];
    const isValidId = isUuid(courseId);

    const { data: course, isPending, isError, error, refetch } = useCourse(isValidId ? courseId : undefined, isValidId);
    const rerunAnalysis = useRerunAnalysis();
    const [activeTab, setActiveTab] = useState<string>('materials');

    const isReady = course?.analysisStatus === 'READY';
    const { data: concepts } = useCourseConcepts(isReady ? courseId : undefined);
    const { data: materials } = useCourseMaterials(courseId);

    if (!isValidId) {
        return <CourseNotFoundView />;
    }

    const isNotFound = isError && getApiError(error).status === 404;
    if (isNotFound) {
        return <CourseNotFoundView />;
    }

    if (isPending) {
        return <CourseDetailSkeleton />;
    }

    if (isError) {
        return (
            <CourseDetailError
                error={error}
                onRetry={() => refetch()}
            />
        );
    }

    if (!course) {
        return <CourseNotFoundView />;
    }

    const handleRerun = () =>
        rerunAnalysis.mutate(course.id, {
            onSuccess: () =>
                toast.success('Analyse relancée', {
                    description: 'Les concepts seront recalculés dans une à deux minutes.',
                }),
            onError: (mutationError) =>
                toast.error('Relance impossible', { description: getErrorMessage(mutationError) }),
        });

    return (
        <div className="flex flex-col gap-6">
            <NavLink
                to="/courses"
                className="inline-flex w-fit items-center gap-1 rounded-neu-sm text-sm font-semibold text-sub-text transition-colors hover:text-main-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong"
            >
                <ChevronLeft size={16} aria-hidden="true" />
                Mes cours
            </NavLink>

            {(course.analysisStatus === 'PENDING' || course.analysisStatus === 'ANALYZING') && (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-core-bg px-4 py-3 shadow-neu-pressed-sm">
                    <AnalysisStatusBadge status={course.analysisStatus} size="sm" />
                    <p className="text-xs text-sub-text">
                        PingCortex analyse le cours pour en extraire les concepts. La page se met à jour
                        automatiquement.
                    </p>
                </div>
            )}

            {course.analysisStatus === 'FAILED' && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-core-bg px-4 py-3 shadow-neu-pressed-sm">
                    <div className="flex flex-col gap-1">
                        <AnalysisStatusBadge status="FAILED" size="sm" />
                        <p className="text-xs text-sub-text">
                            Vérifiez le contenu du support, puis relancez l'analyse pour extraire les concepts.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<RefreshCcw size={14} />}
                        loading={rerunAnalysis.isPending}
                        onClick={handleRerun}
                    >
                        Relancer l'analyse
                    </Button>
                </div>
            )}

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col"
            >
                <TabsList aria-label="Contenu du cours">
                    <TabsTrigger
                        value="materials"
                        icon={<BookOpen size={14} />}
                        badge={materials !== undefined && materials.length > 0 ? materials.length : undefined}
                    >
                        Supports
                    </TabsTrigger>
                    <TabsTrigger
                        value="concepts"
                        icon={<BrainCircuit size={14} />}
                        badge={isReady && concepts !== undefined && concepts.length > 0 ? concepts.length : undefined}
                        disabled={!isReady}
                    >
                        Concepts
                    </TabsTrigger>
                    <TabsTrigger value="quiz" icon={<HelpCircle size={14} />} disabled={!isReady}>
                        Quiz
                    </TabsTrigger>
                    <TabsTrigger value="feynman" icon={<Edit3 size={14} />} disabled={!isReady}>
                        Feynman
                    </TabsTrigger>
                    <TabsTrigger value="chat" icon={<MessageSquare size={14} />}>
                        Chat
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="materials">
                    <MaterialsPanel key={`materials-${course.id}`} courseId={course.id} />
                </TabsContent>
                <TabsContent value="concepts" keepMounted>
                    <ConceptsPanel key={`concepts-${course.id}`} courseId={course.id} />
                </TabsContent>
                <TabsContent value="quiz" keepMounted>
                    <QuizPanel
                        key={`quiz-${course.id}`}
                        courseId={course.id}
                        concepts={concepts ?? []}
                    />
                </TabsContent>
                <TabsContent value="feynman" keepMounted>
                    <FeynmanPanel
                        key={`feynman-${course.id}`}
                        courseId={course.id}
                        concepts={concepts ?? []}
                    />
                </TabsContent>
                <TabsContent value="chat" keepMounted>
                    <ChatPanel key={`chat-${course.id}`} courseId={course.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
