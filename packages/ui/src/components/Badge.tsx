import { cn } from "../utils/cn";
import { CheckCircle2, AlertTriangleIcon, SquareExclamationPointIcon } from 'lucide-react';

export type Variants = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
    variant?: Variants;
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: React.ReactNode;
    dot?: boolean;
    ping?: boolean;
    children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({variant = 'primary', size = 'md', leftIcon, dot = false, ping = false, children}) => {

    const sizes = {
        sm: 'gap-1.5 px-3 py-2 text-sm',
        md: 'gap-2 px-4 py-2 text-base',
        lg: 'gap-2.5 px-6 py-2 text-lg',
    };
    const iconSizes = { sm: 14, md: 16, lg: 18 };

    const icons = {
        success: <CheckCircle2 size={iconSizes[size]}/>,
        warning: <AlertTriangleIcon size={iconSizes[size]}/>,
        danger: <SquareExclamationPointIcon size={iconSizes[size]}/>,
    }

    const baseStyles = 'flex items-center justify-center relative rounded-neu-md shadow-neu-flat border w-max backdrop-blur-sm';

    const variants = {
        neutral: 'bg-main-text/5 text-sub-text border-main-text/20',
        primary: 'bg-primary/10 text-primary-strong border-primary',
        secondary: 'bg-secondary/10 text-secondary-strong broder-secondary',
        success: 'bg-success/10 text-success border-success',
        warning: 'bg-warning/10 text-warning border-warning',
        danger: 'bg-danger/10 text-danger border-danger',
    };

    const dots = {
        neutral: 'bg-main-text',
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        success: 'bg-success',
        warning: 'bg-warning',
        danger: 'bg-danger',
    }

    return (
        <span className={cn(baseStyles, variants[variant], sizes[size])}>
            {(dot && <span className={cn('w-2 h-2 rounded-full', `${ping && 'animate-ping'}`, dots[variant])}></span> ) || leftIcon || (variant !== 'neutral' && variant !== 'primary' && variant !== 'secondary' && icons[variant])}
            {children}
        </span>
    );
}