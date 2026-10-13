import { cn } from "../utils/cn";
import { CheckCircle2, AlertTriangleIcon, SquareExclamationPointIcon } from 'lucide-react';

export interface BadgeProps {
    variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: React.ReactNode;
    children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({variant = 'primary', size = 'md', leftIcon, children}) => {

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

    const baseStyles = 'flex items-center justify-center relative rounded-neu-md shadow-neu-flat border';

    const variants = {
        neutral: 'bg-main-text/5 text-sub-text border-main-text/20',
        primary: 'bg-primary/30 text-primary-strong border-primary',
        success: 'bg-success/30 text-success border-success',
        warning: 'bg-warning/30 text-warning border-warning',
        danger: 'bg-danger/30 text-danger border-danger',
    };

    return (
        <span className={cn(baseStyles, variants[variant], sizes[size])}>
            {leftIcon || (variant !== 'neutral' && variant !== 'primary' && icons[variant])}
            {children}
        </span>
    );
}