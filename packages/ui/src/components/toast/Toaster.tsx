import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '../../theme/useTheme';
import { cn } from '../../utils/cn';

export const Toaster: React.FC = () => {
    const { resolvedTheme } = useTheme();

    return (
        <SonnerToaster
            theme={resolvedTheme}
            position="bottom-right"
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cn(
                        'pointer-events-auto flex w-full items-center gap-3 rounded-neu-sm p-4',
                        'border border-main-text/10 bg-container-bg text-main-text shadow-neu-flat'
                    ),
                    icon: 'flex shrink-0',
                    title: 'text-sm font-semibold',
                    description: 'mt-1 text-xs text-sub-text',
                    closeButton: cn(
                        'absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full',
                        'bg-container-bg text-sub-text shadow-neu-flat-sm transition-colors',
                        'hover:text-main-text focus-visible:outline-2 focus-visible:outline-secondary-strong'
                    ),
                    actionButton:
                        'rounded-neu-sm bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary',
                    cancelButton:
                        'rounded-neu-sm bg-core-bg px-3 py-1.5 text-xs text-sub-text',
                    success: 'border-l-4 border-l-success [&_[data-icon]]:text-success',
                    error: 'border-l-4 border-l-danger [&_[data-icon]]:text-danger',
                    warning: 'border-l-4 border-l-warning [&_[data-icon]]:text-warning',
                    info: 'border-l-4 border-l-secondary-strong [&_[data-icon]]:text-secondary-strong',
                },
            }}
        />
    );
};