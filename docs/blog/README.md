# Blog — Documents de référence

**Branche :** `dev03` (issue de `dev02`, commit `76e2e81d`). **Périmètre :** préparation du moteur JSON et de la bibliothèque éditoriale pour l’étape 4 ; les deux articles MDX en production restent inchangés.

## Références et ordre de lecture

1. [ARCHITECTURE.md](ARCHITECTURE.md) — architecture réellement intégrée au dépôt.
2. [01_inventaire_reference_visuelle_blog.md](01_inventaire_reference_visuelle_blog.md) — inventaire historique des deux articles, capturé sur une ancienne version du code. Les chemins des composants peuvent donc différer sur `dev02/dev03`.
3. [03_audit_critique_showcase_blog.md](03_audit_critique_showcase_blog.md) — risques identifiés lors de la revue du prototype.
4. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — règles visuelles et catalogue de composants.
5. [JSON_ENGINE.md](JSON_ENGINE.md) et [ARTICLE_TEMPLATE.json](ARTICLE_TEMPLATE.json) — contrat de données JSON v1 et gabarit.
6. [CREER_UN_ARTICLE.md](CREER_UN_ARTICLE.md) et [PROMPT_NOUVEL_ARTICLE.md](PROMPT_NOUVEL_ARTICLE.md) — procédures MDX conservées pendant la transition.
7. [PREPARATION_ETAPE_4.md](PREPARATION_ETAPE_4.md) — revue, décisions et portes de sortie avant migration.

## Architecture de travail

- **Production MDX :** `src/content/blog/` + `src/features/blog/` + routes `src/app/(localized)/[locale]/blog/`.
- **Données JSON :** `src/content/blog-json/`, chargées/validées dans `src/lib/blog/json-source.mjs`.
- **Composants JSON :** `src/features/blog/json/` ; design system dans `src/features/blog/design-system/`.
- **Showcase :** `/fr/blog/showcase` (`noindex`). **Prévisualisation JSON :** `/fr/blog/json-preview` (développement uniquement).
- **Aperçu HTML figé :** [previews/showcase-preview.html](previews/showcase-preview.html) — n’est pas la vérité technique du rendu Next.js.

## Ce qui n’a volontairement pas été fait

Aucun article publié n’a été converti. L’archive ZIP et les dossiers `docs/blog/blog_design_system_showcase_etape2/` et `docs/blog/blog_etape3_moteur_json/` ont été retirés de l’arbre courant pour éviter de compiler et maintenir des doublons de `src/` à l’intérieur de `docs/`. Leur historique reste accessible par Git. Le patcher SEO généré pour la version `main` n’est **pas** exécuté : il aurait écrasé une architecture SEO plus récente.

**Important :** le layout parent `src/app/(localized)/[locale]/layout.tsx` fournit déjà le header et le footer globaux. Le Showcase et le renderer JSON n’en dessinent pas de deuxième exemplaire.

## Décisions et validation avant migration

Les cinq décisions retenues et les critères d'entrée de l'étape 4 se trouvent dans [PREPARATION_ETAPE_4.md](PREPARATION_ETAPE_4.md). Le contrat de progression du guide est figé dans [contracts/guide-checklist-v1.json](contracts/guide-checklist-v1.json). Ne pas confondre Showcase (prototype de référence) et validation du rendu visuel réel.
