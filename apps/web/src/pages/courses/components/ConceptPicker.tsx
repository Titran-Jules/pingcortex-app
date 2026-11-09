import type { ConceptResponse } from '@pingcortex/shared-types';
import { cn } from '@pingcortex/ui';

export interface ConceptPickerProps {
    concepts: ConceptResponse[];
    value: string | null;
    onChange: (conceptId: string) => void;
    disabled?: boolean;
}

export const ConceptPicker = ({ concepts, value, onChange, disabled = false }: ConceptPickerProps) => (
    <div role="group" aria-label="Choix d'un concept" className="flex flex-wrap gap-2">
        {concepts.map((concept) => {
            const isActive = concept.id === value;
            return (
                <button
                    key={concept.id}
                    type="button"
                    aria-pressed={isActive}
                    disabled={disabled}
                    onClick={() => onChange(concept.id)}
                    className={cn(
                        'rounded-neu-sm px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong',
                        'disabled:pointer-events-none disabled:opacity-50',
                        isActive
                            ? 'bg-secondary text-on-secondary shadow-glow-secondary'
                            : 'bg-core-bg text-sub-text shadow-neu-flat-sm hover:text-main-text'
                    )}
                >
                    {concept.name}
                </button>
            );
        })}
    </div>
);
