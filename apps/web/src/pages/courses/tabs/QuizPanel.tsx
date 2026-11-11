import type React from 'react';
import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, NeumorphicCard, toast } from '@pingcortex/ui';
import { ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import type {
    ConceptResponse,
    Difficulty,
    QuizAttemptResponse,
    QuizQuestionResponse,
} from '@pingcortex/shared-types';
import type { Variants } from '@pingcortex/ui';
import { api } from '../../../api/api';
import { getErrorMessage } from '../../../errors/getErrorMessage';
import { ConceptPicker } from '../components/ConceptPicker';
import { MiniMeterBar } from '../components/MiniMeterBar';
import { queryKeys } from '../../../lib/queryKeys';

const DIFFICULTY_BADGES: Record<Difficulty, { label: string; variant: Variants }> = {
    EASY: { label: 'Facile', variant: 'success' },
    MEDIUM: { label: 'Moyen', variant: 'warning' },
    HARD: { label: 'Difficile', variant: 'danger' },
};

const QuestionBlock: React.FC<{
    question: QuizQuestionResponse;
    result: QuizAttemptResponse | null;
    selectedOptionId: string | null;
    isSubmitting: boolean;
    onSelectOption: (optionId: string) => void;
}> = ({ question, result, selectedOptionId, isSubmitting, onSelectOption }) => {
    const { variant, label } = DIFFICULTY_BADGES[question.difficulty];

    return (
        <section className="flex flex-col gap-4 rounded-2xl bg-core-bg p-5 shadow-neu-pressed-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant={variant} size="sm">
                    {label}
                </Badge>
                <span className="text-[10px] font-bold uppercase tracking-wide text-sub-text">Question générée</span>
            </div>

            <p className="text-base leading-snug font-bold text-main-text">{question.questionText}</p>

            <div className="flex flex-col gap-3">
                {question.options.map((option) => {
                    if (result) {
                        const isCorrection = option.id === result.correctionOptionId;
                        const isUserPick = option.id === selectedOptionId;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                disabled
                                className={
                                        'rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ' +
                                        (isCorrection
                                            ? 'bg-success/10 text-success ring-2 ring-success/50'
                                            : isUserPick
                                              ? 'bg-danger/10 text-danger ring-2 ring-danger/50'
                                              : 'bg-core-bg opacity-50 shadow-neu-flat-sm')
                                    }
                            >
                                {option.text}
                            </button>
                        );
                    }
                    return (
                        <button
                            key={option.id}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => onSelectOption(option.id)}
                            className={
                                'rounded-2xl bg-core-bg px-4 py-3 text-left text-sm font-medium text-main-text transition-all ' +
                                'shadow-neu-flat-sm hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong active:shadow-neu-pressed-sm ' +
                                (isSubmitting ? 'pointer-events-none opacity-60' : '')
                            }
                        >
                            {option.text}
                        </button>
                    );
                })}
            </div>

            {result && (
                <div className="flex flex-col gap-3 border-t border-main-text/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1.5">
                        <Badge variant={result.isCorrect ? 'success' : 'danger'} size="sm">
                            {result.isCorrect ? 'Bonne réponse' : 'Réponse incorrecte'}
                        </Badge>
                        <span className="text-[11px] text-sub-text">
                            Maîtrise mise à jour : {result.newMastery} %
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MiniMeterBar
                            value={result.newMastery}
                            ariaLabel={`Nouvelle maîtrise : ${result.newMastery} %`}
                            className="w-32"
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export const QuizPanel: React.FC<{ courseId: string; concepts: ConceptResponse[] }> = ({ courseId, concepts }) => {
    const [conceptId, setConceptId] = useState<string | null>(null);
    const [question, setQuestion] = useState<QuizQuestionResponse | null>(null);
    const [result, setResult] = useState<QuizAttemptResponse | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const generate = useMutation({
        mutationFn: () => {
            if (!conceptId) {
                return Promise.reject(new Error('Sélectionnez un concept.'));
            }
            return api.quiz.getQuizQuestion(conceptId);
        },
        onSuccess: (generatedQuestion) => {
            setQuestion(generatedQuestion);
            setResult(null);
            setSelectedOptionId(null);
        },
        onError: (mutationError) =>
            toast.error('Génération impossible', { description: getErrorMessage(mutationError) }),
    });

    const answer = useMutation({
        mutationFn: (optionId: string) =>
            api.quiz.submitAnswer(question?.id as string, { selectedOptionId: optionId }),
        onSuccess: (attempt, optionId) => {
            const key = queryKeys.courses.concepts(courseId ?? '');
            setResult(attempt);
            setSelectedOptionId(optionId);
            queryClient.setQueryData<ConceptResponse[]>(key, (oldConcepts) => {
                if (!oldConcepts) return oldConcepts;
                return oldConcepts.map((concept) => {
                    if (concept.id === conceptId) {
                        return { ...concept, mastery: attempt.newMastery };
                    }
                    return concept;
                });
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.progress });
            queryClient.invalidateQueries({ queryKey: queryKeys.reviews.today });
            if (conceptId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.reviews.activity(conceptId) });
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.usage.summary });
        },
        onError: (mutationError) =>
            toast.error('Évaluation impossible', { description: getErrorMessage(mutationError) }),
    });

    const generateQuestion = useCallback(() => {
        if (!conceptId) return;
        generate.mutate();
    }, [conceptId, generate]);

    const selectedConcept = concepts.find((concept) => concept.id === conceptId) ?? null;

    return (
        <NeumorphicCard variant="flat" className="flex flex-col gap-5 rounded-3xl">
            <div className="flex items-center justify-between gap-4 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <HelpCircle size={16} className="text-primary" />
                    Quiz sur le cours
                </h3>
                <span className="text-[11px] text-sub-text">Un concept à la fois · la réponse ajuste la maîtrise</span>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <span className="ml-1 text-sm font-medium text-sub-text">Choisissez un concept</span>
                    <ConceptPicker
                        concepts={concepts}
                        value={conceptId}
                        onChange={(id) => {
                            setConceptId(id);
                            setQuestion(null);
                            setResult(null);
                            setSelectedOptionId(null);
                        }}
                        disabled={generate.isPending || answer.isPending}
                    />
                </div>
                <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-sub-text">
                        {selectedConcept
                            ? `Cible : ${selectedConcept.name}`
                            : 'Sélectionnez un concept pour générer un quiz adapté.'}
                    </p>
                    <Button
                        variant="generate"
                        isGlowing
                        size="sm"
                        leftIcon={<Sparkles size={14} />}
                        loading={generate.isPending}
                        disabled={!conceptId}
                        onClick={generateQuestion}
                    >
                        {question ? 'Nouvelle question' : 'Générer le quiz'}
                    </Button>
                </div>
            </div>

            {generate.isPending && (
                <div className="flex flex-col gap-3 rounded-2xl bg-core-bg p-5 shadow-neu-pressed-sm">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-main-text/10" />
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-12 animate-pulse rounded-2xl bg-main-text/10" />
                    ))}
                </div>
            )}

            {!generate.isPending && question && (
                <QuestionBlock
                    question={question}
                    result={result}
                    selectedOptionId={selectedOptionId}
                    isSubmitting={answer.isPending}
                    onSelectOption={(optionId) => answer.mutate(optionId)}
                />
            )}

            {!question && !generate.isPending && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-core-bg py-8 shadow-neu-pressed-sm text-center">
                    <ArrowRight size={22} className="text-sub-text" />
                    <p className="text-sm font-bold text-main-text">Prêt pour votre premier quiz ?</p>
                    <p className="max-w-sm text-xs text-sub-text">
                        Choisissez un concept ci-dessus puis générez le quiz : chaque réponse ajuste votre maîtrise du
                        concept.
                    </p>
                </div>
            )}
        </NeumorphicCard>
    );
};
