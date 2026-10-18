import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: React.ReactNode;
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
} as const;

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
                    className={cn(
                        'fixed inset-0 z-50 bg-core-bg/60 backdrop-blur-sm',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                        'motion-reduce:animate-none'
                    )}
                />

                <Dialog.Content
                    onOpenAutoFocus={onOpenAutoFocus}
                    onEscapeKeyDown={(e) => {
                        if (!dismissible) e.preventDefault();
                    }}
                    onInteractOutside={(e) => {
                        if (!dismissible) e.preventDefault();
                    }}
                    {...(description ? {} : { 'aria-describedby': undefined })}
                    className={cn(
                        'fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col',
                        'max-h-[85dvh] rounded-neu-md bg-container-bg shadow-neu-flat outline-none',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'motion-reduce:animate-none',
                        SIZES[size]
                    )}
                >
                    <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
                        <div>
                            <Dialog.Title className="text-lg font-bold text-main-text">
                                {title}
                            </Dialog.Title>
                            {description && (
                                <Dialog.Description className="mt-1 text-sm text-sub-text">
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
                                    'rounded-neu-sm p-2 text-sub-text transition-colors motion-reduce:transition-none',
                                    'hover:bg-main-text/5 hover:text-main-text active:bg-main-text/10',
                                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong',
                                    'disabled:pointer-events-none disabled:opacity-50'
                                )}
                            >
                                <X size={18} aria-hidden="true" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2 text-main-text">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-main-text/10 px-6 py-4">
                            {footer}
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};