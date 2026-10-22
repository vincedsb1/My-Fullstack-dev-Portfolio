# Préparation de l’étape 4 — décisions et contrôle d’entrée

**Décision produit (22 octobre 2026) :** les cinq choix ont été validés par le propriétaire du portfolio. Référence technique : `dev03` (partant de `9aede17`).

## Décisions actées

| Domaine | Contrat |
|---|---|
| Direction graphique | **Article SaaS** comme référence, sans copier ses en-têtes/footer redondants ; design system commun et responsive |
| Interactions | **Conserver toutes** : mosaïque, deux sélecteurs de langue, matrice 6 × 6, funnel, arbre de décision, checklist 14 points, progression, copie, impression, partage et ancres |
| Personnalisation | Articles en **JSON local**, blocs standards + registre statique de composants React ; aucune injection HTML, import arbitraire ni script déclaré depuis les données |
| Langues | Schéma et shell **FR + EN** ; publication **FR uniquement** pour l’instant ; les cinq widgets SaaS sont explicitement **FR-only** tant que leurs textes anglais ne sont pas écrits |
| Migration | **Article SaaS d’abord**, puis **guide premier emploi** ; aucune bascule automatique des URL existantes |

## Réalisations de la préparation

1. **Registry JSON :** cinq IDs publics, uniques par article : `saas-mosaic`, `saas-language-demo`, `saas-language-matrix`, `saas-acquisition-funnel`, `saas-decision-tree`. Correspondance stricte avec `InternationalisationArticleModules.tsx` ; aucun widget recodé.
2. **Styles :** les widgets réutilisent la feuille `InternationalisationArticle.module.css` sous le scope `.blog-ds__saas-module-host`, sans refaire une page entière. Il reste à vérifier visuellement la coexistence avec les tokens.
3. **Fixture :** `src/content/blog-json/fr/json-demo-blog.json` est **draft** ; elle rend les cinq modules dans le Showcase (via `JsonBlockRenderer`) et dans la prévisualisation locale de développement.
4. **Interopérabilité :** `JsonChecklist` reprend la convention historique `{ "chk-1": true }` : seuls les items cochés sont sauvegardés. Un snapshot de la clé, des 14 IDs et libellés est dans [contracts/guide-checklist-v1.json](contracts/guide-checklist-v1.json).
5. **Schéma :** bloc `video` YouTube avec ID contrôlé et activation explicite par l’utilisateur ; champs meta `seoTitle` / `relatedProjects`, chargés par le catalogue existant.
6. **Qualité :** nouveaux tests Node de schéma + snapshots, tests Playwright du Showcase et ancien routage ; étape `blog:test:json` ajoutée au workflow qualité.

## Critères de validation — obligatoires avant étape 4

- [ ] **CI / Build :** `npm ci`, `npm run blog:validate`, `npm run blog:test:json`, `npm run lint`, `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run blog:test:seo`, `npm run test:e2e` sont tous au vert dans le dépôt complet.
- [ ] **Visuel :** captures de la page React réellement servie aux largeurs 320, 390, 820, 1440 px, clair/sombre, boutons focus, widgets ouverts/fermé et impression. Une simple preview HTML n'est pas suffisante.
- [ ] **Intégrité :** vérifier statiquement et via navigateur qu’il n’y a qu’un `main`, un H1 et aucun ID HTML dupliqué. Confirmer les 14 IDs, la clé `vd_guide_checklist_v1`, et une progression déjà sauvegardée avant migration.
- [ ] **Accessibilité :** navigation clavier des deux sélecteurs, matrice, radios de décision, contrôles de partage, accordéons et bouton impression ; contrastes AA et `prefers-reduced-motion`.
- [ ] **SEO :** deux URL publiées inchangées, même canonical, même titre, metadata / JSON-LD / sitemap, aucune fixture draft exposée en production.
- [ ] **Contenu :** inventaire de conservation paragraphe par paragraphe, titres, liens, extraits, 5 interactions et visuels avant bascule du SaaS.

**État :** préparation technique livrée. Ne pas annoncer la phase 4 comme prête à la publication tant que la CI et les captures du rendu réel n’ont pas été vérifiées.

## Ordre opérationnel de l’étape 4

1. Exporter le MDX SaaS et sa structure : métadonnées, 5 sections H2, paragraphes, citations/encadrés, liens et 5 widgets.
2. Construire une première version JSON **draft** sous un slug provisoire différent : ne pas provoquer de collision MDX/JSON.
3. Comparer visuellement l’ancien rendu et le JSON côte à côte (desktop/mobile + thèmes). Corriger les styles du shell / modules.
4. Confirmer la parité du contenu, le questionnaire et les 36 cases de matrice, les tests de route, les données structurées.
5. Basculer **atomiquement** l’ancien MDX vers le JSON à slug identique dans un seul commit ; tester et n’exposer qu’après validation.
6. Répéter pour le guide lors de l’étape suivante, en préservant strictement `vd_guide_checklist_v1` et les 14 IDs.

## Dette technique non bloquante pour l’article SaaS

- Coloration de code JSON supérieure à la présentation HTML actuelle.
- Internationalisation intégrale des textes métiers interactifs EN (interdits sur une page EN tant qu’elle n’existe pas).
- Un registre supplémentaire pour les futurs widgets réellement nouveaux, au cas par cas.

## Retour arrière

La préparation ne modifie aucun des deux articles publiés. La future migration sera réversible par retour à la version MDX/React de référence ; ne jamais renommer la clé de stockage de la checklist.

## Contrôles observés (première CI de la préparation)

- `npm ci`, `npm audit --audit-level=moderate`, `npm run blog:test:json` (14 tests), `npm run lint`, `npm test` et `npm run build` : **réussis**.
- `npm run audit:verify` : **échec indépendant du moteur JSON** : budget JavaScript de la page d'accueil mesuré à 221,42 Kio gzip pour un plafond de 150 Kio. La source de cette hausse n'a pas été isolée ; **ne pas relever ce plafond sans analyse**.
- Afin de ne pas cacher d'autres erreurs derrière cet audit global, le workflow exécute TypeScript, SEO et E2E avant l'audit de performance final. La préparation visuelle continue de nécessiter les captures de référence.

## Références visuelles automatisées

Le test Playwright `tests/browser/blog-json.spec.ts` génère à chaque CI douze captures réelles, sans animations : Showcase aux largeurs 320/390/820/1440 et article SaaS historique à 390/1440, chacun en clair/sombre. Les fichiers sont archivés pendant 30 jours dans l'artefact GitHub Actions `blog-visual-reference-<SHA>`. Ce sont des **références de comparaison** à examiner, pas un verdict de conformité pixel-perfect. Le guide sera capturé à son tour avant sa propre migration.

## Validation de la dernière préparation (commit `7e29ee42`)

Le [run GitHub Actions #39819779089](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/actions/runs/39819779089) confirme :

- **OK** : `npm ci`, audit de dépendances, **14 tests JSON**, ESLint, tests unitaires, compilation Next.js, TypeScript, tests SEO et tests navigateur Playwright.
- **OK** : génération et archivage de **12 captures PNG** de référence (Showcase : 4 largeurs × 2 thèmes ; SaaS historique : 2 largeurs × 2 thèmes). Artefact : `blog-visual-reference-7e29ee4234dd74450e1714dd94bf3e4cf77cd2dd` (~9,9 Mo), téléchargeable dans le run.
- **Échec connu restant** : `npm run audit:verify` sur le budget JavaScript global de **la page d’accueil**, 221,42 Kio gzip mesurés contre 150 Kio autorisés. Ne pas confondre ce contrôle global avec la validation des composants blog. Le seuil n’a pas été modifié.
- **À valider visuellement par revue humaine** : les douze captures, les variations d’interactions focus/hover et le rendu print. Les captures sont la référence technique, pas une acceptation pixel-perfect automatique.

**Conclusion :** préparation fonctionnelle du moteur et de la migration SaaS prête pour la phase d'inventaire et de conversion **en brouillon**. **Publication de la conversion bloquée** tant que la comparaison éditoriale/visuelle et la qualité globale du pipeline n’ont pas été clarifiées. Les deux articles publiés restent inchangés.
