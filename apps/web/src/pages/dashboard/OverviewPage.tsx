import { ProgressBar } from "@pingcortex/ui";

export const OverviewPage = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Tableau de bord de révision</h1>
    <p className="text-sub-text">
      Vos statistiques d'apprentissage et vos rappels de **Répétition espacée** (*méthode d'apprentissage optimisant la mémorisation en espaçant les révisions dans le temps*).
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <ProgressBar
        variant="circular"
        value={85}
        label="Architecture Spring Boot"
        subLabel="Évalué sur 150 questions"
        color="#10b981"
        actionText="Continuer la révision"
        onActionClick={() => console.log('Lancer révision Java')}
      />

      <ProgressBar
        variant="circular"
        value={60}
        label="Express JS"
        subLabel="Évalué sur 90 cartes"
        color="#f59e0b"
        actionText="Approfondir"
        onActionClick={() => console.log('Lancer révision Réseaux')}
      />

      <ProgressBar
        variant="circular"
        value={20}
        label="Modèle OSI & Routage"
        subLabel="Évalué sur 90 cartes"
        color="#f59e0b"
        actionText="Approfondir"
        onActionClick={() => console.log('Lancer révision Réseaux')}
      />
    </div>
    <div className="max-w-md mx-auto my-4">
      <ProgressBar
        variant="linear"
        value={70}
        max={100}
        label="Objectif Quotidien de Rappel"
        subLabel={`70 / 100 cartes révisées aujourd'hui`}
        color="#6366f1"
      />
    </div>
  </div>
);