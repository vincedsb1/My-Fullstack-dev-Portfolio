# Spécifications fonctionnelles et techniques

## Refonte de la section Projets et système d'études de cas

**Projet :** My Fullstack Dev Portfolio<br>
**Dépôt de référence :** [vincedsb1/My-Fullstack-dev-Portfolio](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio)<br>
**Statut :** spécification prête pour implémentation<br>
**Date de référence :** 20 octobre 2026<br>
**Langues cibles :** français (`fr`) et anglais (`en`)

> Ce document décrit la cible fonctionnelle, l'architecture recommandée et le séquencement d'implémentation. Il ne constitue pas une implémentation. Pendant la phase actuelle, aucun composant React, aucune route, aucune dépendance et aucun contenu définitif d'étude de cas ne doit être créé.

---

## 0. Mode d'emploi et règles de décision

Ce document est la référence centrale pour la refonte des projets. Il est autonome afin d'être transmissible à un agent qui ne disposerait pas immédiatement d'un accès au dépôt.

Il couvre l'état actuel, le classement exact des quinze projets, le carrousel, les modales, les archives, les routes localisées, l'architecture TypeScript/MDX/médias, le template visuel, le contrat d'audit, le SEO, l'accessibilité, les tests et les étapes d'implémentation.

### Référence visuelle obligatoire

[Consulter la maquette UX/UI de référence](./tude_de_cas_template_r_utilisable.html)

Le fichier doit être ouvert et examiné réellement avant toute implémentation du template : structure HTML, styles, composition desktop/mobile, interactions, variantes RICH/STANDARD/LIGHT, workflow, architecture, galerie, lightbox et thèmes clair/sombre. Son empreinte SHA-256 validée est `7c5dd37ca6d18f7fa3c73d84aadd3b9abe2f447d25e6d6aa4cc74667c4f66517`. En cas d'absence ou de différence d'empreinte, l'implémentation est bloquée jusqu'à résolution ; aucune ancienne version ne doit être substituée silencieusement.

### 0.1 Sources de vérité

En cas de conflit, appliquer cet ordre :

1. exigences explicites du propriétaire, notamment noms et ordre des projets ;
2. informations techniques vérifiées dans les dépôts audités ou confirmées explicitement ;
3. direction artistique de `docs/tude_de_cas_template_r_utilisable.html` ;
4. conventions et contraintes du dépôt existant ;
5. recommandations de ce document.

La maquette HTML est une référence de composition et d'interaction. Ses dates, technologies, rôles, architectures, résultats, URLs, placeholders et données de démonstration ne sont pas des données de production.

### 0.2 Politique de véracité

Ne publier aucune affirmation sans preuve identifiable : dépôt audité, fichier précis, fonctionnalité observable, URL contrôlée ou confirmation du propriétaire.

Ne jamais inventer de métrique, utilisateur, revenu, architecture, intégration, fonctionnalité, rôle, lien externe ou traduction. Une information manquante doit rester absente ou être signalée comme à vérifier.

### 0.3 État de la phase actuelle

À la fin de cette phase, le document de spécifications et la copie de référence de la maquette doivent être présents dans `docs/`. La maquette doit rester strictement inchangée. Aucun code applicatif ne doit être modifié et aucun commit, push ou déploiement ne doit être effectué.

---

## 1. Contexte et objectifs produit

### 1.1 Contexte

Le portfolio présente un profil de développeur Fullstack Senior orienté React, Next.js, TypeScript, Node.js, SaaS et produits métier. La section Projets actuelle montre des cartes, mais n'explique pas encore suffisamment les problèmes traités, les décisions techniques, les preuves visuelles et la contribution réelle.

La refonte doit renforcer la valeur perçue auprès des recruteurs techniques, CTO, Engineering Managers, Product Owners, Product Managers et clients freelance.

### 1.2 Objectifs

Le visiteur doit comprendre rapidement :

1. le problème résolu ;
2. les utilisateurs concernés ;
3. le rôle réel de Vincent ;
4. les contraintes et décisions ;
5. les preuves visuelles et techniques ;
6. les limites connues.

La qualité visuelle doit donner envie de poursuivre la lecture sans remplacer les preuves par des effets décoratifs.

### 1.3 Cible fonctionnelle

La cible comprend exactement :

- 4 projets à la une sur l'accueil ;
- 3 autres projets sur l'accueil ;
- 8 projets dans les archives ;
- 15 pages de détail ;
- un catalogue partagé ;
- des pages FR et EN uniquement lorsque le contenu correspondant existe réellement.

### 1.4 Hors périmètre

Ne pas introduire de base de données, CMS, backend supplémentaire, espace d'administration, filtre complexe, pagination, refonte globale du portfolio, second design system ou moteur de graphes lourd sans justification.

---

## 2. Audit technique du dépôt de départ

Les chemins ci-dessous ont été observés lors de l'audit. Ils doivent être vérifiés à nouveau avant toute édition.

### 2.1 Stack et scripts

| Élément | État connu |
|---|---|
| Framework | Next.js `^16.4.0`, App Router |
| UI | React `^18` |
| Langage | TypeScript `^5` |
| CSS | Tailwind CSS `^3.3.0` |
| i18n | `next-intl ^4.14.9` |
| Animation | Framer Motion `^12.23.24`, AOS `^2.3.4` |
| Icônes | `lucide-react ^0.291.0` |
| MDX | `@mdx-js/loader`, `@mdx-js/react`, remark/rehype |
| Radix | Accordion présent, Dialog absent lors de l'audit |
| Dev local | port `3006` |
| Tests actuels | validation blog, SEO blog, locales, lint |

Scripts à préserver :

```text
npm run dev
npm run build
npm run start
npm run blog:validate
npm run blog:test:seo
npm run locale:test
npm run lint
```

### 2.2 Routage et i18n

Le routage actif est notamment organisé autour de :

```text
src/app/(localized)/[locale]/layout.tsx
src/app/(localized)/[locale]/page.tsx
src/app/(localized)/[locale]/HomeContent.tsx
src/app/(localized)/[locale]/blog/page.tsx
src/app/(localized)/[locale]/blog/[slug]/page.tsx
src/proxy.ts
i18n.config.ts
```

Constats : locales `fr` et `en`, locale par défaut `en`, `localePrefix` toujours présent, layout localisé Server Component, `generateStaticParams`, `setRequestLocale` et pattern SEO déjà présents dans le blog.

### 2.3 Section Projets active

Le composant actif est `src/app/components/Projects3.tsx`. Il utilise `next-intl`, `next/image`, Framer Motion, AOS et Lucide. Il embarque actuellement types, données, carrousel et cartes dans un seul fichier.

Limites constatées :

- pas d'autoplay ;
- pas de barre de progression ;
- pas d'arrêt définitif après interaction volontaire ;
- pas de gestion de `document.visibilityState` ni de `prefers-reduced-motion` dédiée ;
- une seule action externe ;
- pas de route interne, modale ou page d'archives ;
- Iconise et Suggst absents du catalogue actif ;
- données non mutualisées avec de futures pages de détail.

### 2.4 Composants historiques et dépendances

À considérer comme historiques jusqu'à vérification :

```text
src/app/components/Projects.tsx
src/app/components/Project2.tsx
PROJECTS3.md
CARROUSEL.md
PROJECT2.md
```

Illustrations existantes :

```text
src/app/components/projectsIllustrations/SmartFlowIllustration.tsx
src/app/components/projectsIllustrations/TruthifyIllustration.tsx
```

Elles sont principalement décoratives et ne remplacent pas le contenu éditorial indexable.

`tailwind.config.ts` utilise `darkMode: "class"`, possède déjà des écrans personnalisés et une animation légère. La nouvelle section doit réutiliser ces conventions.

`@radix-ui/react-dialog` n'est pas installé. `src/app/juliedieris/DownloadModal.tsx` est le précédent existant pour focus trap, Échap, click outside, restauration du focus et blocage du scroll. Le choix entre Radix Dialog et une factorisation interne est à valider avant installation.

### 2.5 SEO et tests existants

`src/app/sitemap.ts` référence actuellement l'accueil, le blog et ses articles, mais aucune route projet. `src/app/robots.ts` référence déjà le sitemap.

Le blog fournit le pattern de `generateStaticParams`, `generateMetadata`, canonical, alternates, Open Graph, Twitter et JSON-LD.

Le dépôt ne contient pas de configuration directe Playwright, Cypress, Vitest, Jest, Testing Library ou axe-core. Une suite E2E est donc une décision d'outillage à prendre, pas une capacité déjà disponible.

---

## 3. Maquette de référence et direction artistique

### 3.1 Référence

La maquette fournie est [`docs/tude_de_cas_template_r_utilisable.html`](./tude_de_cas_template_r_utilisable.html). Elle montre un hero immersif, des sections alternées, un workflow, un diagramme d'architecture, des défis, une galerie, une vidéo facultative, une lightbox et une navigation finale. La version locale doit conserver la SHA-256 `7c5dd37ca6d18f7fa3c73d84aadd3b9abe2f447d25e6d6aa4cc74667c4f66517`.

Elle n'est pas une implémentation de production. Son HTML, son JavaScript vanilla, `innerHTML`, ses placeholders, ses URLs de démonstration et ses données fictives ne doivent pas être copiés dans Next.js.

### 3.2 Exigence de qualité visuelle

Les futures pages doivent être modernes, élégantes, premium et dignes des plus belles pages de portfolio logiciel de 2026. La qualité UX/UI est une exigence fonctionnelle : une page qui contient les bonnes informations mais perd la composition, le rythme, les proportions ou la qualité d'interaction de la maquette est non conforme.

À préserver :

- espaces généreux ;
- titres éditoriaux très grands ;
- hero centré et immersif ;
- actions visibles sous le texte ;
- grand mockup ou média sous les actions ;
- palette neutre avec accent rouge ;
- bordures fines, grands arrondis, ombres maîtrisées ;
- alternance de fonds ;
- compositions asymétriques utiles ;
- diagrammes techniques élégants ;
- animations discrètes ;
- dark mode travaillé ;
- responsive conçu sur mesure.

### 3.3 Intégration au portfolio

Réutiliser autant que possible les typographies, tokens Tailwind, thème, navigation, footer, liens professionnels, conventions de boutons, Framer Motion et Lucide déjà présents. Ne pas créer de design system isolé. Documenter tout écart dû à l'accessibilité, la performance, le SEO ou une contrainte du dépôt.

### 3.4 Hero de référence

Le hero principal n'est pas un hero desktop en deux colonnes par défaut. Il suit cette séquence :

1. contexte de navigation ;
2. badge type/période ;
3. H1 très grand ;
4. accroche orientée problème ou valeur ;
5. description courte ;
6. actions ;
7. grand mockup, capture, illustration ou animation sous le texte ;
8. rôle, périmètre et stack en informations secondaires.

Une variante en deux colonnes reste possible pour un projet particulier, mais ne doit pas remplacer automatiquement la composition centrée.

### 3.5 Correspondance maquette / production

| Élément de la maquette | Décision de production |
|---|---|
| Sélecteur RICH/STD/LIGHT | démonstration uniquement, jamais public |
| `projectsData` | catalogue TypeScript et manifestes validés |
| `innerHTML` | composants React typés |
| URLs `#demo-*` | URL réelle ou action absente |
| `placehold.co` | interdit dans le contenu publié |
| `lucide.createIcons()` | `lucide-react` |
| panneau de démonstration | supprimé |
| vidéo d'exemple | supprimée sans vidéo vérifiée |
| lightbox native | composant React accessible |
| panneaux workflow superposés | état React avec un seul panneau accessible |
| flèches séquentielles | relations `edges` réelles |

---

## 4. Inventaire et classement exact des quinze projets

### 4.1 Classement cible

À la une, exactement dans cet ordre :

1. `Allaw`
2. `Iconise`
3. `Suggst`
4. `SmartFlow`

Autres projets, exactement dans cet ordre :

1. `AI System`
2. `Aimoto`
3. `Truthify`

Archives, exactement dans cet ordre :

1. `CodeMaster`
2. `Décor Nature`
3. `Is Tesla Worth It?`
4. `LIIC`
5. `Wilder Game`
6. `QuickFlow`
7. `Legal Constat`
8. `Emmaüs Connect`

Les noms et la casse sont contractuels. Les variantes `Smartflow`, `Quickflow` ou `Légal Constat` doivent être normalisées.

### 4.2 Matrice avant/après

| Nom | Identifiant connu | Classe actuelle | Classe cible | Position | Média connu | Vérification nécessaire |
|---|---|---|---|---:|---|---|
| Allaw | `allaw` | featured | featured | 1 | `public/allaw.jpg` | URL, rôle, stack, contenu, droits |
| Iconise | à créer | absent | featured | 2 | lien blog vers `iconise.fyi`, pas de média actif identifié | dépôt, URL, stack, captures, contenu |
| Suggst | à créer | absent | featured | 3 | aucun média actif identifié | dépôt macOS, stack, captures, contenu |
| SmartFlow | `smartflow` | featured | featured | 4 | `SmartFlowIllustration.tsx` | URL, contenu, visuels |
| AI System | `aiSystem` | other | other | 1 | `public/aiSystem.png` | contenu, état GitHub |
| Aimoto | `aimoto` | featured | other | 2 | `public/aimoto.png`, `aimoto2.png` | URL publique, dépôt, étude |
| Truthify | `truthify` | featured | other | 3 | illustration existante | contenu, média principal |
| CodeMaster | `codeMaster` | other | archive | 1 | `public/codemaster.png` | dépôt, contenu, licence |
| Décor Nature | `decorNature` | other | archive | 2 | `public/decornature.png` | URL, dépôt, contenu |
| Is Tesla Worth It? | `teslaApp` | other | archive | 3 | `public/isteslaworthit.png` | slug, dépôt, stack, contenu |
| LIIC | `liic` | other | archive | 4 | `public/liic.png` | URL, dépôt, contenu |
| Wilder Game | `wilderGame` | other | archive | 5 | `public/wildersgame.jpg` | dépôt, stack, contenu |
| QuickFlow | `legalDirectory` à vérifier | other | archive | 6 | `public/quickflow.png` | confirmer l'identité historique |
| Legal Constat | `legalConstat` | other | archive | 7 | `public/legalconstat.png` | URL, dépôt, contenu |
| Emmaüs Connect | `emmausConnect` | other | archive | 8 | `public/emmausconnect.png` | URL, dépôt, droits |

Une URL contrôlée lors de l'audit reste à revalider au moment de l'implémentation. Une réponse HTTP valide ne justifie pas à elle seule le contenu éditorial.

### 4.3 Migration des identifiants

Le projet identifié par `legalDirectory` doit être vérifié avant renommage. Options : conserver l'identifiant et afficher QuickFlow, ou introduire `quickFlow` avec un alias de migration. Ne supprimer aucun alias tant que les références du dépôt n'ont pas été vérifiées.

### 4.4 Conservation

Le reclassement déplace les projets entre catégories. Il ne supprime ni données, ni images, ni identifiants historiques.

### 4.5 Visibilité d'un projet et publication de son étude de cas

Le catalogue des quinze projets et la publication de leurs études de cas sont deux états indépendants.

#### Visibilité du projet

La présence d'une entrée dans le catalogue signifie que le projet peut être affiché dans la section correspondant à son placement : featured, other ou archive. Les quinze entrées cibles doivent pouvoir être conservées dans le catalogue même si leur étude de cas n'est pas encore rédigée.

Cette visibilité concerne la carte, le nom, la description courte vérifiée, le média disponible et les liens externes vérifiés. Elle ne signifie pas qu'une page de détail est publiée.

#### Statut de l'étude de cas

Le statut est porté par locale et non par le projet global :

```text
not-started → draft → in-review → validated → published
```

Une locale peut être `published` alors qu'une autre est encore `draft` ou `not-started`.

Critères minimum pour `published` :

- contenu éditorial rédigé dans la locale ;
- faits techniques vérifiés et reliés à des preuves ;
- manifestes et médias validés ;
- title, description, H1 et structure de sections prêts ;
- liens externes contrôlés ;
- accessibilité clavier et contrastes vérifiés ;
- rendu clair/sombre et responsive vérifié ;
- route directe testée ;
- absence de placeholder, donnée fictive ou section vide ;
- sitemap et alternates cohérents.

#### Comportement transitoire recommandé

La carte du projet reste visible dans son groupe cible afin de respecter le catalogue `4/3/8`, mais aucune action ne doit conduire vers une 404 prévisible.

Tant que l'étude de cas de la locale courante n'est pas `published` :

- les grandes cartes masquent le lien actionnable `Voir le détail` ;
- elles peuvent afficher à sa place un libellé non interactif, par exemple « Étude de cas en préparation » / « Case study in preparation » ;
- la modale d'une petite carte reste ouvrable, mais l'action de détail est absente ou remplacée par le même libellé non interactif ;
- les actions GitHub et externes restent disponibles uniquement si leurs URLs sont vérifiées ;
- la page d'archives conserve la carte mais n'affiche pas de lien de détail actif ;
- les liens précédent/suivant d'une étude publiée parcourent uniquement les projets possédant une étude `published` dans la locale courante ;
- une URL directe d'une étude non publiée renvoie 404 ou n'est pas générée ;
- le sitemap et les alternates excluent cette étude.

Cette politique évite à la fois la 404 prévisible, le faux contenu de démonstration et la disparition des quinze projets du portfolio. Lorsque les quinze études seront publiées, toutes les actions `Voir le détail` deviendront automatiquement actives à partir du même catalogue.

#### Décisions à valider

La recommandation est de masquer le bouton non disponible et de le remplacer par un statut textuel discret. Il faut encore valider :

1. le libellé final FR/EN du statut ;
2. l'affichage ou non de ce statut sur les grandes cartes ;
3. l'affichage ou non de ce statut dans les modales et archives ;
4. le fait que la navigation précédent/suivant soit limitée aux études publiées, recommandé ici.

---

## 5. Architecture de données

### 5.1 Couches

Séparer clairement :

1. **Catalogue** : identité, classement, slug, état, liens et disponibilité.
2. **Manifestes structurés** : sections visuelles et interactives validées par TypeScript.
3. **MDX** : narration longue et éditoriale.
4. **Médias** : fichiers et métadonnées de présentation.
5. **Traductions JSON** : libellés génériques de l'interface.
6. **Preuves** : sources justifiant les affirmations.

Ne pas stocker dans du MDX libre les graphes, états de publication, URLs, IDs médias ou contrats d'accessibilité qui doivent être validés par le code.

### 5.2 Arborescence cible

Cette arborescence est une cible, à créer uniquement dans les étapes correspondantes :

```text
src/content/projects/
├── types.ts
├── catalog.ts
├── taxonomy.ts
├── validation.ts
├── loaders.ts
├── media.ts
├── manifests/
│   ├── shared/*.ts
│   ├── fr/*.ts
│   └── en/*.ts
└── case-studies/
    ├── fr/*.mdx
    └── en/*.mdx

src/app/components/projects/
├── ProjectFeaturedCarousel.tsx
├── ProjectFeaturedPanel.tsx
├── ProjectCard.tsx
├── ProjectActions.tsx
├── ProjectQuickActionsDialog.tsx
├── ProjectArchiveGrid.tsx
├── ProjectSectionHeading.tsx
├── ProjectMediaFrame.tsx
└── case-study/
    ├── CaseStudyPage.tsx
    ├── CaseStudyHero.tsx
    ├── CaseStudyOverview.tsx
    ├── CaseStudyVideo.tsx
    ├── CaseStudyWorkflow.tsx
    ├── CaseStudyArchitecture.tsx
    ├── CaseStudyGallery.tsx
    ├── CaseStudyChallenges.tsx
    ├── CaseStudyDecisions.tsx
    ├── CaseStudyResults.tsx
    ├── CaseStudyNavigation.tsx
    └── CaseStudyLightbox.tsx
```

### 5.3 Types du catalogue

```ts
export type Locale = "fr" | "en";

export type ProjectPlacement = "featured" | "other" | "archive";

export type PortfolioVisibility = "visible" | "hidden";

export type CaseStudyPublicationStatus =
  | "not-started"
  | "draft"
  | "in-review"
  | "validated"
  | "published";

export type ProjectMaturity =
  | "concept"
  | "prototype"
  | "personal"
  | "client"
  | "production"
  | "archived"
  | "unknown";

export type ProjectKind =
  | "saas"
  | "web-app"
  | "native-app"
  | "tool"
  | "extension"
  | "showcase"
  | "game"
  | "unknown";

export interface EvidenceReference {
  type: "repository" | "file" | "url" | "owner-confirmed" | "audit-report";
  source: string;
  locator?: string;
  note: string;
  verifiedAt: string;
}

export interface ProjectLink {
  href: string;
  isExternal: true;
  verifiedAt: string;
  status: "verified" | "unverified" | "unavailable";
}

export interface ProjectLinks {
  live?: ProjectLink;
  github?: ProjectLink;
  malt?: ProjectLink;
  contact?: ProjectLink;
}

export interface ProjectMediaReference {
  id: string;
  src: string;
  kind: "image" | "video" | "illustration" | "diagram";
  width?: number;
  height?: number;
  aspectRatio?: string;
  priority?: boolean;
  verified: boolean;
}

export interface CaseStudyLocalePublication {
  status: CaseStudyPublicationStatus;
  manifestFile?: string;
  mdxFile?: string;
  lastReviewedAt?: string;
}

export interface ProjectCatalogEntry {
  id: string;
  slug: string;
  canonicalName: string;
  portfolioVisibility: PortfolioVisibility;
  placement: ProjectPlacement;
  order: number;
  kind: ProjectKind;
  maturity: ProjectMaturity;
  links: ProjectLinks;
  technologies: string[];
  media: ProjectMediaReference[];
  legacyIds?: string[];
  caseStudyByLocale: Partial<Record<Locale, CaseStudyLocalePublication>>;
  evidence: EvidenceReference[];
}
```

Règles :

- IDs et slugs uniques ;
- `canonicalName` défini une seule fois ;
- ordre unique par catégorie ;
- slug minuscule, stable et sans accent ;
- lien absent omis, jamais remplacé par `#` ;
- URL externe affichée seulement si `status: "verified"` ;
- média manquant représenté par absence, pas par placeholder ;
- contenu publié associé à une preuve et à une version locale réelle.

### 5.4 Types des sections visuelles

```ts
export interface ProjectSharedHeroData {
  heroMediaId?: string;
}

export interface ProjectSharedOverviewData {
  hasAudience?: boolean;
  hasScope?: boolean;
  hasSolution?: boolean;
}

export type SharedWorkflowVisual =
  | { type: "icon"; icon: string }
  | { type: "mockup"; mediaId: string }
  | { type: "flow"; stepIds: string[] }
  | { type: "result"; icon?: string }
  | { type: "custom"; renderer: string; payload: Record<string, string | number | boolean> };

export interface SharedWorkflowStep {
  id: string;
  visual: SharedWorkflowVisual;
}

export interface SharedWorkflowData {
  stepIds: string[];
  steps: SharedWorkflowStep[];
}

export interface SharedArchitectureNode {
  id: string;
  type: "client" | "api" | "database" | "service" | "ai" | "native" | "storage" | "external" | "other";
  technology?: string;
  icon?: string;
  highlight?: boolean;
  column?: number;
  position?: { x: number; y: number };
}

export interface SharedArchitectureEdge {
  id: string;
  source: string;
  target: string;
  flow?: "request" | "response" | "event" | "data" | "unknown";
  dashed?: boolean;
}

export interface ProjectSharedArchitectureData {
  layout: "flow" | "columns" | "custom";
  nodes: SharedArchitectureNode[];
  edges: SharedArchitectureEdge[];
}

export interface ProjectSharedManifest {
  projectId: string;
  hero?: ProjectSharedHeroData;
  overview?: ProjectSharedOverviewData;
  workflow?: SharedWorkflowData;
  architecture?: ProjectSharedArchitectureData;
  mediaIds: string[];
  similarProjectIds?: string[];
}

export interface ProjectLocaleHeroData {
  eyebrow?: string;
  hook: string;
  shortDescription: string;
  role?: string;
  period?: string;
}

export interface ProjectLocaleOverviewData {
  problem: string;
  audience?: string;
  scope?: string;
  solution?: string;
  role?: string;
}

export type LocaleWorkflowVisual =
  | { type: "icon"; title: string; description: string }
  | { type: "mockup"; caption?: string }
  | { type: "flow"; labels: Record<string, string> }
  | { type: "result"; title: string; description?: string }
  | { type: "custom"; copy?: string };

export interface LocaleWorkflowStep {
  id: string;
  title: string;
  description: string;
  visual: LocaleWorkflowVisual;
}

export interface ProjectLocaleWorkflowData {
  title?: string;
  introduction?: string;
  steps: LocaleWorkflowStep[];
}

export interface LocaleArchitectureNode {
  id: string;
  label: string;
  role?: string;
}

export interface LocaleArchitectureEdge {
  id: string;
  label?: string;
}

export interface ProjectLocaleArchitectureData {
  title?: string;
  description?: string;
  legend?: string;
  nodes: LocaleArchitectureNode[];
  edges: LocaleArchitectureEdge[];
}

export interface LocaleChallengeData {
  id: string;
  title: string;
  problem?: string;
  constraint?: string;
  decision?: string;
  solution?: string;
  tradeoff?: string;
  observableResult?: string;
  evidence?: EvidenceReference[];
}

export interface LocaleGalleryItem {
  id: string;
  mediaId: string;
  layout?: "hero" | "wide" | "half" | "portrait" | "comparison";
}

export interface ProjectLocaleGalleryData {
  title?: string;
  items: LocaleGalleryItem[];
  lightbox: boolean;
}

export interface ProjectLocaleVideoData {
  title: string;
  transcript?: string;
  caption?: string;
}

export interface ProjectLocaleMediaCopy {
  mediaId: string;
  alt: string;
  caption?: string;
}

export interface ProjectLocaleManifest {
  projectId: string;
  locale: Locale;
  status: CaseStudyPublicationStatus;
  mdxFile: string;
  seo: { title: string; description: string };
  media: ProjectLocaleMediaCopy[];
  hero: ProjectLocaleHeroData;
  overview?: ProjectLocaleOverviewData;
  video?: ProjectLocaleVideoData;
  workflow?: ProjectLocaleWorkflowData;
  architecture?: ProjectLocaleArchitectureData;
  gallery?: ProjectLocaleGalleryData;
  challenges?: LocaleChallengeData[];
  technicalDecisions?: Array<{
    id: string;
    title: string;
    explanation: string;
    alternatives?: string;
    evidence?: EvidenceReference[];
  }>;
  results?: Array<{
    id: string;
    title: string;
    description: string;
    evidence?: EvidenceReference[];
  }>;
  lessons?: string[];
  limitations?: string[];
}
```

### 5.5 Architecture multilingue et source de vérité

Les données sont séparées en deux niveaux afin de ne pas obliger un manifeste anglais à posséder des textes français.

#### Données communes aux langues

Le catalogue et le `ProjectSharedManifest` sont communs :

- `projectId`, slug, nom canonique, placement et ordre ;
- type, maturité, visibilité sur le portfolio et liens ;
- technologies vérifiées et preuves ;
- chemins, dimensions, ratios et état de vérification des médias ;
- IDs et types des étapes du workflow ;
- IDs, types, positions, colonnes et relations `source`/`target` de l'architecture ;
- ordre de composition et références de projets similaires.

Les textes visibles, les labels de nœuds, les légendes, les alts, les titres de sections, les descriptions et le SEO ne sont pas stockés dans cette couche commune.

#### Données localisées

Le `ProjectLocaleManifest` existe dans `fr/` ou `en/` et contient uniquement la version de la locale concernée :

- hook, description, rôle et période rédigés dans la locale ;
- problème, audience, périmètre et solution ;
- textes du workflow ;
- labels de nœuds et d'arêtes ;
- défis, décisions, résultats, leçons et limites ;
- alt et légendes des médias ;
- titre, description et autres champs SEO ;
- chemin vers le MDX de la même locale.

Les champs structurels sont reliés par des IDs communs. Le français n'est donc pas obligatoire dans un manifeste anglais : chaque manifeste localisé porte des chaînes simples dans sa propre langue.

#### Relation catalogue, manifeste et MDX

Le catalogue est la source de vérité du classement et de la publication. `caseStudyByLocale[locale]` indique le statut et les chemins du manifeste/MDX. Le manifeste partagé décrit la structure vérifiée. Le manifeste localisé décrit les textes courts et les labels nécessaires aux composants. Le MDX de la même locale est la source de vérité des paragraphes longs et est référencé par `mdxFile`.

Un texte long ne doit pas être recopié dans le manifeste. Un label nécessaire au rendu structuré ne doit pas être enfoui dans le MDX. Cette séparation évite la duplication sans rigidifier la narration.

#### Traduction manquante

Si une locale est absente, ne pas fabriquer de fallback éditorial silencieux. Le loader renvoie un état non publiable pour cette locale ; la carte reste visible si le projet est visible, mais l'action de détail est masquée ou remplacée par le statut transitoire décrit en section 4.5. Les labels génériques de l'interface utilisent uniquement les fichiers `fr.json`/`en.json` existants.

#### Validation des locales publiables

Pour chaque locale candidate :

1. le catalogue déclare une entrée `caseStudyByLocale` ;
2. le manifeste localisé correspond au même `projectId` et à la même locale ;
3. son statut est `validated` ou `published` selon le contexte ;
4. son fichier MDX existe et possède le frontmatter correspondant ;
5. les sections référencées ont des IDs présents dans le manifeste partagé ;
6. les champs SEO et les textes minimum sont présents ;
7. la route, le rendu, l'accessibilité et le sitemap sont validés.

Seule la dernière étape de publication fait passer le statut à `published`.

### 5.6 Responsabilités du MDX

Le MDX contient la narration longue : introduction, explication du problème, décisions, retour d'expérience, enseignements et limites. Il ne doit pas devenir le conteneur non contrôlé des routes, liens, graphes, IDs médias, états de publication ou libellés d'accessibilité.

Chaque fichier MDX est relié à un `projectId` et à une locale. Son frontmatter minimal est validé :

```yaml
projectId: allaw
locale: fr
status: draft
contentVersion: 1
title: "Nom officiel vérifié"
description: "Description réellement rédigée et validée."
```

Une version anglaise ne doit pas être créée par simple copie du français.

### 5.7 Validation sans dépendance supplémentaire par défaut

La validation interne doit couvrir cardinalité `4/3/8`, ordre, unicité ID/slug, visibilité du portfolio, statut par locale, URLs `https:` et absence de `#`, références médias, arêtes valides, IDs workflow uniques, cohérence manifeste/MDX, champs minimum de publication et suppression des sections vides. Une bibliothèque supplémentaire n'est envisageable qu'après mesure et validation explicite.

### 5.8 Fixtures de développement non publiées

Le template doit être validable avant la rédaction des quinze études de cas. Prévoir des fixtures dédiées, séparées du catalogue publiable, dans un emplacement explicite tel que `src/content/projects/fixtures/` ou un dossier de test équivalent.

La fixture doit porter un marqueur non publiable, par exemple `status: "fixture"`, et être exclue de :

- `generateStaticParams` ;
- `generateMetadata` de production ;
- sitemap ;
- JSON-LD indexable ;
- liens de navigation publics ;
- compte des quinze projets réels.

Couverture minimale :

- une fixture RICH ;
- une fixture STANDARD ;
- une fixture LIGHT ;
- une seule capture ;
- plusieurs captures ;
- sans vidéo ;
- sans workflow ;
- sans architecture ;
- un, deux, trois, quatre et cinq défis ;
- workflow de deux, trois, quatre et cinq étapes ;
- diagramme de plusieurs nœuds avec relations non linéaires ;
- contenu long ;
- contenu court ;
- locale absente ;
- liens externes absents ou explicitement indisponibles.

Les textes de fixture doivent être visiblement neutres ou explicitement marqués « contenu de test » dans l'environnement de développement. Ils ne doivent jamais être réutilisés comme descriptions de projets réels.

---

## 6. Accueil : carrousel et cartes à la une

### 6.1 Grandes cartes

Conserver le principe de la carte actuelle : média dominant, nom, description, technologies vérifiées, contrôles et deux actions. Le cycle exact est :

```text
Allaw → Iconise → Suggst → SmartFlow → Allaw
```

La carte active au chargement est Allaw. Aimoto et Truthify ne doivent plus apparaître dans cette zone.

### 6.2 Actions

Action principale :

- FR : `Voir le détail` ;
- EN : `View case study` ;
- vrai lien `next/link` vers la route interne ;
- priorité visuelle et focus visible.

Action secondaire :

- FR : `Accéder au projet` ;
- EN : `Visit project` ;
- HTTPS réelle et vérifiée ;
- ouverture externe sécurisée si nouvel onglet ;
- absence ou état désactivé expliqué si aucune URL publique ;
- jamais `href="#"` ou URL fictive.

### 6.3 États du carrousel

Modéliser explicitement `running`, `paused-hover`, `paused-hidden`, `stopped-manually`, `disabled-reduced-motion` et `transitioning`.

Valeurs de référence :

```text
index initial : 0
projet initial : Allaw
durée d'un cycle : 4000 ms
transition cible : environ 500 ms
```

### 6.4 Autoplay et arrêt manuel

- attendre quatre secondes complètes ;
- passer au suivant ;
- revenir à Allaw après SmartFlow ;
- remettre la progression à zéro ;
- ne pas changer d'index pendant une transition ;
- nettoyer timers et listeners au démontage.

Arrêter définitivement l'autoplay pour la session après précédent, suivant, indicateur, activation clavier, drag/swipe significatif ou interaction avec un bouton/lien de carte.

Après l'arrêt : navigation manuelle active, aucun timer recréé, progression figée et aucun redémarrage provoqué par thème, resize ou remontage interne.

### 6.5 Hover, visibilité et drag

Le survol suspend le compte à rebours sans réinitialiser le temps écoulé. Le départ reprend le temps restant si l'autoplay n'a pas été arrêté. Sur mobile, ne pas simuler un hover.

Avec `document.visibilityState`, annuler le timer quand la page devient cachée, conserver le temps écoulé et reprendre le temps restant au retour sans rattraper plusieurs cycles. Supprimer le listener au démontage.

Le drag est horizontal et possède un seuil. Un drag significatif arrête l'autoplay et ne doit pas déclencher le lien de la carte. Les contrôles clavier restent disponibles.

### 6.6 Reduced motion

Lire `prefers-reduced-motion` côté client uniquement. Si la préférence est active : pas d'autoplay, transitions réduites ou instantanées, pas de barre animée en continu. Le rendu serveur ne dépend pas de `window`.

### 6.7 Barre de progression

Emplacement recommandé : sous la carte, dans sa coque, au-dessus ou au voisinage de la navigation.

- piste de 2 à 3 px ;
- largeur stable ;
- neutre et accent rouge compatibles clair/sombre ;
- progression 0–100 % en 4000 ms ;
- remise à zéro au changement ;
- pause visuelle cohérente avec le timer ;
- hauteur fixe, aucun CLS ;
- figée après arrêt manuel ou masquée selon validation.

L'animation CSS ne doit pas continuer après l'arrêt du timer React. L'horloge et le rendu partagent une source d'état.

### 6.8 Contrôles accessibles

Prévoir précédent, suivant, indicateurs, état actif, labels traduits, focus visible et annonce `aria-live="polite"` du projet changé sans annoncer chaque pourcentage.

---

## 7. Petites cartes, modales et archives

### 7.1 Petites cartes

Les trois autres projets sont exactement AI System, Aimoto et Truthify. Conserver la disposition responsive, mais remplacer l'ouverture directe par une modale. La carte doit être un bouton ou contenir un déclencheur sans bouton imbriqué dans un lien.

Le clic, Entrée et Espace ouvrent la modale. Les actions internes restent de vrais liens HTML.

### 7.2 Modale d'actions

Contenu : nom, illustration si disponible, description courte, `Voir le détail`, GitHub si public vérifié, accès externe si utile et fermeture explicite.

Pour un dépôt privé ou absent, masquer GitHub ou afficher une action désactivée expliquée sans `href`.

La modale gère `role="dialog"` ou une primitive équivalente, `aria-modal`, titre accessible, focus initial, focus trap, Échap, click outside, blocage du scroll et restitution du focus.

### 7.3 Choix de la primitive Dialog

`@radix-ui/react-dialog` n'est pas présent au départ. L'utiliser si l'ajout et sa compatibilité sont validés, sinon factoriser le comportement de `src/app/juliedieris/DownloadModal.tsx`. Ne pas maintenir deux implémentations et ne pas installer la dépendance avant la gate de décision.

### 7.4 Archives

Sous les trois cartes, afficher un lien secondaire `Archives` en français et `Archive` ou `Project archive` en anglais après validation éditoriale. C'est un vrai lien vers la route locale.

---

## 8. Page Archives et routes de détail

### 8.1 Routes d'archives

```text
/fr/projets/archives
/en/projects/archive
```

La page contient un H1, une introduction courte, un lien de retour, exactement huit cartes et les mêmes modales que l'accueil. Aucun filtre, recherche ou pagination.

Grille cible : une colonne sur petit mobile, deux selon tablette/petit desktop, trois sur grand desktop. Réutiliser `ProjectCard` avec un variant de contexte, pas une copie.

### 8.2 Routes de détail

```text
/fr/projets/[slug]
/en/projects/[slug]
```

Le slug est stable entre les langues sauf décision documentée. Utiliser des points d'entrée minces qui partagent loader et renderer. Ne pas coder quinze pages indépendantes.

La page doit utiliser :

- Server Components par défaut ;
- `generateStaticParams` ;
- `generateMetadata` ;
- `notFound()` pour slug inconnu, locale incorrecte ou contenu non publiable ;
- une politique de publication par locale ;
- `dynamicParams = false` si compatible avec le pattern Next.js du dépôt.

Une page française publiée n'implique pas automatiquement une page anglaise publiée.

### 8.3 Indexation

Le sitemap et les alternates ne contiennent que les versions réellement publiées. Une route non publiée est absente du sitemap et renvoie 404 ou n'est pas générée.

---

## 9. Template commun des études de cas

### 9.1 Variantes RICH, STANDARD et LIGHT

Il existe un seul système de page. Les variantes sont des niveaux de richesse éditoriale déterminés par les sections renseignées, les médias, le type de projet et les preuves disponibles.

Une section absente disparaît entièrement : pas de titre vide, carte vide, placeholder ou espace artificiel.

Exemples :

- Iconise : page potentiellement RICH avec workflow, médias, architecture et défis ;
- Allaw : page STANDARD ou RICH orientée plateforme B2B et parcours métier ;
- Suggst : page adaptée à une application macOS, avec captures et workflow contextuel ;
- CodeMaster : page LIGHT possible sans architecture complexe ni vidéo.

### 9.2 Ordre de rendu par défaut

1. navigation de contexte ;
2. hero ;
3. présentation synthétique ;
4. vidéo facultative ;
5. workflow facultatif ;
6. architecture facultative ;
7. galerie facultative ;
8. défis ;
9. décisions techniques et stack ;
10. résultats, enseignements et limites ;
11. projets précédent/suivant ou similaires ;
12. CTA professionnel et footer.

Un changement d'ordre doit être piloté par une donnée documentée, pas par des conditions dispersées dans les composants.

### 9.3 Hero

Afficher lorsque vérifié : nom, type, période, accroche, description, rôle, actions, média principal et technologies principales utiles.

Contraintes : H1 très grand mais responsive, largeur de ligne contrôlée, actions visibles, média sous le texte par défaut, ratio réservé, image prioritaire choisie avec parcimonie, aucune animation permanente distrayante.

### 9.4 Présentation synthétique

Composition éditoriale :

- colonne principale : hook, problème, solution ou périmètre ;
- colonne secondaire : rôle, audience, période, type, contribution ;
- bordure et fond secondaire ;
- labels courts ;
- paragraphes suffisamment courts pour préserver le rythme.

### 9.5 Vidéo

Facultative. Si elle existe : source réelle, poster vérifié, `preload="none"` ou lazy loading, pas d'autoplay sonore, contrôles accessibles, transcript ou alternative si nécessaire et dimensions réservées. Sans vidéo, la section est absente. Aucun faux lecteur.

### 9.6 Workflow utilisateur

Desktop : étapes à gauche, visualisation active à droite, état actif évident et contenu centré. Mobile : liste horizontale scrollable ou liste empilée, panneau sous l'étape active, aucun débordement.

Visualisations minimum :

1. icône, titre et description ;
2. capture dans un mockup ;
3. mini-diagramme ou parcours ;
4. résultat ou illustration finale.

Accessibilité :

- `role="tablist"`, `role="tab"`, `role="tabpanel"` ;
- `aria-selected`, `aria-controls`, `aria-labelledby` ;
- flèches, Home et End ;
- un seul onglet dans la tabulation ;
- panneau inactif non focusable ;
- un seul `activeStepId` ;
- transitions réduites selon la préférence.

Ne pas recopier la superposition de panneaux de la maquette sans gérer l'état React et le focus.

### 9.7 Architecture technique

Les `nodes` et `edges` doivent représenter les relations réelles. Le diagramme doit pouvoir illustrer SaaS React/Node, application macOS SwiftUI, extension navigateur, outil local, site simple ou pipeline IA.

Solution recommandée : rendu serveur léger, SVG pour les connecteurs, `viewBox` stable, colonnes ou positions issues des données, labels de flux, légende et représentation textuelle accessible. Ne pas introduire de moteur de graphe lourd sans justification.

Desktop : plusieurs cartes visibles, pas de scroll horizontal, connecteurs alignés. Mobile : verticalisation ou simplification, relations toujours compréhensibles et aucun chevauchement.

### 9.8 Défis

Chaque défi peut contenir problème, contrainte, décision, solution, compromis, résultat observable et preuves. Les champs absents ne produisent pas de labels vides.

| Nombre | Composition |
|---:|---|
| 0 | section absente |
| 1 | carte centrée de largeur maîtrisée |
| 2 | deux cartes équilibrées |
| 3 | une principale et deux secondaires, ou trois égales |
| 4 | grille 2 × 2 |
| 5+ | composition responsive sans carte isolée |

### 9.9 Galerie et médias

| Nombre | Rendu |
|---:|---|
| 0 | absente |
| 1 | grand visuel ou hero |
| 2 | composition équilibrée ou comparaison |
| 3 à 5 | galerie éditoriale avec média dominant |
| 6+ | affichage progressif ou navigation légère |

Chaque image possède alt, ratio, dimensions si connues, légende éventuelle, source et état de vérification. Utiliser `next/image` lorsque pertinent. La lightbox est facultative mais doit gérer bouton, focus, Échap, click outside, alt et légende.

### 9.10 Décisions, résultats et navigation

Les décisions expliquent architecture, technologies, alternatives documentées, sécurité, performance et maintenabilité. Les badges ne remplacent pas le raisonnement.

Les résultats montrent seulement les fonctionnalités livrées, résultats observables, difficultés résolues, enseignements et limites. Les métriques exigent une source.

La fin de page peut contenir retour projets, précédent/suivant, projets similaires, CTA contact/Malt réel et footer. Les liens vers des projets non publiés sont exclus.

---

## 10. Responsive, thème et animation

### 10.1 Points de contrôle

Valider au minimum : 1440 px, 1280 px, 1024 px, 768 px, 390 px et 320 px. À chaque largeur : pas de scroll horizontal, titre lisible, actions accessibles, média non écrasé, diagramme compréhensible, modale contenue et texte long maîtrisé.

### 10.2 Dark mode

Vérifier séparément les contrastes, bordures, fonds de cartes, images, accent rouge, focus, boutons, overlay, diagrammes, légendes et barre de progression. Le dark mode doit être conçu, pas seulement inversé.

### 10.3 Animations

Autoriser : entrée douce, changement de panneau, transition de carte, léger hover, dialogue et zoom contrôlé. Éviter mouvement permanent, parallaxe lourde, animation sonore, déplacement de layout et effets qui réduisent la lisibilité. Tout doit respecter `prefers-reduced-motion`.

---

## 11. SEO, i18n, accessibilité et performance

### 11.1 Métadonnées par projet

Chaque page publiée doit avoir :

- title unique ;
- meta description unique ;
- canonical localisée ;
- Open Graph title/description/image ;
- Twitter Card ;
- H1 unique ;
- hiérarchie H2/H3 ;
- liens internes ;
- images avec alt ;
- données structurées véridiques.

Ne pas reprendre les métadonnées génériques de la maquette.

### 11.2 Canonical et hreflang

Si les deux locales sont publiées : canonical vers chaque page locale et alternates `fr`/`en` réelles. Si une seule locale est publiée : canonical locale et aucun `hreflang` inventé. Ne jamais présenter du français comme traduction anglaise.

### 11.3 Données structurées

Prévoir `BreadcrumbList` et, lorsque justifié, `CreativeWork` ou un type plus spécifique. `SoftwareApplication` ne doit être utilisé que si le projet et les propriétés sont réellement vérifiables. `Person` et `WebSite` restent gérés par le layout existant sans duplication inutile.

### 11.4 Sitemap

Mettre à jour `src/app/sitemap.ts` pour inclure archives et détails publiés, avec alternates lorsque compatible avec le type retourné par Next.js. Exclure les études `not-started`, `draft` et `in-review`.

### 11.5 HTML initial et composants client

Le HTML initial doit contenir H1, description, overview, titres, contenu éditorial et liens principaux. Réserver les Client Components au carrousel, workflow, lightbox, modale, animations et interaction optionnelle du diagramme.

### 11.6 Accessibilité

Exiger navigation clavier, focus visible, labels traduits, rôles ARIA nécessaires, focus trap, restauration du focus, Échap, click outside, contraste, alt, alternative vidéo, résumé textuel du diagramme, reduced motion et absence d'interaction uniquement disponible au survol.

### 11.7 Performance

Surveiller LCP, CLS et INP. Réserver les ratios média, choisir l'image hero prioritaire avec parcimonie, différer les vidéos, optimiser les images, limiter le JS et éviter les calculs de layout permanents.

---

## 12. Contrat d'audit futur des dépôts de projets

### 12.1 Informations à collecter

Pour chaque projet : nom officiel, dépôt, slug, type, maturité, statut, période vérifiable, descriptions courte et longue, problème utilisateur, audience, périmètre, rôle, responsabilités, fonctionnalités, stack vérifiée, architecture, flux, services tiers, traitements asynchrones, décisions, alternatives documentées, tests, qualité, résultats, limites, URLs, visibilité GitHub, captures, vidéos, droits média, informations manquantes et sources précises.

### 12.2 Format JSON d'échange

Le format suivant est documentaire à ce stade :

```json
{
  "schemaVersion": "1.0",
  "project": {
    "id": "stable-project-id",
    "name": "Nom officiel vérifié",
    "slug": "nom-officiel",
    "repository": {
      "url": "https://github.com/owner/repository",
      "visibility": "public",
      "commitOrTagAudited": "commit-ou-tag",
      "auditedAt": "2026-10-20"
    },
    "type": "saas",
    "maturity": "production",
    "portfolioVisibility": "visible",
    "requestedPlacement": "featured",
    "requestedOrder": 1
  },
  "locales": {
    "fr": {
      "status": "draft",
      "shortDescription": "",
      "longDescription": "",
      "problem": "",
      "audience": "",
      "scope": "",
      "role": "",
      "seo": { "title": "", "description": "" }
    },
    "en": {
      "status": "not-started",
      "shortDescription": "",
      "longDescription": "",
      "problem": "",
      "audience": "",
      "scope": "",
      "role": "",
      "seo": { "title": "", "description": "" }
    }
  },
  "responsibilities": [],
  "features": [],
  "stack": [],
  "architecture": {
    "summary": "",
    "nodes": [],
    "edges": [],
    "asyncFlows": [],
    "integrations": []
  },
  "challenges": [],
  "technicalDecisions": [],
  "quality": { "tests": [], "linting": [], "ci": [], "security": [] },
  "results": [],
  "limitations": [],
  "links": { "live": null, "github": null, "video": null },
  "media": [],
  "missingInformation": [],
  "evidence": []
}
```

### 12.3 Règles du contrat

- tableau vide = non trouvé ou non renseigné, pas nécessairement inexistant ;
- `missingInformation` distingue absent, non vérifiable et à confirmer ;
- toute affirmation technique importante référence `evidence` ;
- URL privée non publiée comme URL publique ;
- capture avec chemin, ratio, alt et droit d'utilisation ;
- métrique sans source refusée ;
- date avec origine ;
- technologie du lockfile distinguée de technologie réellement utilisée ;
- responsabilités reliées à des fichiers, commits, tickets, documentation ou confirmation ;
- aucune publication automatique sans relecture éditoriale.

### 12.4 Méthode d'intégration

1. importer le JSON dans un espace temporaire ou un rapport versionné ;
2. vérifier ID, slug et classement ;
3. comparer liens et médias au catalogue ;
4. transformer les champs structurés en manifeste TypeScript ;
5. rédiger ou compléter le MDX à partir des faits ;
6. traduire séparément les locales validées ;
7. exécuter la validation catalogue/routes ;
8. faire relire le contenu ;
9. passer à `validated`, puis `published` après tests SEO et visuels.

---

## 13. Matrice des fichiers et composants

### 13.1 Fichiers existants potentiellement concernés

| Fichier | Rôle futur | Action prévue |
|---|---|---|
| `src/app/components/Projects3.tsx` | section d'accueil active | sortir les données, brancher le catalogue et les composants communs |
| `src/app/(localized)/[locale]/HomeContent.tsx` | montage de l'accueil | conserver le client nécessaire sans rendre les pages détail client |
| `src/i18n/fr.json` | libellés UI français | ajouter carrousel, actions, modales, archives et sections |
| `src/i18n/en.json` | libellés UI anglais | ajouter uniquement les équivalents réellement disponibles |
| `src/app/sitemap.ts` | indexation | ajouter archives et détails publiés |
| `tailwind.config.ts` | tokens éventuels | modifier seulement si un manque réel est démontré |
| `src/app/components/projectsIllustrations/*.tsx` | illustrations | conserver ou adapter sans casser clair/sombre |
| `package.json` | scripts/dépendances | uniquement après décision validée |
| `package-lock.json` | verrouillage | modifier seulement avec installation réelle |
| `src/app/(localized)/[locale]/layout.tsx` | contexte global | modifier seulement si les routes l'exigent |

### 13.2 Fichiers à préserver

```text
src/app/components/Projects.tsx
src/app/components/Project2.tsx
src/app/juliedieris/DownloadModal.tsx
src/app/globals.css
src/app/robots.ts
src/content/blog/**
docs/blog/**
```

Les anciens composants ne doivent pas être supprimés pendant la première migration.

### 13.3 Fichiers à créer ultérieurement

```text
src/content/projects/types.ts
src/content/projects/catalog.ts
src/content/projects/taxonomy.ts
src/content/projects/validation.ts
src/content/projects/loaders.ts
src/content/projects/media.ts
src/content/projects/manifests/shared/*.ts
src/content/projects/manifests/fr/*.ts
src/content/projects/manifests/en/*.ts
src/content/projects/case-studies/fr/*.mdx
src/content/projects/case-studies/en/*.mdx

src/app/components/projects/*.tsx
src/app/components/projects/case-study/*.tsx

src/app/(localized)/[locale]/projets/archives/page.tsx
src/app/(localized)/[locale]/projects/archive/page.tsx
src/app/(localized)/[locale]/projets/[slug]/page.tsx
src/app/(localized)/[locale]/projects/[slug]/page.tsx

scripts/validate-projects.mjs
scripts/test-projects-seo.mjs
```

L'emplacement exact peut être adapté aux conventions du dépôt, mais les responsabilités doivent rester séparées.

### 13.4 Composants fonctionnels

Prévoir :

- `ProjectFeaturedCarousel` : autoplay, progress, drag, contrôles et arrêt manuel ;
- `ProjectFeaturedPanel` : grande carte active ;
- `ProjectActions` : liens internes/externes et règles de disponibilité ;
- `ProjectCard` : carte compacte réutilisée accueil/archives ;
- `ProjectQuickActionsDialog` : modale d'actions ;
- `ProjectArchiveGrid` : grille des huit archives ;
- `ProjectSectionHeading` : titres et introductions communs ;
- `ProjectMediaFrame` : cadre, ratio, thème et légende ;
- `CaseStudyPage` : composition conditionnelle ;
- `CaseStudyHero` ;
- `CaseStudyOverview` ;
- `CaseStudyVideo` ;
- `CaseStudyWorkflow` et `CaseStudyWorkflowVisual` ;
- `CaseStudyArchitecture` et son rendu SVG ;
- `CaseStudyGallery` et `CaseStudyLightbox` ;
- `CaseStudyChallenges` ;
- `CaseStudyDecisions` ;
- `CaseStudyResults` ;
- `CaseStudyNavigation` ;
- `CaseStudyCollaborationCta`.

Chaque composant est Server Component par défaut. Ajouter `"use client"` seulement pour état local, API navigateur, événements, focus, modale, lightbox, carrousel, workflow et animation nécessaire.

---

## 14. Découpage d'implémentation logique

Les étapes sont ordonnées. Chaque étape doit être testée et validée avant la suivante.

### Étape 0 — Préparation et vérification

**Objectif :** revalider checkout, chemins, versions et maquette avant toute modification.

**Prérequis :** validation de ce document et absence de modification applicative non comprise.

**Fichiers à examiner :** `AGENTS.md`, `package.json`, `package-lock.json`, `Projects3.tsx`, `HomeContent.tsx`, layout localisé, sitemap, traductions, Tailwind et maquette.

**Tâches :**

- confirmer le chemin physique du dépôt ;
- relire les guides Next.js pertinents ;
- confirmer que `Projects3` est actif ;
- confirmer le pattern SEO du blog ;
- confirmer Radix Dialog ;
- relever les modifications concurrentes.

**Tests :** `git status --short --branch`, recherche des IDs/URLs, vérification de la maquette.

**Acceptation :** chaque chemin est confirmé ou marqué à créer, aucune modification de code n'est faite et les décisions dépendantes de Next.js sont identifiées.

**Gate :** périmètre de fichiers confirmé.

### Étape 1 — Catalogue et taxonomie

**Objectif :** créer la source de vérité des quinze projets et appliquer `4/3/8` sans perte.

**Fichiers :** `src/content/projects/types.ts`, `catalog.ts`, `taxonomy.ts`, `validation.ts`, `Projects3.tsx`, `fr.json`, `en.json`.

**Tâches fonctionnelles :**

- quatre featured dans l'ordre imposé ;
- trois autres dans l'ordre imposé ;
- huit archives dans l'ordre imposé ;
- ajout d'Iconise et Suggst avec statut d'étude `not-started` par locale si nécessaire ;
- noms contractuels exacts ;
- décision `legalDirectory`/QuickFlow.

**Tâches techniques :** sortir les données de `Projects3`, typer strictement, valider cardinalité, conserver alias historiques, omettre les liens manquants et éviter les duplications de traductions.

**Tests :** cardinalité, ordre, unicité, recherche de Aimoto/Truthify dans featured, clés FR/EN.

**Acceptation :** catalogue de quinze projets, aucun projet perdu, noms exacts, données non vérifiées non publiées.

**Risques :** ancien ID utilisé ailleurs, traduction contradictoire, URL historique, QuickFlow mal identifié.

**Gate :** taxonomie relue et tests passants.

### Étape 2 — Contrats, manifestes et validation

**Objectif :** composer RICH, STANDARD et LIGHT sans dupliquer les composants.

**Fichiers :** types, manifestes shared/localisés, MDX des locales réellement disponibles, loaders, validation, `scripts/validate-projects.mjs`.

**Tâches :** sections facultatives, champs manquants, statuts éditoriaux, locales indépendantes, preuves, validation médias/nœuds/arêtes/workflow/URLs/publication.

**Fixtures obligatoires :** riche, standard, light, sans vidéo, un média, sans architecture, arête invalide, locale absente, `href="#"` invalide.

**Acceptation :** un manifeste minimal valide reste rendu élégamment ; une erreur structurelle est lisible ; aucune donnée illustrative de la maquette n'est intégrée.

**Gate :** le validateur échoue sur données invalides et réussit sur fixtures minimales valides.

### Étape 3 — Routes et publication

**Objectif :** exposer archives et détails localisés sans dupliquer le renderer.

**Fichiers :** quatre pages de route proposées, loaders et politique de publication.

**Tâches :** routes FR/EN, `generateStaticParams`, `generateMetadata`, `notFound`, Server Components, slug inconnu, locale incorrecte, contenu non publiable.

**Tests :** routes d'archives, détail publié FR/EN, 404, draft exclu, génération des paramètres.

**Acceptation :** contenu principal visible sans JavaScript, aucun renderer dupliqué, routes directes fonctionnelles.

**Gate :** routes minimales fonctionnelles avec une fixture.

### Étape 4 — Primitives visuelles et shell

**Objectif :** construire la base fidèle à la maquette et au portfolio.

**Fichiers :** headings, media frame, page shell, hero, overview et éventuels tokens Tailwind.

**Tâches :** hero centré, grands titres, espaces, neutres/rouge, arrondis, bordures, ombres, fonds alternés, dark mode, ratio média, actions hiérarchisées.

**Interdits :** importer le HTML, CSS global inutile, design system parallèle, composant client global.

**Tests :** hero image/illustration/sans média, clair/sombre, 1440/1024/768/390/320, focus, CLS visuel.

**Gate :** validation visuelle du shell avant les sections complexes.

### Étape 5 — Première étude de cas

**Objectif :** construire le premier rendu complet du template avec un projet réel validé ou une fixture explicitement non publiée, avant d'alimenter quinze projets.

**Choix :** Iconise peut éprouver RICH après audit réel ; Allaw peut éprouver STANDARD. Si le contenu réel n'est pas encore validé, utiliser une fixture de développement marquée `fixture`, jamais indexable et jamais présentée comme une étude de cas terminée. Ne jamais utiliser les données fictives de la maquette comme contenu publié.

**Tâches :** hero, overview, sections conditionnelles, composition des zones workflow/architecture/galerie/défis, décisions, résultats, navigation, actions et contenu serveur. Les interactions essentielles sont finalisées à l'étape 6.

**Tests :** RICH/STANDARD/LIGHT, absence de sections, une ou plusieurs captures, contenu long/court, locale absente, zéro/un/deux/trois/quatre/cinq défis et vérification qu'une fixture n'est pas routable ni ajoutée au sitemap.

**Acceptation :**

- un seul template, aucune duplication par variante ;
- rendu élégant avec contenu riche ou minimal ;
- une première comparaison directe avec `./tude_de_cas_template_r_utilisable.html` porte sur le hero, la typographie, les espacements, les couleurs, les fonds alternés et le mockup ;
- lorsque l'environnement le permet, cette comparaison est faite sur de vrais rendus navigateur desktop, mobile, clair et sombre ;
- tout écart observé est listé et expliqué ;
- aucune fixture n'est accessible par une route publique, un lien interne, le sitemap ou les métadonnées d'indexation.

**Gate :** le shell et la composition de la première page sont acceptés, mais la production en série reste interdite jusqu'à la validation finale de l'étape 7.

### Étape 6 — Composants interactifs du template

**Objectif :** finaliser les interactions essentielles du template avant toute validation définitive.

**Tâches :** onglets du workflow, navigation clavier, visualisations icon/mockup/flow/result, SVG d'architecture piloté par `nodes`/`edges`, résumé accessible, galerie éditoriale, lightbox si bénéfice démontré, vidéo différée, transitions Framer Motion et reduced motion.

**Tests :** focus workflow, étapes de deux à cinq éléments, graphes à relations non linéaires, mobile sans chevauchement, lightbox au clavier, vidéo non téléchargée inutilement, un à cinq défis, une ou plusieurs captures, absence de vidéo/workflow/architecture, contenu long/court et locale absente.

**Acceptation :** tous les composants interactifs prévus par le template sont fonctionnels, génériques, accessibles et pilotés par les contrats ; aucun panneau inactif ou nœud masqué ne reste dans le focus ; aucun moteur lourd n'est ajouté sans validation.

**Gate :** le template est techniquement complet et prêt à subir la validation visuelle et fonctionnelle finale de l'étape 7. La production en série reste interdite.

### Étape 7 — Validation finale visuelle et fonctionnelle du template

**Objectif :** décider explicitement si le template complet peut être utilisé pour les quatorze autres études de cas.

**Comparaison obligatoire avec la maquette :**

- ouvrir réellement `docs/tude_de_cas_template_r_utilisable.html` ;
- examiner sa structure HTML, ses styles et ses interactions ;
- comparer hero, typographie, espacements, couleurs, fonds alternés, mockups, workflow, architecture, défis, galerie, navigation finale, lightbox, light mode, dark mode et rendu mobile ;
- effectuer la comparaison sur de vrais rendus navigateur lorsque l'environnement le permet ;
- répéter la comparaison après correction des écarts significatifs ;
- accepter uniquement les écarts nécessaires à l'accessibilité, au responsive, à la performance ou aux contraintes vérifiées du portfolio, avec justification écrite.

**Tests fonctionnels :** fixtures RICH, STANDARD et LIGHT ; une capture et plusieurs captures ; sans vidéo ; sans workflow ; sans architecture ; un à cinq défis ; workflow de deux à cinq étapes ; diagramme multi-nœuds avec relations non linéaires ; contenu long et court ; locale absente ; clair/sombre ; mobile ; reduced motion ; clavier ; HTML initial indexable.

**Critères d'acceptation :**

- direction visuelle immédiatement reconnaissable ;
- aucune page réduite à un mur de texte ;
- hero, médias, sections alternées et rythme de lecture conformes ;
- workflow, architecture, défis, galerie, lightbox, navigation finale et thèmes vérifiés ;
- accessibilité et performance préservées ;
- aucune fixture indexable ou présentée comme une réalisation réelle ;
- tous les écarts sont documentés.

**Gate :** validation explicite du template complet, visuelle et fonctionnelle, avant l'alimentation en série. Sans cette validation, l'étape 10 ne peut pas commencer.

### Étape 8 — Carrousel d'accueil

**Objectif :** implémenter autoplay, progression et arrêt manuel dans `Projects3` refactoré.

**Tâches :** catalogue, Allaw initial, timer 4 s, progress, arrêt définitif, hover, visibility API, reduced motion, verrou transition, drag/clic, clavier, suppression des anciens boutons.

**Tests :** attente 4 s, cycle, hover, clic, dot, drag, onglet caché, reduced motion, resize, thème, démontage.

**Gate :** aucun changement surprenant après une interaction et lecture tranquille garantie.

### Étape 9 — Modales et archives

**Objectif :** finaliser petites cartes, actions et archives.

**Tâches :** trois autres projets, décision Dialog, focus trap, Échap, click outside, liens internes, GitHub conditionnel, routes d'archives, grille partagée.

**Tests :** clic/Entrée/Espace, bon projet, action interne, GitHub absent, externe absent, focus, scroll, huit cartes, 1/2/3 colonnes.

**Gate :** modale utilisable sans souris et sans lien fictif.

### Étape 10 — Alimentation progressive

**Objectif :** importer les audits et publier les projets sans modifier le template à chaque fois.

**Ordre recommandé :** Allaw, Iconise, Suggst, SmartFlow, AI System, Aimoto, Truthify, CodeMaster, Décor Nature, Is Tesla Worth It?, LIIC, Wilder Game, QuickFlow, Legal Constat, Emmaüs Connect.

**Règles :** contrat d'audit, preuves, médias autorisés, informations manquantes, statuts par locale `not-started` → `draft` → `in-review` → `validated` → `published`, locales séparées.

**Gate :** chaque projet passe contenu, route, SEO et revue visuelle de sa variante.

### Étape 11 — SEO, i18n, accessibilité et performance

**Tâches :** metadata, canonical, alternates, OG, JSON-LD, sitemap, H1/H2, liens internes, alt, transcripts, contrastes, budget JS, ratios média, reduced motion, 404.

**Tests :** script HTML/SEO, HTML initial, metadata, canonical/hreflang, sitemap, JSON-LD, FR/EN, pages non publiées, clavier, lecteur d'écran ciblé, Lighthouse ou équivalent.

**Gate :** aucune page déclarée prête sans HTML initial, metadata et navigation clavier contrôlés.

### Étape 12 — Suite de tests et livraison contrôlée

**Tâches :** finaliser validation projets, test SEO, décider Playwright, documenter tests manuels, exécuter lint/build/blog validation/tests projets, vérifier liens et diff Git.

**Gate final :** tests passants, build contrôlé, carrousel/modales/archives validés, RICH/STANDARD/LIGHT vérifiés, clair/sombre/reduced motion vérifiés, aucune donnée inventée, aucune dépendance non validée et aucun fichier hors périmètre modifié sans justification.

---

## 15. Stratégie de tests détaillée

### 15.1 Tests de données

Vérifier automatiquement :

- quinze IDs uniques ;
- quatre featured, trois other et huit archive ;
- ordre exact dans chaque catégorie ;
- noms contractuels ;
- slugs uniques ;
- liens HTTPS ou absents ;
- aucun `#` ;
- médias référencés existants ou explicitement externes ;
- statut et locale cohérents ;
- arêtes valides ;
- IDs workflow uniques ;
- absence de section déclarée vide ;
- publication uniquement avec contenu et SEO minimum.

### 15.2 Tests du carrousel

Scénario principal :

1. charger la page ;
2. vérifier Allaw ;
3. attendre 4 secondes ;
4. vérifier Iconise ;
5. vérifier la progression ;
6. survoler et vérifier la pause ;
7. quitter le survol et vérifier la reprise ;
8. cliquer suivant ;
9. vérifier Suggst ;
10. attendre plus de 4 secondes ;
11. vérifier l'absence de changement automatique ;
12. naviguer manuellement jusqu'à SmartFlow puis Allaw.

Scénarios complémentaires : clic dot, précédent pendant transition, drag sous le seuil, drag au-dessus du seuil, onglet en arrière-plan, reduced motion, navigation clavier et démontage/remontage.

### 15.3 Tests des modales

- ouverture par clic, Entrée et Espace ;
- titre accessible ;
- focus initial ;
- cycle Tab et Shift+Tab ;
- Échap ;
- click outside ;
- restauration du focus ;
- scroll de fond bloqué ;
- liens HTML ;
- GitHub absent ou désactivé lorsqu'il n'est pas public.

### 15.4 Tests du workflow

- première étape active ;
- une seule étape sélectionnée ;
- flèches droite/bas et gauche/haut ;
- Home et End ;
- panneau actif accessible ;
- panneau inactif non focusable ;
- transition réduite ;
- une étape, quatre étapes et titres longs ;
- mobile sans overflow involontaire.

### 15.5 Tests du diagramme

- nœuds rendus ;
- arêtes rendues ;
- labels rendus ;
- flux événementiel distinct si nécessaire ;
- nœud mis en évidence ;
- mobile sans chevauchement ;
- résumé textuel ;
- état sans diagramme ;
- graphes à deux, quatre et plusieurs nœuds.

### 15.6 Tests SEO

Pour chaque route publiée : status HTTP, title unique, description unique, H1 unique, canonical, hreflang exact, Open Graph, JSON-LD parseable, breadcrumb, présence dans le sitemap. Pour une route non publiée : absence du sitemap et comportement 404/non génération.

### 15.7 Tests responsive et visuels

Comparer les rendus en 1440, 1280, 1024, 768, 390 et 320 px, en clair et en sombre, avec workflow actif et second état, modale ouverte, galerie ouverte si présente, texte long et reduced motion.

Vérifier absence de scroll horizontal, alignements, ratios, densité du diagramme, hauteur de cartes, focus, contraste, actions et CTA.

### 15.8 Tests E2E

Lorsque Playwright est validé et installé, couvrir accueil/carrousel, archives, détail RICH, STANDARD et LIGHT, navigation locale, modale, liens externes, 404 et reduced motion. Tant que l'outil n'est pas installé, ces tests doivent être indiqués comme à exécuter et non comme passés.

### 15.9 Tests des fixtures non publiées

Pour chaque fixture :

- vérifier le rendu attendu de la variante ;
- vérifier la suppression propre des sections absentes ;
- vérifier les longueurs de contenu ;
- vérifier les médias et ratios ;
- vérifier les défis et le workflow ;
- vérifier les relations non linéaires du diagramme ;
- vérifier clavier, reduced motion, clair/sombre et responsive ;
- vérifier qu'aucune fixture n'apparaît dans `generateStaticParams`, le sitemap, les JSON-LD de production ou les liens publics ;
- vérifier qu'une locale absente produit un état non publiable sans fallback éditorial silencieux.

---

## 16. Risques de régression et parades

| Risque | Conséquence | Parade |
|---|---|---|
| données encore embarquées dans `Projects3` | incohérences | catalogue unique et validation |
| mauvais classement | non-respect de la cible | test cardinalité/ordre |
| timer non nettoyé | changements tardifs ou fuite | hook dédié et cleanup |
| autoplay redémarré | utilisateur interrompu | ref d'arrêt manuel irréversible |
| drag déclenchant un lien | navigation accidentelle | seuil et séparation drag/click |
| panneau invisible focusable | accessibilité cassée | un seul panneau actif ou `hidden` correct |
| diagramme séquentiel faux | architecture trompeuse | `edges` validées et rendues |
| données de maquette publiées | contenu factuellement faux | statut d'audit et preuves |
| traduction anglaise inventée | crédibilité/SEO dégradés | locale non publiée |
| ajout Radix incompatible | build ou bundle affecté | gate dépendance et lockfile |
| routes dupliquées | indexation confuse | segments FR/EN exclusifs |
| images sans dimensions | CLS | dimensions et ratios |
| vidéo lourde | LCP dégradé | poster, `preload="none"`, lazy |
| tokens globaux modifiés | régressions ailleurs | changements minimaux |
| anciens composants supprimés | liens cassés | conservation pendant migration |
| modal maison incomplète | focus/clavier défaillant | Radix validé ou pattern existant |

---

## 17. Décisions à valider avant les étapes correspondantes

1. Maintenir strictement `/fr/projets/...` et `/en/projects/...`, ou adopter un segment commun si `next-intl` impose une autre convention.
2. Choisir Radix Dialog ou une factorisation interne de `DownloadModal.tsx`.
3. Confirmer l'identifiant canonique de QuickFlow.
4. Confirmer les URLs publiques et la règle d'ouverture dans un nouvel onglet.
5. Confirmer les dépôts GitHub publics.
6. Confirmer les droits d'utilisation des captures, vidéos et illustrations.
7. Choisir le premier projet réel pour valider le template.
8. Décider si la barre de progression reste figée ou se masque après arrêt manuel.
9. Décider si Playwright peut être ajouté.
10. Confirmer le stockage des médias : `public/projects/<slug>/` ou fichiers existants.
11. Confirmer les liens professionnels du CTA final.
12. Confirmer le traitement d'une page FR publiée sans traduction EN.
13. Valider le comportement transitoire des études non publiées : recommandation de masquer l'action et d'afficher un statut non interactif.
14. Valider les libellés FR/EN de ce statut et son affichage sur grandes cartes, modales et archives.
15. Confirmer que précédent/suivant parcourt uniquement les études publiées dans la locale courante.
16. Confirmer que la validation finale du template complet intervient après l'étape 7, avant toute production en série.

En cas de contradiction entre maquette et contrainte technique, la maquette prévaut pour la direction visuelle ; le dépôt et les exigences SEO/accessibilité prévalent pour l'architecture. Toute exception est documentée.

### 17.1 Matrice plan / maquette / spécifications

| Sujet | Plan validé | Maquette de référence | Décision de spécification |
|---|---|---|---|
| Hero | évoquait une variante desktop en deux colonnes | titre très imposant centré, actions puis grand média | hero centré immersif par défaut ; deux colonnes seulement comme variante justifiée |
| Sections | hero, overview, défis, architecture, galerie, vidéo, décisions, résultats | mêmes familles, avec rythmes et fonds alternés | système commun à sections facultatives, sans titre/espace vide |
| Variantes | template mutualisé pour quinze projets | RICH, STANDARD, LIGHT | trois niveaux éditoriaux d'un seul renderer |
| Données | catalogue TypeScript, MDX et médias | objet JS de démonstration | catalogue + manifestes typés + MDX narratif |
| Workflow | interaction à prévoir | étapes à gauche, visualisation à droite | état React, tabs accessibles, visualisations data-driven |
| Architecture | diagramme statique léger recommandé | nodes/edges et interactions démontrées | SVG/rendu serveur léger, relations `edges` réellement rendues, client facultatif |
| Galerie | médias optimisés, lightbox éventuelle | grands médias, compositions variables | layout selon nombre/type, `next/image`, lightbox conditionnelle |
| Vidéo | facultative et différée | lecteur avec poster | aucune section sans source réelle, pas d'autoplay sonore |
| Accueil | carrousel, actions et modales | navigation de démonstration | autoplay 4 s, arrêt manuel définitif, modales accessibles |
| SEO | routes localisées, metadata, sitemap | metadata génériques de prototype | metadata calculées par projet, hreflang uniquement réel |
| Publication | données vérifiées et statuts | données illustratives | les données de la maquette ne sont jamais publiées |

### 17.2 Livrables documentaires de cette phase

| Document | Rôle |
|---|---|
| `docs/PROJECTS_CASE_STUDIES_SPECIFICATIONS.md` | référence fonctionnelle et technique unique, étapes, contrats, tests, prompt et checklist |
| `docs/tude_de_cas_template_r_utilisable.html` | référence UX/UI validée fournie par le propriétaire ; non modifiée et non copiée comme code de production |

Les futures étapes de développement pourront créer des documents complémentaires dans `docs/projects/` si la granularité opérationnelle le justifie, mais aucun second document n'est nécessaire pour démarrer l'implémentation après validation.

---

## 18. Prompt autonome pour l'agent d'implémentation

Le bloc suivant peut être transmis à un agent qui n'a pas accès au contexte complet du dépôt. Il doit être utilisé après validation de ce document et étape par étape.

```text
Tu implémentes la refonte de la section Projets et le système d'études de cas du portfolio suivant :
https://github.com/vincedsb1/My-Fullstack-dev-Portfolio

OBJECTIF

Produis une section Projets et des pages de détail modernes, élégantes et premium, dignes des plus belles pages de portfolio logiciel de 2026. La qualité UX/UI, la lisibilité, la crédibilité technique, l'accessibilité et la performance sont des exigences fonctionnelles. Ne construis pas une page générique composée uniquement de titres, paragraphes et badges de technologies.

CONTEXTE TECHNIQUE DU DÉPÔT

- Next.js ^16.4.0 avec App Router.
- React ^18 et TypeScript ^5.
- Tailwind CSS ^3.3.0 avec darkMode: "class".
- next-intl ^4.14.9, locales fr et en, localePrefix always.
- Framer Motion ^12.23.24 et AOS déjà installés.
- lucide-react déjà installé.
- @radix-ui/react-accordion installé ; @radix-ui/react-dialog absent au départ.
- Serveur de développement sur le port 3006.
- Scripts existants : build, lint, blog:validate, blog:test:seo et locale:test.
- Ne modifie pas le blog ni les sections sans rapport.
- Lis les guides pertinents dans node_modules/next/dist/docs/ avant d'écrire du code, car cette version de Next.js comporte des changements de conventions.

ARCHITECTURE À INSPECTER AVANT TOUTE MODIFICATION

- src/app/(localized)/[locale]/layout.tsx : layout localisé Server Component, métadonnées globales, Person/WebSite JSON-LD.
- src/app/(localized)/[locale]/page.tsx : page d'accueil.
- src/app/(localized)/[locale]/HomeContent.tsx : composition client de l'accueil.
- src/app/components/Projects3.tsx : section Projets active, cartes et carrousel.
- src/i18n/fr.json et src/i18n/en.json : traductions.
- src/app/sitemap.ts et src/app/robots.ts : SEO et sitemap.
- src/app/components/projectsIllustrations/SmartFlowIllustration.tsx et TruthifyIllustration.tsx : illustrations existantes.
- tailwind.config.ts et src/app/globals.css : tokens et styles globaux.
- src/app/juliedieris/DownloadModal.tsx : précédent de modale accessible.
- docs/tude_de_cas_template_r_utilisable.html : référence UX/UI exacte, SHA-256 attendue 7c5dd37ca6d18f7fa3c73d84aadd3b9abe2f447d25e6d6aa4cc74667c4f66517, pas code à copier.

AVANT TOUTE IMPLÉMENTATION DU TEMPLATE

- ouvre réellement docs/tude_de_cas_template_r_utilisable.html dans l'environnement disponible ;
- examine sa structure HTML, ses styles CSS et ses interactions ;
- étudie les compositions desktop et mobile, les thèmes clair/sombre et les variantes RICH/STANDARD/LIGHT ;
- compare régulièrement les rendus React à cette maquette, sur un vrai navigateur si possible ;
- si le fichier est absent ou si son empreinte diffère, arrête l'étape et signale le problème au lieu de remplacer silencieusement la référence.

CONTRAINTES ABSOLUES

- Ne supprime aucun projet.
- N'introduis ni base de données, ni CMS, ni backend supplémentaire.
- N'ajoute aucune dépendance sans vérifier qu'elle n'existe pas déjà et sans justifier son coût.
- Ne copie pas le HTML, le JavaScript vanilla, innerHTML, les placeholders, les URLs fictives ou les données illustratives de la maquette.
- Ne publie aucune affirmation technique, date, métrique, architecture, fonctionnalité ou responsabilité non vérifiée.
- N'utilise jamais href="#" ou de lien externe fictif.
- Ne rends jamais un bouton ou un lien « Voir le détail » actif si l'étude de cas de la locale courante n'est pas publiée ; aucune 404 prévisible ne doit être accessible depuis une carte.
- Utilise de vrais liens next/link pour les pages internes.
- Utilise Server Components pour les données et le contenu. Réserve les Client Components à l'état, aux interactions, aux modales, au workflow, au carrousel, à la lightbox et aux animations nécessaires.
- Ne fabrique pas de traduction anglaise. Une locale non rédigée reste non publiée et absente du sitemap.
- Les quinze projets restent visibles dans leur catégorie même lorsque leur étude de cas est `not-started`, `draft` ou `in-review`.
- Travaille en étapes courtes, teste chaque étape et arrête-toi si une décision marquée « à valider » n'est pas tranchée.

CLASSEMENT EXACT

Featured, dans cet ordre :
1. Allaw
2. Iconise
3. Suggst
4. SmartFlow

Other, dans cet ordre :
1. AI System
2. Aimoto
3. Truthify

Archive, dans cet ordre :
1. CodeMaster
2. Décor Nature
3. Is Tesla Worth It?
4. LIIC
5. Wilder Game
6. QuickFlow
7. Legal Constat
8. Emmaüs Connect

Le carrousel commence par Allaw. Aimoto et Truthify quittent le carrousel featured. Iconise et Suggst sont ajoutés au catalogue avec un statut d'étude `not-started` par locale tant que leurs données réelles ne sont pas auditées.

CARROUSEL

- Autoplay toutes les 4000 ms.
- Cycle Allaw → Iconise → Suggst → SmartFlow → Allaw.
- Barre de progression fine sous la grande carte, sans CLS.
- Pause temporaire au survol, reprise au départ du pointeur.
- Arrêt définitif pour la session après précédent, suivant, indicateur, clavier, drag/swipe significatif ou interaction avec un bouton de carte.
- Après arrêt manuel, navigation manuelle active mais aucun redémarrage automatique.
- Nettoyage de timers et listeners.
- document.visibilityState : conserver le temps écoulé quand l'onglet est caché.
- prefers-reduced-motion : pas d'autoplay et transitions réduites.
- Aucun changement pendant une transition.
- Distinguer clic et drag pour éviter une navigation accidentelle.
- Contrôles accessibles, labels traduits et annonce polie du projet actif.

GRANDES CARTES ET PETITES CARTES

Pour chaque featured :
- action principale « Voir le détail » / « View case study » vers la page interne ;
- action secondaire « Accéder au projet » / « Visit project » uniquement si l'URL HTTPS est réelle et vérifiée ;
- rel="noopener noreferrer" si ouverture dans un nouvel onglet ;
- action externe absente ou désactivée avec explication si aucune URL publique.

Les trois autres projets sont AI System, Aimoto et Truthify. Un clic ouvre une modale compacte et élégante avec nom, média disponible, « Voir le détail » et GitHub seulement si le dépôt est public. L'action externe est facultative.

La modale gère role dialog ou primitive équivalente, aria-modal, titre accessible, focus initial, focus trap, restitution du focus, Échap, click outside et blocage du scroll. Choisis Radix Dialog ou un composant interne basé sur DownloadModal.tsx ; ne fais pas les deux.

ROUTES

- /fr/projets/archives contient uniquement les huit archives, avec H1, introduction, retour et grille.
- /en/projects/archive contient la version anglaise réellement traduite.
- /fr/projets/[slug] et /en/projects/[slug] sont les routes des études de cas.
- Utilise un loader et un renderer communs, pas quinze pages codées indépendamment.
- Utilise generateStaticParams, generateMetadata, notFound et une politique de publication par locale.
- Une page `not-started`, `draft` ou `in-review` ne doit pas être dans le sitemap ni exposée comme finalisée.

POLITIQUE TRANSITOIRE DES ÉTUDES NON PUBLIÉES

- Le catalogue contient les quinze projets et leurs cartes restent visibles.
- Le statut de l'étude est indépendant par locale : not-started, draft, in-review, validated ou published.
- Les critères de published sont contenu rédigé, faits vérifiés, manifestes et médias validés, SEO, accessibilité, responsive, liens et route contrôlés.
- Avant published, masque l'action active « Voir le détail » et affiche au besoin un statut non interactif « Étude de cas en préparation » / « Case study in preparation ».
- Dans une modale, garde les liens GitHub/live vérifiés mais ne propose pas de lien de détail vers une route qui renverrait 404.
- Les archives suivent la même règle.
- Les liens précédent/suivant parcourent uniquement les études published de la locale courante.
- Une URL directe non publiée est 404 ou non générée.
- Les quinze actions de détail deviendront actives progressivement à mesure des publications, sans changer le contrat du template.

ARCHITECTURE DE DONNÉES

Sépare :
1. catalogue TypeScript commun : id, slug, nom officiel, placement, ordre, visibilité portfolio, statut d'étude par locale, type, maturité, liens, médias et preuves ;
2. manifeste partagé : IDs médias, structure du workflow, types de visualisations, nodes/edges, positions et relations communes ;
3. manifestes localisés `fr`/`en` : textes courts, labels, alts, légendes, SEO et références MDX de la locale ;
4. MDX par locale : narration longue et retours d'expérience, sans recopier les structures ;
5. traductions JSON : libellés génériques ;
6. médias locaux : chemin, dimensions, ratio et vérification, avec alt/légende localisés dans le manifeste de locale.

Les sections sont facultatives. Une section absente disparaît sans titre vide, placeholder ni espace artificiel. Les nodes/edges, états, liens et IDs médias restent structurés et validés par TypeScript, pas cachés dans du HTML libre. Un manifeste anglais ne possède jamais de chaînes françaises obligatoires.

FIXTURES DE DÉVELOPPEMENT

Valide le template avant les audits avec des fixtures explicitement marquées `fixture` et stockées hors du catalogue publiable. Elles doivent couvrir RICH, STANDARD, LIGHT, une ou plusieurs captures, sans vidéo, sans workflow, sans architecture, un à cinq défis, workflow de deux à cinq étapes, diagramme multi-nœuds non linéaire, contenu long/court et locale absente. Exclue ces fixtures de generateStaticParams, metadata de production, sitemap, JSON-LD indexable, liens publics et compte des quinze projets. Aucun texte de fixture ne doit devenir une réalisation réelle.

TEMPLATE DES ÉTUDES DE CAS

La maquette docs/tude_de_cas_template_r_utilisable.html est la référence principale. Reproduis fidèlement sa composition, ses espaces généreux, ses très grands titres, ses arrondis, ses bordures fines, ses ombres, sa palette neutre avec accent rouge, ses sections alternées, ses grands médias, ses diagrammes élégants, ses animations subtiles et ses interactions soignées.

Le hero doit être centré et immersif par défaut : badge type/période, H1 très grand, accroche, description, actions, puis grand mockup/capture/illustration sous le texte. Ne remplace pas automatiquement cette composition par un hero desktop en deux colonnes.

Le même template doit produire :
- RICH : hero, overview, vidéo, workflow, architecture, galerie, défis, décisions, résultats et navigation ;
- STANDARD : hero, overview, galerie, défis et décisions utiles ;
- LIGHT : hero, overview courte, stack/résultats et navigation.

Sections à prévoir : hero, présentation synthétique, défis, architecture, galerie, vidéo facultative, décisions techniques, résultats/enseignements/limites, précédent/suivant, projets similaires et CTA professionnel.

WORKFLOW

- Desktop : étapes à gauche, visualisation active à droite.
- Mobile : liste horizontale ou empilée, visualisation sous l'étape active.
- Données : nombre variable d'étapes, titres, descriptions et visualisations icon/mockup/flow/result/custom.
- État React avec une seule étape active.
- role tablist/tab/tabpanel, aria-selected, aria-controls, aria-labelledby.
- flèches, Home et End ; un seul onglet dans la tabulation ; panneau inactif non focusable.
- reduced motion respecté.

ARCHITECTURE

Le diagramme doit utiliser réellement les relations edges. Ne dessine pas seulement des flèches séquentielles entre cartes. Une solution légère est privilégiée : rendu serveur, SVG, viewBox stable, positions ou colonnes déclarées, connecteurs et labels issus des données, résumé textuel accessible. Aucun moteur de graphes lourd sans justification. Le rendu doit fonctionner pour SaaS React/Node, app macOS SwiftUI, extension navigateur, outil local, site simple et pipeline IA.

DÉFIS ET MÉDIAS

- 1 défi : carte unique centrée.
- 2 défis : deux cartes équilibrées.
- 3 défis : composition principale + secondaires ou trois cartes équilibrées.
- 4 défis : grille 2 × 2.
- 5+ : composition responsive sans carte isolée.
- 0 média : pas de galerie.
- 1 média : grand visuel.
- 2 médias : composition équilibrée.
- 3 à 5 : galerie éditoriale.
- 6+ : affichage progressif ou navigation légère.

Utilise next/image si adapté, réserve les ratios, fournis alt et légendes, charge les vidéos en différé, n'autoplay pas le son et ne publie jamais de faux lecteur ou média placeholder.

SEO, ACCESSIBILITÉ ET PERFORMANCE

- HTML initial indexable.
- H1 unique et hiérarchie H2/H3.
- title, description, canonical, Open Graph, Twitter Card et JSON-LD véridiques.
- hreflang uniquement pour les versions réellement disponibles.
- sitemap limité aux pages publiées.
- BreadcrumbList et type CreativeWork/SoftwareApplication uniquement lorsque justifiés.
- liens internes accueil/archives/projets.
- alt, focus visible, contraste, clavier, Échap, focus trap et restitution.
- dark/light et reduced motion.
- surveiller LCP, CLS, INP, poids JS, vidéo et images.

PROCESSUS

Respecte cet ordre :
0. revalider architecture et dépendances ;
1. catalogue, taxonomie et validation ;
2. contrats, manifestes, loaders et MDX ;
3. routes et publication ;
4. primitives visuelles et shell ;
5. une étude de cas représentative ;
6. composants interactifs du template ;
7. validation finale visuelle et fonctionnelle contre la maquette ;
8. carrousel ;
9. cartes, modales et archives ;
10. alimentation progressive des quinze projets ;
11. SEO, i18n, accessibilité et performance ;
12. tests, build et contrôle du diff.

À chaque étape, indique les fichiers modifiés, décisions, tests, limites et gate de passage. Ne passe pas à l'alimentation en série avant la validation finale visuelle et fonctionnelle de l'étape 7. Ouvre réellement la maquette et compare les rendus navigateur après les corrections significatives.

QUALITÉ VISUELLE NON NÉGOCIABLE

Le résultat doit être moderne, élégant, premium et mémorable, digne des meilleures pages de 2026. Préserve la hiérarchie, le rythme, les proportions et les compositions asymétriques de la référence. Évite les effets gratuits, murs de texte, badges omniprésents, visuels génériques, animations permanentes et composants lourds. Le résultat doit convaincre simultanément recruteur, développeur et responsable produit.

Avant de terminer, vérifie :
- exactitude 4/3/8 ;
- Allaw initial ;
- autoplay 4 secondes et arrêt manuel définitif ;
- barre de progression sans CLS ;
- modale accessible ;
- archives exactes ;
- routes FR/EN ;
- contenu serveur indexable ;
- template RICH/STANDARD/LIGHT ;
- workflow clavier ;
- architecture basée sur edges ;
- galerie et vidéo facultatives ;
- dark/light/reduced motion ;
- SEO et sitemap ;
- aucune donnée inventée ;
- aucune dépendance ajoutée sans justification.
```

---

## 19. Checklist de validation fonctionnelle finale

### Données et classement

- [ ] Le catalogue contient exactement quinze projets.
- [ ] Les featured sont Allaw, Iconise, Suggst et SmartFlow dans cet ordre.
- [ ] Les autres projets sont AI System, Aimoto et Truthify dans cet ordre.
- [ ] Les archives sont exactes et ordonnées.
- [ ] Aucun ancien projet n'a été supprimé.
- [ ] QuickFlow et son ancien identifiant sont documentés.
- [ ] Les noms contractuels respectent la casse demandée.

### Accueil et carrousel

- [ ] Allaw est visible au chargement.
- [ ] Le changement automatique se produit après 4 secondes.
- [ ] Le cycle revient à Allaw.
- [ ] La barre de progression est visible et sans CLS.
- [ ] Le survol suspend puis reprend l'autoplay.
- [ ] Toute interaction significative arrête définitivement l'autoplay.
- [ ] La navigation manuelle reste active après l'arrêt.
- [ ] Timers et listeners sont nettoyés.
- [ ] Un onglet inactif ne provoque pas de rattrapage inattendu.
- [ ] Reduced motion désactive l'autoplay et réduit les transitions.
- [ ] Drag, clic et clavier ne se déclenchent pas mutuellement par erreur.

### Actions et modales

- [ ] Les grandes cartes dont l'étude est publiée proposent « Voir le détail ».
- [ ] Une carte visible dont l'étude n'est pas publiée n'expose aucune action menant vers une 404.
- [ ] Le statut transitoire des études non publiées est non interactif et traduit.
- [ ] Le lien externe n'existe que si l'URL est valide.
- [ ] Aimoto n'affiche pas de faux lien public.
- [ ] Les petites cartes ouvrent une modale.
- [ ] La modale contient le nom et les actions disponibles.
- [ ] Les liens internes sont des liens HTML.
- [ ] GitHub est absent ou désactivé s'il est privé/absent.
- [ ] Focus trap, Échap, click outside et restitution fonctionnent.

### Archives et routes

- [ ] `/fr/projets/archives` fonctionne.
- [ ] `/en/projects/archive` fonctionne uniquement avec contenu anglais réel.
- [ ] Les archives contiennent huit cartes et aucune autre.
- [ ] Les détails FR/EN sont accessibles par URL.
- [ ] Les slugs sont stables et uniques.
- [ ] Les pages non publiées renvoient 404 ou ne sont pas générées.

### Études de cas

- [ ] La maquette est accessible par [ce lien relatif](./tude_de_cas_template_r_utilisable.html).
- [ ] La SHA-256 de la maquette correspond à `7c5dd37ca6d18f7fa3c73d84aadd3b9abe2f447d25e6d6aa4cc74667c4f66517`.
- [ ] Le fichier HTML a été ouvert et examiné avant l'implémentation.
- [ ] Le hero reprend la composition centrée de la maquette.
- [ ] Le média principal réserve son espace.
- [ ] Les sections facultatives disparaissent proprement.
- [ ] RICH, STANDARD et LIGHT utilisent le même système.
- [ ] Le workflow est piloté par données et accessible.
- [ ] Le diagramme rend les relations déclarées.
- [ ] Les défis s'adaptent à leur nombre.
- [ ] La galerie s'adapte au nombre de médias.
- [ ] La vidéo est facultative et différée.
- [ ] La navigation exclut les pages non publiées.
- [ ] Le CTA utilise des liens professionnels réels.
- [ ] La validation finale visuelle et fonctionnelle a été réalisée après les interactions, avant toute production en série.

### SEO, i18n et accessibilité

- [ ] Chaque page possède title et description uniques.
- [ ] Canonical et alternates sont corrects.
- [ ] Le sitemap ne contient que les pages publiées.
- [ ] Le JSON-LD est véridique et parseable.
- [ ] Le contenu principal est dans le HTML initial.
- [ ] Les images ont des alt pertinents.
- [ ] Le clavier couvre carrousel, workflow, modale et galerie.
- [ ] Les contrastes sont vérifiés en clair et en sombre.
- [ ] Reduced motion est respecté.

### Qualité visuelle et performance

- [ ] Validation 1440/1280/1024/768/390/320 px.
- [ ] Validation clair/sombre.
- [ ] Validation contenu riche et contenu minimal.
- [ ] Aucun scroll horizontal involontaire.
- [ ] Aucun CLS important lié aux médias.
- [ ] Vidéo et images ne bloquent pas inutilement le chargement.
- [ ] Le résultat est moderne, élégant, premium et fidèle à la référence sans surcharge décorative.

---

## 20. Arrêt de phase

Cette documentation est prête à servir de support à l'implémentation, mais aucune étape de code ne doit commencer automatiquement à partir de ce fichier.

La prochaine action attendue est la validation des décisions de la section 17, puis le lancement explicite de l'étape 0 ou de l'étape 1.
