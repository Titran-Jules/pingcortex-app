import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    BrainCircuit,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const navItems = [
        { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
        { to: '/courses', label: 'Mes Cours & Fiches', icon: BookOpen },
        { to: '/revision', label: 'Révision (Flashcards)', icon: BrainCircuit },
        { to: '/settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <aside
            className={`relative bg-core-bg flex flex-col justify-between p-5 transition-all duration-300 ease-in-out border-r border-main-text/10 ${
                    isCollapsed ? 'w-24' : 'w-64'
            }`}
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3.5 top-9 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-container-bg text-sub-text shadow-neu-flat-sm transition-all hover:text-secondary"
                aria-label={isCollapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3 py-1 pl-1 overflow-hidden rounded-full">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-container-bg shadow-neu-flat-sm p-2">
                        <img
                            src="/logo.png"
                            alt="Logo PingCortex"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col leading-none">
                            <h2 className="text-xl font-black tracking-tight text-main-text">
                                <span className="text-primary">Ping</span>Cortex
                            </h2>
                            <span className="text-[10px] text-sub-text font-medium tracking-wide mt-1">
                                Espace d'apprentissage
                            </span>
                        </div>
                    )}
                </div>
                <nav className="flex flex-col gap-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                title={isCollapsed ? item.label : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                                    isActive
                                    ? 'bg-secondary text-white shadow-glow-secondary'
                                    : 'text-sub-text hover:text-main-text hover:shadow-neu-pressed-sm'
                                } ${isCollapsed ? 'justify-center' : ''}`
                                }
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        
            <div
                className={`p-3 rounded-2xl bg-container-bg shadow-neu-pressed-sm flex items-center ${
                            isCollapsed ? 'justify-center' : 'justify-between'
                }`}
            >
                {!isCollapsed && (
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                            E
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-main-text truncate">
                                Étudiant
                            </span>
                            <span className="text-[10px] text-sub-text truncate">
                                etudiant@pingcortex.com
                            </span>
                        </div>
                    </div>
                )}
                <button
                    title="Déconnexion"
                    className="p-2 rounded-xl text-sub-text hover:text-rose-500 transition-colors"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
}