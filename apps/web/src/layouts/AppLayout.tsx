import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {

    return (
        <div className="flex h-screen w-full bg-[#eef2f6] dark:bg-slate-900 text-slate-700 dark:text-slate-100 overflow-hidden font-sans">
            <Sidebar/>

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-8 bg-[#eef2f6] dark:bg-slate-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};