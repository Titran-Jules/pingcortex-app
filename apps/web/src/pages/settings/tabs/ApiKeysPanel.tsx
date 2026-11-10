import React, { useState } from 'react';
import { Badge, Button, Modal, NeumorphicCard, SoftInput, toast } from '@pingcortex/ui';
import { cn } from '@pingcortex/ui';
import {
    Bot,
    BrainCircuit,
    KeyRound,
    Plus,
    Power,
    RotateCcw,
    Sparkles,
    Trash2,
    TriangleAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ApiKeyResponse, Provider } from '@pingcortex/shared-types';
import { useAddApiKey, useApiKeys, useDeleteApiKey, useToggleApiKeyActive } from '../../../hooks/queries/useApiKeys';
import { getErrorMessage } from '../../../errors/getErrorMessage';
import { formatDate } from '../../../lib/format';

const PROVIDERS: Record<Provider, { label: string; icon: LucideIcon }> = {
    GEMINI: { label: 'Google Gemini', icon: Sparkles },
    ANTHROPIC: { label: 'Anthropic Claude', icon: BrainCircuit },
    OPENAI: { label: 'OpenAI', icon: Bot },
};

const NoActiveKeyNotice: React.FC = () => (
    <div className="flex items-center gap-3 rounded-2xl bg-core-bg px-4 py-3 shadow-neu-pressed-sm">
        <TriangleAlert size={16} className="shrink-0 text-amber-500" />
        <p className="text-xs font-semibold text-sub-text">
            Aucune clé API active : analyses de cours, quiz, tentatives Feynman et chat IA restent indisponibles
            jusqu'à l'activation d'une clé.
        </p>
    </div>
);

const KeyRow: React.FC<{
    apiKey: ApiKeyResponse;
    isBusy: boolean;
    onToggle: (apiKey: ApiKeyResponse) => void;
    onDelete: (apiKey: ApiKeyResponse) => void;
}> = ({ apiKey, isBusy, onToggle, onDelete }) => {
    const provider = PROVIDERS[apiKey.provider] ?? { label: 'Fournisseur IA', icon: KeyRound };
    const ProviderIcon = provider.icon;

    return (
        <article className="flex flex-col gap-3 rounded-2xl bg-core-bg p-5 shadow-neu-pressed-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3.5">
                <div
                    className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-container-bg text-secondary transition-all',
                        apiKey.isActive ? 'shadow-neu-flat-sm ring-2 ring-secondary/40' : 'shadow-neu-flat-sm'
                    )}
                >
                    <ProviderIcon size={18} />
                </div>
                <div className="min-w-0 space-y-0.5">
                    <h4 className="text-sm font-bold leading-snug text-main-text">{provider.label}</h4>
                    <p className="text-[11px] text-sub-text">Ajoutée le {formatDate(apiKey.createdAt)}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                <Badge variant={apiKey.isActive ? 'success' : 'neutral'} dot size="sm">
                    {apiKey.isActive ? 'Active' : 'En veille'}
                </Badge>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={apiKey.isActive}
                        aria-label={apiKey.isActive ? 'Mettre la clé en veille' : 'Activer cette clé'}
                        title={apiKey.isActive ? 'Mettre en veille' : 'Activer'}
                        disabled={isBusy}
                        onClick={() => onToggle(apiKey)}
                        className="flex items-center justify-center rounded-xl bg-core-bg p-2.5 text-sub-text shadow-neu-flat-sm transition-all active:scale-[0.98] active:shadow-neu-pressed-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong disabled:pointer-events-none disabled:opacity-60"
                    >
                        <Power size={14} className={cn(apiKey.isActive && 'text-success')} />
                    </button>
                    <button
                        type="button"
                        aria-label={`Supprimer la clé ${provider.label}`}
                        title="Supprimer"
                        disabled={isBusy}
                        onClick={() => onDelete(apiKey)}
                        className="flex items-center justify-center rounded-xl bg-core-bg p-2.5 text-sub-text shadow-neu-flat-sm transition-all hover:text-danger active:scale-[0.98] active:shadow-neu-pressed-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong disabled:pointer-events-none disabled:opacity-60"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </article>
    );
};

export const ApiKeysPanel: React.FC = () => {
    const { data: keys, isPending, isError, error, refetch } = useApiKeys();
    const addKey = useAddApiKey();
    const toggleKey = useToggleApiKeyActive();
    const deleteKey = useDeleteApiKey();

    const [addOpen, setAddOpen] = useState(false);
    const [provider, setProvider] = useState<Provider>('GEMINI');
    const [apiKeyValue, setApiKeyValue] = useState('');
    const [keyToDelete, setKeyToDelete] = useState<ApiKeyResponse | null>(null);

    const canAdd = apiKeyValue.trim().length > 0 && !addKey.isPending;
    const keysList = keys ?? [];
    const activeKeyLabel = keysList.find((key) => key.isActive)
        ? PROVIDERS[keysList.find((key) => key.isActive)!.provider]?.label
        : undefined;

    const openAddModal = () => {
        setProvider('GEMINI');
        setApiKeyValue('');
        setAddOpen(true);
    };

    const handleAdd = () => {
        if (!canAdd) return;
        addKey.mutate(
            { provider, apiKey: apiKeyValue.trim() },
            {
                onSuccess: () => {
                    toast.success('Clé API ajoutée', {
                        description:
                            'Le fournisseur est prêt : analyses, quiz, tentatives Feynman et chat IA en tireront profit.',
                    });
                    setAddOpen(false);
                    setApiKeyValue('');
                },
                onError: (mutationError) =>
                    toast.error('Ajout impossible', { description: getErrorMessage(mutationError) }),
            }
        );
    };

    const handleToggle = (apiKey: ApiKeyResponse) => {
        const willBeActive = !apiKey.isActive;
        toggleKey.mutate(
            { keyId: apiKey.id, isActive: willBeActive },
            {
                onSuccess: () =>
                    willBeActive
                        ? toast.success('Clé activée', {
                              description: 'Les fonctions IA utilisent désormais cette clé.',
                          })
                        : toast.info('Clé en veille', {
                              description: 'Les fonctions IA requièrent une clé active pour fonctionner.',
                          }),
                onError: (mutationError) =>
                    toast.error('Changement impossible', { description: getErrorMessage(mutationError) }),
            }
        );
    };

    const handleDelete = () => {
        const apiKey = keyToDelete;
        if (!apiKey || deleteKey.isPending) return;
        deleteKey.mutate(apiKey.id, {
            onSuccess: () => {
                toast.success('Clé supprimée', {
                    description: apiKey.isActive
                        ? 'La clé active a été retirée : réactivez une autre clé pour restaurer les fonctions IA.'
                        : 'La clé a été retirée de votre compte.',
                });
                setKeyToDelete(null);
            },
            onError: (mutationError) =>
                toast.error('Suppression impossible', { description: getErrorMessage(mutationError) }),
        });
    };

    const hasActiveKey = keysList.some((key) => key.isActive);

    return (
        <NeumorphicCard variant="flat" className="flex flex-col gap-4 rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <KeyRound size={16} className="text-secondary" />
                    Clés API
                    {keysList.length > 0 && (
                        <span className="text-xs font-medium text-sub-text">
                            · {keysList.length} {keysList.length > 1 ? 'clés' : 'clé'}
                            {activeKeyLabel ? ` · active : ${activeKeyLabel}` : ''}
                        </span>
                    )}
                </h3>
                <Button variant="generate" size="sm" leftIcon={<Plus size={14} />} onClick={openAddModal}>
                    Ajouter une clé
                </Button>
            </div>

            {isError && (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-core-bg px-4 py-3 shadow-neu-pressed-sm">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-sub-text">
                        <TriangleAlert size={14} className="text-amber-500" />
                        {getErrorMessage(error)}
                    </span>
                    <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={13} />} onClick={() => refetch()}>
                        Réessayer
                    </Button>
                </div>
            )}

            {isPending && (
                <div className="flex flex-col gap-3 pt-1">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="h-20 animate-pulse rounded-2xl bg-container-bg" />
                    ))}
                </div>
            )}

            {keys && keysList.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                    <KeyRound size={28} className="text-sub-text" />
                    <p className="text-sm font-bold text-main-text">Aucune clé API</p>
                    <p className="max-w-md text-sm text-sub-text">
                        Ajoutez la clé d'un fournisseur IA : sans clé active, les analyses de cours, quiz, Feynman et
                        chat restent indisponibles.
                    </p>
                    <Button variant="generate" size="sm" onClick={openAddModal}>
                        Ajouter une clé
                    </Button>
                </div>
            )}

            {keysList.length > 0 && !hasActiveKey && !isPending && <NoActiveKeyNotice />}

            {keysList.length > 0 && (
                <div className="flex flex-col gap-3 pt-1">
                    {keysList
                        .slice()
                        .sort((a, b) => Number(b.isActive) - Number(a.isActive) || b.createdAt.localeCompare(a.createdAt))
                        .map((apiKey) => (
                            <KeyRow
                                key={apiKey.id}
                                apiKey={apiKey}
                                isBusy={toggleKey.isPending || deleteKey.isPending}
                                onToggle={handleToggle}
                                onDelete={setKeyToDelete}
                            />
                        ))}
                </div>
            )}

            <Modal
                open={addOpen}
                onOpenChange={setAddOpen}
                title="Ajouter une clé API"
                description="Collez la clé du fournisseur choisi. Elle transite en HTTPS et n'est jamais réaffichée en clair."
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setAddOpen(false)} disabled={addKey.isPending}>
                            Annuler
                        </Button>
                        <Button
                            variant="generate"
                            isGlowing
                            loading={addKey.isPending}
                            disabled={!canAdd}
                            onClick={handleAdd}
                        >
                            Ajouter la clé
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-5 pb-2">
                    <div className="flex flex-col gap-2">
                        <span className="ml-1 text-sm font-medium text-sub-text">Fournisseur IA</span>
                        <div role="group" aria-label="Fournisseur IA" className="flex flex-wrap gap-2">
                            {(Object.keys(PROVIDERS) as Provider[]).map((key) => {
                                const config = PROVIDERS[key];
                                const Icon = config.icon;
                                const isActive = provider === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-pressed={isActive}
                                        disabled={addKey.isPending}
                                        onClick={() => setProvider(key)}
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-[0.98]',
                                            isActive
                                                ? 'bg-secondary text-on-secondary shadow-glow-secondary'
                                                : 'bg-core-bg text-sub-text shadow-neu-flat-sm hover:text-main-text'
                                        )}
                                    >
                                        <Icon size={13} />
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <SoftInput
                        label="Clé"
                        type="password"
                        autoComplete="off"
                        icon={<KeyRound size={16} />}
                        value={apiKeyValue}
                        onChange={(event) => setApiKeyValue(event.target.value)}
                        placeholder="Collez la clé du fournisseur…"
                        disabled={addKey.isPending}
                        autoFocus
                    />
                </div>
            </Modal>

            <Modal
                open={keyToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setKeyToDelete(null);
                }}
                title="Supprimer la clé API"
                size="sm"
                description={
                    keyToDelete
                        ? `${PROVIDERS[keyToDelete.provider]?.label ?? 'Fournisseur IA'} · ajoutée le ${formatDate(keyToDelete.createdAt)} · ${keyToDelete.isActive ? 'clé active' : 'en veille'}. Cette action est irréversible.`
                        : undefined
                }
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setKeyToDelete(null)} disabled={deleteKey.isPending}>
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            loading={deleteKey.isPending}
                            onClick={handleDelete}
                        >
                            Supprimer
                        </Button>
                    </>
                }
            >
                <p className="pb-3 text-sm text-sub-text">
                    Les analyses en cours qui utilisent cette clé s'arrêteront. Aucune donnée d'apprentissage n'est
                    perdue : l'app s'appuie sur vos cours, concepts et révisions déjà enregistrés.
                </p>
            </Modal>
        </NeumorphicCard>
    );
};
