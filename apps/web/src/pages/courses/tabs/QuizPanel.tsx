import React, { useState } from 'react';
import { NeumorphicCard } from '@pingcortex/ui';
import { HelpCircle } from 'lucide-react';
import type { ConceptResponse } from '@pingcortex/shared-types';
import { ConceptPicker } from '../components/ConceptPicker';
import { QuizActivity } from '../components/QuizActivity';

export const QuizPanel: React.FC<{ courseId: string; concepts: ConceptResponse[] }> = ({ courseId, concepts }) => {
    const [conceptId, setConceptId] = useState<string | null>(null);
    const [isBusy, setIsBusy] = useState(false);

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

            <div className="flex flex-col gap-2">
                <span className="ml-1 text-sm font-medium text-sub-text">Choisissez un concept</span>
                <ConceptPicker
                    concepts={concepts}
                    value={conceptId}
                    onChange={(id) => setConceptId(id)}
                    disabled={isBusy}
                />
            </div>

            <QuizActivity
                key={conceptId ?? 'quiz'}
                courseId={courseId}
                conceptId={conceptId}
                conceptName={selectedConcept?.name}
                onPendingChange={setIsBusy}
            />
        </NeumorphicCard>
    );
};
