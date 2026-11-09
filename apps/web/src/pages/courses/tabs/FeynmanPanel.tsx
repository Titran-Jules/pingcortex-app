import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, NeumorphicCard, ProgressBar, toast } from '@pingcortex/ui';
import { Edit3, Sparkles, TriangleAlert } from 'lucide-react';
import type { ConceptResponse, FeynmanSubmissionResponse } from '@pingcortex/shared-types';
import { api } from '../../../api/api';
import { getErrorMessage } from '../../../errors/getErrorMessage';
import { ConceptPicker } from '../components/ConceptPicker';
import { MiniMeterBar } from '../components/MiniMeterBar';

const MIN_LENGTH = 20;

const EvaluationBlock: React.FC<{ submission: FeynmanSubmissionResponse }> = ({ submission }) => (
    <section className="flex flex-col gap-4 rounded-2xl bg-core-bg p-5 shadow-neu-pressed-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="shrink-0">
                <ProgressBar variant="circular" size={130} value={submission.score} caption="Score" />
            </div>

            <div className="flex flex-1 flex-col gap-3">
                {submission.aiEvaluation.criteria.map((criterion) => (
                    <div key={criterion.name} className="space-y-1">
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="text-xs font-bold text-main-text">{criterion.name}</span>
                            <span className="text-xs font-black tabular-nums text-main-text">
                                {criterion.score}/100
                            </span>
                        </div>
                        <MiniMeterBar value={criterion.score} ariaLabel={`Critère : ${criterion.name}`} />
                        <p className="text-[11px] leading-relaxed text-sub-text">{criterion.comment}</p>
                    </div>
                ))}
            </div>
        </div>

        {submission.aiEvaluation.misconceptions.length > 0 && (
            <div className="flex flex-col gap-2 rounded-2xl bg-core-bg p-4 shadow-neu-pressed-sm">
                <h4 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <TriangleAlert size={16} className="text-amber-500" />
                    Idées reçues relevées
                </h4>
                <ul className="list-disc space-y-1.5 pl-5 text-xs text-sub-text">
                    {submission.aiEvaluation.misconceptions.map((misconception) => (
                        <li key={misconception}>{misconception}</li>
                    ))}
                </ul>
            </div>
        )}

        <div className="rounded-2xl bg-core-bg p-4 shadow-neu-pressed-sm">
            <p className="text-sm italic text-main-text">{submission.aiEvaluation.overallFeedback}</p>
            <p className="mt-1 text-[11px] font-medium text-sub-text">— PingCortex AI</p>
        </div>
    </section>
);

export const FeynmanPanel: React.FC<{ courseId: string; concepts: ConceptResponse[] }> = ({ concepts }) => {
    const [conceptId, setConceptId] = useState<string | null>(null);
    const [explanationText, setExplanationText] = useState('');
    const [submission, setSubmission] = useState<FeynmanSubmissionResponse | null>(null);

    const submit = useMutation({
        mutationFn: () => {
            if (!conceptId) {
                return Promise.reject(new Error('Sélectionnez un concept.'));
            }
            return api.feynman.submitFeynmanExplanation(conceptId, {
                explanationText: explanationText.trim(),
            });
        },
        onSuccess: (evaluation) => {
            setSubmission(evaluation);
            setExplanationText('');
            toast.success('Tentative Feynman évaluée', {
                description: 'Analysez le retour de PingCortex puis refaites une tentative pour progresser.',
            });
        },
        onError: (mutationError) =>
            toast.error('Évaluation impossible', { description: getErrorMessage(mutationError) }),
    });

    const selectedConcept = concepts.find((concept) => concept.id === conceptId) ?? null;
    const canSubmit =
        conceptId !== null && explanationText.trim().length >= MIN_LENGTH && explanationText.trim().length <= 4000;

    return (
        <NeumorphicCard variant="flat" className="flex flex-col gap-5 rounded-3xl">
            <div className="flex items-center justify-between gap-4 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <Edit3 size={16} className="text-secondary" />
                    Tentative Feynman
                </h3>
                <span className="text-[11px] text-sub-text">
                    Expliquez avec vos mots · l'IA évalue la compréhension
                </span>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <span className="ml-1 text-sm font-medium text-sub-text">Choisissez un concept</span>
                    <ConceptPicker
                        concepts={concepts}
                        value={conceptId}
                        onChange={(id) => {
                            setConceptId(id);
                            setSubmission(null);
                        }}
                        disabled={submit.isPending}
                    />
                </div>
                <p className="text-[11px] text-sub-text">
                    {selectedConcept
                        ? `Expliquez « ${selectedConcept.name} » de mémoire, sans consulter le support.`
                        : 'Sélectionnez un concept pour démarrer votre tentative Feynman.'}
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <textarea
                    value={explanationText}
                    onChange={(event) => setExplanationText(event.target.value)}
                    placeholder="Expliquez le concept comme si vous l'appreniez à un camarade : vos mots, vos exemples, vos étapes…"
                    rows={6}
                    readOnly={submit.isPending}
                    aria-label="Explication Feynman du concept"
                    className="w-full min-h-40 resize-none rounded-2xl bg-core-bg px-4 py-3 text-sm text-main-text shadow-neu-pressed placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-secondary/50 read-only:opacity-60"
                />
                <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-sub-text">
                        Au moins {MIN_LENGTH} caractères · évaluation IA immédiate.
                    </p>
                    <Button
                        variant="generate"
                        isGlowing
                        size="sm"
                        leftIcon={<Sparkles size={14} />}
                        loading={submit.isPending}
                        disabled={!canSubmit}
                        onClick={() => submit.mutate()}
                    >
                        Soumettre
                    </Button>
                </div>
            </div>

            {submit.isPending && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-core-bg py-10 shadow-neu-pressed-sm text-center">
                    <p className="text-6xl font-bold text-sub-text">…</p>
                    <p className="text-sm font-bold text-main-text">Évaluation Feynman en cours</p>
                    <p className="max-w-sm text-xs text-sub-text">
                        PingCortex analyse la cohérence, la précision et la clarté de votre explication.
                    </p>
                </div>
            )}

            {!submit.isPending && submission && <EvaluationBlock submission={submission} />}
        </NeumorphicCard>
    );
};
