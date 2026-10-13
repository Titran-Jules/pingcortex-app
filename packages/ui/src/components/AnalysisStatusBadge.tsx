import { Badge, type Variants } from "./Badge";

export type StatusType = 'PENDING' | 'ANALYZING' | 'READY' | 'FAILED';

export interface AnalysisStatusBadgeProps {
    status: StatusType;
    size?: 'sm' | 'md' | 'lg';
}

export const AnalysisStatusBadge: React.FC<AnalysisStatusBadgeProps> = ({status, size = 'md'}) => {

    const configStatus = {
        PENDING: {
            label: 'En attente',
            variant: 'warning',
        },
        ANALYZING: {
            label: 'Analyse en cours...',
            variant: 'primary',
        },
        READY: {
            label: 'Prêt',
            variant: 'success',
        },
        FAILED: {
            label: 'Échec',
            variant: 'danger',
        },
    };

    const config = configStatus[status];

    return (
        <Badge size={size} dot={true} ping={status === 'ANALYZING'} variant={config.variant as Variants}>
            {config.label}
        </Badge>
    )
}