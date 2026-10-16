import { toast as sonnerToast } from "sonner";

export const toast = {
    success: (message: string, description?: string) => {
        sonnerToast.success(message, { description });
    },
    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            duration: 8000,
            closeButton: true,
        });
    },
    warning: (message: string, description?: string) => {
        sonnerToast.warning(message, { description });
    },
    info: (message: string, description?: string) => {
        sonnerToast.info(message, { description });
    },

    promise: <T,>(
        promise: Promise<T>,
        message: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, message);
    },
};