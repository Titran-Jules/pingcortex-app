import React from 'react';
import { Button } from '@pingcortex/ui';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CourseNotFoundView: React.FC = () => (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-container-bg shadow-neu-flat text-rose-500">
            <CircleAlert size={28} />
        </div>
        <div className="space-y-1">
            <h2 className="text-2xl font-black text-main-text">Cours introuvable</h2>
            <p className="text-sm text-sub-text">
                Ce cours n'existe pas, a été supprimé ou n'est pas accessible depuis votre compte.
            </p>
        </div>
        <Link to="/courses" replace aria-label="Retour vers la liste des cours">
            <Button variant="primary" leftIcon={<ArrowLeft size={16} />}>
                Retour aux cours
            </Button>
        </Link>
    </div>
);
