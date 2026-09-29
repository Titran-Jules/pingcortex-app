import React from "react";
import { cn } from "../utils/cn";

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isGlowing?: boolean;
    children: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
    variant = 'primary',
    isGlowing = false,
    children,
    className,
    disabled,
    ...props
}) => {
    const baseStyles =
        'relative px-6 py-3 rounded-neu-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
        primary:
            'bg-brand-500 text-white shadow-neu-flat dark:shadow-neu-dark-flat active:shadow-neu-pressed dark:active:shadow-neu-dark-pressed hover:bg-brand-600',
        secondary:
            'bg-neu-bg dark:bg-neu-dark-bg text-slate-700 dark:text-slate-200 shadow-neu-flat dark:shadow-neu-dark-flat active:shadow-neu-pressed dark:active:shadow-neu-dark-pressed hover:text-brand-500',
        danger:
            'bg-rose-500 text-white shadow-neu-flat dark:shadow-neu-dark-flat active:shadow-neu-pressed hover:bg-rose-600',
    };

    const glowStyles = isGlowing ? 'shadow-glow-primary' : '';

    return (
        <button
            className={cn(baseStyles, variants[variant], glowStyles, className)}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}