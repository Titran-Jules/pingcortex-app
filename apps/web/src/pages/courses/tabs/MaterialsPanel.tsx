import { useState } from 'react';
import type { Variants } from '@pingcortex/ui';
import { Badge, Button, Modal, NeumorphicCard, toast } from '@pingcortex/ui';
import { BookOpenCheck, FileText, RotateCcw, TriangleAlert } from 'lucide-react';
import type { ContentType, MaterialResponse } from '@pingcortex/shared-types';
import { useAddCourseMaterial, useCourseMaterials } from '../../../hooks/queries/useCourseMaterials';
import { getErrorMessage } from '../../../errors/getErrorMessage';
import { formatDate } from '../../../lib/format';

const MATERIAL_BADGES: Record<ContentType, { label: string; variant: Variants }> = {
    SUMMARY: { label: 'Résumé', variant: 'primary' },
    NOTES: { label: 'Notes', variant: 'secondary' },
    PDF: { label: 'PDF', variant: 'neutral' },
};

const MaterialRow: React.FC<{ material: MaterialResponse }> = ({ material }) => (
    <article className="flex flex-col gap-2 rounded-2xl bg-core-bg p-5 shadow-neu-pressed-sm">
        <div className="flex items-center justify-between gap-3">
            <Badge variant={MATERIAL_BADGES[material.type].variant} size="sm" leftIcon={<FileText size={12} />}>
                {MATERIAL_BADGES[material.type].label}
            </Badge>
            <span className="text-[11px] text-sub-text">{formatDate(material.createdAt)}</span>
        </div>
        <p className="line-clamp-3 text-sm whitespace-pre-line text-main-text">{material.content}</p>
    </article>
);

const EmptyMaterials: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <BookOpenCheck size={28} className="text-sub-text" />
        <p className="text-sm font-bold text-main-text">Aucun support pour le moment</p>
        <p className="max-w-sm text-sm text-sub-text">
            Collez le contenu ci-dessous : plus il est complet et précis, plus l'analyse IA extraira des concepts fiables.
        </p>
        <Button variant="generate" size="sm" onClick={onOpen}>
            Ajouter un support
        </Button>
    </div>
);

export const MaterialsPanel: React.FC<{ courseId: string }> = ({ courseId }) => {
    const { data: materials, isPending, isError, error, refetch } = useCourseMaterials(courseId);
    const addMaterial = useAddCourseMaterial(courseId);

    const [open, setOpen] = useState(false);
    const [type, setType] = useState<ContentType>('NOTES');
    const [content, setContent] = useState('');

    const canSubmit = content.trim().length > 0 && !addMaterial.isPending;

    const handleSubmit = () => {
        if (!canSubmit) return;
        addMaterial.mutate(
            { content: content.trim(), type },
            {
                onSuccess: () => {
                    toast.success('Support ajouté', {
                        description: "L'analyse IA en tiendra compte : l'extraction des concepts peut prendre une à deux minutes.",
                    });
                    setOpen(false);
                    setContent('');
                    setType('NOTES');
                },
                onError: (mutationError) =>
                    toast.error('Ajout impossible', { description: getErrorMessage(mutationError) }),
            }
        );
    };

    return (
        <NeumorphicCard variant="flat" className="rounded-3xl">
            <div className="flex items-center justify-between gap-4 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <FileText size={16} className="text-secondary" />
                    Supports du cours
                    {materials && materials.length > 0 && (
                        <span className="text-xs font-medium text-sub-text">
                            · {materials.length} {materials.length > 1 ? 'supports' : 'support'}
                        </span>
                    )}
                </h3>
                <Button variant="generate" size="sm" leftIcon={<FileText size={14} />} onClick={() => setOpen(true)}>
                    Ajouter un support
                </Button>
            </div>

            {isError && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-core-bg px-4 py-3 shadow-neu-pressed-sm">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-sub-text">
                        <TriangleAlert size={14} className="text-amber-500" />
                        {getErrorMessage(error)}
                    </span>
                    <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={13} />} onClick={() => refetch()}>
                        Réessayer
                    </Button>
                </div>
            )}

            {isPending && !isError && (
                <div className="flex flex-col gap-3 pt-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="h-24 animate-pulse rounded-2xl bg-container-bg" />
                    ))}
                </div>
            )}

            {materials && materials.length === 0 && !isPending && <EmptyMaterials onOpen={() => setOpen(true)} />}

            {materials && materials.length > 0 && (
                <div className="flex flex-col gap-3 pt-4">
                    {materials
                        .slice()
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .map((material) => (
                            <MaterialRow key={material.id} material={material} />
                        ))}
                </div>
            )}

            <Modal
                open={open}
                onOpenChange={setOpen}
                title="Ajouter un support"
                description="Collez la matière de cours. L'analyse peut prendre une à deux minutes."
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setOpen(false)} disabled={addMaterial.isPending}>
                            Annuler
                        </Button>
                        <Button
                            variant="generate"
                            isGlowing
                            loading={addMaterial.isPending}
                            disabled={!canSubmit}
                            onClick={handleSubmit}
                        >
                            Ajouter
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-5 pb-2">
                    <div className="flex flex-col gap-2">
                        <span className="ml-1 text-sm font-medium text-sub-text">Type de support</span>
                        <div role="group" aria-label="Type de support" className="flex flex-wrap gap-2">
                            {Object.entries(MATERIAL_BADGES).map(([value, config]) => (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={type === value}
                                    disabled={addMaterial.isPending}
                                    onClick={() => setType(value as ContentType)}
                                    className={
                                        type === value
                                            ? 'rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-on-secondary shadow-glow-secondary transition-all'
                                            : 'rounded-full bg-core-bg px-4 py-2 text-xs font-medium text-sub-text shadow-neu-flat-sm transition-all hover:text-main-text'
                                    }
                                >
                                    {config.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="material-content" className="ml-1 text-sm font-medium text-sub-text">
                            Contenu
                        </label>
                        <textarea
                            id="material-content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="Collez ici la matière du cours : notes de cours, résumé, transcription de cours, extrait de PDF…"
                            rows={8}
                            aria-disabled={addMaterial.isPending}
                            className="min-h-40 w-full resize-none rounded-2xl bg-core-bg px-4 py-3 text-sm text-main-text shadow-neu-pressed placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-secondary/50"
                        />
                    </div>
                </div>
            </Modal>
        </NeumorphicCard>
    );
};
