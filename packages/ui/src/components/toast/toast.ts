import { toast as sonnerToast, type ExternalToast } from 'sonner';

export type ToastOptions = Pick<ExternalToast, 'description' | 'id' | 'action' | 'duration'>;
export type ToastId = string | number;

const DURATION = {
    warning: 6000,
    error: 8000,
} as const;

const normalize = (options?: string | ToastOptions): ToastOptions =>
    typeof options === 'string' ? { description: options } : (options ?? {});

export const toast = {
    success: (message: string, options?: string | ToastOptions): ToastId =>
        sonnerToast.success(message, normalize(options)),

    info: (message: string, options?: string | ToastOptions): ToastId =>
        sonnerToast.info(message, normalize(options)),

    warning: (message: string, options?: string | ToastOptions): ToastId =>
        sonnerToast.warning(message, { duration: DURATION.warning, ...normalize(options) }),

    error: (message: string, options?: string | ToastOptions): ToastId =>
        sonnerToast.error(message, {
            duration: DURATION.error,
            closeButton: true,
            ...normalize(options),
        }),

    loading: (message: string, options?: string | ToastOptions): ToastId =>
        sonnerToast.loading(message, normalize(options)),

    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: unknown) => string);
        }
    ) => sonnerToast.promise(promise, messages),

    dismiss: (id?: ToastId) => sonnerToast.dismiss(id),
};