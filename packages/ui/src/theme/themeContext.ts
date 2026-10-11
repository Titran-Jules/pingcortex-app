import type { ResolvedTheme, Theme } from "./theme";

export interface ThemeContext {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme(t: Theme): void;
    toggleTheme(): void;
}