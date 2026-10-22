# Corrections de l’audit du 22 octobre 2026

État local sur la branche `projet-details`. L’audit d’origine est conservé dans
`AUDIT_2026-10-22.md`. Les modifications portent sur ses 25 mesures ; la réserve
concernant le livre et l’historique public est détaillée plus bas.

**Statut le plus récent :** les cinq sections de l'accueil (Compétences, Projets, Blog,
Parcours, FAQ) ont ensuite été restaurées d'après `origin/main` à la demande du propriétaire.
Le carrousel Framer Motion, son drag et son timer, la fenêtre illustrée des autres projets et
l'accordéon historique sont revenus. La table ci-dessous décrit donc la **passe d'audit avant
cette restauration** pour P3, P5, S5, H1/H4, U2 et U4. Le suivi courant, y compris le budget
JavaScript à 221,36 Ko gzip, les contrastes des sous-titres et la FAQ sans ouverture hors JS,
figure en tête de [AUDIT_2026-10-22.md](AUDIT_2026-10-22.md).

## Résultats par mesure lors de la passe d'audit initiale

| ID  | Correction réalisée                                                                                                                                                                                                                                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Suppression des deux anciens composants projets, des dépendances et du CSS FontAwesome, de Radix Accordion, du paquet Lucide inutilisé, d’AOS et de sa configuration obsolète. React et ses types sont alignés sur 19. Notes déplacées dans `docs/archive/`, fichiers parasites retirés et conventions réécrites dans `CLAUDE.md`.                   |
| A2  | Identité, contacts et origine centralisés dans `src/lib/site.ts` ; constructeur de métadonnées et composant JSON-LD commun avec échappement de `<`. Police et initialisation du thème partagées.                                                                                                                                                     |
| A3  | Une table `next-intl` avec chemins FR/EN, une page par type de projet, configuration `requestLocale`, chemins construits à partir de la table avec des paramètres typés. Le changement de langue conserve la fiche traduite ; si un article n’a pas de traduction, le menu propose l’accueil de l’autre langue. Les liens de l’accueil sont des liens HTML pour garder un chargement initial léger. |
| A4  | Chargeurs, registre et validation de manifestes protégés par `server-only`. Modèles d’affichage sérialisables calculés côté serveur, visuels déclarés dans le catalogue, lecture des articles mémorisée par processus hors développement.                                                                                                            |
| A5  | Composants regroupés dans `src/features/` et `src/components/`. Registre de gabarits d’articles piloté par le frontmatter. Guide rendu depuis MDX et dix sections React typées, sans injection de sa chaîne HTML ; checklist et clé de stockage conservées. Tests unitaires, navigateur et CI ajoutés.                                               |
| P1  | Accueil assemblé côté serveur ; sections statiques hors du bundle client. Les contrôles reçoivent leurs libellés en props ; les providers de messages sont limités au blog et aux projets. Budget du JavaScript moderne contrôlé par `npm run audit:verify`.                                                                                         |
| P2  | AOS entièrement retiré. Hero visible sans JavaScript ; photo prioritaire ; police en `display: optional` pour éviter un remplacement tardif du texte sur connexion lente. Les images des projets sous la ligne de flottaison ne sont plus prioritaires.                                                                                              |
| P3  | Progression du carrousel en CSS, sans état React mis à jour à chaque frame. Grille des autres projets rendue côté serveur.                                                                                                                                                                                                                           |
| P4  | Onze images préparées en WebP ; originaux et variantes AVIF conservés dans `assets-src/`, ignoré par Git. Imports statiques, dimensions et flou automatiques, `sizes` adaptés ; avatar partagé aussi sur l’article éditorial et qualité 100 retirée.                                                                                                 |
| P5  | CSS du guide chargé par son rendu, une déclaration Inter, script de thème en ligne commun. Framer Motion limité au workflow et chargé avec `LazyMotion`.                                                                                                                                                                                             |
| S1  | Index des études de cas FR/EN, sept liens de détail dans chaque accueil, cartes de fiches avec des liens HTML utilisables sans JavaScript et un dialogue d’actions au clic ; fil d’Ariane visible aligné sur le JSON-LD ; projet Iconise lié à l’article qui le cite.                                                                                                               |
| S2  | Images sociales statiques 1200 × 630 pour accueil, index, archives et fiches, dans chaque langue. Les images du blog sont conservées. Une route stable sert aussi les images référencées par le JSON-LD des fiches.                                                                                                                                  |
| S3  | Gabarit de titre commun, titres SEO courts distincts des titres éditoriaux, rôle/catégorie inclus dans les H1, `x-default`, compte d’archives calculé et libellés de compétences traduits. Les titres courts reprennent les sujets réellement décrits dans les manifestes.                                                                           |
| S4  | Graphe `Person` / `WebSite` / `ProfilePage` sur l’accueil, identifiants stables référencés ailleurs, `CreativeWork` enrichis et auteurs d’articles reliés par `@id`.                                                                                                                                                                                 |
| S5  | FAQ native côté serveur, landmarks et lien d’évitement, suppression des identifiants décoratifs dupliqués. Dates ISO de révision vérifiées dans les manifestes et `lastmod` du sitemap liés aux contenus, sans date de build.                                                                                                                        |
| H1  | Tokens sémantiques clair/sombre, rayons, ombres, typographie et mouvement ; correction des contrastes relevés dans les deux thèmes. Règle ESLint pour éviter les couleurs, rayons et ombres arbitraires hors illustrations.                                                                                                                          |
| H2  | Primitives boutons, liens-boutons, surfaces interactives, badges, cartes, titres, avatar, copie et dialogue. Dialogue natif partagé avec boucle Tab explicite et restitution du focus. Galerie interne des primitives en développement.                                                                                                              |
| H3  | En-tête et pied de page communs sur les pages localisées ; menu mobile avec Échap. Dans l’en-tête, interrupteur clair/sombre à deux positions, initialement réglé selon le système, choix manuel mémorisé, et petit menu déroulant FR/EN.                                                                                                                                                                    |
| H4  | Conteneurs fluides, échelle typographique et espacements communs, timeline sans hauteur fixe. Correction de l’espacement hérité des sous-titres des H1. Contrôle des débordements entre 280 et 1920 px.                                                                                                                                              |
| H5  | Lucide actualisé, trait commun, badges de technologie textuels ; suppression de la police Phosphor. Libellés communs dans les messages et typographie française normalisée. Les marques restent identifiées par leur nom.                                                                                                                            |
| U1  | Révélation progressive partagée : contenu visible avant activation, éléments déjà dans le viewport préservés, mouvement réduit respecté. Tokens communs et animations de produit conservées.                                                                                                                                                         |
| U2  | Quatre panneaux présents dans le HTML, hauteur calculée par la grille, panneaux inactifs inertes, flèches et points accessibles. La progression est intégrée au point actif (4 s) ; pause automatique au survol, au focus, hors écran et dans un onglet masqué. Le bouton pause et l’anneau séparé ont été retirés à la demande du propriétaire. Geste tactile horizontal sans bloquer le défilement vertical.                                             |
| U3  | Une action principale de contact, une secondaire vers les projets ; liens e-mail et téléphone directs. Copie annoncée et repli explicite, sans `onKeyPress`. PDF renommés et anciens liens redirigés en 308, y compris le nom encodé contenant des espaces.                                                                                          |
| U4  | Survol des cartes de compétences, de projets et de blog rétabli ; timeline en liste et hauteur naturelle avec points, traits et survol ; FAQ sans hauteur maximale avec survol des questions. Icônes des titres, sous-titres et lien animé « Voir tous les articles » rétablis sur l’accueil. Le calque `bg-noise` reste retiré.                                                                                                                                                                              |
| U5  | 404 localisée, 404 racine avec choix FR/EN et thème, gestion d’erreur avec reprise, focus global, gouttière de défilement stable et marges d’ancres. La galerie de développement permet de provoquer une erreur puis de vérifier « Réessayer ».                                                                                                      |

## Retour visuel demandé après la première correction

Les 17 ajustements de l’accueil ont été appliqués : survols des compétences, projets, blog,
parcours et FAQ ; points et progression du carrousel ; dialogue sur les cartes projet ; icônes,
sous-titres, carte du blog et lien vers tous les articles ; interrupteur clair/sombre et menu de
langue. Les couleurs des sous-titres sont plus claires que le texte courant tout en passant le
contrôle de contraste en clair et en sombre. La Hero et le footer n’ont pas été modifiés dans
cette reprise. Les décisions initiales de S1, H3, U2 et U4 ont été ajustées ci-dessus pour
refléter la demande explicite du propriétaire.
Le contrôle de pause explicite prévu par U2 a été retiré avec les deux icônes situées à droite
des points. La pause automatique au survol, au focus, hors écran et quand l’onglet est masqué
reste active ; le critère U2 qui exige une commande de pause indépendante n’est donc pas
entièrement satisfait dans cet état.

## Mesures et preuves locales

Les références de départ sont celles de l’audit. Les résultats ci-dessous portent
sur le build local, sans déploiement.

| Indicateur                                 | Référence de l’audit             | Après correction                                       |
| ------------------------------------------ | -------------------------------- | ------------------------------------------------------ |
| JavaScript moderne de l’accueil            | Non séparé du fichier legacy     | 149,03 Ko gzip, neuf fichiers, FR et EN                |
| Fichier `nomodule` de compatibilité        | Inclus dans les ~302 Ko annoncés | 38,70 Ko gzip, voie alternative pour ancien navigateur |
| Somme arithmétique des deux voies          | ~302 Ko gzip                     | ~187,73 Ko gzip, pas le chargement d’un seul visiteur  |
| Manifestes dans les chunks client          | ~36 Ko gzip                      | Absents : recherche de `schemaVersion` vide            |
| Dossier public                             | ~23 Mo                           | ~1,4 Mo ; aucune image > 500 Ko                        |
| Études de cas liées dans le HTML d’accueil | 1 / 7                            | 7 / 7 dans chaque langue                               |
| Images sociales du portfolio               | Photo carrée en repli            | 23 pages avec une image réelle de 1200 × 630           |
| AOS / FontAwesome                          | Chargés globalement              | Aucun import applicatif ni CSS FontAwesome             |

Le budget de 150 Ko est vérifié pour les scripts modernes effectivement chargés.
Le script `nomodule` est une voie de compatibilité différente ; les navigateurs
qui prennent en charge les modules ignorent cette balise ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#module_fallback)). Sa somme avec les scripts modernes ne décrit donc pas le transfert d’un navigateur moderne. Le vérificateur affiche les deux voies séparément. La marge restante sur le budget moderne est de 0,97 Ko.
Après la maquette du hero, une cible interne d’environ 140 Ko laisserait 10 Ko de marge.

Contrôles reproductibles :

```bash
npm ci
npm run lint
npm test
npm run build
npx tsc --noEmit
npm run blog:test:seo
npm run audit:verify
npm audit
npm run test:e2e
node scripts/observe-portfolio.mjs
```

- Onze tests unitaires couvrent chargeurs, modèles, dates, métadonnées, sitemap, temps de lecture et les deux backports de sécurité des dépendances.
- Neuf tests navigateur couvrent FR/EN, les deux thèmes, les largeurs 280, 390, 1440 et 1920 px, les contrôles clavier, la navigation de langue, le carrousel, les dialogues, la copie, une FAQ longue, la persistance du guide et les anciennes URL de CV.
- Les analyses axe portent sur neuf routes dans chacun des deux thèmes. La copie au clavier utilise un double de l’API Clipboard pour vérifier un seul appel et son annonce.
- L’observation vérifie les 24 URL du sitemap, les dimensions des 23 images sociales du portfolio et les images du JSON-LD des fiches. La page autonome du livre reste hors harmonisation de la charte du portfolio.
- Douze vues complètes et douze vues du haut de page sont capturées : accueil, Iconise et article d’internationalisation, 390/1440 px, clair/sombre, mouvement réduit. Les captures ont été inspectées ; elles ne constituent pas une comparaison pixel à pixel avec l’ancienne charte.
- Une erreur de rendu a été provoquée dans la galerie de développement, puis la reprise par « Réessayer » a été exécutée avec succès.

Dernier Lighthouse mobile consigné sur `/fr` : **95 / 100 / 100 / 100** (performance, accessibilité, bonnes pratiques, SEO), **LCP 2,9 s**, **TBT 20 ms**, **FCP 1,1 s**. Cette mesure précède le patch Next 16.4.2 et la nouvelle maquette du hero ; refaire le test après cette maquette. La cible de 150 Ko est atteinte pour les scripts modernes ; la somme avec la voie `nomodule` est un calcul entre deux chemins de navigateur.

La CI reprend l’audit npm, lint, tests, build, budget, TypeScript, SEO et Playwright. Elle est
préparée dans le dépôt ; son exécution distante n’a pas été déclenchée.

## Décisions et dépendances après reprise

**Livre et historique public — annexe 7.1.** Le propriétaire confirme que le
téléchargement direct du livre depuis le dépôt GitHub public est acceptable. Le
livre est donc traité comme public ; stockage privé, rotation du secret et
réécriture d’historique ne font pas partie des travaux demandés.

**Dépendances de construction.** `npm audit` et `npm audit --omit=dev` donnent
maintenant zéro vulnérabilité. Les neuf entrées initiales correspondaient à deux
avis transitifs. Next/ESLint est mis à jour en 16.4.2 ; `postcss-selector-parser`
est épinglé en 7.1.7. Tailwind reste en 3.4.19 pour conserver le support
Firefox 111+ de Next 16.4.2 ; Tailwind 4 réclame Firefox 128+ et ne supprimerait
pas `braces` du greffon ESLint de Next. La suggestion de rétrograder
`eslint-config-next` vers 14.2.35 aurait désaligné ESLint avec Next 16.
Le paquet `braces@3.0.4` du dépôt est un backport local du correctif de profondeur
du [PR amont #72](https://github.com/micromatch/braces/pull/72), documenté dans
`vendor/braces/SECURITY_PATCH.md` ; ce n’est pas une version publiée sur npm.
Tests de profondeur 100/101, analyse d’AST, expansion normale, lint, build et
audit npm passent. Retirer le backport quand une version officielle corrigée sort.

`npm ci` affiche une dépréciation de `glob@10.5.0` transitif de Tailwind/Sucrase,
mais le registre npm ne le signale pas comme vulnérabilité dans ce lockfile.
L’avertissement reste une note de maintenance, séparée de l’audit de sécurité.

**Budget JavaScript.** Conserver la limite de 150 Ko gzip pour les scripts modernes.
Le fichier `nomodule` est une branche de compatibilité distincte ; ne pas le sommer
au paquet moderne comme si les deux étaient servis au même navigateur.

**Tailwind 4.** La migration n’est pas nécessaire pour fermer les avis traités et
elle relèverait le minimum Firefox de 111 à 128. Les références officielles
confirment les prérequis [Tailwind 4](https://tailwindcss.com/docs/upgrade-guide)
et les [navigateurs ciblés par Next](https://nextjs.org/docs/architecture/supported-browsers).

**Transitions de page.** Il s’agit d’animer le passage entre une carte projet et
sa page, par exemple en faisant évoluer ensemble le titre et l’image. L’API
expérimentale n’a pas été activée ; elle n’est pas nécessaire à la navigation.

Les validations LinkedIn/X, les mesures CrUX et les résultats après déploiement
restent des vérifications externes ; les contrôles locaux ne les remplacent pas.

Références de cadrage : [routage next-intl](https://next-intl.dev/docs/routing/setup), [navigation next-intl](https://next-intl.dev/docs/routing/navigation), [versions de React](https://react.dev/versions). Les choix Next sont aussi vérifiés contre la documentation embarquée de la version installée.

## Clôture de cette passe

La suite autorisée a ajouté le backport local de `braces`, la surcharge corrigée de
`postcss-selector-parser`, les versions Next 16.4.2, les tests associés et le
raccordement des avatars éditoriaux. Les décisions ouvertes sont closes pour cette
passe : livre public accepté, convergence visuelle reportée jusqu’à la maquette du
hero, transitions de page non activées. Restent la cible LCP à reprendre après la
maquette et les vérifications externes après déploiement.
