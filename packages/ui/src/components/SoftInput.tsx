import React from "react";
import { cn } from "../utils/cn";

export interface SoftInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const SoftInput = React.forwardRef<HTMLInputElement, SoftInputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
        <div className="w-full flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-sub-text ml-1">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && <div className="absolute left-4 text-sub-text">{icon}</div>}
                <input
                    ref={ref}
                    className={cn(
                        'w-full py-3 px-4 rounded-neu-sm bg-neu-bg dark:bg-neu-dark-bg text-sub-text placeholder-slate-400 focus:outline-none transition-all duration-200',
                        'shadow-neu-pressed dark:shadow-neu-dark-pressed focus:ring-2 focus:ring-brand-500/50',
                        icon && 'pl-11',
                        error && 'border border-rose-500/50',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-rose-500 ml-1">{error}</span>}
        </div>
        );
    }
);

SoftInput.displayName = 'SoftInput';