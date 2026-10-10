import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, LogOut, Settings, Sparkles, ChevronDown } from 'lucide-react';
import { ToggleTheme } from '@pingcortex/ui';

export const Header: React.FC = () => {
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const getPageTitle = (pathname: string) => {
        switch (pathname) {
            case '/dashboard':
                return 'Tableau de bord de révision';
            case '/courses':
                return 'Mes Cours & Fiches IA';
            case '/revision':
                return 'Session de Révision';
            case '/settings':
                return 'Paramètres du compte';
            default:
                return 'Espace d\'apprentissage';
        }
    };

    return (
        <header className="w-full flex items-center justify-between px-8 py-5 bg-core-bg border-b border-slate-200/50 dark:border-slate-800">
            <div>
                <h1 className="text-2xl font-black text-main-text tracking-tight">
                {getPageTitle(location.pathname)}
                </h1>
            </div>

            <div className="flex items-center gap-5">
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfileMenu(false);
                        }}
                        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl bg-container-bg text-sub-text transition-all ${
                            showNotifications
                            ? 'shadow-neu-pressed-sm text-secondary'
                            : 'shadow-neu-flat-sm hover:text-secondary'
                        }`}
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-[0_2px_6px_rgba(92,97,244,0.4)]">
                            1
                        </span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-core-bg p-4 shadow-neu-flat z-50 border border-main-text/10">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                            <span className="text-xs font-extrabold text-main-text">
                            Notifications
                            </span>
                            <span className="text-[10px] bg-indigo-100 text-secondary font-bold px-2 py-0.5 rounded-full">
                            1 nouvelle
                            </span>
                        </div>
                        <div className="mt-3 flex items-start gap-3 p-2 rounded-xl bg-core-bg shadow-neu-pressed-sm">
                            <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <p className="font-bold text-sub-text">Rappel Répétition Espacée</p>
                                <p className="text-sub-text text-[11px] mt-0.5">5 flashcards de Mathématiques à réviser aujourd'hui.</p>
                            </div>
                        </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <ToggleTheme />
                    <button
                        onClick={() => {
                        setShowProfileMenu(!showProfileMenu);
                        setShowNotifications(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-2xl bg-container-bg transition-all ${
                        showProfileMenu
                            ? 'shadow-neu-pressed-sm'
                            : 'shadow-neu-flat-sm'
                        }`}
                    >
                        <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_6px_rgba(92,97,244,0.3)]">
                            E
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-main-text leading-tight">
                                Étudiant
                            </span>
                            <span className="text-[10px] text-sub-text font-medium">
                                Standard
                            </span>
                        </div>
                        <ChevronDown size={14} className="text-sub-text ml-1" />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-core-bg p-2 shadow-neu-flat z-50 border border-main-text/10 flex flex-col gap-1">
                            <button className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-sub-text hover:text-secondary rounded-xl transition-all hover:shadow-neu-pressed-sm">
                                <Settings size={14} /> Mon Profil
                            </button>
                            <button className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <LogOut size={14} /> Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};