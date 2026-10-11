import { createContext } from "react";
import type { ResolvedTheme, Theme } from "./theme";

export interface ThemeContextType {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme(t: Theme): void;
    toggleTheme(): void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);