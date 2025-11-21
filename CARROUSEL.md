### Étape 1 – Objectif de l’animation du carrousel

Objectif UX :

- Au clic sur une flèche :
  - La **carte actuelle glisse** vers la gauche ou la droite (selon la flèche).
  - La **nouvelle carte arrive** depuis le côté opposé.
- L’animation doit :
  - Être fluide, ~0.4–0.5s.
  - Utiliser un easing naturel (type `easeInOut`).
  - Respecter le sens :
    - Flèche **droite** → slide gauche (on va vers le projet suivant).
    - Flèche **gauche** → slide droite (on revient au projet précédent).

Contraintes :

- Ne toucher **qu’à la partie “Featured Projects Carousel”** dans `Projects3.tsx`. :contentReference[oaicite:0]{index=0}
- La structure visuelle de la carte (titre, image, badges, boutons) reste identique.
- On ajoute uniquement la logique d’animation autour de la carte actuelle.

Recommandation technique : utiliser **Framer Motion** (librairie standard pour les animations React) pour gérer l’`enter/exit` des slides en fonction de la direction.
md
Copier le code

### Étape 2 – Installation et import de Framer Motion

1. Ajouter la dépendance :

````bash
npm install framer-motion
# ou
yarn add framer-motion
En haut de Projects3.tsx, ajouter l’import :

ts
Copier le code
import { AnimatePresence, motion } from "framer-motion";
Ne pas supprimer les imports existants (AOS, lucide-react, etc.).

go
Copier le code

```md
### Étape 3 – Nouvel état pour gérer l’index + la direction

Dans `Projects3()`, juste après :

```ts
const [activeIndex, setActiveIndex] = useState(0);
remplacer par un state combiné index + direction :

ts
Copier le code
// direction: 1 = vers la droite (user clique flèche droite → slide vers la gauche)
// direction: -1 = vers la gauche (user clique flèche gauche → slide vers la droite)
const [[activeIndex, direction], setActiveIndex] = useState<[number, 1 | -1]>([
  0,
  1,
]);

const [isAnimating, setIsAnimating] = useState(false);
isAnimating servira à éviter les double-clics pendant la transition.

typescript
Copier le code

```md
### Étape 4 – Adapter les handlers `handlePrevious` / `handleNext`

Remplacer les fonctions existantes par des versions qui mettent à jour **index + direction** et respectent `isAnimating` :

```ts
const featuredProjects = projects
  .filter((p) => p.isFeatured)
  .sort((a, b) => a.order - b.order);

const goToIndex = (nextIndex: number, nextDirection: 1 | -1) => {
  if (isAnimating) return;
  setIsAnimating(true);
  setActiveIndex([nextIndex, nextDirection]);
};

const handlePrevious = () => {
  const nextIndex =
    (activeIndex - 1 + featuredProjects.length) % featuredProjects.length;
  goToIndex(nextIndex, -1); // slide vers la droite (on revient en arrière)
};

const handleNext = () => {
  const nextIndex = (activeIndex + 1) % featuredProjects.length;
  goToIndex(nextIndex, 1); // slide vers la gauche (on avance)
};
Les callbacks onClick des flèches restent les mêmes (onClick={handlePrevious} / onClick={handleNext}).
Les dots (onClick={() => setActiveIndex(index)}) devront aussi utiliser goToIndex avec une direction cohérente, par exemple :

tsx
Copier le code
onClick={() =>
  goToIndex(
    index,
    index > activeIndex ? 1 : -1 // si on va vers un index plus grand: direction 1, sinon -1
  )
}
javascript
Copier le code

```md
### Étape 5 – Extraire le contenu de la carte dans un composant dédié

Pour que l’animation soit propre, on va encapsuler tout le bloc de la carte (`Left Column + Right Column + Navigation`) dans un composant “slide” réutilisable.

Sous la définition de `OtherProjectCard`, créer :

```tsx
type FeaturedSlideProps = {
  project: Project;
  t: ReturnType<typeof useTranslations>;
};

function FeaturedSlide({ project, t }: FeaturedSlideProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 md:p-10 lg:p-12 shadow-sm md:shadow">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10">
        {/* Colonne gauche (texte) */}
        <div className="flex flex-col items-start order-2 md:order-1">
          <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-700 px-4 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-100 mb-4">
            {project.kind.charAt(0).toUpperCase() + project.kind.slice(1)}
          </span>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
            {t(project.i18nNameKey)}
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 mb-6 md:mb-8 md:min-h-56">
            {t.rich(project.i18nDescriptionKey, {
              strong: (chunks) => <strong>{chunks}</strong>,
              break: () => <br />,
            })}
          </p>
          <div className="flex gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-full bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 ${
                !project.url ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-disabled={!project.url}
              onClick={(e) => {
                if (!project.url) e.preventDefault();
              }}
            >
              {t("viewProject")}
            </a>
          </div>
        </div>

        {/* Colonne droite (visuel) */}
        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
            <Image
              src={project.imageSrc}
              alt={project.imageAlt}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              className="transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
          <div className="flex flex-wrap items-center justify-start md:justify-start gap-2 md:gap-3">
            {project.technologies.map((techId) => (
              <TechBadge key={techId} techId={techId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
Ensuite, dans Projects3, on supprimera la carte inline pour utiliser <FeaturedSlide />.

yaml
Copier le code

```md
### Étape 6 – Définir les variants Framer Motion pour le slide

Toujours dans `Projects3.tsx`, au niveau du composant `Projects3()`, définir les variants **en dehors** du JSX :

```ts
const slideVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction === 1 ? 80 : -80,  // la nouvelle slide arrive du côté opposé
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 1 | -1) => ({
    x: direction === 1 ? -80 : 80, // l’ancienne slide sort dans le bon sens
    opacity: 0,
  }),
};

const slideTransition = {
  x: { type: "tween", duration: 0.45, ease: "easeInOut" },
  opacity: { duration: 0.3 },
};
80 correspond à 80 pixels de décalage. Si tu veux un effet plus prononcé, tu peux passer à 120.

javascript
Copier le code

```md
### Étape 7 – Intégrer `AnimatePresence` + `motion.div` autour du slide

Remplacer le bloc :

```tsx
{activeProject && (
  <div data-aos="fade-up" className="max-w-5xl mx-auto mb-16">
    <div className="rounded-3xl ...">
      ... contenu du slide ...
      ... navigation ...
    </div>
  </div>
)}
par :

tsx
Copier le code
{activeProject && (
  <div data-aos="fade-up" className="max-w-5xl mx-auto mb-16">
    <div className="relative overflow-hidden">
      <AnimatePresence
        custom={direction}
        initial={false}
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          key={activeProject.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="w-full"
        >
          <FeaturedSlide project={activeProject} t={t} />
          {/* Navigation reste à l'intérieur du motion.div pour glisser avec le slide */}
          <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label={t("previousProjectAriaLabel")}
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              disabled={isAnimating}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {featuredProjects.map((project, index) => (
                <button
                  type="button"
                  key={project.id}
                  onClick={() =>
                    goToIndex(
                      index,
                      index > activeIndex ? 1 : -1,
                    )
                  }
                  aria-label={`${t("goToProjectAriaLabel")} ${t(
                    project.i18nNameKey,
                  )}`}
                  aria-pressed={activeIndex === index}
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  disabled={isAnimating}
                >
                  <span
                    className={`block rounded-full transition-all ${
                      activeIndex === index
                        ? "w-3 h-3 bg-neutral-50"
                        : "w-2 h-2 bg-neutral-500 hover:w-3 hover:h-3"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              aria-label={t("nextProjectAriaLabel")}
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              disabled={isAnimating}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
)}
Points importants :

key={activeProject.id} → indispensable pour que Framer Motion comprenne qu’il s’agit d’un nouveau slide.

custom={direction} passé à AnimatePresence et motion.div pour pouvoir calculer les variants en fonction de la direction.

onExitComplete={() => setIsAnimating(false)} → réactive les contrôles une fois l’animation terminée.

disabled={isAnimating} sur les flèches et dots pour éviter de spam cliquer.

go
Copier le code

```md
### Étape 8 – Comportement attendu et tests

Une fois les changements appliqués :

1. **Flèche droite** :
   - La carte actuelle glisse vers la gauche et disparaît.
   - La carte suivante arrive depuis la droite et s’arrête au centre.
2. **Flèche gauche** :
   - La carte actuelle glisse vers la droite.
   - La carte précédente arrive depuis la gauche.
3. Pendant l’animation :
   - Les flèches et les dots sont désactivés (`disabled`).
4. À la fin de l’animation :
   - `isAnimating` repasse à `false`,
   - Les contrôles sont à nouveau cliquables.

Vérifier :

- que le sens du slide est cohérent avec la flèche utilisée,
- que l’animation est fluide (≈0.45s) avec une courbe “easeInOut”,
- qu’il n’y a pas de flash ou de clignotement entre deux projets.

Tu peux ensuite ajuster finement :

- la distance (`80` → `100`/`120`),
- la durée dans `slideTransition`,
- le style des flèches/dots (mais sans toucher au mécanisme d’animation).
````
