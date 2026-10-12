import React from "react";
import { cn } from "../utils/cn";
import { Sparkle } from 'lucide-react';

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'generate' | 'danger';
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
        'flex items-center justify-center gap-2 relative px-6 py-3 rounded-neu-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
        primary:
            'bg-primary text-on-primary shadow-neu-flat active:shadow-neu-pressed',
        secondary:
            'bg-core-bg text-secondary-strong shadow-neu-flat active:shadow-neu-pressed hover:text-secondary',
        generate:
            'bg-secondary text-on-secondary shadow-neu-flat active:shadow-neu-pressed',
        danger:
            'bg-rose-500 text-white shadow-neu-flat active:shadow-neu-pressed hover:bg-rose-600',
    };

    const glowStyles = isGlowing ? 'shadow-glow-primary' : '';

    return (
        <button
            className={cn(baseStyles, variants[variant], glowStyles, className)}
            disabled={disabled}
            {...props}
        >
            {variant === 'generate' &&
                <Sparkle size={14}/>
            }
            {children}
        </button>
    );
}