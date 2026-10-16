import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { resolveTheme, readStoredTheme } from '../../theme/theme';
import { cn } from '../../utils/cn';

export const Toaster: React.FC = () => {
    const storedTheme = readStoredTheme() || 'system';
    const resolvedTheme = resolveTheme(storedTheme);

    return (
        <SonnerToaster
            theme={resolvedTheme}
            position="bottom-right"
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cn(
                        "flex items-center gap-3 w-full p-4 rounded-neu-sm",
                        "bg-container-bg text-main-text shadow-neu-flat",
                        "border border-main-text/10"
                    ),
                    description: "text-xs text-sub-text mt-1",
                    actionButton: "bg-primary text-on-primary px-3 py-1.5 rounded-neu-sm text-xs font-semibold",
                    cancelButton: "bg-container-bg text-sub-text px-3 py-1.5 rounded-neu-sm text-xs",
                    success: "border-success/40 bg-success/5",
                    error: "border-danger/40 bg-danger/5",
                    warning: "border-warning/40 bg-warning/5",
                },
            }}
        />
    );
};