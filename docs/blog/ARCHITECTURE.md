# Architecture du blog

## Sources et rendu

Les articles vivent dans `src/content/blog/<locale>/<slug>.mdx`. Le frontmatter MDX est la source unique des titres, descriptions, extraits, catégories, dates, slugs, langues et statuts.

`src/lib/blog/article-source.mjs` lit les fichiers locaux avec `yaml`, valide leurs métadonnées, repère les collisions de routes et vérifie les relations de traduction. Il s’assure aussi que le titre du frontmatter reste l’unique H1 et que les images locales référencées existent sous `public/blog/`. `src/lib/blog/articles.ts` expose les articles publiés, leur ordre, leurs versions traduites, leur temps de lecture et leur URL d’image sociale.

Les pages utilisent les Server Components de l’App Router. `generateStaticParams()` énumère les paires locale/slug publiées et `dynamicParams = false` ferme les routes inconnues. Le chargeur officiel `@next/mdx` compile les imports locaux pendant le build ; Vercel sert ensuite le HTML généré sans lire ni compiler le fichier à chaque visite. Le contenu MDX est du code du dépôt, de confiance. Ne jamais y injecter de contenu utilisateur ou distant.

`@next/mdx` compile les fichiers MDX locaux pendant le build. `remark-frontmatter` repère le YAML et `remark-mdx-frontmatter` le convertit en export MDX (les métadonnées affichées sont lues séparément par le validateur). `remark-gfm` prend en charge les tableaux, listes de tâches et autres extensions GitHub. `rehype-pretty-code` colore le code pendant la génération. Les blocs `<Callout>`, `<Figure>`, `<Diagram>` et `<YouTubeEmbed>` sont exposés dans `src/app/components/blog/MdxComponents.tsx`.

## Articles React spécialisés

Un article peut déclarer `renderer: guide` dans son frontmatter pour réutiliser un rendu React interactif enregistré. Le guide du premier emploi reste dans `src/app/guide-premier-emploi-developpeur/` afin de conserver sa checklist, ses ancres, sa progression, sa persistance locale, la copie, le partage, l’impression, le thème et ses icônes. Son contenu et ses interactions partagent les routes, métadonnées, images sociales et le sitemap du blog.

Ce renderer est réservé à cet article. Les articles ordinaires restent des fichiers MDX sans registre manuel à mettre à jour.

## Routes et langues

- `/fr/blog` liste les articles français publiés.
- `/fr/blog/<slug>` rend un article publié.
- `/en/blog` et les routes anglaises sans article répondent 404. Une route anglaise publiée doit partager un `translationKey` avec un article français publié.
- Les traductions peuvent avoir des slugs différents et sont associées par `translationKey` ; seuls les articles traduits entre les langues produisent des liens hreflang.

`generateMetadata()` lit la même source que les pages. Les liens canonical et hreflang ne mentionnent que les versions réellement publiées. Les pages d’article publient un JSON-LD `BlogPosting` avec les dates et l’auteur réels.

`next.config.mjs` redirige l’ancienne URL du guide vers la nouvelle avec HTTP 308. Les anciennes routes d’images sociales sont redirigées vers l’image actuelle. Les barres obliques finales sont redirigées vers l’URL sans barre en un seul saut. Le sitemap Next.js ajoute l’index et chaque article publié ; il exclut les brouillons et l’ancienne URL.

## Médias

Range les médias d’un article sous `public/blog/<slug>/`. Déclare une image de couverture dans le frontmatter avec `cover` et `coverAlt`. Sans couverture, l’image de partage produite pour l’article sert aussi de visuel de carte.

Les images MDX peuvent être écrites avec la syntaxe Markdown standard ; des dimensions par défaut évitent un décalage de mise en page. Utilise `<Figure>` quand une légende ou des dimensions précises sont nécessaires. `<Diagram>` affiche un SVG/PNG local pré-rendu. Les sources Mermaid restent versionnées à côté des SVG ; aucun moteur de rendu ou navigateur n’est chargé chez le lecteur.

`<YouTubeEmbed id="…" title="…" />` affiche une miniature, un lien de repli et un bouton de lecture. L’iframe `youtube-nocookie.com` n’est créée qu’après une action explicite. La miniature externe `i.ytimg.com` est chargée paresseusement ; héberge une miniature locale si un article doit éviter cette requête tierce avant lecture.

## Partage social

`src/app/[locale]/blog/[slug]/social-image/route.tsx` génère un PNG de 1200 × 630 au build depuis le titre, la catégorie et l’identité du portfolio. Le guide réutilise l’image sociale existante. La même URL est déclarée pour Open Graph et Twitter, avec des textes alternatifs issus de l’article.

## Validation et publication

`npm run blog:validate` contrôle les métadonnées, slugs, dates, médias et traductions. `npm run dev` et `npm run build` exécutent cette validation avant de démarrer Next.js ou de compiler le site. Le build génère les routes, le sitemap et les images sociales. Le push Git déclenche le déploiement Vercel habituel.

## Fichiers principaux

- `src/app/[locale]/blog/page.tsx` : index et métadonnées du blog.
- `src/app/[locale]/blog/[slug]/page.tsx` : articles, SEO et pré-rendu statique.
- `src/app/[locale]/blog/[slug]/social-image/route.tsx` : images sociales statiques.
- `src/app/components/blog/` : cartes, navigation, layout partagé et composants MDX.
- `src/content/blog/` : frontmatter et contenu éditorial.
- `public/blog/` : images et schémas locaux.
- `src/app/sitemap.ts` : index et articles publiés.
- `scripts/validate-blog.mjs` : validation préalable au build.
