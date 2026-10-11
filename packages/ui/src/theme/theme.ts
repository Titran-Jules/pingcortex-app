export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export const isTheme = (value: string | null): value is Theme => {
    return value === 'light' || value === 'dark' || value === 'system';
};

export const readStoredTheme = (): Theme | null => {
    if (typeof window === 'undefined') return null;
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        if (isTheme(value)) {
            return value;
        }
        return null;
    } catch {
        return null;
    }
};

export const writeStoredTheme = (theme: Theme): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        return;
    }
}

export const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'light';
}

export const resolveTheme = (theme: Theme): ResolvedTheme => {
    if (theme === 'system') {
        return getSystemTheme();
    }
    return theme;
}

export const applyTheme = (resolvedTheme: ResolvedTheme): void => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
}