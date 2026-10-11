export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export const readStoredTheme = (): Theme | null => {
    if (typeof window === 'undefined') return null;
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        if (value === 'light' || value === 'dark' || value === 'system') {
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
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
}