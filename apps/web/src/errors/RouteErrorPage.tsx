import React from 'react';
import { useLocation, useRouteError } from 'react-router-dom';
import { Button } from '@pingcortex/ui';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from './getErrorMessage';

export const RouteErrorPage: React.FC = () => {
    const error = useRouteError();
    const location = useLocation();

    if (import.meta.env.DEV) {
        console.error('Erreur de rendu de la page', location.pathname, error);
    }

    const message = getErrorMessage(error);

    return (
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-container-bg shadow-neu-flat text-amber-500">
                <TriangleAlert size={28} />
            </div>
            <div className="space-y-1">
                <h2 className="text-2xl font-black text-main-text">Une erreur est survenue</h2>
                <p className="text-sm text-sub-text">{message}</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="primary" leftIcon={<RotateCcw size={16} />} onClick={() => window.location.reload()}>
                    Réessayer
                </Button>
                <Link to="/dashboard" replace aria-label="Retour au tableau de bord">
                    <Button variant="secondary">Tableau de bord</Button>
                </Link>
            </div>
        </div>
    );
};
