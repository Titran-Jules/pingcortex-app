import { Badge, type BadgeSize, type Variants } from './Badge';

export type StatusType = 'PENDING' | 'ANALYZING' | 'READY' | 'FAILED';

export interface AnalysisStatusBadgeProps {
    status: StatusType;
    size?: BadgeSize;
}

const STATUS_CONFIG = {
    PENDING: { label: 'En attente', variant: 'neutral' },
    ANALYZING: { label: 'Analyse en cours…', variant: 'primary' },
    READY: { label: 'Prêt', variant: 'success' },
    FAILED: { label: 'Échec de l’analyse', variant: 'danger' },
} as const satisfies Record<StatusType, { label: string; variant: Variants }>;

export const AnalysisStatusBadge = ({ status, size = 'md' }: AnalysisStatusBadgeProps) => {
    const { label, variant } = STATUS_CONFIG[status];

    return (
        <span role="status" className="inline-flex">
            <Badge size={size} dot ping={status === 'ANALYZING'} variant={variant}>
                {label}
            </Badge>
        </span>
    );
};