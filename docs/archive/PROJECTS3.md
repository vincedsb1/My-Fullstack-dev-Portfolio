### Étape 1 – Objectif général & périmètre du composant `Projects3`

- Créer un **nouveau composant** `Projects3.tsx` (sans modifier `Projects.tsx`). :contentReference[oaicite:0]{index=0}
- Objectif UX :
  - Donner un **point d’entrée très clair** sur 4 projets phares via un **carousel**.
  - Permettre de parcourir l’ensemble des projets via une **grille de cartes uniformes**.
- Contenu géré par le composant :
  - Environ 11–16 projets (projets existants + nouveaux).
  - Pour chaque projet :
    - Titre.
    - Brève description.
    - Image.
    - Liste de technologies (badges).
    - URL externe optionnelle (ou type “local only”).
- Thème :
  - Prise en charge **light** et **dark** via classes Tailwind (`dark:`).
- Responsive :
  - **Mobile** : 1 colonne (top + grille).
  - **Tablette** : 1 case study visible + grille en 2 colonnes.
  - **Desktop** : carousel “case studies” en haut, grille en 3 colonnes en bas.
- Test de l’étape :
  - Le développeur peut expliquer le fonctionnement global (carousel + grille) sans parler d’implémentation.
    md
    Copier le code

### Étape 2 – Modèle de données TypeScript

- Définir les types suivants :

  ```ts
  type ProjectId =
    | "allaw"
    | "truthify"
    | "aimoto"
    | "smartflow"
    | "decorNature"
    | "teslaApp"
    | "emmausConnect"
    | "wilderGame"
    | "legalDirectory"
    | "legalConstat"
    | "liic";

  type TechnologyId =
    | "nextjs"
    | "react"
    | "typescript"
    | "javascript"
    | "tailwind"
    | "nodejs"
    | "mongodb"
    | "postgresql"
    | "mysql"
    | "json"
    | "python"
    | "symfony"
    | "css"
    | "recharts";

  type Project = {
    id: ProjectId;
    i18nNameKey: string;         // ex: "projects.allaw.name"
    i18nDescriptionKey: string;  // ex: "projects.allaw.description"
    url?: string;                // undefined si projet local seulement
    imageSrc: string;            // chemin vers image (public/)
    imageAlt: string;
    technologies: TechnologyId[];
    isFeatured: boolean;         // true pour les 4 projets du carousel
    kind: "platform" | "tool" | "extension" | "showcase";
    order: number;               // ordre global (top + autres)
  };
  Le composant exporte un tableau constant const projects: Project[].
  ```

Test de l’étape :

Le code compile sans erreur de types.

projects couvre l’ensemble des projets listés.

perl
Copier le code

````md
### Étape 3 – Données des projets (y compris nouveaux projets)

- Alimenter `projects` avec les entrées suivantes (au minimum) :

  - **Projets à la une (`isFeatured: true`)**

    - `allaw`
      - `url`: `https://www.allaw.fr`
      - `kind`: `"platform"`
      - `technologies`: `["nextjs", "typescript", "nodejs", "mongodb"]`
      - `imageSrc`: `/projects/allaw.png`
    - `truthify`
      - `url`: `https://www.truthify.eu/`
      - `kind`: `"tool"`
      - `technologies`: `["nextjs", "typescript", "tailwind", "postgresql"]`
      - `imageSrc`: `/projects/truthify.png`
    - `aimoto`
      - `url`: `undefined` (projet local)
      - `kind`: `"tool"`
      - `technologies`: `["nextjs", "typescript", "tailwind", "python"]`
      - `imageSrc`: `/projects/aimoto.png`
    - `smartflow` (équivalent `project6` existant) :contentReference[oaicite:1]{index=1}
      - `url`: `https://www.smartflow-app.com/`
      - `kind`: `"tool"`
      - `technologies`: `["nextjs", "tailwind", "postgresql", "typescript"]`
      - `imageSrc`: `/project6-2.png`

  - **Autres projets (`isFeatured: false`)**
    - `decorNature` (project5) – Next.js / TailwindCSS / PostgreSQL / Typescript. :contentReference[oaicite:2]{index=2}
    - `teslaApp` (project1) – Next.js / Recharts / Typescript.
    - `emmausConnect` (project2) – ReactJS / Javascript / JSON.
    - `wilderGame` (project3) – ReactJS / Javascript / Node.js / MySQL.
    - `legalDirectory` (project4) – Next.js / Tailwind CSS / Node.js / PostgreSQL.
    - `legalConstat` – ReactJS / Typescript / Symfony / CSS.
    - `liic` – Typescript / JSON / Node.js.

- Chaque projet doit avoir :
  - `order` : entier définissant l’ordre d’apparition (1 = premier).
  - `i18nNameKey` et `i18nDescriptionKey` cohérents avec les fichiers de traduction.
- Test de l’étape :
  - Les 4 projets phares ont `isFeatured: true`.
  - Tous les projets sont uniques par `id` et ont un `order` distinct.
    md
    Copier le code

### Étape 4 – Internationalisation (i18n)

- Utiliser `useTranslations("projects")` comme dans `Projects`. :contentReference[oaicite:3]{index=3}
- Pour chaque projet, ajouter dans les fichiers de locales :

  - `projects.allaw.name`, `projects.allaw.description`
  - `projects.truthify.name`, `projects.truthify.description`
  - `projects.aimoto.name`, `projects.aimoto.description`
  - `projects.smartflow.name`, `projects.smartflow.description`
  - etc. pour tous les `Project.id`.

- Dans le code :

  ```ts
  const t = useTranslations("projects");

  const name = t(project.i18nNameKey);
  const description = t(project.i18nDescriptionKey);
  Prévoir aussi des clés pour :
  ```

Titre de section : projects.title (existant).

Intro : projects.intro (existant).

Sous-titre “Autres projets” : projects.othersTitle.

Bouton : projects.viewProject (ex: "Voir le projet").

Test de l’étape :

Aucun texte statique de projet n’est hardcodé en clair dans le JSX (tout vient de t(...)).

typescript
Copier le code

````md
### Étape 5 – Mapping technologies → badges

- Créer un dictionnaire `technologyMeta` réutilisable :

  ```ts
  const technologyMeta: Record<TechnologyId, { label: string; icon?: JSX.Element }> = {
    nextjs: { label: "Next.js", icon: <FileCode size={16} /> },
    react: { label: "React", icon: <Atom size={16} /> },
    typescript: { label: "TypeScript", icon: <Type size={16} /> },
    javascript: { label: "JavaScript", icon: <Code size={16} /> },
    tailwind: { label: "Tailwind CSS", icon: <Palette size={16} /> },
    nodejs: { label: "Node.js", icon: <Server size={16} /> },
    mongodb: { label: "MongoDB", icon: <Database size={16} /> },
    postgresql: { label: "PostgreSQL", icon: <Database size={16} /> },
    mysql: { label: "MySQL", icon: <Database size={16} /> },
    json: { label: "JSON", icon: <Braces size={16} /> },
    python: { label: "Python", icon: <Code size={16} /> },
    symfony: { label: "Symfony" },
    css: { label: "CSS" },
    recharts: { label: "Recharts", icon: <LineChart size={16} /> },
  };
  Composant badge :
  ```

tsx
Copier le code
function TechBadge({ techId }: { techId: TechnologyId }) {
const tech = technologyMeta[techId];
return (
<span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 text-neutral-800 px-3 py-1 text-xs font-medium dark:bg-neutral-800 dark:text-neutral-100">
{tech.icon && <span>{tech.icon}</span>}
<span>{tech.label}</span>
</span>
);
}
Test de l’étape :

Chaque techno listée dans Project.technologies s’affiche comme badge aligné correctement.

Aucun overlay ne passe sur le texte : les badges sont dans une ligne dédiée.

javascript
Copier le code

````md
### Étape 6 – Structure globale du composant `Projects3`

- Signature :

  ```tsx
  "use client";

  import React, { useEffect, useState } from "react";
  import Image from "next/image";
  import { useTranslations } from "next-intl";
  import AOS from "aos";
  import "aos/dist/aos.css";

  function Projects3() {
    const t = useTranslations("projects");
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
      AOS.init({ duration: 300 });
    }, []);

    const featuredProjects = projects.filter((p) => p.isFeatured).sort((a, b) => a.order - b.order);
    const otherProjects = projects.filter((p) => !p.isFeatured).sort((a, b) => a.order - b.order);

    // ...
  }
  Layout :
  ```

Wrapper section centré, similaire à Projects : titre + intro en haut.
Projects

Puis :

Bloc FeaturedCarousel.

Bloc OtherProjectsGrid.

Test de l’étape :

Le composant compile et affiche (sans styles détaillés) la liste des noms des projets phares et des autres.

markdown
Copier le code

````md
### Étape 7 – Carousel des projets phares (layout & interaction)

- **Layout desktop :**

  - Conteneur :
    - `rounded-3xl`, `border`, `bg-neutral-100 dark:bg-neutral-900`, `p-8`, `shadow-sm`.
    - Largeur max : `max-w-5xl` centré.
  - Grid interne 2 colonnes :

    ```tsx
    className = "grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]";
    ```

  - Colonne gauche (texte) :
    - Badge de type (plateforme / outil / extension).
    - Titre (2xl–3xl).
    - Description (3–4 lignes max).
    - Boutons :
      - `Voir le projet` (bouton primaire).
      - Optionnel : lien secondaire `Code` si disponible (prop future).
  - Colonne droite (visuel) :
    - Wrapper `relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800`.
    - Image `next/image` centrée.
    - Ligne de badges techno sous l’image, alignée à gauche.

- **Layout mobile :**

  - `flex flex-col gap-6`.
  - Ordre : titre -> description -> boutons -> image -> badges techno.

- **Interaction :**

  - `activeIndex` pointe sur `featuredProjects[activeIndex]`.
  - Boutons flèches :

    ```tsx
    onClickPrevious = () =>
      setActiveIndex(
        (i) => (i - 1 + featuredProjects.length) % featuredProjects.length,
      );
    onClickNext = () =>
      setActiveIndex((i) => (i + 1) % featuredProjects.length);
    ```

  - Dots (points) sous le carousel :

    - un point par projet phare.
    - le point actif est plein, les autres ont une opacité réduite.
    - clic sur un point = `setActiveIndex(index)`.

  - Mobile : autoriser le swipe horizontal (optionnel mais recommandé) :
    - soit via un petit wrapper avec gestion de `touchstart` / `touchend`,
    - soit via une librairie légère de carousel si souhaité (spéc à clarifier à l’implémentation).

- **Accessibilité :**

  - Les flèches sont des `<button>` avec `aria-label="Projet précédent"` / `"Projet suivant"`.
  - Les dots sont des `<button>` avec `aria-label` indiquant le nom du projet.
  - Le bouton “Voir le projet” ouvre l’URL dans un nouvel onglet si `project.url` défini ; sinon :
    - style désactivé (`disabled`) et aria `"Ce projet n'est pas disponible en ligne"`.

- Test de l’étape :
  - En desktop, clic sur les flèches fait défiler les 4 projets phares dans le même conteneur.
  - Les points réagissent et reflètent correctement l’index actif.
    md
    Copier le code

### Étape 8 – Bloc “Autres projets” (grille responsive)

- Titre de section :

  ```tsx
  <h3 className="mt-12 mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
    {t("othersTitle")}
  </h3>
  Grille responsive :
  ```

tsx
Copier le code

<div
  className="
    grid gap-6
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
  "
>
  {otherProjects.map((project) => (
    <OtherProjectCard key={project.id} project={project} />
  ))}
</div>
OtherProjectCard :

Carte :

tsx
Copier le code

<article
  className="
    flex flex-col h-full rounded-2xl border border-neutral-200 bg-neutral-50
    p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md
    dark:border-neutral-700 dark:bg-neutral-900
  "
  role="link"
  tabIndex={0}
  onClick={...}
  onKeyDown={...}
>
Contenu :

Titre (font-semibold, text-lg).

Courte description (2–3 lignes max).

Ligne de badges techno.

Image en bas :

aspect-[4/3], rounded-xl, overflow-hidden, même ratio pour toutes les cartes.

Bouton “Voir le projet” en bas (petit bouton secondaire).

Interaction :

Clic sur la carte ou sur “Voir le projet” ouvre l’URL si définie.

Si pas d’URL :

bouton désactivé ou label différent (ex: "Projet local"), mais bien indiqué dans les specs front.

Test de l’étape :

En desktop : 3 colonnes, cartes de hauteur similaire (grâce au h-full + grille).

En tablette : 2 colonnes.

En mobile : 1 colonne.

go
Copier le code

````md
### Étape 9 – Thème light / dark & cohérence visuelle

- Utiliser systématiquement les paires de classes :

  - Fond des cartes :
    - `bg-neutral-50 dark:bg-neutral-900`.
  - Bordures :
    - `border-neutral-200 dark:border-neutral-700`.
  - Texte principal :
    - `text-neutral-900 dark:text-neutral-100`.
  - Texte secondaire :
    - `text-neutral-500 dark:text-neutral-400`.
  - Badges techno :
    - `bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100`.

- Le carousel et la grille doivent partager :

  - mêmes arrondis (`rounded-2xl` ou `rounded-3xl`),
  - même traitement : légère ombre et hover subtil (`hover:shadow-md`, `hover:-translate-y-1`).

- Test de l’étape :
  - En basculant le thème global (classe `dark` sur `<html>`), le composant reste lisible et homogène.
    md
    Copier le code

### Étape 10 – Animations, AOS & performance

- Initialiser AOS dans `Projects3` comme dans `Projects`. :contentReference[oaicite:5]{index=5}

  ```ts
  useEffect(() => {
    AOS.init({ duration: 300 });
  }, []);
  Appliquer data-aos="fade-up" :
  ```

sur le bloc du carousel,

sur le titre “Autres projets”,

sur chaque carte de la grille.

Transitions Tailwind :

transition-transform transition-shadow duration-200 sur les cartes pour les hover.

Performance images :

Utiliser next/image avec sizes répondant aux breakpoints (mobile/tablette/desktop).

Les images des “autres projets” peuvent être plus petites que celles du carousel.

Test de l’étape :

Le scroll déclenche une animation douce depuis le bas.

Aucun jank visible (les animations restent légères).

go
Copier le code

```md
### Étape 11 – Accessibilité & navigation clavier

- Chaque carte (carousel + grille) :

  - `role="link"`, `tabIndex={0}`.
  - `onKeyDown` gère :
    - `Enter` → ouvre le projet.
    - `Space` → ouvre le projet (avec `e.preventDefault()`).

- Boutons du carousel :
  - Vrais `<button>` avec `type="button"`.
  - `aria-label` explicite (précédent / suivant / aller au projet X).
- Dots :
  - `<button>` minimal avec `aria-pressed` pour l’actif.
- Ordre de focus logique :
  - Titre de section → carousel (carte active + flèches + dots) → “Autres projets” → cartes de la grille.
- Test de l’étape :
  - Navigation complète possible au clavier uniquement.
  - Lecteur d’écran annonce correctement les actions (ouvrir projet, changer de slide, etc.).
    md
    Copier le code

### Étape 12 – Validation finale & intégration

- Vérifier que :

  - Les 4 projets phares apparaissent bien uniquement dans le carousel, pas en double dans la grille.
  - Tous les autres projets sont présents dans la grille.
  - Les technologies affichées correspondent bien aux stacks réelles (via `Project.technologies`).
  - Les comportements sont identiques sur :
    - Desktop (largeur ≥ 1024px),
    - Tablette (~768–1023px),
    - Mobile (< 768px).

- Checklist :

  - [ ] Tous les textes viennent de `useTranslations`.
  - [ ] Le thème dark est supporté.
  - [ ] Les liens ouvrent dans un nouvel onglet.
  - [ ] Le carousel fonctionne (flèches + dots).
  - [ ] La grille se comporte bien sur les trois breakpoints.
  - [ ] Aucune image déformée (ratio constant).

- Une fois validé :
  - Intégrer `Projects3` sur la page portfolio à la place du composant précédent (ou en parallèle pour tests A/B).
```
````
````
````
````
````
