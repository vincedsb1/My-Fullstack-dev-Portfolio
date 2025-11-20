# Spécifications fonctionnelles – Composant `Projects2`

## 1. Contexte

Le composant actuel `Projects` affiche une sélection de projets dans une mise en page responsive basée sur du `flex-wrap`, avec :

- un titre + intro,
- plusieurs cartes projet avec image, description et liste des technos au survol,
- animations d’apparition (AOS),
- comportement “carte cliquable” ouvrant l’URL du projet. :contentReference[oaicite:0]{index=0}

Objectif : créer un **nouveau composant** `Projects2` proposant :

- un **nouveau layout responsive** (3 colonnes desktop, 2 colonnes tablette, 1 colonne mobile),
- une **séparation claire** entre cartes “grandes” (projets principaux) et cartes “carrées” (autres projets),
- un **code plus data-driven** (configuration via un tableau de projets),
- **sans modifier** `Projects.tsx` tant que `Projects2` n’est pas validé.

`Projects2` pourra ensuite remplacer `Projects` dans la page portfolio.

---

## 2. Liste des projets et typage

### 2.1. Structure de données `Project`

Créer un typage TypeScript pour décrire chaque projet :

```ts
type ProjectSize = "large" | "square";

type ProjectId =
  | "allaw"
  | "truthify"
  | "legalConstat"
  | "smartflow"
  | "decorNature"
  | "teslaApp"
  | "emmausConnect"
  | "wilderGame"
  | "legalDirectory"
  | "aimoto"
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
  | "css";

type Project = {
  id: ProjectId;

  /** Clé de traduction pour le nom (ex: "projects.allaw.name") */
  i18nNameKey: string;

  /** Clé de traduction pour la description */
  i18nDescriptionKey: string;

  /** URL externe (optionnelle pour les projets locaux) */
  url?: string;

  /** Type de projet (pour affichage éventuel de badge) */
  kind: "web-app" | "extension" | "tool" | "platform";

  /** Technologies principales */
  technologies: TechnologyId[];

  /** Type de carte (impacte layout + style) */
  size: ProjectSize;

  /** Chemin d’image (screenshot) */
  imageSrc: string;

  /** Texte alternatif image */
  imageAlt: string;

  /**
   * Ordre logique d’affichage sur mobile (1 colonne).
   * Sur tablette / desktop, le placement dépendra de la grille (cf. section layout).
   */
  mobileOrder: number;
};
2.2. Projets à intégrer
Grandes cartes (size: "large" – dans cet ordre de priorité)
Allaw

id: "allaw"

kind: "platform"

url: https://www.allaw.fr

description: plateforme de mise en relation particuliers / pros du droit + CRM.

technologies: ["nextjs", "typescript", "nodejs", "mongodb"]

size: "large"

imageSrc: /projects/allaw.png (nommage à confirmer)

imageAlt: "Allaw – plateforme juridique"

mobileOrder: 1

Truthify

id: "truthify"

kind: "tool"

url: https://www.truthify.eu/

description: outil d’analyse d’arguments et fact-checking de vidéos / textes.

technologies: ["nextjs", "typescript", "tailwind", "postgresql"]

size: "large"

imageSrc: /projects/truthify.png

imageAlt: "Truthify – outil de fact-checking"

mobileOrder: 2

Légal Constat

id: "legalConstat"

kind: "platform"

url: https://www.legalconstat.fr/

description: plateforme de mise en relation particuliers / commissaires de justice + CRM.

technologies: ["react", "typescript", "symfony", "css"]

size: "large"

imageSrc: /projects/legal-constat.png

imageAlt: "Légal Constat – plateforme pour commissaires de justice"

mobileOrder: 3

Smartflow

id: "smartflow"

kind: "tool"

url: https://www.smartflow-app.com/

description: outil de gestion / automatisation (déjà présent dans Projects.tsx sous project6).
Projects


technologies: ["nextjs", "tailwind", "postgresql", "typescript"]

size: "large"

imageSrc: /project6-2.png (ou nouveau chemin harmonisé)

imageAlt: "Smartflow – application de gestion"

mobileOrder: 4

Cartes carrées (size: "square")
Décor Nature

id: "decorNature"

kind: "web-app"

url: https://decor-nature.fr/

technologies: ["nextjs", "tailwind", "postgresql", "typescript"]

size: "square"

imageSrc: /project5.png

imageAlt: "Décor Nature – site vitrine"

mobileOrder: 5

Aimoto

id: "aimoto"

kind: "tool"

url: undefined (projet local)

description: outil d’analyse prédictive du prix du bitcoin via modèle IA sur séries temporelles.

technologies: ["nextjs", "typescript", "tailwind", "python"]

size: "square"

imageSrc: /projects/aimoto.png

imageAlt: "Aimoto – analyse prédictive Bitcoin"

mobileOrder: 6

LIIC – LinkedIn AI Comments

id: "liic"

kind: "extension"

url: éventuelle URL du Chrome Web Store (sinon undefined)

description: extension Chrome générant des commentaires LinkedIn avec IA.

technologies: ["typescript", "json", "nodejs"]

size: "square"

imageSrc: /projects/liic.png

imageAlt: "LIIC – extension Chrome pour commentaires LinkedIn"

mobileOrder: 7

Is Tesla Worth It?

id: "teslaApp"

kind: "tool"

url: https://isteslaworthit.vercel.app/

technologies: ["nextjs", "typescript"] (possibilité d’ajouter "recharts" si utile)

size: "square"

imageSrc: /project1.png

imageAlt: "Is Tesla Worth It ? – outil d’analyse d’investissement"

mobileOrder: 8

Emmaüs Connect

id: "emmausConnect"

kind: "web-app"

url: https://emmaus-connect-bay.vercel.app/

technologies: ["react", "javascript"]

size: "square"

imageSrc: /project2.png

imageAlt: "Emmaüs Connect – interface web"

mobileOrder: 9

Wilder Game

id: "wilderGame"

kind: "web-app"

url: https://wilders-game.vercel.app/

technologies: ["react", "javascript", "nodejs", "mysql"]

size: "square"

imageSrc: /project3.png

imageAlt: "Wilder Game – jeu web"

mobileOrder: 10

Legal Directory Management System

id: "legalDirectory"

kind: "web-app"

url: http://5.250.176.153:5000/

technologies: ["nextjs", "tailwind", "nodejs", "postgresql"]

size: "square"

imageSrc: /project4.png

imageAlt: "Legal Directory – outil de gestion d’annuaire"

mobileOrder: 11

3. Variantes de cartes
3.1. Comportement commun (toutes cartes)
Carte cliquable

role="link", tabIndex={0}

onClick: ouvre url dans un nouvel onglet (window.open(url, "_blank")) si url défini.

onKeyDown: déclenche l’ouverture sur Enter ou Space.

Style global

Fond : bg-neutral-200 dark:bg-neutral-800

Bordure : border border-neutral-400 border-opacity-50 dark:border-neutral-700

Hover : bordure plus visible + hover:ring ring-neutral-400 dark:ring-neutral-700

Bords : rounded-3xl

Overflow : overflow-hidden

Cursor : cursor-pointer

Transition : transition-all

Contenu minimum

Nom du projet (typo similaire à Projects actuel, text-2xl bold).

Court texte descriptif.

Image illustrative (alignement différent selon variante).

Bandeau technos au survol (en bas, slide-up comme dans Projects).
Projects


3.2. Variante “grande carte” (size: "large")
Objectif visuel

Mettre en avant les 4 projets principaux.

Occuper 2 cellules de grille au minimum :

soit en largeur (col-span-2),

soit en hauteur (row-span-2).

Layout interne recommandé

lg: layout horizontal (texte à gauche, image à droite) similaire à project6 / project4 actuels.
Projects


md: même principe mais plus compact.

sm: layout vertical (texte au-dessus, image en dessous).

Hauteur

Desktop / tablette : hauteur fixe cohérente (ex: h-80 ou h-96), identique pour toutes les grandes cartes.

Mobile : hauteur auto, mais conserver un aspect “carte riche” (image visible).

3.3. Variante “carte carrée” (size: "square")
Forme

Sur desktop / tablette : 1 cellule de grille (col-span-1 row-span-1).

Ratio visuel proche d’un carré (ex: aspect-[4/3] ou aspect-square selon rendu final).

Layout interne

Stack vertical simple :

Titre

Petite description (2–3 lignes max)

Petite image centrée ou alignée bas

Bandeau technos

Même pattern que les grandes cartes :

bandeau semi-transparent en bas,

slide-up au survol,

liste d’icônes + texte.

4. Layout responsive
4.1. Breakpoints
Mobile (1 colonne) : < 768px (en pratique, classe Tailwind par défaut, sans préfixe).

Tablette (2 colonnes) : md: (≥ 768px et < 1024px).

Desktop (3 colonnes) : lg: (≥ 1024px).

4.2. Conteneur
Remplacer le flex flex-wrap actuel par une grille :

tsx
Copier le code
<div
  id="projectsCardsContainer"
  className="
    grid gap-6
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
  "
>
  {/* cartes */}
</div>
4.3. Placement logique des projets
4.3.1. Ordre sur mobile (1 colonne)
Utiliser mobileOrder pour trier le tableau de projets avant rendu.

Ordre souhaité (du haut vers le bas) :

Allaw (large)

Truthify (large)

Légal Constat (large)

Smartflow (large)

Décor Nature

Aimoto

LIIC

Tesla

Emmaüs Connect

Wilder Game

Legal Directory

Toutes les cartes sont plein largeur (w-full), une par ligne, avec un spacing vertical constant (gap-6).

Les grandes cartes et les carrées peuvent avoir un style légèrement différent, mais pas de décalage latéral sur mobile.

4.3.2. Layout tablette (2 colonnes)
Objectif : se rapprocher du layout sketchnoté “2 colonnes” :

Schéma conceptuel (chaque lettre = une carte, les [] symbolisent une cellule de grille) :

less
Copier le code
Row 1: [ Allaw (large, col-span-2)           ]
Row 2: [ Truthify (large, row-span-2) ] [ Décor Nature ]
Row 3: [ ...                        ] [ Smartflow (large, row-span-2) ]
Row 4: [ Aimoto                     ] [ LIIC                          ]
Row 5: [ Legal Constat (large, col-span-2)    ]
Row 6: [ Tesla                      ] [ Emmaüs Connect                ]
Row 7: [ Wilder Game (square, col-span-1) ] [ Legal Directory (square, col-span-1) ]
Règles associées :

Allaw

md:col-span-2

Truthify

md:row-span-2

md:col-span-1

Smartflow

md:row-span-2

md:col-span-1

Legal Constat

md:col-span-2

Autres projets

md:col-span-1 md:row-span-1

L’ordre DOM peut être :

Allaw

Truthify

Décor Nature

Smartflow

Aimoto

LIIC

Legal Constat

Tesla

Emmaüs Connect

Wilder Game

Legal Directory

Avec grid-auto-flow: row dense (ajouter une classe utilitaire ou style inline) pour que la grille compacte les vides et produise un arrangement proche du sketch.

4.3.3. Layout desktop (3 colonnes)
Objectif : layout “mosaïque” à 3 colonnes comme le dessin fourni.

Schéma conceptuel (lettres = projets) :

less
Copier le code
Row 1: [ Décor Nature ] [ Aimoto      ] [ Truthify (large, row-span-3) ]
Row 2: [ Allaw (large, row-span-2) ] [ LIIC       ] [ ...              ]
Row 3: [ ...                    ] [ Legal Constat (large, col-span-2)  ]
Row 4: [ Tesla        ] [ Emmaüs Connect ] [ Wilder Game               ]
Row 5: [ Smartflow (large, col-span-2) ] [ Legal Directory            ]
Règles de span :

Truthify

lg:row-span-3 lg:col-span-1

Allaw

lg:row-span-2 lg:col-span-1

Legal Constat

lg:col-span-2 lg:row-span-1

Smartflow

lg:col-span-2 lg:row-span-1

Toutes les cartes carrées

lg:col-span-1 lg:row-span-1

L’ordre DOM peut être conservé identique à la version tablette, la différence de layout venant uniquement des row-span / col-span.

5. Internationalisation
Reprendre useTranslations("projects") comme dans le composant existant.
Projects


Ajouter les clés suivantes dans les fichiers de traductions :

projects.allaw.name, projects.allaw.description

projects.truthify.name, projects.truthify.description

projects.legalConstat.name, projects.legalConstat.description

projects.smartflow.name, projects.smartflow.description

projects.aimoto.name, projects.aimoto.description

projects.liic.name, projects.liic.description

(les projets déjà présents peuvent garder leurs clés existantes)

6. Icônes de technologies
Réutiliser le pattern projectTechnologies du composant actuel, mais le rendre générique.

6.1. Table de correspondance Technology → icône
Créer un dictionnaire :

tsx
Copier le code
const technologyIcons: Record<TechnologyId, { label: string; icon: JSX.Element }> = {
  nextjs: { label: "Next.js", icon: <FileCode size={20} ... /> },
  react: { label: "ReactJS", icon: <Atom size={20} ... /> },
  typescript: { label: "Typescript", icon: <Type size={20} ... /> },
  javascript: { label: "Javascript", icon: <Code size={20} ... /> },
  tailwind: { label: "TailwindCSS", icon: <Palette size={20} ... /> },
  nodejs: { label: "Node.js", icon: <Server size={20} ... /> },
  mongodb: { label: "MongoDB", icon: <Database size={20} ... /> },
  postgresql: { label: "PostgreSQL", icon: <Database size={20} ... /> },
  mysql: { label: "MySQL", icon: <Database size={20} ... /> },
  json: { label: "JSON", icon: <Braces size={20} ... /> },
  python: { label: "Python", icon: <Code size={20} ... /> },
  symfony: { label: "Symfony", icon: <Server size={20} ... /> },
  css: { label: "CSS", icon: <Palette size={20} ... /> },
};
Puis dans la carte :

tsx
Copier le code
<div className="flex flex-wrap gap-x-6 gap-y-3">
  {project.technologies.map((techId) => {
    const tech = technologyIcons[techId];
    return (
      <div key={techId} className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
        {tech.icon}
        <span className="text-sm">{tech.label}</span>
      </div>
    );
  })}
</div>
7. Structure du composant Projects2
7.1. Signature
tsx
Copier le code
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import AOS from "aos";

function Projects2() {
  // ...
}
7.2. Initialisation AOS
Même comportement que dans Projects :

tsx
Copier le code
useEffect(() => {
  AOS.init({ duration: 300 });
}, []);
7.3. Layout global
Conserver le même header que Projects (icône Rocket, titre, intro) pour cohérence visuelle, mais le code sera dupliqué dans Projects2 pour éviter la dépendance directe.
Projects


7.4. Rendu des cartes
Définir un tableau projects: Project[] (cf. section 2).

Sur mobile : trier par mobileOrder.

Rendu :

tsx
Copier le code
<div
  id="projectsCardsContainer"
  className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
>
  {sortedProjects.map((project, index) => (
    <ProjectCard2
      key={project.id}
      project={project}
      index={index}
    />
  ))}
</div>
Composant ProjectCard2 :

applique les classes communes,

ajoute les col-span / row-span en fonction de :

project.size,

project.id,

et du breakpoint (via clsx/conditions Tailwind comme lg:col-span-2 etc.),

gère l’animation data-aos="fade-up".

8. Accessibilité & interactions
Chaque carte doit être focusable (tabIndex={0}).

Navigation clavier :

Enter et Space ouvrent le lien.

aria-label optionnel pour préciser le rôle :

aria-label="Ouvrir le projet Allaw dans un nouvel onglet" par exemple.

S’assurer que le contraste texte/fond reste suffisant en mode clair et sombre.

9. Points à vérifier avant remplacement de Projects
Capture des screenshots

Générer / exporter une image par projet, alignée avec le style actuel.

Test responsive

Vérifier le comportement de la grille :

mobile : 1 colonne,

tablette : 2 colonnes, layout compact (pas de trous importants),

desktop : 3 colonnes + spans qui respectent l’esprit du sketch.

Tests d’accessibilité

Navigation clavier sur toutes les cartes.

Hover + focus visibles.

Performance

Nombre d’images / poids raisonnables (use next/image avec sizes adaptés).

Migration

Quand Projects2 est validé :

remplacer le composant utilisé dans la page portfolio par Projects2,

éventuellement supprimer Projects ou le garder comme fallback.
```
