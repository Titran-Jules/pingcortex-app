import React, { useState } from 'react';
import { ToggleTheme, Button, Badge, ProgressBar, Modal, Tabs, TabsList, TabsTrigger, TabsContent, PromptInput, CardListSkeleton } from '@pingcortex/ui';
import { Sparkles } from 'lucide-react';

export const ComponentsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPromptLoading, setIsPromptLoading] = useState(false);

    return (
        <div className="min-h-screen bg-core-bg p-8 text-main-text space-y-12">
            <div className="flex justify-between border-b border-main-text/10 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <Sparkles className="text-secondary" /> PingCortex - Design System Playground
                    </h1>
                    <p className="text-sub-text mt-1">
                        Espace de test isolé pour les composants neumorphiques de l'application. Mode DEV actif.
                    </p>

                </div>
                <ToggleTheme />
            </div>

            {/* Section 1 : Buttons */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">1. Boutons (Button.tsx)</h2>
                <div className="flex flex-wrap gap-4 items-center p-6 rounded-3xl bg-core-bg shadow-neu-flat">
                <Button variant="primary">Primaire</Button>
                <Button variant="secondary">Secondaire</Button>
                <Button variant="generate" isGlowing>Générer (Glow)</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" loading>Chargement</Button>
                </div>
            </section>

            {/* Section 2 : Badges */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">2. Badges (Badge.tsx)</h2>
                <div className="flex flex-wrap gap-4 items-center p-6 rounded-3xl bg-core-bg shadow-neu-flat">
                <Badge variant="neutral">Neutre</Badge>
                <Badge variant="primary">Primaire</Badge>
                <Badge variant="success" dot ping>Succès (Actif)</Badge>
                <Badge variant="warning">Avertissement</Badge>
                <Badge variant="danger">Danger</Badge>
                </div>
            </section>

            {/* Section 3 : Progress Bars */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">3. Barres de Progression (ProgressBar.tsx)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProgressBar variant="circular" value={85} label="Maîtrise Java" subLabel="150 cartes évaluées" />
                <ProgressBar variant="circular" value={45} label="Réseaux OSPF" subLabel="90 cartes évaluées" />
                <ProgressBar variant="linear" value={70} label="Objectif Quotidien" subLabel="35 / 50 cartes" />
                </div>
            </section>

            {/* Section 4 : Tabs */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">4. Onglets (Tabs.tsx)</h2>
                <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat">
                    <Tabs defaultValue="concepts">
                        <TabsList aria-label=''>
                            <TabsTrigger value="concepts" badge={14}>Concepts</TabsTrigger>
                            <TabsTrigger value="feynman">Méthode Feynman</TabsTrigger>
                            <TabsTrigger value="chat">Chat IA</TabsTrigger>
                        </TabsList>
                        <TabsContent value="concepts">Contenu des concepts clés...</TabsContent>
                        <TabsContent value="feynman" keepMounted>Zone de rédaction Feynman (état conservé)...</TabsContent>
                        <TabsContent value="chat" keepMounted>Fil de discussion du chat...</TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Section 5 : Modale (Modal.tsx) */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">5. Modales (Modal.tsx)</h2>
                <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat flex gap-4">
                    <Button onClick={() => setIsModalOpen(true)}>Ouvrir la Modale</Button>
                    <Modal
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        title="Confirmation requise"
                        description="Ceci est un test de modale neumorphique intégrée."
                        footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                            <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirmer</Button>
                        </>
                        }
                    >
                        <p className="text-sub-text">Contenu dynamique de la modale pour PingCortex.</p>
                    </Modal>
                </div>
            </section>

            {/* Section 6 : Prompt Input & Skeletons */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">6. Prompt Input & Skeletons</h2>
                <div className="space-y-6 p-6 rounded-3xl bg-core-bg shadow-neu-flat">
                    <PromptInput 
                        onSubmit={() => {
                        setIsPromptLoading(true);
                        setTimeout(() => setIsPromptLoading(false), 2000);
                        }}
                        loading={isPromptLoading}
                        placeholder="Testez l'input de prompt IA..."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <CardListSkeleton />
                    </div>
                </div>
            </section>
        </div>
    );
};