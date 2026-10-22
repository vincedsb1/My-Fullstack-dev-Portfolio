Spécifications fonctionnelles – Projects2 (version étape par étape)

PROJECT2

### Étape 1 – Objectif général & contraintes

- Créer un nouveau composant `Projects2` (sans toucher à `Projects`) qui affiche 11 projets.
- Layout responsive à partir d’une même liste de projets :
  - Mobile : 1 colonne.
  - Tablette : 2 colonnes.
  - Desktop : 3 colonnes avec une mosaïque de cartes.
- Deux types de cartes :
  - **Grande carte** (`size: "large"`) pour 4 projets : Allaw, Truthify, Légal Constat, Smartflow.
  - **Carte carrée** (`size: "square"`) pour les 7 autres.
- Règle d’harmonie sur desktop :
  - La « carte carrée » définit la **cellule de base**.
  - **Grande carte horizontale** : largeur = 2× largeur d’une carte carrée + le gap entre deux colonnes ; hauteur = hauteur d’une carte carrée.
  - **Grande carte verticale** : hauteur = 2× hauteur d’une carte carrée + le gap entre deux lignes ; largeur = largeur d’une carte carrée.
- Test de cette étape :
  - Le développeur est capable d’expliquer le layout attendu à l’oral en se basant sur le croquis desktop.

### Étape 2 – Modèle de données TypeScript

- Créer les types suivants :
  - `ProjectSize = "large" | "square"`.
  - `ProjectId` : union littérale de tous les ids (`"allaw"`, `"truthify"`, `"legalConstat"`, `"smartflow"`, `"decorNature"`, `"aimoto"`, `"liic"`, `"teslaApp"`, `"emmausConnect"`, `"wilderGame"`, `"legalDirectory"`).
  - `TechnologyId` : union littérale (`"nextjs"`, `"react"`, `"typescript"`, `"javascript"`, `"tailwind"`, `"nodejs"`, `"mongodb"`, `"postgresql"`, `"mysql"`, `"json"`, `"python"`, `"symfony"`, `"css"`).
- Définir le type `Project` :

  ```ts
  type Project = {
    id: ProjectId;
    i18nNameKey: string;
    i18nDescriptionKey: string;
    url?: string;
    kind: "web-app" | "extension" | "tool" | "platform";
    technologies: TechnologyId[];
    size: ProjectSize;
    imageSrc: string;
    imageAlt: string;
    mobileOrder: number;
  };
  ```

Test de cette étape :

Le code compile en TypeScript sans erreur sur les types.

``````md
### Étape 3 – Définition de la liste `projects`

- Créer un tableau constant `const projects: Project[] = [...]`.
- Renseigner **tous les champs** pour les 11 projets :
  - `id`, `size`, `kind`, `url` (si disponible), `technologies`, `imageSrc`, `imageAlt`.
  - `i18nNameKey` et `i18nDescriptionKey` (ex: `"projects.allaw.name"`).
  - `mobileOrder` pour définir l’ordre sur mobile :
    1. Allaw
    2. Truthify
    3. Légal Constat
    4. Smartflow
    5. Décor Nature
    6. Aimoto
    7. LIIC
    8. Tesla
    9. Emmaüs connect
    10. Wilder Game
    11. Legal Directory
- Test de cette étape :
  - `projects.length === 11`.
  - Chaque objet respecte le type `Project` (pas de champ manquant).

### Étape 4 – Internationalisation (i18n)

- Utiliser `useTranslations("projects")` dans `Projects2`.
- Ajouter dans les fichiers de traductions :
  - `projects.allaw.name`, `projects.allaw.description`, etc. pour chaque projet.
- Dans le composant carte, récupérer :
  - `const name = t(project.i18nNameKey);`
  - `const description = t(project.i18nDescriptionKey);`
- Test de cette étape :
  - Chaque carte affiche un nom et une description lisibles (pas de clé brute).

### Étape 5 – Mapping technologies → icônes

- Créer un dictionnaire global :

  ```ts
  const technologyIcons: Record<TechnologyId, { label: string; icon: JSX.Element }> = {
    nextjs: { label: "Next.js", icon: <FileCode size={20} /> },
    react: { label: "React", icon: <Atom size={20} /> },
    typescript: { label: "TypeScript", icon: <Type size={20} /> },
    javascript: { label: "JavaScript", icon: <Code size={20} /> },
    tailwind: { label: "Tailwind", icon: <Palette size={20} /> },
    nodejs: { label: "Node.js", icon: <Server size={20} /> },
    mongodb: { label: "MongoDB", icon: <Database size={20} /> },
    postgresql: { label: "PostgreSQL", icon: <Database size={20} /> },
    mysql: { label: "MySQL", icon: <Database size={20} /> },
    json: { label: "JSON", icon: <Braces size={20} /> },
    python: { label: "Python", icon: <Code size={20} /> },
    symfony: { label: "Symfony", icon: <Server size={20} /> },
    css: { label: "CSS", icon: <Palette size={20} /> },
  };
  ```

Dans la carte, afficher la liste des technos en bas (bandeau) en mappant project.technologies.

Test de cette étape :

Sur chaque carte, le bandeau affiche les bonnes technos avec libellé + icône.

`````md
### Étape 6 – Composant `ProjectCard2` (structure & comportement)

- Props :

  ```ts
  type ProjectCard2Props = { project: Project };
  ```

Structure HTML/Tailwind (commune à toutes les tailles) :

<article> root avec :

role="link", tabIndex={0}.

classes de base : relative rounded-3xl overflow-hidden border border-neutral-700/60 bg-neutral-900 cursor-pointer transition-all.

Gestion du clic :

onClick: window.open(project.url, "\_blank") si project.url.

onKeyDown: ouvrir sur Enter ou Space.

Contenu principal :

Titre (nom).

Description.

Image (via next/image) dans un wrapper adapté selon la variante.

Bandeau technos masqué par défaut, visible au hover/focus.

Test de cette étape :

En affichant une seule carte, celle-ci est clickable au clic et au clavier.

### Étape 7 – Styles internes des cartes (large vs square)

Problème actuel :

- L’étape parle bien de laisser la grille gérer la hauteur, mais dans le code tu as encore probablement des `h-...` ou `aspect-square` sur desktop.
- Ça rigidifie les cartes et empêche la grille de fonctionner parfaitement comme “cellules”.

À améliorer :

- Ajouter explicitement :
  - Sur desktop (`lg:`), **aucune hauteur fixe** ni `aspect-square` ne doit être appliquée au root de la carte.
  - Les variants large/square doivent seulement changer le layout interne (`flex-row` / `flex-col`), pas les dimensions.

### Étape 8 – Composant `Projects2` (header + data + AOS)

- Créer le composant :

  ```tsx
  "use client";

  function Projects2() {
    const t = useTranslations("projects");

    useEffect(() => {
      AOS.init({ duration: 300 });
    }, []);

    const sortedProjects = [...projects].sort(
      (a, b) => a.mobileOrder - b.mobileOrder,
    );

    return (
      <section id="projects">
        {/* Header avec icône Rocket + titre + sous-titre, comme dans Projects */}
        {/* Grille de cartes (étape suivante) */}
      </section>
    );
  }
  ```

Appliquer data-aos="fade-up" sur chaque carte.

Test de cette étape :

Toutes les cartes s’affichent en colonne simple, les animations AOS fonctionnent.

````md
### Étape 9 – Layout mobile (1 colonne)

- Conteneur grille :

  ```tsx
  <div id="projectsCardsContainer" className="w-full grid gap-6 grid-cols-1">
    {sortedProjects.map((project) => (
      <ProjectCard2 key={project.id} project={project} />
    ))}
  </div>
  ```

Aucune classe md: ou lg: n’est encore utilisée.

Toutes les cartes prennent la pleine largeur.

Test de cette étape :

Sur un viewport < 768px, toutes les cartes sont alignées verticalement, dans l’ordre défini par mobileOrder.

### Étape 10 – Layout tablette (2 colonnes)

Cette étape est globalement bonne (le rendu tablette te convient).

À garder tel quel, mais préciser :

- Les classes `md:col-span-*` / `md:row-span-*` ne doivent pas forcer d’`lg:` associées.
- Les règles desktop seront définies **en plus** dans l’étape suivante (pas en réutilisant celles de tablette).

### Étape 11 – Layout desktop (3 colonnes + mapping exact)

C’est l’étape clé à corriger.

Problème actuel :

- Tu définis seulement des `lg:row-span-*` et `lg:col-span-*`.
- Tu ne définis **aucun `lg:col-start-*` / `lg:row-start-*`**, donc le navigateur place les cartes “au fil de l’eau”.
- Résultat : la disposition est logique mais ne suit pas ton croquis.

À remplacer par :

- Un conteneur qui fixe la hauteur de cellule :

  ```tsx
  className="
    w-full grid gap-6
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    lg:[grid-auto-rows:260px]
  "
  Un mapping précis de chaque projet dans la grille desktop (3 colonnes × 5 lignes), par exemple :
  ```

md
Copier le code
| Projet | col-start | row-start | col-span | row-span | Type |
|----------------|----------:|----------:|---------:|---------:|-------------------|
| Décor Nature | 1 | 1 | 1 | 1 | square |
| Aimoto | 2 | 1 | 1 | 1 | square |
| Truthify | 3 | 1 | 1 | 2 | large verticale |
| Allaw | 1 | 2 | 1 | 2 | large verticale |
| LIIC | 2 | 2 | 1 | 1 | square |
| Légal Constat | 2 | 3 | 2 | 1 | large horizontale |
| Emmaüs connect | 1 | 4 | 1 | 1 | square |
| Wilder Game | 2 | 4 | 1 | 1 | square |
| Is Tesla ... | 3 | 4 | 1 | 1 | square |
| Smartflow | 1 | 5 | 2 | 1 | large horizontale |
| Legal Directory| 3 | 5 | 1 | 1 | square |
Et en code, des classes Tailwind explicites :

ts
Copier le code
const desktopGridClassesById: Record<ProjectId, string> = {
decorNature: "lg:col-start-1 lg:row-start-1 lg:col-span-1 lg:row-span-1",
aimoto: "lg:col-start-2 lg:row-start-1 lg:col-span-1 lg:row-span-1",
truthify: "lg:col-start-3 lg:row-start-1 lg:col-span-1 lg:row-span-2",
allaw: "lg:col-start-1 lg:row-start-2 lg:col-span-1 lg:row-span-2",
liic: "lg:col-start-2 lg:row-start-2 lg:col-span-1 lg:row-span-1",
legalConstat: "lg:col-start-2 lg:row-start-3 lg:col-span-2 lg:row-span-1",
emmausConnect: "lg:col-start-1 lg:row-start-4 lg:col-span-1 lg:row-span-1",
wilderGame: "lg:col-start-2 lg:row-start-4 lg:col-span-1 lg:row-span-1",
teslaApp: "lg:col-start-3 lg:row-start-4 lg:col-span-1 lg:row-span-1",
smartflow: "lg:col-start-1 lg:row-start-5 lg:col-span-2 lg:row-span-1",
legalDirectory:"lg:col-start-3 lg:row-start-5 lg:col-span-1 lg:row-span-1",
};
Dans ProjectCard2, tu concatènes :

les classes communes,

les classes md:\* pour tablette,

plus desktopGridClassesById[project.id].

Test à ajouter dans la spec :

vérifier, sur desktop, que :

la grille a bien 3 colonnes,

les 4 grandes cartes sont exactement aux mêmes positions que sur le croquis,

les petites cartes occupent les 7 emplacements restant, sans trous.

### Étape 12 – Hover, focus, animations et accessibilité

- Hover / focus sur la carte :
  - `hover:ring-2 hover:ring-neutral-500` + légère translation ou scale.
  - Bandeau technologies qui slide vers le haut (`translate-y-full` → `group-hover:translate-y-0`).
- Accessibilité :
  - `tabIndex={0}`, `role="link"`.
  - `onKeyDown` gère `Enter` + `Space`.
  - `aria-label` optionnel sur `<article>` (ex: `"Ouvrir le projet Allaw"`).
- Animations AOS :
  - `data-aos="fade-up"` sur chaque carte.
- Test de cette étape :
  - Navigation clavier seule : on peut visiter chaque carte et ouvrir les liens.
  - Les hover/focus n’abîment pas le layout (pas de saut de hauteur de grille).

### Étape 13 – Validation finale

- Vérifier les 3 breakpoints :
  - Mobile : 1 colonne, ordre correct.
  - Tablette : 2 colonnes, Allaw et Légal Constat sur 2 colonnes, verticales cohérentes.
  - Desktop : 3 colonnes, mosaïque conforme et proportions respectées (verticales et horizontales doubles).
- Vérifier que :
  - Toutes les URL s’ouvrent dans un nouvel onglet.
  - Les textes sont bien traduits.
  - Les images sont présentes et correctement alt-tagguées.
- Une fois validé :
  - Remplacer `Projects` par `Projects2` dans la page portfolio.
  - Garder `Projects.tsx` en backup ou le supprimer plus tard si plus utilisé.
````
`````
``````
