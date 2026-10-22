# Instructions pour les agents

Pour créer ou modifier une fiche projet, lire d’abord
[`docs/projects/CREER_UNE_ETUDE_DE_CAS.md`](docs/projects/CREER_UNE_ETUDE_DE_CAS.md).
Utiliser les JSON localisés et le template commun, dont la page Iconise est la
référence visuelle. Ne pas dupliquer sa mise en page ; valider les contenus avec
`npm run projects:validate` et le pré-rendu avec `npm run build`.

Pour toute création ou modification d’article, lis d’abord [`docs/blog/ARCHITECTURE.md`](docs/blog/ARCHITECTURE.md), [`docs/blog/CREER_UN_ARTICLE.md`](docs/blog/CREER_UN_ARTICLE.md) et [`docs/blog/PROMPT_NOUVEL_ARTICLE.md`](docs/blog/PROMPT_NOUVEL_ARTICLE.md).

Les deux sujets du blog sont publiés en français et en anglais sous `src/content/blog-json/{fr,en}/`. Chaque paire partage un `translationKey` ; le moteur JSON et les widgets SaaS sont communs et localisés. Les composants historiques et la fixture MDX technique restent conservés jusqu’au nettoyage distinct de l’étape 6. Le moteur JSON v1 est disponible sous `src/content/blog-json/<locale>/<slug>.json` et documenté dans `docs/blog/JSON_ENGINE.md` : les nouveaux articles standards utilisent ce format par défaut ; pour tout nouvel article JSON, valider avec `npm run blog:validate`, `npm run blog:test:json`, puis `npm run build` et `npm run blog:test:seo`. Ne pas démarrer automatiquement le nettoyage de l’étape 6 ; traduire fidèlement les contenus lorsqu’une version localisée est demandée, sans inventer de sources ou d’expériences. Voir `docs/blog/MISE_EN_PLACE_FR_EN.md` pour les contrats de langue et de sauvegarde.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
