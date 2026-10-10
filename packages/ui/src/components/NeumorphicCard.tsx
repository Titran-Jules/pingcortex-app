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
        flat: 'shadow-neu-flat bg-core-bg',
        pressed: 'shadow-neu-pressed bg-core-bg',
        convex: 'shadow-neu-flat bg-gradient-to-br from-white to-core-bg',
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