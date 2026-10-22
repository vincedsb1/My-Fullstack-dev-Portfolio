# Préparation de l’étape 4 — revue dev02 → dev03

Date : 22 octobre 2026. Base source `dev02` : `76e2e81d5ed1cc0fc2f283c2e77d47e7b30bd638`.

## Verdict

Les étapes 1, 2 et 3 ne pouvaient **pas** être installées telles quelles : le dépôt a été refactorisé depuis leur création. Les chemins `src/app/components/blog`, les anciens providers et le routage SEO des archives ne correspondent plus à `dev02` (`src/features/blog`, composants partagés et `buildPageMetadata`). Une copie sans adaptation aurait régressé le SEO et le guide.

## Réorganisation effectuée

- Sources de l’étape 3 déplacées hors de `docs/blog/` vers `src/features/blog/{design-system,json}`, `src/lib/blog`, `src/content/blog-json`, et routes de démonstration.
- Les scripts `validate-blog` et `test-blog-seo` ont été modifiés directement ; suppression du patcher de chaîne historique.
- Le routeur d’article conserve `ArticleLayouts`, `JsonLd`, `RelatedProjects` pour les MDX et utilise `JsonArticlePage` uniquement pour un article JSON.
- Les docs ont été aplaties et indexées ; la preview HTML est conservée explicitement comme maquette statique historique.
- Le thème et le partage des pages JSON réutilisent les composants globaux de `dev02`.

## Invariants techniques

1. Les deux articles MDX existants restent rendus par leurs composants et styles spécialisés ; mêmes slugs/URL.
2. Les routes JSON publiées sont ajoutées au catalogue commun ; le brouillon d’exemple ne figure ni dans le sitemap ni dans les listes publiques.
3. Les collisions MDX/JSON et les liens vers des brouillons sont bloqués au prébuild.
4. `showcase` et `json-preview` sont des slugs réservés ; le Showcase est `noindex`, et le preview JSON retourne une 404 en production.
5. Les modules custom ne sont ni des imports dynamiques ni du HTML arbitraire : seul `metric-panel` est enregistré pour l’instant.

## Zones d’ombre explicitement conservées avant migration

- **P0** : vérifier `npm ci`, `npm run blog:validate`, `npm run blog:test:json`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run blog:test:seo`, `npm run test:e2e` sur un checkout complet de `dev03`. Les tests du moteur Node ont réussi dans le livrable isolé, mais cette revue n’est pas une compilation intégrée.
- **P0 design** : créer des captures de référence du Showcase React à 320/390/820/1440 px, clair/sombre et état focus (la maquette HTML ne suffit pas).
- **P0 contenu étape 4** : cartographier les modules interactifs existants (mosaïque, matrice, démo 6 langues, funnel, arbre décisionnel, guide 14 étapes) et leurs props ; aujourd’hui le seul custom JSON est `metric-panel`. Préserver la clé `vd_guide_checklist_v1` et ses IDs de cases lors de la migration.
- **P1** : la coloration de code JSON est moindre que la coloration MDX ; ajouter un bloc vidéo et le format du questionnaire avant toute migration qui en a besoin.
- **P1** : compléter les traductions FR/EN des contrôles éditoriaux, des métadonnées optionnelles (`seoTitle`, `relatedProjects`) et des relations vers les fiches projets.
- **P1** : tests de rendu HTML/a11y pour tous les blocs et navigateur, notamment état localStorage, ancres et print.

## Règle de démarrage étape 4

Ne pas migrer l’article SaaS ni le guide avant passage des vérifications P0. Une migration doit être réversible et ne pas changer les canonicals, le H1, les dates, le contenu ni les interactions sans décision explicite.

### Point de compatibilité layout corrigé

Le layout racine `src/app/(localized)/[locale]/layout.tsx` fournit un `SiteHeader` et un `SiteFooter` identiques sur le portfolio et le blog. Les doublons spécifiques introduits dans le prototype ont été supprimés ; seuls la progression de lecture et les contrôles d’impression/partage sont ajoutés au contenu JSON/Showcase.
