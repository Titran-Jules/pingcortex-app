import React from 'react';
import { Badge, Button, NeumorphicCard } from '@pingcortex/ui';
import { Pencil, User } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { formatDate, formatNumber } from '../../../lib/format';

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center justify-between gap-4 border-b border-main-text/10 py-3 last:border-none">
        <span className="text-sm font-medium text-sub-text">{label}</span>
        <span className="text-right text-sm font-semibold text-main-text">{children}</span>
    </div>
);

export const ProfilePanel: React.FC<{ onEdit: () => void }> = ({ onEdit }) => {
    const { user } = useAuth();

    if (!user) {
        return (
            <NeumorphicCard variant="flat" className="rounded-3xl">
                <div className="flex flex-col gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-full bg-container-bg" />
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-6 w-2/3 animate-pulse rounded bg-container-bg" />
                    ))}
                </div>
            </NeumorphicCard>
        );
    }

    return (
        <NeumorphicCard variant="flat" className="flex flex-col gap-4 rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <User size={16} className="text-secondary" />
                    Profil
                </h3>
                <Badge variant="success" dot size="sm">
                    Session active
                </Badge>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary shadow-neu-flat-sm">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-sm font-bold text-main-text">{user.name}</p>
                    <p className="truncate text-xs text-sub-text">{user.email}</p>
                </div>
            </div>

            <div className="flex flex-col pt-1">
                <InfoRow label="Niveau d'étude">{user.level}</InfoRow>
                <InfoRow label="Email">{user.email}</InfoRow>
                <InfoRow label="Seuil d'alerte (usage)">
                    {user.alertThreshold === null ? '—' : `${formatNumber(user.alertThreshold)} jetons`}
                </InfoRow>
                <InfoRow label="Membre depuis">{formatDate(user.createdAt)}</InfoRow>
            </div>

            <div className="flex justify-end">
                <Button variant="secondary" size="sm" leftIcon={<Pencil size={14} />} onClick={onEdit}>
                    Modifier le profil
                </Button>
            </div>
        </NeumorphicCard>
    );
};
