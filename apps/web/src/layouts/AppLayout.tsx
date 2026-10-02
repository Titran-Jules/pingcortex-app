import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    BrainCircuit,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
        { to: '/courses', label: 'Mes Cours & Fiches', icon: BookOpen },
        { to: '/revision', label: 'Révision (Flashcards)', icon: BrainCircuit },
        { to: '/settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <div className="flex h-screen w-full bg-[#eef2f6] dark:bg-slate-900 text-slate-700 dark:text-slate-100 overflow-hidden font-sans">
            <aside
                className={`relative bg-[#eef2f6] dark:bg-slate-900 flex flex-col justify-between p-5 transition-all duration-300 ease-in-out border-r border-slate-200/50 dark:border-slate-800 ${
                isCollapsed ? 'w-24' : 'w-64'
                }`}
            >
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3.5 top-9 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-[#eef2f6] text-slate-500 shadow-[3px_3px_6px_#c8d0e0,-3px_-3px_6px_#ffffff] transition-all hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:shadow-none"
                    aria-label={isCollapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-3 py-1 pl-1 overflow-hidden rounded-full">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neu-bg dark:bg-neu-dark-bg shadow-neu-flat dark:shadow-neu-dark-flat p-2">
                            <img
                                src="/logo.png"
                                alt="Logo PingCortex"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        {!isCollapsed && (
                        <div className="flex flex-col leading-none">
                            <h2 className="text-xl font-black tracking-tight text-[#1e2342] dark:text-white">
                                <span className="text-[#00c2ff]">Ping</span>Cortex
                            </h2>
                            <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
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
                                        ? 'bg-[#5c61f4] text-white shadow-[0_6px_16px_0_rgba(92,97,244,0.35)]'
                                        : 'text-slate-500 hover:text-slate-800 hover:shadow-[inset_2px_2px_5px_#c8d0e0,inset_-2px_-2px_5px_#ffffff] dark:text-slate-400 dark:hover:text-white'
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
                    className={`p-3 rounded-2xl bg-[#eef2f6] shadow-[inset_2px_2px_5px_#c8d0e0,inset_-2px_-2px_5px_#ffffff] dark:bg-slate-800 dark:shadow-none flex items-center ${
                        isCollapsed ? 'justify-center' : 'justify-between'
                    }`}
                >
                    {!isCollapsed && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-[#5c61f4] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                E
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                    Étudiant
                                </span>
                                <span className="text-[10px] text-slate-400 truncate">
                                    etudiant@pingcortex.com
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        title="Déconnexion"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8 bg-[#eef2f6] dark:bg-slate-900">
                <Outlet />
            </main>
        </div>
    );
};