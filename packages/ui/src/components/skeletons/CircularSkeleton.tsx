import React from 'react';

export const CircularSkeleton: React.FC = () => {
    return (
        <div 
            role="region" 
            aria-busy="true" 
            aria-label="Chargement de la jauge de progression..."
            className="p-6 rounded-3xl bg-core-bg shadow-neu-flat flex flex-col items-center text-center transition-all duration-300"
        >
            <div className="h-4 w-32 rounded bg-main-text/10 animate-pulse mb-6" aria-hidden="true" />
            
            <div 
                className="w-37.5 h-37.5 rounded-full bg-core-bg shadow-neu-pressed animate-pulse my-2 flex items-center justify-center" 
                aria-hidden="true"
            >
                <div className="w-12 h-6 rounded bg-main-text/10" />
            </div>
            
            <div className="h-3 w-24 rounded bg-main-text/10 animate-pulse mt-4" aria-hidden="true" />
        </div>
    );
};