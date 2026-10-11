import { useCallback, useEffect, useMemo, useState } from "react";
import { applyTheme, getSystemTheme, readStoredTheme, THEME_STORAGE_KEY, writeStoredTheme, type ResolvedTheme, type Theme } from "./theme";
import { ThemeContext } from "./ThemeContext";

interface ThemeProviderProps {
    children: React.ReactNode;
}

const isTheme = (value: string | null): value is Theme => {
    return value === 'light' || value === 'dark' || value === 'system';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        return readStoredTheme() || 'system';
    });
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);
    const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

    const setTheme = useCallback((newTheme: Theme) => {
        try {
            writeStoredTheme(newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error("Failed to save theme in localStorage :", error);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const nextTheme: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    }, [resolvedTheme, setTheme]);

    useEffect(() => {
        applyTheme(resolvedTheme);
    }, [resolvedTheme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    useEffect(() => {
        const handleStorageSync = (event: StorageEvent) => {
            if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
                setThemeState(event.newValue);
            }
        };
        window.addEventListener('storage', handleStorageSync);
        return () => {
            window.removeEventListener('storage', handleStorageSync);
        };
    }, []);

    const value = useMemo(() => ({
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme
    }), [theme, resolvedTheme, setTheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};