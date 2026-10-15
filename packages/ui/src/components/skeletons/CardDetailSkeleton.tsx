import React from 'react';

export const CardDetailSkeleton: React.FC = () => {
    return (
        <div 
            role="region" 
            aria-busy="true" 
            aria-label="Chargement de la carte de révision..."
            className="p-6 rounded-3xl bg-core-bg shadow-neu-flat flex flex-col gap-4 w-full transition-all duration-300"
        >
            <div className="flex items-center justify-between" aria-hidden="true">
                <div className="h-5 w-1/3 rounded-md bg-main-text/10 animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-main-text/10 animate-pulse" />
            </div>

            <div className="space-y-2 py-4" aria-hidden="true">
                <div className="h-4 w-full rounded-md bg-main-text/10 animate-pulse" />
                <div className="h-4 w-4/5 rounded-md bg-main-text/10 animate-pulse" />
            </div>

            <div className="pt-2 flex justify-end gap-3" aria-hidden="true">
                <div className="h-10 w-24 rounded-xl bg-main-text/10 animate-pulse" />
                <div className="h-10 w-28 rounded-xl bg-main-text/10 animate-pulse" />
            </div>
        </div>
    );
};