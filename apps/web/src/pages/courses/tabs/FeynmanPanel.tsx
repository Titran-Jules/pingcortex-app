import React, { useState } from 'react';
import { NeumorphicCard } from '@pingcortex/ui';
import { Edit3 } from 'lucide-react';
import type { ConceptResponse } from '@pingcortex/shared-types';
import { ConceptPicker } from '../components/ConceptPicker';
import { FeynmanActivity } from '../components/FeynmanActivity';

export const FeynmanPanel: React.FC<{ courseId: string; concepts: ConceptResponse[] }> = ({ courseId, concepts }) => {
    const [conceptId, setConceptId] = useState<string | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    const selectedConcept = concepts.find((concept) => concept.id === conceptId) ?? null;

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

            <div className="flex flex-col gap-2">
                <span className="ml-1 text-sm font-medium text-sub-text">Choisissez un concept</span>
                <ConceptPicker
                    concepts={concepts}
                    value={conceptId}
                    onChange={(id) => setConceptId(id)}
                    disabled={isBusy}
                />
            </div>

            <FeynmanActivity
                key={conceptId ?? 'feynman'}
                courseId={courseId}
                conceptId={conceptId}
                conceptName={selectedConcept?.name}
                onPendingChange={setIsBusy}
            />
        </NeumorphicCard>
    );
};
