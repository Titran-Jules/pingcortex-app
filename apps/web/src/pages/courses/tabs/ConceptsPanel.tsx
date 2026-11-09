import React from 'react';
import { Badge, Button, NeumorphicCard, toast } from '@pingcortex/ui';
import { BrainCircuit, CircleHelp, RotateCcw, TriangleAlert } from 'lucide-react';
import type { ConceptResponse, CoverageStatus } from '@pingcortex/shared-types';
import {
    useAdvanceConceptCoverage,
    useConfirmConceptCoverage,
    useCourseConcepts,
    useRevertConceptCoverage,
} from '../../../hooks/queries/useCourseConcepts';
import { getErrorMessage } from '../../../errors/getErrorMessage';
import { MiniMeterBar } from '../components/MiniMeterBar';

const COVERAGE_BADGES: Record<CoverageStatus, { label: string; variant: 'neutral' | 'warning' | 'success' }> = {
    NOT_COVERED: { label: 'À couvrir', variant: 'neutral' },
    ANTICIPATED_COVERED: { label: 'Couverture anticipée', variant: 'warning' },
    COVERED: { label: 'Couvert', variant: 'success' },
};

const MutationError = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => (
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

const MasteryLabel: React.FC<{ mastery: number | null }> = ({ mastery }) => {
    if (mastery === null) {
        return (
            <div className="flex h-10 items-center text-[11px] text-sub-text" title="Maîtrise inconnue">
                <span className="text-xs font-black tabular-nums text-sub-text">–</span>
            </div>
        );
    }
    const clamped = Math.min(Math.max(mastery, 0), 100);
    return (
        <div className="flex items-center gap-2" title={`Maîtrise : ${clamped} %`}>
            <MiniMeterBar value={clamped} ariaLabel={`Maîtrise de ${clamped} %`} className="w-24" />
        </div>
    );
};

const ConceptRow: React.FC<{
    concept: ConceptResponse;
    isBusy: boolean;
    onAdvance: (concept: ConceptResponse) => void;
    onConfirm: (concept: ConceptResponse) => void;
    onRevert: (concept: ConceptResponse) => void;
}> = ({ concept, isBusy, onAdvance, onConfirm, onRevert }) => {
    const { variant, label } = COVERAGE_BADGES[concept.coverageStatus];
    return (
        <article className="flex flex-col gap-3 rounded-2xl bg-core-bg p-5 shadow-neu-pressed-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 sm:min-w-0 sm:flex-1">
                <div className="flex items-center gap-2">
                    <Badge variant={variant} size="sm">
                        {label}
                    </Badge>
                </div>
                <h4 className="text-sm font-bold leading-snug text-main-text">{concept.name}</h4>
                {concept.description && (
                    <p className="line-clamp-2 text-xs text-sub-text">{concept.description}</p>
                )}
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
                <MasteryLabel mastery={concept.masteryLevel} />
                <div className="flex items-center justify-end gap-2">
                    {concept.coverageStatus === 'NOT_COVERED' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => onAdvance(concept)}
                            >
                                Anticiper la couverture
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => onConfirm(concept)}
                            >
                                Confirmer
                            </Button>
                        </>
                    )}
                    {concept.coverageStatus === 'ANTICIPATED_COVERED' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => onRevert(concept)}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => onConfirm(concept)}
                            >
                                Confirmer
                            </Button>
                        </>
                    )}
                    {concept.coverageStatus === 'COVERED' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => onRevert(concept)}
                        >
                            Annuler la couverture
                        </Button>
                    )}
                </div>
            </div>
        </article>
    );
};

export const ConceptsPanel: React.FC<{ courseId: string }> = ({ courseId }) => {
    const { data: concepts, isPending, isError, error, refetch } = useCourseConcepts(courseId);
    const confirm = useConfirmConceptCoverage(courseId);
    const advance = useAdvanceConceptCoverage(courseId);
    const revert = useRevertConceptCoverage(courseId);

    const isBusy = confirm.isPending || advance.isPending || revert.isPending;

    const runMutation = (act: 'confirm' | 'advance' | 'revert', concept: ConceptResponse) =>
        act === 'confirm'
            ? confirm.mutate(concept.id, {
                  onSuccess: () =>
                      toast.success('Concept couvert', {
                          description: 'Il intègre la rotation des révisions programmées.',
                      }),
                  onError: (mutationError) =>
                      toast.error('Couverture impossible', {
                          description: getErrorMessage(mutationError),
                      }),
              })
            : act === 'advance'
              ? advance.mutate(concept.id, {
                    onSuccess: () =>
                        toast.info('Couverture anticipée', {
                            description: 'Confirmez la couverture dès que la maîtrise est suffisante.',
                        }),
                    onError: (mutationError) =>
                        toast.error('Action impossible', { description: getErrorMessage(mutationError) }),
                })
              : revert.mutate(concept.id, {
                    onSuccess: () =>
                        toast.info('Couverture annulée', {
                            description: 'Ce concept sera de nouveau à couvrir.',
                        }),
                    onError: (mutationError) =>
                        toast.error('Action impossible', { description: getErrorMessage(mutationError) }),
                });

    const coveredCount = concepts?.filter((c) => c.coverageStatus === 'COVERED').length ?? 0;
    const anticipatedCount = concepts?.filter((c) => c.coverageStatus === 'ANTICIPATED_COVERED').length ?? 0;
    const notCoveredCount = concepts?.filter((c) => c.coverageStatus === 'NOT_COVERED').length ?? 0;

    return (
        <NeumorphicCard variant="flat" className="rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <BrainCircuit size={16} className="text-secondary" />
                    Concepts du cours
                    {concepts && (
                        <span className="text-xs font-medium text-sub-text">
                            · {concepts.length} {concepts.length > 1 ? 'concepts extraits' : 'concept extrait'}
                        </span>
                    )}
                </h3>
                <span className="text-[11px] font-medium tracking-wide text-sub-text">
                    {coveredCount} couverts · {anticipatedCount} anticipés · {notCoveredCount} à couvrir
                </span>
            </div>

            {isError && (
                <div className="pt-4">
                    <MutationError error={error} onRetry={() => refetch()} />
                </div>
            )}

            {isPending && !isError && (
                <div className="flex flex-col gap-3 pt-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-20 animate-pulse rounded-2xl bg-container-bg" />
                    ))}
                </div>
            )}

            {concepts && (
                <div className="flex flex-col gap-3 pt-4">
                    {concepts
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((concept) => (
                            <ConceptRow
                                key={concept.id}
                                concept={concept}
                                isBusy={isBusy}
                                onAdvance={(item) => runMutation('advance', item)}
                                onConfirm={(item) => runMutation('confirm', item)}
                                onRevert={(item) => runMutation('revert', item)}
                            />
                        ))}
                </div>
            )}

            <p className="flex items-start gap-2 pt-4 text-[11px] text-sub-text">
                <CircleHelp size={13} className="mt-0.5 shrink-0 text-sub-text" />
                Confirmer la couverture nécessite une maîtrise suffisante : gagnez la maîtrise via les quiz et les
                tentatives Feynman.
            </p>
        </NeumorphicCard>
    );
};
