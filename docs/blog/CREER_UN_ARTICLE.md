# Créer un article

## Procédure standard : JSON local

1. Lire `AGENTS.md`, [ARCHITECTURE.md](ARCHITECTURE.md) et [JSON_ENGINE.md](JSON_ENGINE.md).
2. Vérifier les articles MDX et JSON existants pour éviter une collision de slug ou un doublon éditorial.
3. Copier [ARTICLE_TEMPLATE.json](ARTICLE_TEMPLATE.json) dans `src/content/blog-json/fr/<slug>.json`. Rédiger les métadonnées et les sections ; le titre fournit l’unique H1, chaque section son H2 et son entrée de sommaire.
4. Utiliser les blocs standards et les modules déjà enregistrés. Un article ordinaire ne nécessite aucune page Next.js, aucun import d’article et aucun CSS dédié. Un module React réellement nouveau nécessite une extension explicite du registre, pas du HTML/JS dans le JSON.
5. Ajouter les médias utiles dans `public/blog/<slug>/`, avec alt, légende et dimensions adaptées. Ne pas inventer d’expérience, chiffre, source ou traduction. La publication reste française pour le moment.
6. Choisir `published` pour une publication demandée, `draft` pour une préparation explicite. Prévisualiser le JSON avec `npm run dev`, puis `/fr/blog/json-preview?slug=<slug>` ; ce preview n’existe pas en production.
7. Vérifier les thèmes clair/sombre, le mobile, les ancres et le clavier. Conserver les IDs et les clés de checklist après publication. Un `storageKey` doit commencer par `vd_` et être propre à sa checklist.
8. Exécuter les commandes suivantes, puis vérifier la route et l’entrée de sitemap. Les articles suivants viennent de `related.slugs`, les projets de `meta.relatedProjects`.

```bash
npm run blog:validate
npm run blog:test:json
npm run lint
npx tsc --noEmit
npm run build
npm run blog:test:seo
```

La fixture `json-demo-blog.json` est une démonstration technique ; ne pas la transformer en article publié. Le SaaS est désormais un exemple publié en JSON ; le guide reste en MDX jusqu’à l’étape 5 demandée séparément. Ne jamais créer les deux formats pour la même paire locale/slug.

Pour tester le moteur lui-même : `npm run test:e2e`, `npm run blog:test:publication` et `npm run blog:test:preview`, successivement. Le pilote de publication emploie des données synthétiques temporaires et remet le build normal en place.

## Référence historique MDX

1. Lis `AGENTS.md` ou `CLAUDE.md`, puis `docs/blog/ARCHITECTURE.md`.
2. Parcours `src/content/blog/` pour éviter un doublon et vérifier la convention de slug.
3. Crée `src/content/blog/<locale>/<slug>.mdx` avec le frontmatter obligatoire ci-dessous.
4. Ajoute les images utiles dans `public/blog/<slug>/` et utilise leurs chemins locaux.
5. Rédige le contenu dans le ton des notes fournies. Ne fabrique pas d’expérience, de chiffres, de sources ou de date.
6. Vérifie les liens, textes alternatifs, ancres, tableaux et blocs de code.
7. Lance `npm run blog:validate`, puis `npm run build`.
8. Après le build, lance `npm run blog:test:seo` pour vérifier localement le HTML pré-rendu, les métadonnées, le JSON-LD, les images sociales, le sitemap et l’exclusion des brouillons.
9. Vérifie l’article à `/fr/blog/<slug>` ou `/en/blog/<slug>` selon sa langue, le rendu mobile, le mode sombre, les liens et les images.
10. Résume les fichiers modifiés et donne l’URL finale. Un article est publié par défaut quand son statut vaut `published`.

## Fichier et slug

Le nom du fichier, le champ `slug` et le dernier segment de l’URL doivent être identiques. Le slug utilise uniquement des minuscules ASCII, des chiffres et des tirets : `architecture-nextjs-maintenable`. Il reste stable après publication.

## Métadonnées obligatoires

```yaml
---
title: "Un titre précis"
description: "Une description SEO unique et fidèle au contenu."
excerpt: "Un résumé court pour la carte du blog."
slug: architecture-nextjs-maintenable
locale: fr
category: Architecture
publishedAt: 2026-10-11
status: published
---
```

`updatedAt` est facultatif et ne change qu’après une révision éditoriale réelle. `publishedAt` est la date prévue pour la première publication, au format `AAAA-MM-JJ`. Ne reprends pas automatiquement la date de modification Git comme date de publication. Le système ne programme pas les publications.

Le `title` du frontmatter fournit l’unique H1 de la page. Commence le corps MDX au niveau H2. Pour les images de l’article, utilise des chemins locaux existants sous `/blog/<slug>/` ; `npm run blog:validate` vérifie leurs fichiers.

`status` vaut `published` pour publier lors du prochain déploiement ou `draft` pour exclure l’article des routes, de l’index et du sitemap. Tout article anglais publié doit porter un `translationKey` partagé avec sa version française publiée. Le champ `author` n’est pas recopié : l’auteur par défaut est Vincent DESBROSSES.

Les articles publiés doivent avoir des titres et descriptions distincts. Les traductions utilisent le même `translationKey`, même si leurs slugs diffèrent. Ajoute uniquement la traduction réellement rédigée. L’absence de traduction n’affiche pas une copie sous l’autre langue.

## Checklist SEO avant publication

- Vérifie que le `title` décrit précisément l’article et que la `description` est unique, fidèle et utile dans les résultats de recherche.
- Garde le titre du frontmatter comme H1 unique. Structure le contenu avec des H2 puis des H3, sans saut de niveau artificiel.
- Donne un texte alternatif aux images informatives ; vérifie que leurs fichiers et les autres ressources locales existent.
- Vérifie chaque lien interne : il doit pointer vers une page existante ou un article publié. Ne crée pas de lien vers un brouillon.
- Pour une traduction, publie uniquement les deux versions rédigées avec le même `translationKey`. Les canonical et hreflang sont générés depuis ces versions publiées.
- Confirme le pré-rendu, le canonical, les données structurées, les images sociales et la présence dans le sitemap avec `npm run blog:test:seo`.

Lors d’une véritable révision éditoriale, réévalue les références temporelles du titre et du contenu, par exemple « en 2026 ». Ne modifie `updatedAt` qu’après une mise à jour éditoriale réelle.

## Médias et MDX

Range les fichiers locaux sous `public/blog/<slug>/`. Une couverture est facultative :

```yaml
cover: /blog/architecture-nextjs-maintenable/cover.webp
coverAlt: "Diagramme des couches de l’application"
```

Utilise `![Texte alternatif](/blog/<slug>/illustration.webp)` pour une image simple. Utilise `<Figure src="/blog/<slug>/diagram.svg" alt="Description du schéma" caption="Légende facultative" width={1200} height={700} />` pour préciser les dimensions ou la légende. Les textes alternatifs décrivent l’information portée par l’image.

Les vidéos sont limitées à YouTube : `<YouTubeEmbed id="dQw4w9WgXcQ" title="Titre descriptif" />`. L’iframe n’est chargée qu’après activation du bouton, mais la miniature initiale vient de `i.ytimg.com`. Pour éviter cette requête, enregistre une miniature locale et utilise un composant image.

Les diagrammes Mermaid doivent être pré-rendus en SVG ou PNG avant publication. Garde la source `.mmd` avec les médias de l’article, vérifie l’image produite et intègre-la avec `<Diagram src="/blog/<slug>/architecture.svg" alt="Description du diagramme" caption="Architecture cible" />`. Aucun moteur Mermaid n’est chargé côté lecteur.

Les blocs Markdown fournissent la coloration syntaxique, le nom de langage et un bouton de copie :

```tsx title="src/example.tsx" {1,3}
export function Example() {
  return <p>Contenu</p>;
}
```

Les tableaux GFM sont pris en charge et défilent horizontalement sur mobile. `<Callout tone="tip" title="À retenir">…</Callout>` propose les tons `note`, `tip` et `warning`.

Les composants sont du code MDX de confiance stocké dans le dépôt. Ne colle pas de MDX reçu d’un utilisateur ou d’un service distant.

## Dates, liens et contrôle

Utilise une date ISO réelle. Les pages affichent `updatedAt` seulement quand cette date est fournie et différente de `publishedAt`. N’utilise pas la date du build comme date de modification.

Les liens internes doivent pointer vers la nouvelle URL du blog, les pages `/fr` ou `/en`, et les routes existantes. Le guide a migré vers `/fr/blog/guide-premier-emploi-developpeur` ; l’ancienne URL reste une redirection 308.

`npm run blog:validate` détecte les slugs invalides ou dupliqués, métadonnées manquantes, dates invalides, couvertures absentes, collisions et mauvaises associations de traduction. `npm run build` vérifie ensuite la compilation MDX, les routes statiques, le sitemap et les images sociales. Les routes anglaises sans article doivent rester en 404.
