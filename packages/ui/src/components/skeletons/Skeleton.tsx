import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
    <div
        aria-hidden="true"
        className={cn('animate-pulse rounded-md bg-main-text/10 motion-reduce:animate-none', className)}
        {...props}
    />
);

interface LoadingRegionProps {
    label: string;
    children: ReactNode;
    className?: string;
}

export const LoadingRegion = ({ label, children, className }: LoadingRegionProps) => (
    <div role="status" aria-busy="true" className={className}>
        <span className="sr-only">{label}</span>
        {children}
    </div>
);