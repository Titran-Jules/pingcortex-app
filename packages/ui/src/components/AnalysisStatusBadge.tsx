import React from 'react';
import { cn } from '../utils/cn';

export type StatusType = 'PENDING' | 'ANALYZING' | 'READY' | 'FAILED';

export interface AnalysisStatusBadgeProps {
    status: StatusType;
    className?: string;
}

export const AnalysisStatusBadge: React.FC<AnalysisStatusBadgeProps> = ({
    status,
    className,
}) => {
    const statusConfig = {
        PENDING: {
            label: 'En attente',
            color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
            dot: 'bg-amber-500',
        },
        ANALYZING: {
            label: 'Analyse en cours...',
            color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-glow-primary',
            dot: 'bg-indigo-500 animate-ping',
        },
        READY: {
            label: 'Prêt',
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
            dot: 'bg-emerald-500',
        },
        FAILED: {
            label: 'Échec',
            color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
            dot: 'bg-rose-500',
        },
    };

    const config = statusConfig[status];

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium backdrop-blur-sm transition-all duration-300',
                config.color,
                className
            )}
        >
            <span className={cn('w-2 h-2 rounded-full', config.dot)} />
            <span>{config.label}</span>
        </div>
    );
};