import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@pingcortex/ui';
import { BookOpen, Brain, HelpCircle, MessageSquare, Edit3 } from 'lucide-react';

export const CourseDetailView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const currentTab = searchParams.get('tab') || 'concepts';

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-main-text mb-6">Architecture Spring Boot & Bases de Données</h2>

            <Tabs value={currentTab} onValueChange={handleTabChange} variant='underline'>
                <TabsList aria-label="Sections du cours">
                    <TabsTrigger value="supports" icon={<BookOpen size={16} />}>
                        Supports
                    </TabsTrigger>
                    <TabsTrigger value="concepts" icon={<Brain size={16} />} badge={14}>
                        Concepts
                    </TabsTrigger>
                    <TabsTrigger value="quiz" icon={<HelpCircle size={16} />}>
                        Quiz
                    </TabsTrigger>
                    <TabsTrigger value="feynman" icon={<Edit3 size={16} />}>
                        Feynman
                    </TabsTrigger>
                    <TabsTrigger value="chat" icon={<MessageSquare size={16} />}>
                        Chat IA
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="supports">
                    <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat text-main-text">
                        <h3 className="font-semibold text-lg mb-2">Documents et PDFs du cours</h3>
                        <p className="text-sub-text">Chargement des supports en cours...</p>
                    </div>
                </TabsContent>

                <TabsContent value="concepts">
                    <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat text-main-text">
                        <h3 className="font-semibold text-lg mb-2">Liste des 14 Concepts clés</h3>
                        <p className="text-sub-text">Cartes de répétition espacée prêtes pour la révision.</p>
                    </div>
                </TabsContent>

                <TabsContent value="quiz">
                    <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat text-main-text">
                        <h3 className="font-semibold text-lg mb-2">Quiz d'évaluation rapide</h3>
                        <p className="text-sub-text">Testez vos connaissances sur le module actif.</p>
                    </div>
                </TabsContent>

                <TabsContent value="feynman" keepMounted>
                    <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat text-main-text">
                        <h3 className="font-semibold text-lg mb-2">Méthode Feynman</h3>
                        <p className="text-sub-text mb-4">Expliquez le concept avec vos propres mots :</p>
                        <textarea 
                            placeholder="Écrivez votre explication ici (le brouillon est conservé)..."
                            className="w-full h-32 p-3 rounded-2xl bg-core-bg text-main-text shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="chat" keepMounted>
                    <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat text-main-text">
                        <h3 className="font-semibold text-lg mb-2">Discussion avec PingCortex AI</h3>
                        <p className="text-sub-text">Le fil de discussion reste actif et mémorisé.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};