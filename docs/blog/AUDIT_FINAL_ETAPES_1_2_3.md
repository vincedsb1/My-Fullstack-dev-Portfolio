# Audit final des étapes 1, 2 et 3 du blog

> État historique avant migration. Le SaaS passe en JSON lors de l’étape 4 demandée ensuite ; voir [ETAPE_4_MIGRATION_SAAS.md](ETAPE_4_MIGRATION_SAAS.md) pour l’état livré. Le guide conserve son MDX.


Date : 22 octobre 2026. Branche de livraison : `dev04`.

## 1. Périmètre et versions Git

Base auditée : `dev03`, commit `8ec765f38b3bc0e69b41a7230f2404e8c5a5e902`, vérifié identique à `origin/dev03` après fetch. Le checkout initial était propre ; `dev04` n’existait ni localement ni sur le remote et a été créée depuis cette base.

Version de l’implémentation consolidée et testée : `e3142673d8192aff48bbaa0afb5367c06934eeb3`. Les mises à jour documentaires suivent dans un commit séparé. Le diff est limité à l’infrastructure blog, son Showcase/fixture, ses tests, sa documentation et quelques règles d’impression historiques. Aucun texte MDX, URL ou widget métier historique n’est converti. `main` n’est pas modifiée ; aucune commande de déploiement ou fusion n’est exécutée.

L’audit confronte les documents au code, à l’historique Git, au build et au navigateur. Il ne prend pas l’ancien ZIP ni la preview HTML autonome pour le rendu Next.js réel.

## 2. Verdict

**PRÊT pour commencer l’étape 4 lors d’une demande distincte.** Le moteur permet d’écrire un nouvel article standard avec un fichier JSON et ses éventuels médias, sans ajouter de page Next.js, de CSS ou de branche dans le renderer générique. Le pilote local de publication l’a vérifié jusqu’aux routes statiques, index, SEO, images sociales et sitemap.

**La validation globale du dépôt reste partielle : `audit:verify` est rouge sur le budget JavaScript d’accueil.** Ce dépassement est antérieur au blog, reproduit et analysé en section 7. Le plafond de 150 Kio n’est pas relevé. Ce verdict autorise la préparation de la migration, pas une publication automatique ni une déclaration de CI entièrement verte.

L’étape 4 n’est pas commencée : aucun export/conversion paragraphe par paragraphe du SaaS, aucune bascule de son renderer.

## 3. Constats par étape

### Étape 1 — inventaire et référence

L’inventaire initial était riche, mais se référait à un ancien `main`, à des chemins disparus et au guide encore injecté en HTML. Sur la base auditée, le guide est déjà assemblé en React typé, les fichiers sont sous `features/`, les styles du guide sont importés par celui-ci et le chrome global est fourni par le portfolio.

L’actualisation de l’inventaire documente ces différences et le DOM actuel :

- Guide : 11 sections, 11 H2, 22 H3, deux modèles copiables, tableau, citation, dix conseils, 14 cases, progression, reset et stockage historique.
- SaaS : cinq chapitres/ancres, lettrine, emphases, illustration 6 × 6, deux portraits, cinq modules, auteur, lien suivant vers le guide et projet lié Iconise.
- Les deux routes gardent leurs métadonnées, données structurées, navigation et redirections.

L’artefact [GitHub Actions 39819779089](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/actions/runs/39819779089) a été interrogé, téléchargé et examiné : 12 PNG, environ 9,9 Mo, nom `blog-visual-reference-7e29ee4234dd74450e1714dd94bf3e4cf77cd2dd`. Le code `src/` et `public/` de ce SHA est identique à celui de la base `8ec765f`.

La comparaison confirme la composition SaaS conservée et les changements intentionnels du Showcase. Les images CI/Linux et locales/macOS ne sont pas identiques au pixel : hauteur du SaaS 1440 px, 9 214 contre 9 211 px ; à 390 px, 10 932 contre 10 996 px. Des retours à la ligne du hero diffèrent aussi entre les deux environnements. Ces écarts étaient déjà présents sur le checkout local `dev03` avant correction. Leur cause précise entre environnements de rendu n’a pas été isolée ; aucune équivalence binaire n’est annoncée. Les nouvelles références ajoutent le guide, le shell JSON et les états interactifs.

### Étape 2 — design system et Showcase

La direction SaaS est reconnaissable dans le hero, la grille, les marges, les accents et les illustrations. Les tokens sont isolés sous `.blog-ds`, avec variantes de thème. Le header, le footer, le thème, les boutons de base, la copie et le partage du portfolio sont réutilisés.

Problèmes corrigés :

- Le Showcase perdait les ancres de ses sections JSON ; `#structure` était orphelin. Les sections sont maintenant rendues avec `BlogSection`, et leurs entrées de sommaire viennent des données.
- Les démos de checklist et questionnaire maintenaient une deuxième logique. Elles sont supprimées : même checklist que les articles, vrai questionnaire SaaS, vrais widgets historiques.
- La variante `cards.action` était acceptée sans effet ; elle a une présentation et un lien obligatoire. Les cartes peuvent intégrer des blocs structurés.
- Les listes JSON n’avaient plus leurs marqueurs avec le reset Tailwind ; H4 et code en ligne n’avaient pas de traitement éditorial dédié.
- Le code JSON était brut et perdait son titre/langage lorsque la copie était désactivée. Le plugin déjà installé pour le MDX colore maintenant le code au serveur, avec thèmes GitHub à contraste renforcé et copie du texte exact.
- Deux labels ARIA étaient placés sur des `div` sans rôle. Des textes secondaires échouaient aux contrastes AA sur fond de code/module. Les usages et couleurs sont corrigés et retestés.
- Des libellés français subsistaient dans les commandes EN ; les commandes de lecture et le shell sont vérifiés par pilote EN synthétique.
- Le thème sombre restait prioritaire à l’impression, rendant notamment le titre illisible. Le style papier est commun aux deux thèmes, les accordéons sont ouverts pour l’impression puis restaurés, et les contrôles sont masqués.
- Le chrome global et certaines couleurs des articles historiques étaient mal imprimés. Un scope commun de layout permet de masquer le chrome uniquement sur les pages du blog ; leurs correctifs CSS sont limités à `@media print`.

Le Showcase utilise les composants réutilisables, une fixture validée, de vraies images, une vidéo au clic, les variantes et les cinq modules. L’aperçu HTML de `docs/` reste un document historique non contractuel.

### Étape 3 — moteur JSON

Le schéma discriminé, la validation runtime et le renderer couvrent paragraphes/chapeaux/emphases, titres H3/H4, listes, citations, encadrés, cartes riches, tableaux, figures, vidéos, code, accordéons, checklists et modules contrôlés.

Corrections des contrats :

- Noms de modules, props permises, langue et IDs DOM centralisés dans `json-custom-modules.json` ; les noms TypeScript du registre en dérivent. Les noms hérités d’Object et les props `null` ne passent plus comme un module valide.
- Validation commune des IDs du shell, des sections, de leurs titres `${id}-heading`, des titres explicites et des widgets. Le DOM des vrais widgets est confronté au manifeste.
- Hiérarchie tenant compte des H3 implicites des cartes et modules ; visuel métrique du hero sans H3 prématuré ; focus possible sur les ancres.
- Espaces du texte riche conservés entre les emphases et liens.
- Liens transmis comme destinations structurées ; leur passage en faux Markdown tronquait les URL avec parenthèses. Contrôle des ancres des articles JSON cibles et des vrais projets publiés.
- `seoTitle` et références de projets alignés avec le MDX ; contrôle de publication mutualisé.
- Clés de checklists dans le namespace `vd_`, uniques dans l’article et entre articles publiés. La clé historique du guide est réservée au bon article FR et à ses 14 IDs.
- Checklist utilisable en mémoire quand le stockage est bloqué, avec retour explicite ; données invalides ignorées, sauvegarde des seuls `true`, progression, reset et synchronisation entre onglets.
- Prévisualisation de tout JSON FR par `?slug=...` en développement ; sortie 404 avant lecture des données en production.
- Scan JSON traçable dans un périmètre explicitement borné. Les six avertissements Turbopack d’inclusion de tout le projet ont disparu.

Le catalogue unique MDX/JSON alimente les routes, les index, les traductions publiées, les images sociales et le sitemap. Les brouillons, collisions interformats et routes internes réservées sont contrôlés. La publication reste française ; les données EN du pilote sont temporaires et synthétiques.

## 4. Problèmes par priorité

| Priorité | Problème | Résolution / état |
|---|---|---|
| P0 | Collision possible d’IDs générés ou métier ; ancres cassées | corrigé, validation et DOM navigateur |
| P0 | Checklist inopérante lorsque le stockage refuse l’écriture ; risque d’écrasement par une clé réutilisée | corrigé, tests de restauration/écriture/reset/onglets et compatibilité historique |
| P1 | Showcase non représentatif et logique concurrente de démos | corrigé, mêmes composants et cinq vrais widgets |
| P1 | Variantes sans effet, listes/H4/code incomplets, cartes trop limitées | corrigé, fixture étendue et contrôles du rendu |
| P1 | ARIA, contrastes, focus et impression | corrigé sur les parcours contrôlés ; PDF vérifiés |
| P1 | Divergences validation/types, liens ou projets non vérifiés | corrigé, contrat central et tests supplémentaires |
| P1 | Faux échecs du test SEO avec EN et couverture SVG | corrigé : `x-default` exclu du compte des langues, SVG en `fill` reconnu ; assertions fonctionnelles conservées |
| P1 indépendant | Accueil au-dessus de 150 Kio gzip | non résolu ; antérieur au blog, diagnostic section 7 ; contrôle reste rouge |
| P2 | Documentation décrivant encore les prototypes isolés | réalignée ; documents historiques explicitement identifiés |

## 5. Architecture consolidée

| Couche | Responsabilité |
|---|---|
| `content/blog-json/<locale>/*.json` | rédaction locale et données versionnées |
| `lib/blog/json-types.ts` / `json-source.mjs` / manifeste custom | typage, validation, liens, médias, IDs, stockage, registre fermé |
| `lib/blog/articles.ts` | catalogue unique MDX/JSON, statut, langue, ordre, lecture et relations |
| `features/blog/json/` | shell générique, rendu des blocs, checklist et adaptateurs custom |
| `features/blog/design-system/` | composants visuels serveur et contrôles client ciblés |
| Layout `[locale]` / UI partagée | navigation, footer, thème, boutons, copie, partage |
| Routes blog / sitemap / générateur social | pré-rendu et SEO communs aux deux formats |

L’ajout d’un **nouvel article standard** est une opération de données. Un **nouveau widget métier** reste du code React explicitement enregistré ; ce n’est pas un manque du renderer générique. Les tableaux standards restent textuels et les questionnaires métier passent par le registre, sans moteur de formulaires universel ajouté.

## 6. Tests exécutés

Environnement local : macOS, Node 22.19.0, Next 16.4.2, dépendances du lockfile inchangées. Les commandes utilisent le checkout complet. Les serveurs et builds ont été vérifiés localement, sans dépendre de la production.

| Commande | Résultat final local |
|---|---|
| `npm ci` | OK ; aucune vulnérabilité signalée à l’installation |
| `npm run blog:validate` | OK ; 2 publiés MDX, 1 brouillon JSON après nettoyage |
| `npm run blog:test:json` | OK ; 21 tests |
| `npm run lint` | OK ; 0 erreur, 5 avertissements de tokens préexistants hors de ce lot |
| `npm test` | OK ; 11 tests |
| `npx tsc --noEmit` | OK |
| `npm run build` | OK ; routes statiques et exclusion des brouillons |
| `npm run blog:test:seo` | OK sur le build normal |
| `npm run test:e2e` | OK ; 22 tests navigateur |
| `npm run blog:test:publication` | OK ; build/SEO avec 2 JSON synthétiques, 2 tests navigateur, nettoyage puis reconstruction normale |
| `npm run blog:test:preview` | OK ; 2 tests du shell en développement |
| `npm run audit:verify` | ÉCHEC : accueil au-delà de 150 Kio gzip ; seuil inchangé |

Les cinq avertissements ESLint concernent `BlogResource.tsx`, `Projects3.tsx`, `FeaturedCarousel.tsx`, `ProjectCard.tsx` et `ProjectQuickActionsDialog.tsx`. Ils existaient dans l’état initial.

### Couverture du navigateur

- `/fr/blog/showcase`, les deux articles publiés et le preview JSON, aux largeurs 320, 390, 820, 1440 dans les deux thèmes.
- Un H1, un `main`, aucun ID dupliqué, pas d’ancre `#` orpheline ni débordement de page.
- Axe WCAG A/AA aux largeurs mobile et bureau, plus variantes ouvertes ; pas d’erreur de page sur les parcours testés.
- Sélecteurs indépendants, matrice au clavier, huit décisions et reset, funnel/mosaïque, accordéons, copie exacte et iframe YouTube créée au clic.
- Stockage corrompu/refusé, synchronisation entre onglets, sauvegarde, reset, 14 libellés/IDs historiques et aller-retour ancien guide/nouveau composant.
- Impression claire/sombre du Showcase et des deux articles : papier lisible, chrome masqué, accordéons restaurés et PDF produits.
- Pilote JSON FR/EN : metadata, hreflang réciproque, projets/articles associés, labels d’interface, lecture sans JavaScript, index, images et sitemap.

La CI archive **40 PNG et 6 PDF** : 24 références des trois pages, 8 états, 8 previews et 6 impressions. Les fichiers sont ignorés par Git. Les sources temporaires des tests de publication sont retirées et le build normal est reconstruit avant la mesure finale.

## 7. Budget JavaScript d’accueil : diagnostic

### Reproduction historique

Un worktree temporaire a été compilé au commit `f5f6c28`, parent de l’intégration initiale des étapes du blog (`76e2e81`). Il utilise le même lockfile que `dev03`, les mêmes versions Node/Next et le même compilateur Turbopack.

| Version | JavaScript moderne initial, gzip |
|---|---:|
| Avant étapes blog, `f5f6c28` | 221,45 Kio |
| Base `dev03`, `8ec765f` | 221,42 Kio |
| Consolidation `dev04` | 221,45 Kio, FR et EN |
| Plafond conservé | 150 Kio |

Le dépassement est donc **antérieur aux étapes 1 à 3**, avec des variations de quelques centièmes de Kio entre les builds. Le MDX/JSON est lu au serveur et les données du catalogue ne sont pas embarquées dans les chunks clients.

### Mesure et cause

Le script additionne le gzip des fichiers JavaScript référencés par les balises `script src` de l’accueil pré-rendu, avec déduplication et exclusion du `nomodule` legacy. Il mesure le budget convenu en gzip, pas le transfert Brotli d’un CDN ni un score Lighthouse. Les gros fichiers ne sont pas comptés deux fois.

Une analyse Webpack indépendante du commit antérieur donne aussi environ **221,48 Kio**. Elle identifie environ **128 Kio** pour les principaux chunks Next/React, **41 Kio** pour les deux chunks d’animation/gestes du carrousel, ainsi que l’internationalisation, Next Image et les composants/illustrations de projets. Le carrousel `FeaturedCarousel` importe `AnimatePresence` et `motion` de `framer-motion` ; les cartes clientes embarquent aussi leurs visuels et leur dialogue. Ces chemins existaient avant le moteur JSON.

Le script d’audit avait en outre un problème de portabilité : les chemins encodés de Webpack (`%5Blocale%5D`) n’étaient pas décodés. Il les décode désormais, inspecte récursivement les chunks et imprime les mesures détaillées **pour les deux langues avant de sortir en échec**. Cette amélioration de diagnostic ne change ni le plafond ni la métrique.

### Décision

Atteindre 150 Kio exige un travail sur les frontières serveur/client des projets et les animations/gestes de l’accueil, avec sa propre recette. La seule suppression des chunks d’animation ne suffirait pas au budget ; elle risquerait aussi de perdre les animations ou le drag existants. Ce chantier n’est pas traité en remplaçant le carrousel au cours de l’audit du blog.

Impact : le contrôle global et la CI restent rouges sur ce budget, avec davantage de JavaScript initial à charger/analyser que l’objectif. Aucun lien causal avec le nouveau renderer JSON n’est mesuré. Aucune amélioration de performances en production n’est revendiquée.

## 8. Limites de preuve et suites

- Rendu et interactions vérifiés dans Chromium local et par les tests CI prévus ; pas de campagne manuelle VoiceOver, Safari/iOS ou périphériques physiques dans cette mission.
- La vidéo est testée pour sa façade, son lien et l’activation de l’iframe. Les appels YouTube sont interceptés pour rendre les tests déterministes ; lecture distante, autoplay et événement de fin ne sont pas validés.
- Les vérifications de liens externes sont syntaxiques et protocolaires ; elles ne garantissent pas leur disponibilité future.
- Les captures entre OS ont de petites variations de métriques. Elles servent à comparer composition et états, pas à certifier une égalité de pixels entre environnements.
- Le serveur de développement émet encore des avertissements Next/React lors de la capture de la miniature vidéo et des navigations 404 ; aucun `pageerror` n’est détecté. Ces diagnostics ne sont pas présentés comme des erreurs de production.
- Le résultat de l’ancienne CI a été vérifié via ses artefacts. Les résultats de la branche livrée décrits ici sont ceux de la recette locale ; le run GitHub associé au push reste consultable séparément.
- Aucun contenu de SaaS ou du guide n’a été réécrit. L’inventaire de parité détaillé du prochain JSON et sa comparaison avec le MDX appartiennent à la demande de migration.

## 9. Acceptation de l’étape 4

1. Conserver un export de référence du MDX SaaS à la révision auditée, avec métadonnées, paragraphes, titres, liens, ancres, emphases, visuels et modules.
2. Préparer un JSON `draft` sous un slug temporaire sans collision ni traduction inventée ; le prévisualiser par slug.
3. Comparer ancien/nouveau aux quatre largeurs, dans les deux thèmes et à l’impression ; vérifier contenu, hiérarchie, liens, focus et états.
4. Réutiliser les cinq modules sans recopier leur logique et préserver les huit décisions et 36 cellules.
5. Passer les validations du moteur, du SEO et du navigateur ; rapporter séparément le budget d’accueil tant qu’il reste rouge.
6. Basculer au slug historique dans une seule modification atomique, après la demande distincte de migration. Contrôler canonical, dates, titre SEO, image sociale, JSON-LD, index et sitemap.
7. Garder les sources historiques nécessaires et un retour possible au MDX. Ne pas anticiper le nettoyage de l’étape 6.

La prochaine intervention peut donc porter sur la migration SaaS. Le présent lot s’arrête à la consolidation des étapes 1 à 3.
