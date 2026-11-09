# PingCortex — design.md

> Document de référence visuelle destiné à un outil/IA de design (Stitch, etc.).
> Objectif : permettre la génération et l'amélioration de maquettes **fidèles** à l'identité existante,
> avec des propositions assumées d'évolution. Tout ce qui est marqué « à préserver » est une
> contrainte forte ; les suggestions d'amélioration sont libres tant qu'elles restent dans les tokens.

---

## 1. Le produit en une page

- **PingCortex** est une application d'apprentissage assistée par IA pour étudiants (autodidactes ingénieurs).
  L'utilisateur colle/charge le contenu d'un cours, une analyse IA (LLM) en extrait des **concepts**,
  et l'app pilote la **répétition espacée** (révisions programmées) via deux types d'activités :
  - **Quiz** (QCM générés),
  - **Feynman** (expliquer un concept avec ses propres mots, l'IA évalue).
- Domaine de vocabulaire imposable (jamais « flashcards », jamais « cartes ») :
  *concepts, quiz, Feynman, supports, maîtrise, révisions du jour, couvert, en veille, usage (jetons), clé API active*.
- **Langue : français (fr-FR)**, ton positif et direct, vouvoiement dans les messages système,
  formats de dates `fr-FR` (ex. `3 nov.`), nombres `fr-FR` (ex. `12 480`).
- Nom du produit : « **Ping**Cortex » avec « Ping » en couleur primaire (voir logo sidebar).
- Slogan d'ambiance actuel dans la sidebar : « Espace d'apprentissage ».

## 2. Contraintes techniques (à préserver)

- **Stack** : React 19 + TypeScript, Tailwind CSS **v4**, package de design system `@pingcortex/ui`
  (composants partagés), `lucide-react` pour les icônes.
- **Theming** : tokens CSS custom définis dans `@theme inline` (Tailwind v4), toggle **light/dark/system**
  via classe `.dark`. Deux palettes complètes — tout composant doit avoir son état dark.
- **Icônes** : uniquement `lucide-react`, tailles usuelles 12/13/14/16/18/20/22 px.
- **Polices** : pile système (`font-sans`), pas de webfont custom aujourd'hui.
- Props des composants à ne pas renommer : voir §6.

## 3. Direction visuelle

### 3.1 Principes

1. **Néumorphisme soft** : le fond de surface est **toujours** la couleur de fond locale (`bg-core-bg`),
   la profondeur vient des ombres duales (saillie `shadow-neu-flat`, creusée `shadow-neu-pressed`) —
   jamais de bordures sombres fortes, jamais d'élévation « carte flottante » extérieure à elles-mêmes.
2. **Hub‑and‑spoke** : une zone centrale d'information (carte ou liste) entourée d'un rail latéral.
3. **Hiérarchie par contraste de texte** (main-text vs sub-text, graisse, taille) plus que par couleur.
4. **Accent chromatique rare** : primaire/secondaire réservés aux actions et marqueurs d'état.
5. **Densité aérée** : paddings généreux (24 px standard), rayons très ronds.

### 3.2 Palettes exactes

| Rôle | Token | Light | Dark |
| --- | --- | --- | --- |
| Fond de page (surface de base) | `core-bg` | `#F9FAFB` | `#111827` |
| Fond de conteneur (carte flottée au-dessus) | `container-bg` | `#FFFFFF` | `#1F2937` |
| Texte principal | `main-text` | `#1F2937` | `#E5E7EB` |
| Texte secondaire/métadonnées | `sub-text` | `#4B5563` | `#9CA3AF` |
| Primaire (marque, marqueur «Ping») | `primary` / `primary-strong` | `#22D3EE` / `#0E7490` | `#00F5FF` / `#00F5FF` |
| Secondaire (accent/action能力强) | `secondary` / `secondary-strong` | `#6366F1` / `#4F46E5` | `#818CF8` / `#818CF8` |
| Texte sur primaire | `on-primary` | `#1F2937` | `#111827` |
| Texte sur secondaire | `on-secondary` | `#FFFFFF` | `#111827` |
| Succès | `success` | `#15803D` | `#4ADE80` |
| Avertissement | `warning` | `#A16207` | `#FACC15` |
| Danger | `danger` / `on-danger` | `#BE123C` / `#FFFFFF` | `#FB7185` / `#111827` |

Ombres duales (variables) : `shadow-dark` (`#d5dbe5` / `#070a12`), `shadow-light` (`#ffffff` / `#182238`).

### 3.3 Ombres (tokens)

| Token | Effet | Usage |
| --- | --- | --- |
| `shadow-neu-flat` | `8px 8px 16px dark, -8px -8px 16px light` | carte saillante standard |
| `shadow-neu-flat-sm` | idem ×0.5 | petits contrôles (pastilles, toggles, icônes) |
| `shadow-neu-pressed` | inset ×5px | champ, zone « creusée », piste de barre |
| `shadow-neu-pressed-sm` | inset ×3px | petits creux, conteneur de données |
| `shadow-glow-primary|secondary|success|warning|danger` | halo coloré 20 px mix 35–45 % | CTA génération, actif |
| `shadow-neu-glow-*` | flat + glow composés | CTA principal avec entraînement néu |

### 3.4 Rayons

`rounded-neu-sm` = 12 px (boutons, badges, champs), `rounded-neu-md` = 20 px (cartes, modales),
`rounded-neu-lg` = 28 px, plus Tailwind `rounded-2xl` (16 px) pour les sous-panneaux internes,
`rounded-full` pour pastilles/avatar/icônes circulaires.

## 4. Typographie & micro-copy

- Titres de page (`h1` du header) : `text-2xl font-black tracking-tight text-main-text`.
- Sous-titre/description : `text-xs text-sub-text`.
- Titre de section dans carte : `text-base (ou text-sm)` `font-bold`, souvent précédé d'une icône 16–18 px colorée (secondaire ou primaire).
- Données chiffrées : `tabular-nums` + `font-black` (ex. stats), labels en **MAJUSCULES** `text-[10px] font-bold tracking-wide text-sub-text`.
- Métadonnées de liste : `text-[11px] text-sub-text`, séparées par `·` (point médian) — ex. `12/14 couverts · 9 maîtrisés · 1 à réviser`.
- Citations : `text-sm italic` + attribution non-italique `— Auteur`.
- Messages : jamais de point final sur un titre ; phrases complètes pour les descriptions ; ellippe `…` pour les états en attente.
- Adresses via « l'utilisateur » au vouvoiement dans les notices système (« veuillez vous reconnecter »),
  tutoiement implicite dans les CTA courants (« Démarrer les révisions »).

## 5. Espace et rythme (grille)

- Base **4 px** ; rythme de page : `gap-6` (24 px) et `space-y-6` — INTERDIT d'intro duire des hacks (`top-26`, marges négatives).
- Padding carte standard : `p-6` (24 px) ; sous-rangées denses : `p-4/5`.
- Grille écran authentifiée : `AppLayout` = sidebar fixe (collapsée 96 px, dépliée 256 px) + header (titre à gauche, thème/notifications/profil à droite) + `main` scrollable **p-8**.
- Grilles de contenu : `grid grid-cols-1 gap-6 lg:grid-cols-3` (zone principale `lg:col-span-2`), listes `flex flex-col gap-3/4`.
- Écart vertical entre sections d'une colonne : 24 px uniforme.

## 6. Inventaire des composants (`@pingcortex/ui`)

| Composant | Déclinaisons / props clés | Usage |
| --- | --- | --- |
| `Button` | `variant: primary\|secondary\|generate\|danger\|ghost`, `isGlowing`, `loading`, `leftIcon`, `size sm/md/lg` | CTA ; « generate » = action IA (icône étincelle auto) ; ghost = annulations/secondary-actions |
| `Badge` | `variant: neutral\|primary\|secondary\|success\|warning\|danger`, `size sm/md/lg`, `dot`, `ping`, `leftIcon` | étiquettes d'état ; `ping` = pulsation d'existence active |
| `AnalysisStatusBadge` | `status: PENDING\|ANALYZING\|READY\|FAILED` | statut d'analyse IA d'un cours ; PENDING/ANALYZING = en cours (pulsé) |
| `NeumorphicCard` | `variant: flat\|pressed\|convex`, `p-6` standard | conteneur universel ; **convex** = gradient container-bg→core-bg pour le héro ; **pressed** = citation, creux |
| `ProgressBar` | `variant: circular\|linear`, `label`, `subLabel`, `caption`, `color`, `threshold`, `actionText/onActionClick` | circular = taux de maîtrise dont la couleur est pilotée par le palier (<25 danger, <80 warning, ≥80 success) ; linear = progression par cours |
| `Tabs` | `variant: underline\|segmented`, `TabsTrigger( icon, badge)`, `TabsContent( keepMounted)` | underline = onglets de détail de cours ; segmented = paramètres |
| `SoftInput` | `label`, `error`, `icon` (texte court), `rounded-neu-sm`, ombre pressée | champ formulaire |
| `PromptInput` | `onSubmit`, `loading`, `suggestions[]`, `placeholder` | zone « prompt IA » : textarea auto-extensible + chips de suggestions + bouton « Générer » (variante generate, glowing) |
| `Modal` | `open/onOpenChange`, `title`, `description`, `footer`, `size sm/md/lg`, `dismissible` | création de cours, confirmation destructive ; fermeture X, overlay blur |
| `Toaster`/`toast` | `toast.success/error/warning(message, {description})` | retour d'action Mutation (jamais d'alert) |
| Skeletons | `Skeleton`, `LoadingRegion`, `CardListSkeleton`, `CardDetailSkeleton`, `CircularSkeleton` | états de chargement de pages |
| `ToggleTheme` | interrupteur light/dark | header |

## 7. Écrans de référence

### 7.1 Tableau de bord `/dashboard` (3/2 + rail)

1. **Héro (card convex)** : « Bon retour, {Prénom} » (prénom en `primary-strong`) +
   sous-ligne stats (« N activités à réviser aujourd'hui, sur X cours actifs ») + CTA « Démarrer les révisions » (generate, glowing, désactivé si 0 activité).
2. **Citation du jour (card pressed)** : icône « Quote » en pastille circulaire + citation italique + `— Auteur`.
3. **Révisions du jour (card flat)** : header avec icône BrainCircuit + compteur « N activités restantes ».
   Chaque rangée (card interne `rounded-2xl shadow-neu-pressed-sm`) :
   badge d'activité (Quiz = primary, Feynman = secondary, fallback « À réviser » = neutral) |
   nom du concept (bold) + titre du cours (11 px sub) | « Tous les X j » + bouton d'action secondaire de taille sm.
4. **PromptIA** en fond de colonne : suggestions contextuelles.
5. **Rail droit** : anneau de « Maîtrise globale » (circular 170 px, sous-titre `X / Y concepts maîtrisés`)
   + rangée de 3 stats (Maîtrisés / En cours / À couvrir) + « Progression des cours » (une ProgressBar linéaire par cours avec sous-label couverts · maîtrisés · à réviser).

### 7.2 Cours `/courses`

Header de page avec icône en pastille + CTA « Ajouter un cours » (generate).
Grille de cartes `md:grid-cols-2` : titre (2 lignes max), description (2 lignes), `AnalysisStatusBadge`,
pied avec lien « Ouvrir le cours » + toggle d'activation (boutonActif = fond success + glow success).
Modale de création : SoftInput « Titre » + textarea « Contenu » + notice « l'analyse peut prendre une à deux minutes » + footer Annuler / Créer.
États : liste vide (icône + 2 phrases + CTA), erreurs (icône TriangleAlert ambre + message + Réessayer), skeleton de 4 cartes.

### 7.3 Détail de cours `/courses/:courseId`

Retour « ‹ Mes cours », titre + badge actif/en veille, description bornée.
Bandeau statut : `AnalysisStatusBadge` + éventuels avis (« L'analyse prend plus de temps que prévu », ambre ; « L'analyse a échoué », rose) +
carte de reprise FAILED avec bouton « Relancer l'analyse ».
Onglets underline : `Supports | Concepts | Quiz | Feynman | Chat` (icônes lucide).
Contenu = panneaux `rounded-3xl bg-core-bg shadow-neu-flat p-6`.

### 7.4 Révision `/review` et Paramètres `/settings`

- Révision : en-tête avec pastille icône, liste de rangées concept + échéance (« jeu. 6 nov. · tous les 7 j »), état vide chaleureux.
- Paramètres : Tabs segmented `Clés API | Usage | Profil` via `?tab=`; clés = rangées de cartes,
  statut Active (badge success + ring secondary/40), Usage = 3 stats (jetons reçus/générés/requêtes) + jauge vs seuil d'alerte,
  Profil = lignes étiquettes/valeurs.

## 8. États (convention transversale)

- **Chargement** : blocs `animate-pulse bg-container-bg` aux dimensions du contenu (jamais de spinner à plein écran hors auth).
- **Vide** : icône 28 px `text-sub-text` centrée, 1 phrase bold `text-main-text` + 1 phrase sub + éventuel CTA.
- **Erreur** : `TriangleAlert` ambre (`text-amber-500`) + message d'erreur obtenu du mapper d'erreurs + bouton Réessayer (secondary).
- **Succès d'action** : toast (jamais d'interstitiel).

## 9. Do / Don't

| ✅ Do | ❌ Don't |
| --- | --- |
| Cartes `core-bg` + ombre duale | bordures sombres marquées, drop-shadows grises |
| Un seul CTA primaire par écran | plusieurs CTA pétants |
| `sub-text` pour tout ce qui est métadonnée | gris aléatoire hors tokens |
| Icônes lucide 12–22 px alignées au texte | icônes emoji, tailles mixées |
| Rayons 12/16/20/28 px | angles droits |
| Variables importées des tokens | hexagones codés en dur dans les maquettes |
| Espacement 24 px homogène | hacks de positionnement |

## 10. Brief pour l'IA de design (Stitch)

Générer des améliorations **dans les tokens ci-dessus**, pour : tableau de bord, liste de cours, détail de cours (onglets),
révision, paramètres, modale de création, et un écran d'onboarding gamme.
Particulièrement attendu :
- affiner le tri de la colonne principale (héro/citation/liste/prompt) et la proportion 2/3 ↔ rail,
- proposer une meilleure hiérarchie des 3 stats globales (Maîtrisés/En cours/À couvrir),
- enrichir les cartes de progression de cours (gestion des statuts d'analyse PENDING/ANALYZING/READY),
- un traitement distinct du mode dark (les ombres duales y sont plus profondes : `#070a12` / `#182238`).
À conserver systématiquement : néumorphisme du par, tokens de couleur/shadow/radius, vocabulaire produit (§1),
langue française, transitions d'entrées douces (`tw-animate-css` fade/zoom dans les modaux).
