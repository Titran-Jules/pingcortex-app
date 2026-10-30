import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useRouteTitle } from '../hooks/useRouteTitle';

export const AppLayout: React.FC = () => {
    const title = useRouteTitle();

    useEffect(() => {
        document.title = `${title} | PingCortex`;
    }, [title]);

    return (
        <div className="flex h-screen w-full bg-core-bg text-sub-text overflow-hidden font-sans">
            <Sidebar/>

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-8 bg-core-bg">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};