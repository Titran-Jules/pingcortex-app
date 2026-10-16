import React from "react";
import { cn } from "../utils/cn";
import { Sparkle, Loader2 } from 'lucide-react';

export interface GlowButtonProps extends React.ComponentProps<'button'> {
    variant?: 'primary' | 'secondary' | 'generate' | 'danger' | 'ghost';
    isGlowing?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
}

export const Button: React.FC<GlowButtonProps> = ({
    variant = 'primary',
    isGlowing = false,
    loading = false,
    leftIcon,
    size = 'md',
    children,
    className,
    disabled,
    type = 'button',
    ...props
}) => {
    const baseStyles =
        'flex items-center justify-center relative rounded-neu-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong';

    const variants = {
        primary:
            `bg-primary text-on-primary ${isGlowing ? 'shadow-neu-glow-primary' : 'shadow-neu-flat'} active:shadow-neu-pressed`,
        secondary:
            `bg-container-bg text-secondary-strong ${isGlowing ? 'shadow-neu-glow-secondary' : 'shadow-neu-flat'} active:shadow-neu-pressed`,
        generate:
            `bg-secondary text-on-secondary ${isGlowing ? 'shadow-neu-glow-secondary' : 'shadow-neu-flat'} active:shadow-neu-pressed`,
        danger:
            `bg-danger text-on-danger ${isGlowing ? 'shadow-neu-glow-danger' : 'shadow-neu-flat'} active:shadow-neu-pressed hover:brightness-110`,
        ghost:
            'bg-transparent text-sub-text hover:bg-main-text/5 hover:text-main-text active:bg-main-text/10',
    };

    const sizes = {
        sm: 'gap-1.5 px-4 py-2 text-sm',
        md: 'gap-2 px-6 py-3 text-base',
        lg: 'gap-2.5 px-8 py-4 text-lg',
    };
    const iconSizes = { sm: 14, md: 16, lg: 18 };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={loading || disabled}
            type={type}
            aria-busy={loading}
            {...props}
        >
            {loading ? <Loader2 size={iconSizes[size]} className="animate-spin"/> : leftIcon ?? (variant === 'generate' ? <Sparkle size={iconSizes[size]} aria-hidden/> : null)}
            {children}
        </button>
    );
}