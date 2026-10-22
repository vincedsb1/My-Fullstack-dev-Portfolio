# Instructions pour les agents

Pour créer ou modifier une fiche projet, lire d’abord
[`docs/projects/CREER_UNE_ETUDE_DE_CAS.md`](docs/projects/CREER_UNE_ETUDE_DE_CAS.md).
Utiliser les JSON localisés et le template commun, dont la page Iconise est la
référence visuelle. Ne pas dupliquer sa mise en page ; valider les contenus avec
`npm run projects:validate` et le pré-rendu avec `npm run build`.

Pour toute création ou modification d’article, lis d’abord [`docs/blog/ARCHITECTURE.md`](docs/blog/ARCHITECTURE.md), [`docs/blog/CREER_UN_ARTICLE.md`](docs/blog/CREER_UN_ARTICLE.md) et [`docs/blog/PROMPT_NOUVEL_ARTICLE.md`](docs/blog/PROMPT_NOUVEL_ARTICLE.md).

Le guide historique reste en MDX sous `src/content/blog/fr/guide-premier-emploi-developpeur.mdx` ; le SaaS est migré en JSON sous `src/content/blog-json/fr/internationaliser-saas-lancement.json`. Le moteur JSON v1 est disponible sous `src/content/blog-json/<locale>/<slug>.json` et documenté dans `docs/blog/JSON_ENGINE.md` : les nouveaux articles standards utilisent ce format par défaut ; pour tout nouvel article JSON, valider avec `npm run blog:validate`, `npm run blog:test:json`, puis `npm run build` et `npm run blog:test:seo`. Ne pas migrer automatiquement le guide avant la demande distincte de l’étape 5 ; ne pas inventer de traductions, sources ou expériences.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
