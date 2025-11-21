# CARROUSEL – Spécifications fonctionnelles (v3)

> Nouveau cahier des charges **corrigé** pour l’animation du carrousel des projets principaux dans `Projects3.tsx`.  
> La version précédente (v2) ne doit plus servir de référence. :contentReference[oaicite:0]{index=0}

---

## 1. Objectif UX & comportement attendu

- Au clic sur une flèche (ou un dot) :
  - Le **contenu du projet actuellement visible** (texte + image + badges) glisse vers la gauche ou la droite.
  - Le **contenu du projet suivant** arrive en même temps depuis le côté opposé.
  - On voit clairement les deux contenus se croiser, comme sur un carrousel classique.
- Le mouvement doit être :
  - Fluide et naturel (`~0.45s`, `easeInOut`).
  - Cohérent avec le sens de navigation :
    - Flèche **droite** → contenu actuel va vers la gauche, nouveau contenu arrive depuis la droite.
    - Flèche **gauche** → contenu actuel va vers la droite, nouveau contenu arrive depuis la gauche.
- L’animation peut avoir un léger **fade-out** sur l’ancien contenu, mais **pas de fade-in décalé** :
  - Le nouveau contenu doit être visible dès qu’il commence à glisser, pas après la disparition complète de l’ancien.

---

## 2. Contraintes de layout

- La **carte** (bordure, fond, arrondi, ombre, padding) reste **fixe**.
- Les **contrôles (flèches + dots) restent à l’intérieur de la carte**, en bas :
  - Visuellement comme aujourd’hui : dans la même « box » que le projet, alignés au centre sous le contenu.
- Les contrôles **ne doivent pas être animés** :
  - Pas de translation ni d’opacity appliquées par Framer Motion.
- Seul un **“panel de contenu” interne** à la carte est animé :
  - Ce panel contient : badge type, titre, description, bouton, image, badges de techno.
  - Il est entièrement responsable du slide gauche / droite.

---

## 3. Architecture du carrousel (structure JSX cible)

Dans `Projects3.tsx`, la structure du bloc _featured projects_ doit suivre ce schéma :

```tsx
<section ...>
  ...
  <div className="max-w-5xl mx-auto mb-16" data-aos="fade-up">
    {/* Shell de la carte – FIXE */}
    <div className="rounded-3xl border ... bg-... p-6 md:p-10 lg:p-12 shadow-sm md:shadow">
      {/* Container général de la carte */}
      <div className="flex flex-col gap-6 md:gap-8">

        {/* 1) Zone ANIMÉE (panel de contenu) */}
        <div className="relative overflow-hidden min-h-[260px] md:min-h-[300px]">
          <AnimatePresence ...>
            <motion.div ...>
              <FeaturedPanel project={activeProject} t={t} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2) Navigation – FIXE, À L’INTÉRIEUR DE LA CARTE */}
        <div className="flex items-center justify-center gap-4">
          {/* flèche gauche, dots, flèche droite */}
        </div>

      </div>
    </div>
  </div>
</section>
Rappels importants :

Les flèches + dots sont dans la carte (dans le div arrondi), mais en dehors du motion.div.

Le motion.div ne contient que le FeaturedPanel, pas la navigation.

4. State d’index + direction
Dans Projects3.tsx :

ts
Copier le code
// direction: 1 = on va vers la droite (projet suivant) → slide vers la gauche
// direction: -1 = on va vers la gauche (projet précédent) → slide vers la droite
const [[activeIndex, direction], setActiveIndex] = useState<[number, 1 | -1]>([
  0,
  1,
]);

const [isAnimating, setIsAnimating] = useState(false);
Helpers :

ts
Copier le code
const featuredProjects = ... // mêmes données qu'actuellement

const goToIndex = (nextIndex: number, nextDirection: 1 | -1) => {
  if (isAnimating || nextIndex === activeIndex) return;
  setIsAnimating(true);
  setActiveIndex([nextIndex, nextDirection]);
};

const handleNext = () => {
  const nextIndex = (activeIndex + 1) % featuredProjects.length;
  goToIndex(nextIndex, 1);
};

const handlePrevious = () => {
  const nextIndex =
    (activeIndex - 1 + featuredProjects.length) % featuredProjects.length;
  goToIndex(nextIndex, -1);
};
Pour les dots :

tsx
Copier le code
onClick={() =>
  goToIndex(index, index > activeIndex ? 1 : -1)
}
5. Animation Framer Motion – panels qui se croisent
Positionnement
Le container de slide :

tsx
Copier le code
<div className="relative overflow-hidden min-h-[260px] md:min-h-[300px]">
  <AnimatePresence ...>
    ...
  </AnimatePresence>
</div>
Chaque panel animé :

tsx
Copier le code
<motion.div
  key={activeProject.id}
  custom={direction}
  variants={slideVariants}
  initial="enter"
  animate="center"
  exit="exit"
  transition={slideTransition}
  className="absolute inset-0 w-full h-full"
>
  <FeaturedPanel project={activeProject} t={t} />
</motion.div>
Variants – entrer et sortir en même temps
Objectif : l’ancien panel et le nouveau sont visibles simultanément pendant la transition.

ts
Copier le code
const slideVariants = {
  // Nouvelle slide qui arrive
  enter: (direction: 1 | -1) => ({
    x: direction === 1 ? "100%" : "-100%", // démarre juste hors cadre
    opacity: 1,                            // déjà visible
  }),
  // Slide centrée (état stable)
  center: {
    x: "0%",
    opacity: 1,
  },
  // Slide qui sort
  exit: (direction: 1 | -1) => ({
    x: direction === 1 ? "-100%" : "100%", // sort par le côté opposé
    opacity: 0.6,                          // léger fade-out uniquement
  }),
};

const slideTransition = {
  x: { type: "tween", duration: 0.45, ease: "easeInOut" },
  opacity: { duration: 0.45, ease: "easeInOut" },
};
AnimatePresence
Utiliser le mode par défaut (synchronisé), pas mode="wait" :

tsx
Copier le code
<AnimatePresence
  custom={direction}
  initial={false}
  onExitComplete={() => setIsAnimating(false)}
>
  {/* motion.div ici */}
</AnimatePresence>
Conséquences :

La slide sortante commence son animation en même temps que la slide entrante.

onExitComplete sera appelée quand l’animation de sortie est terminée, ce qui suffit pour réactiver les contrôles.

6. Composant FeaturedPanel – contenu uniquement
Signature :

ts
Copier le code
type FeaturedPanelProps = {
  project: Project;
  t: ReturnType<typeof useTranslations>;
};
Comportement :

Contient uniquement :

badge type,

titre,

description (avec t.rich),

bouton “Voir le projet”,

image,

badges de technos.

Ne déclare aucune animation Framer Motion.

Ne contient pas les flèches ni les dots.

Structure suggérée :

tsx
Copier le code
function FeaturedPanel({ project, t }: FeaturedPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10 flex-1">
        {/* Colonne gauche : texte */}
        <div className="flex flex-col items-start order-2 md:order-1">
          <span className="inline-flex items-center rounded-full bg-neutral-800 px-4 py-1 text-xs font-medium text-neutral-100 mb-4">
            {project.kind.charAt(0).toUpperCase() + project.kind.slice(1)}
          </span>

          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-50 mb-3">
            {t(project.i18nNameKey)}
          </h3>

          <p className="text-sm md:text-base leading-relaxed text-neutral-300 mb-6 md:mb-8">
            {t.rich(project.i18nDescriptionKey, {
              strong: (chunks) => <strong>{chunks}</strong>,
              break: () => <br />,
            })}
          </p>

          <div className="mt-auto">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-full bg-neutral-50 text-neutral-900 hover:bg-neutral-200 ${
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

        {/* Colonne droite : image + badges */}
        <div className="order-1 md:order-2 flex flex-col">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 mb-4">
            <Image
              src={project.imageSrc}
              alt={project.imageAlt}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {project.technologies.map((techId) => (
              <TechBadge key={techId} techId={techId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
7. Navigation à l’intérieur de la carte (non animée)
Sous la zone relative (mais toujours dans la carte arrondie) :

tsx
Copier le code
<div className="flex items-center justify-center gap-4">
  <button
    type="button"
    onClick={handlePrevious}
    aria-label={t("previousProjectAriaLabel")}
    className="p-2 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
    disabled={isAnimating}
  >
    <ChevronLeft size={20} />
  </button>

  <div className="flex gap-2">
    {featuredProjects.map((project, index) => (
      <button
        key={project.id}
        type="button"
        onClick={() =>
          goToIndex(index, index > activeIndex ? 1 : -1)
        }
        aria-pressed={activeIndex === index}
        aria-label={`${t("goToProjectAriaLabel")} ${t(project.i18nNameKey)}`}
        className="w-4 h-4 flex items-center justify-center"
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
    className="p-2 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
    disabled={isAnimating}
  >
    <ChevronRight size={20} />
  </button>
</div>
Points clés :

Ce bloc est en dehors du <AnimatePresence> et du motion.div.

Il ne doit pas être inclus dans FeaturedPanel.

Les flèches et dots restent visuellement dans la carte, juste sous le contenu.

8. Critères d’acceptation
Layout

La carte reste fixe (bordure, arrondi, fond, ombre, padding ne bougent pas).

Les flèches + dots sont intégrés dans la carte, sous le contenu, et ne se déplacent pas lors de l’animation.

Animation

En cliquant sur une flèche :

L’ancien contenu glisse vers le côté correspondant (gauche si flèche droite, droite si flèche gauche).

Le nouveau contenu arrive simultanément depuis le côté opposé.

Les deux contenus sont visibles une partie du temps (effet “carrousel”).

La transition est fluide (~0.45s) avec un easing easeInOut.

L’ancien contenu peut légèrement s’estomper (opacity vers 0.6), le nouveau ne doit pas avoir un fade-in décalé.

Stabilité

La hauteur de la carte ne change pas de manière brutale entre deux projets.

Aucun “flash” blanc / noir au milieu de la transition.

Pas de double-animation en spammant les contrôles (les boutons sont désactivés pendant isAnimating).

Accessibilité

Navigation clavier possible (tab + Enter/Space).

Attributs aria-label présents et cohérents sur les flèches et les dots.

Lorsque ces points sont respectés, le carrousel est considéré conforme à cette version (v3) des spécifications.
```
