import type { ReactNode } from 'react';
import { CheckCircle2, CircleAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export type Variants = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
    variant?: Variants;
    size?: BadgeSize;
    leftIcon?: ReactNode;
    dot?: boolean;
    ping?: boolean;
    children?: ReactNode;
}

const SIZES: Record<BadgeSize, { box: string; icon: number }> = {
    sm: { box: 'gap-1.5 px-2.5 py-1 text-xs', icon: 12 },
    md: { box: 'gap-2 px-3 py-1.5 text-sm', icon: 14 },
    lg: { box: 'gap-2 px-4 py-2 text-base', icon: 16 },
};

const VARIANTS: Record<Variants, string> = {
    neutral: 'border-main-text/20 bg-main-text/5 text-sub-text',
    primary: 'border-primary/40 bg-primary/10 text-primary-strong',
    secondary: 'border-secondary/40 bg-secondary/10 text-secondary-strong',
    success: 'border-success/40 bg-success/10 text-success',
    warning: 'border-warning/40 bg-warning/10 text-warning',
    danger: 'border-danger/40 bg-danger/10 text-danger',
};

const DOTS: Record<Variants, string> = {
    neutral: 'bg-main-text/60',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

const DEFAULT_ICONS: Partial<Record<Variants, LucideIcon>> = {
    success: CheckCircle2,
    warning: TriangleAlert,
    danger: CircleAlert,
};

const StatusDot = ({ variant, ping }: { variant: Variants; ping: boolean }) => (
    <span className="relative flex h-2 w-2" aria-hidden="true">
        {ping && (
            <span
                className={cn(
                    'absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping motion-reduce:animate-none',
                    DOTS[variant]
                )}
            />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', DOTS[variant])} />
    </span>
);

export const Badge = ({
    variant = 'primary',
    size = 'md',
    leftIcon,
    dot = false,
    ping = false,
    children,
}: BadgeProps) => {
    const { box, icon } = SIZES[size];
    const DefaultIcon = DEFAULT_ICONS[variant];

    let lead: ReactNode = null;
    if (dot) {
        lead = <StatusDot variant={variant} ping={ping} />;
    } else if (leftIcon) {
        lead = leftIcon;
    } else if (DefaultIcon) {
        lead = <DefaultIcon size={icon} aria-hidden="true" />;
    }

    return (
        <span
            className={cn(
                'inline-flex w-max items-center justify-center whitespace-nowrap rounded-neu-md border font-medium',
                VARIANTS[variant],
                box
            )}
        >
            {lead}
            {children}
        </span>
    );
};