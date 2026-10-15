import React from 'react';

export const CardListSkeleton: React.FC = () => {
    return (
        <div 
            role="region" 
            aria-busy="true" 
            aria-label="Chargement de la liste des cartes..."
            className="p-5 rounded-2xl bg-core-bg shadow-neu-flat flex items-center gap-4 w-full transition-all duration-300"
        >
            <div className="w-12 h-12 rounded-xl bg-main-text/10 animate-pulse shrink-0" aria-hidden="true" />
            
            <div className="flex-1 space-y-2" aria-hidden="true">
                <div className="h-4 w-3/4 rounded bg-main-text/10 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-main-text/10 animate-pulse" />
            </div>
        </div>
    );
};