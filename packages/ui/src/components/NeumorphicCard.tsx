import React from 'react';
import { cn } from '../utils/cn';

export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'flat' | 'pressed' | 'convex';
    children: React.ReactNode;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
    variant = 'flat',
    children,
    className,
    ...props
}) => {
    const variants = {
        flat: 'shadow-neu-flat dark:shadow-neu-dark-flat bg-neu-bg dark:bg-neu-dark-bg',
        pressed: 'shadow-neu-pressed dark:shadow-neu-dark-pressed bg-neu-bg dark:bg-neu-dark-bg',
        convex: 'shadow-neu-flat dark:shadow-neu-dark-flat bg-gradient-to-br from-white to-neu-bg dark:from-slate-800 dark:to-neu-dark-bg',
    };

    return (
        <div
            className={cn(
                'rounded-neu-md p-6 transition-all duration-300 border border-white/20 dark:border-slate-800/40',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};