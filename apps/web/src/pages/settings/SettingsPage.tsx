import React, { useState } from 'react';
import { Button, Modal, SoftInput, Tabs, TabsContent, TabsList, TabsTrigger, toast } from '@pingcortex/ui';
import { KeyRound, Settings, User, Gauge } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateProfile } from '../../hooks/queries/useProfile';
import { getErrorMessage } from '../../errors/getErrorMessage';
import { ApiKeysPanel } from './tabs/ApiKeysPanel';
import { UsagePanel } from './tabs/UsagePanel';
import { ProfilePanel } from './tabs/ProfilePanel';

const DEFAULT_TAB = 'cles-api';

type TabId = typeof DEFAULT_TAB | 'usage' | 'profil';

const TAB_IDS: Record<TabId, boolean> = { 'cles-api': true, usage: true, profil: true };

export const SettingsPage: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const updateProfile = useUpdateProfile();

    const requestedTab = searchParams.get('tab');
    const tab: TabId = requestedTab !== null && requestedTab in TAB_IDS ? (requestedTab as TabId) : DEFAULT_TAB;

    const [profileOpen, setProfileOpen] = useState(false);
    const [level, setLevel] = useState('');
    const [threshold, setThreshold] = useState('');

    const handleTabChange = (value: string) => {
        if (value === DEFAULT_TAB) {
            setSearchParams({}, { replace: true });
            return;
        }
        setSearchParams({ tab: value }, { replace: true });
    };

    const openProfileEditor = () => {
        setLevel(user?.level ?? '');
        setThreshold(
            user?.alertThreshold !== null && user?.alertThreshold !== undefined
                ? String(user.alertThreshold)
                : ''
        );
        setProfileOpen(true);
    };

    const thresholdValue = Number(threshold);
    const canSave =
        level.trim().length > 0 &&
        threshold.trim().length > 0 &&
        Number.isFinite(thresholdValue) &&
        thresholdValue >= 0 &&
        !updateProfile.isPending;

    const handleSaveProfile = () => {
        if (!canSave) return;
        updateProfile.mutate(
            { level: level.trim(), alertThreshold: thresholdValue },
            {
                onSuccess: async () => {
                    toast.success('Profil mis à jour', {
                        description: "Votre niveau et votre seuil d'usage ont été enregistrés.",
                    });
                    setProfileOpen(false);
                    try {
                        await refreshUser();
                    } catch {
                        return;
                    }
                },
                onError: (mutationError) =>
                    toast.error("Mise à jour impossible", { description: getErrorMessage(mutationError) }),
            }
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-container-bg text-secondary shadow-neu-flat-sm">
                    <Settings size={20} />
                </div>
                <p className="text-xs text-sub-text">
                    Gérez vos clés API, suivez l'usage (jetons) et vos informations de profil.
                </p>
            </div>

            <Tabs value={tab} onValueChange={handleTabChange} variant="segmented">
                <TabsList aria-label="Sections des paramètres">
                    <TabsTrigger value="cles-api" icon={<KeyRound size={14} />}>
                        Clés API
                    </TabsTrigger>
                    <TabsTrigger value="usage" icon={<Gauge size={14} />}>
                        Usage
                    </TabsTrigger>
                    <TabsTrigger value="profil" icon={<User size={14} />}>
                        Profil
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="cles-api">
                    <ApiKeysPanel />
                </TabsContent>
                <TabsContent value="usage" keepMounted>
                    <UsagePanel onEditThreshold={openProfileEditor} />
                </TabsContent>
                <TabsContent value="profil">
                    <ProfilePanel onEdit={openProfileEditor} />
                </TabsContent>
            </Tabs>

            <Modal
                open={profileOpen}
                onOpenChange={setProfileOpen}
                title="Modifier le profil"
                description="Le seuil d'alerte (usage) déclenche un avertissement avant le dépassement de jetons."
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setProfileOpen(false)} disabled={updateProfile.isPending}>
                            Annuler
                        </Button>
                        <Button
                            variant="primary"
                            loading={updateProfile.isPending}
                            disabled={!canSave}
                            onClick={handleSaveProfile}
                        >
                            Enregistrer
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-5 pb-2">
                    <SoftInput
                        label="Niveau d'étude"
                        icon={<User size={16} />}
                        value={level}
                        onChange={(event) => setLevel(event.target.value)}
                        placeholder="Ex. : Ingénieur — M2"
                        maxLength={60}
                        disabled={updateProfile.isPending}
                        autoFocus
                    />
                    <SoftInput
                        label="Seuil d'alerte (jetons)"
                        type="number"
                        icon={<Gauge size={16} />}
                        value={threshold}
                        onChange={(event) => setThreshold(event.target.value)}
                        placeholder="Ex. : 100000"
                        min={0}
                        step={1000}
                        disabled={updateProfile.isPending}
                    />
                </div>
            </Modal>
        </div>
    );
};
