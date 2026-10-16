import { useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './Button';

const MAX_HEIGHT = 200;

const DEFAULT_SUGGESTIONS = [
    'Fais-moi un QCM sur ce concept',
    'Résume ce cours en 5 points',
    'Crée des flashcards',
];

export interface PromptInputProps {
    onSubmit: (prompt: string) => void;
    loading?: boolean;
    placeholder?: string;
    suggestions?: string[];
    className?: string;
}

export const PromptInput = ({
    onSubmit,
    loading = false,
    placeholder = 'Posez une question sur votre cours ou demandez des flashcards…',
    suggestions = DEFAULT_SUGGESTIONS,
    className,
}: PromptInputProps) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hintId = useId();

    const canSubmit = value.trim().length > 0 && !loading;
    const showSuggestions = suggestions.length > 0 && value.length === 0 && !loading;

    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    }, [value]);

    const submit = () => {
        if (!canSubmit) return;
        onSubmit(value.trim());
        setValue('');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        submit();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
        }
    };

    const pickSuggestion = (text: string) => {
        setValue(text);
        textareaRef.current?.focus();
    };

    return (
        <form
            onSubmit={handleSubmit}
            aria-label="Poser une question à PingCortex AI"
            className={cn(
                'flex w-full flex-col gap-3 rounded-3xl border border-main-text/10 bg-core-bg p-4',
                className
            )}
        >
            {showSuggestions && (
                <div role="group" aria-label="Suggestions" className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => pickSuggestion(suggestion)}
                            className="rounded-full bg-core-bg px-3.5 py-1.5 text-xs font-medium text-sub-text shadow-neu-flat transition-shadow hover:text-main-text active:shadow-neu-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-3">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    readOnly={loading}
                    rows={1}
                    aria-label="Votre question ou votre demande"
                    aria-describedby={hintId}
                    aria-busy={loading}
                    style={{ maxHeight: MAX_HEIGHT }}
                    className={cn(
                        'min-h-12 w-full flex-1 resize-none overflow-y-auto rounded-2xl bg-core-bg px-4 py-3 text-sm text-main-text',
                        'shadow-neu-pressed placeholder:text-sub-text',
                        'focus:outline-none focus:ring-2 focus:ring-secondary/50',
                        'read-only:opacity-60'
                    )}
                />

                <Button
                    type="submit"
                    variant="generate"
                    isGlowing
                    loading={loading}
                    disabled={!canSubmit}
                    leftIcon={<Sparkles size={16} aria-hidden="true" />}
                    className="shrink-0"
                >
                    Générer
                </Button>
            </div>

            <p id={hintId} className="hidden px-1 text-xs text-sub-text sm:block">
                Entrée pour envoyer, Maj+Entrée pour passer à la ligne.
            </p>
        </form>
    );
};