import React from 'react';
import { Button, NeumorphicCard } from '@pingcortex/ui';
import { Activity, ArrowDown, ArrowUp, Gauge, RotateCcw, TriangleAlert, Pencil } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@pingcortex/ui';
import { useUsageSummary } from '../../../hooks/queries/useUsageSummary';
import { getErrorMessage } from '../../../errors/getErrorMessage';
import { formatNumber } from '../../../lib/format';

const UsageGauge: React.FC<{ used: number; limit: number; over: boolean }> = ({ used, limit, over }) => {
    const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;
    const clamped = Math.min(Math.max(pct, 0), 100);
    const fill = clamped <= 50 ? 'bg-success' : clamped <= 80 ? 'bg-warning' : 'bg-danger';

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="flex items-baseline gap-2">
                    <span className="text-2xl font-black tabular-nums text-main-text">{formatNumber(used)}</span>
                    <span className="text-sm font-semibold text-sub-text">/ {formatNumber(limit)} jetons</span>
                </p>
                <span
                    className={cn(
                        'rounded-full px-3 py-1 text-xs font-bold tabular-nums',
                        over ? 'bg-danger/10 text-danger' : 'bg-core-bg text-sub-text shadow-neu-flat-sm'
                    )}
                >
                    {clamped} % du seuil
                </span>
            </div>

            <div
                role="progressbar"
                aria-label="Usage des jetons par rapport au seuil d'alerte"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={clamped}
                className="relative h-3 w-full overflow-hidden rounded-full bg-core-bg shadow-neu-pressed"
            >
                <div
                    className={cn('h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none', fill)}
                    style={{ width: `${clamped}%` }}
                />
            </div>

            <p className={cn('flex items-center gap-2 text-xs font-semibold', over ? 'text-danger' : 'text-sub-text')}>
                {over ? (
                    <>
                        <TriangleAlert size={13} className="shrink-0" />
                        Seuil d'alerte dépassé de {formatNumber(used - limit)} jetons : ajustez le seuil si nécessaire.
                    </>
                ) : (
                    <>Il reste {formatNumber(Math.max(limit - used, 0))} jetons avant le seuil d'alerte.</>
                )}
            </p>
        </div>
    );
};

const StatBlock: React.FC<{ icon: LucideIcon; label: string; value: number; iconTone: string }> = ({
    icon: Icon,
    label,
    value,
    iconTone,
}) => (
    <div className="flex flex-col gap-1 rounded-2xl bg-core-bg p-5 shadow-neu-pressed-sm">
        <dd className="flex items-center gap-2 text-lg font-black tabular-nums text-main-text">
            <Icon size={14} className={iconTone} />
            {formatNumber(value)}
        </dd>
        <dt className="text-[10px] font-bold uppercase tracking-wide text-sub-text">{label}</dt>
    </div>
);

export const UsagePanel: React.FC<{ onEditThreshold: () => void }> = ({ onEditThreshold }) => {
    const {
        data: usage,
        isPending,
        isError,
        error,
        refetch,
    } = useUsageSummary();

    const overThreshold = usage !== undefined && usage.alertThreshold > 0 && usage.totalTokensIn + usage.totalTokensOut >= usage.alertThreshold;

    return (
        <NeumorphicCard variant="flat" className="flex flex-col gap-6 rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <Gauge size={16} className="text-primary" />
                    Usage des jetons
                </h3>
                <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Pencil size={14} />}
                    onClick={onEditThreshold}
                >
                    Modifier le seuil
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
                <div className="flex flex-col gap-4 pt-1">
                    <div className="h-16 animate-pulse rounded-2xl bg-container-bg" />
                    <div className="h-12 animate-pulse rounded-full bg-container-bg" />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-20 animate-pulse rounded-2xl bg-container-bg" />
                        ))}
                    </div>
                </div>
            )}

            {usage && (
                <>
                    <UsageGauge
                        used={usage.totalTokensIn + usage.totalTokensOut}
                        limit={usage.alertThreshold}
                        over={overThreshold}
                    />

                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <StatBlock icon={ArrowDown} label="Jetons reçus" value={usage.totalTokensIn} iconTone="text-primary" />
                        <StatBlock icon={ArrowUp} label="Jetons générés" value={usage.totalTokensOut} iconTone="text-secondary" />
                        <StatBlock icon={Activity} label="Requêtes" value={usage.requestCount} iconTone="text-primary-strong" />
                    </dl>

                    <p className="text-[11px] text-sub-text">
                        Les requêtes regroupent les analyses de cours, quiz, tentatives Feynman et messages du chat.
                    </p>
                </>
            )}
        </NeumorphicCard>
    );
};
