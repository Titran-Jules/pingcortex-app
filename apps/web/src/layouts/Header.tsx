import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, LogOut, Settings, Sparkles, ChevronDown } from 'lucide-react';

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
        <header className="w-full flex items-center justify-between px-8 py-5 bg-[#eef2f6] dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800">
            <div>
                <h1 className="text-2xl font-black text-[#1e2342] dark:text-white tracking-tight">
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
                        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2f6] text-slate-600 transition-all dark:bg-slate-800 dark:text-slate-300 ${
                            showNotifications
                            ? 'shadow-[inset_3px_3px_6px_#c8d0e0,inset_-3px_-3px_6px_#ffffff] text-[#5c61f4]'
                            : 'shadow-[4px_4px_8px_#c8d0e0,-4px_-4px_8px_#ffffff] hover:text-[#5c61f4]'
                        }`}
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#5c61f4] text-[10px] font-bold text-white shadow-[0_2px_6px_rgba(92,97,244,0.4)]">
                            1
                        </span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#eef2f6] p-4 shadow-[8px_8px_16px_#c8d0e0,-8px_-8px_16px_#ffffff] dark:bg-slate-800 z-50 border border-white/40">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                            <span className="text-xs font-extrabold text-[#1e2342] dark:text-white">
                            Notifications
                            </span>
                            <span className="text-[10px] bg-indigo-100 text-[#5c61f4] font-bold px-2 py-0.5 rounded-full">
                            1 nouvelle
                            </span>
                        </div>
                        <div className="mt-3 flex items-start gap-3 p-2 rounded-xl bg-[#eef2f6] shadow-[inset_2px_2px_4px_#c8d0e0,inset_-2px_-2px_4px_#ffffff]">
                            <Sparkles size={16} className="text-[#00c2ff] shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <p className="font-bold text-slate-700">Rappel Répétition Espacée</p>
                                <p className="text-slate-500 text-[11px] mt-0.5">5 flashcards de Mathématiques à réviser aujourd'hui.</p>
                            </div>
                        </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => {
                        setShowProfileMenu(!showProfileMenu);
                        setShowNotifications(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-2xl bg-[#eef2f6] transition-all dark:bg-slate-800 ${
                        showProfileMenu
                            ? 'shadow-[inset_3px_3px_6px_#c8d0e0,inset_-3px_-3px_6px_#ffffff]'
                            : 'shadow-[4px_4px_8px_#c8d0e0,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_5px_#c8d0e0,-2px_-2px_5px_#ffffff]'
                        }`}
                    >
                        <div className="h-8 w-8 rounded-full bg-[#5c61f4] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_6px_rgba(92,97,244,0.3)]">
                            E
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-[#1e2342] dark:text-slate-200 leading-tight">
                                Étudiant
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                                Standard
                            </span>
                        </div>
                        <ChevronDown size={14} className="text-slate-400 ml-1" />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-[#eef2f6] p-2 shadow-[8px_8px_16px_#c8d0e0,-8px_-8px_16px_#ffffff] dark:bg-slate-800 z-50 border border-white/40 flex flex-col gap-1">
                            <button className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#5c61f4] rounded-xl transition-all hover:shadow-[inset_2px_2px_4px_#c8d0e0,inset_-2px_-2px_4px_#ffffff]">
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