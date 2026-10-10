import React, {useEffect, useState} from "react";
import { cn } from "../utils/cn";
import { Moon, Sun } from 'lucide-react';

export const ToggleTheme: React.FC<{className?: string}> = ({ className }) => {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className={cn(
                'w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 bg-container-bg shadow-neu-pressed',
                className
            )}
        >
            <div
                className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 shadow-neu-flat-sm bg-neu-bg text-xs',
                    isDark ? 'translate-x-6 text-amber-400' : 'translate-x-0 text-amber-500'
                )}
            >
                {isDark ? <Moon/> : <Sun/>}
            </div>
        </button>
    );
}