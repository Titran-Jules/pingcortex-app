import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';

export interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    dismissible?: boolean;
    onOpenAutoFocus?: (event: Event) => void;
}

const SIZES = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    size = 'md',
    dismissible = true,
    onOpenAutoFocus,
}) => {
    return (
        <Dialog.Root open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
            <Dialog.Portal>
                <Dialog.Overlay 
                    className="fixed inset-0 z-50 bg-core-bg/60 backdrop-blur-sm transition-opacity animate-in fade-in-0" 
                />

                <Dialog.Content
                    onOpenAutoFocus={onOpenAutoFocus}
                    onEscapeKeyDown={(e) => {
                        if (!dismissible) e.preventDefault();
                    }}
                    onInteractOutside={(e) => {
                        if (!dismissible) e.preventDefault();
                    }}
                    aria-describedby={description ? undefined : undefined}
                    className={cn(
                        "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
                        "bg-container-bg shadow-neu-flat rounded-neu-md p-6",
                        "max-h-[85dvh] overflow-y-auto outline-none",
                        "transition-all animate-in fade-in-0 zoom-in-95",
                        SIZES[size]
                    )}
                >
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <Dialog.Title className="text-lg font-bold text-main-text">
                                {title}
                            </Dialog.Title>
                            {description && (
                                <Dialog.Description className="text-sm text-sub-text mt-1">
                                    {description}
                                </Dialog.Description>
                            )}
                        </div>

                        <Dialog.Close asChild>
                            <button
                                type="button"
                                aria-label="Fermer"
                                disabled={!dismissible}
                                className={cn(
                                    "p-2 rounded-neu-sm text-sub-text transition-all",
                                    "hover:bg-main-text/5 hover:text-main-text active:bg-main-text/10",
                                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong",
                                    "disabled:opacity-50 disabled:pointer-events-none"
                                )}
                            >
                                <X size={18} aria-hidden="true" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="my-4 text-main-text">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-main-text/10">
                            {footer}
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};