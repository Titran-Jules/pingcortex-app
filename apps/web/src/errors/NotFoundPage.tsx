import React from 'react';
import { Button } from '@pingcortex/ui';
import { Home, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-container-bg shadow-neu-flat text-secondary">
            <SearchX size={28} />
        </div>
        <div className="space-y-1">
            <h2 className="text-2xl font-black text-main-text">Page introuvable</h2>
            <p className="text-sm text-sub-text">
                Cette page n'existe pas ou a été déplacée.
            </p>
        </div>
        <Link to="/dashboard" replace aria-label="Retour au tableau de bord">
            <Button variant="primary" leftIcon={<Home size={16} />}>
                Retour au tableau de bord
            </Button>
        </Link>
    </div>
);
