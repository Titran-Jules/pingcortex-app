import React from "react";
import { cn } from "../utils/cn";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from "../theme/useTheme";

export const ToggleTheme: React.FC<{className?: string}> = ({ className }) => {
    const { resolvedTheme, toggleTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    return (
        <button
            onClick={toggleTheme}
            aria-label="Mode sombre"
            aria-checked={isDark}
            type="button"
            role="switch"
            className={cn(
                'w-14 h-8 flex items-center rounded-full p-1 transition-colors motion-reduce:transition-none duration-300 bg-container-bg shadow-neu-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
                className
            )}
        >
            <span
                className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 shadow-neu-flat-sm bg-core-bg motion-reduce:transition-none',
                    isDark ? 'translate-x-6 text-amber-400' : 'translate-x-0 text-amber-500'
                )}
            >
                {isDark ? <Moon size={14}/> : <Sun size={14}/>}
            </span>
        </button>
    );
}