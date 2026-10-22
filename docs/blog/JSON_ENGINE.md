# Blog — Moteur JSON v1 (étape 3)

**Référence actuelle :** intégration sur `dev03`, à partir de `dev02` (`76e2e81d`).  
**Statut :** sources repositionnées dans l’architecture courante ; build Next.js/contrôles navigateur à valider dans le dépôt avec dépendances installées.

## Objectif et périmètre

Créer des articles **entièrement alimentés par des fichiers JSON**, avec styles hérités du design system de l'étape 2. Aucun CMS, base de données, HTML libre ou moteur de code dynamique. Maintenir les deux articles actuellement publiés **sur leur rendu historique** avant leur migration aux étapes 4 et 5.

### Pourquoi `src/content/blog-json/` et non `src/content/blog/` ?

Le chargeur historique `src/lib/blog/article-source.mjs` **refuse les extensions autres que `.mdx`** dans `src/content/blog/{fr,en}`. Pour ne pas remplacer ni fragiliser sa validation, les nouveaux fichiers `.json` sont rangés provisoirement dans `src/content/blog-json/<locale>/`. Les deux formats alimentent **le même catalogue public** via `src/lib/blog/articles.ts`. L'URL reste `/<locale>/blog/<slug>`, indépendamment du format. La fusion finale des dossiers est reportée à la suppression du lecteur MDX legacy.

### Publication et comportement des routes

- `src/content/blog-json/fr/json-demo-blog.json` est **draft** : exclu de l'index, de `generateStaticParams`, du sitemap et des images sociales publiques ; `/fr/blog/json-demo-blog` répond 404 avec `dynamicParams=false`.
- `/fr/blog/json-preview` sert la **même fixture** uniquement en développement ; `noindex, nofollow`, `notFound()` en production ; ne pas considérer cette route comme un article publié.
- `/fr/blog/showcase` contient une **nouvelle section réellement alimentée par la fixture JSON**. Le showcase global conserve aussi les démonstrations JSX de l'étape 2.
- Pour publier un **véritable troisième article**, créer un nouveau JSON sous `src/content/blog-json/fr/<slug>.json` avec `status: "published"`, puis déployer : les fonctions d'index, de sitemap, de route article et de génération d'image sociale utilisent le même catalogue unifié.
- Les articles MDX conservent leurs deux rendus spéciaux ; le shell JSON n'est appelé que si `article.format === "json"`.

## JSON v1 : métadonnées et découpage

```json
{
  "schemaVersion": 1,
  "meta": {
    "title": "Titre H1 unique",
    "description": "Description SEO unique",
    "excerpt": "Chapeau de l'article",
    "slug": "mon-article",
    "locale": "fr",
    "category": "Architecture",
    "publishedAt": "2026-10-22",
    "status": "draft"
  },
  "hero": { "primaryCta": { "label": "Lire", "target": "content" } },
  "introBlocks": [{"type":"lead","content":[{"text":"Introduction avant le premier H2."}]}],
  "sections": [{ "id": "premiere-section", "title": "Section H2", "number": true,
    "blocks": [{"type":"paragraph","content":[{"text":"Texte du premier paragraphe."}]}] }],
  "afterBlocks": [],
  "related": {"slugs": []}
}
```

Champs metadata optionnels : `updatedAt`, `cover`, `coverAlt`, `translationKey`. Si `cover` est renseigné, `coverAlt` est obligatoire. Les dates doivent exister dans le calendrier. Le H1 **ne se déclare pas** dans les blocs.

| Type de bloc | Contrat | Rendu |
|---|---|---|
| `paragraph` / `lead` / `highlight` | `content: RichNode[]` | paragraphe, chapeau, citation visuelle emphatique |
| `heading` | `level: 3 | 4`, `text`, `id?` | H3/H4 sans saut H2→H4 |
| `list` | `items: RichNode[][]`, `ordered?` | liste HTML |
| `quote` | `content: RichNode[]`, `attribution?` | citation éditoriale |
| `callout` | `title?`, `tone?`, `blocks: ArticleBlock[]` | encadré récursif (profondeur bornée) |
| `cards` | `variant?`, `items[]` avec titre, description riche, lien optionnel | grille de cartes |
| `table` | `caption`, `columns[]`, `rows[][]` | tableau responsive |
| `figure` | `src`, `alt`, `width?` et `height?`, `caption?` | Next Image avec dimensions |
| `code` | `language`, `code`, `title?`, `copyable?` | code copiable (coloration avancée à consolider) |
| `checklist` | `storageKey`, `items[{id,label}]` | état persisté localement, progression, reset |
| `accordion` | `items[{title,blocks}]` | éléments `<details>` avec contenu structuré |
| `custom` | `component`, `props` exactement typées | module React issu d'un registre statique |

`RichNode` : `{text, bold?, italic?, code?, link?:{href, external?}}`. Ce format permet l'emphase et les liens *dans* les paragraphes et les cartes sans `dangerouslySetInnerHTML` ni snippets HTML. Le contenu des modules custom n'est jamais évalué comme code.

### Registre custom

La première entrée est `metric-panel` avec `props: { value, label, caption? }`. Les IDs et propriétés autorisés sont vérifiés dans `json-source.mjs` et rendus dans `JsonCustomRegistry.tsx`. **Chaque futur module spécialisé** (langues, matrice, funnel, questionnaire Iconise) doit être ajouté dans les deux sources avec des props strictement bornées. À cette étape, aucune fonctionnalité spécialisée existante n'a été recodée ni migrée.

### Limites délibérées de v1

- Pas de bloc questionnaire générique arbitraire : le questionnaire internationalisation sera ajouté par module enregistré lors de sa migration.
- Pas d'exécution de code, HTML libre, styles par article ou composants choisis par chemin.
- Le bloc code v1 conserve la copie et la langue affichée, mais **pas encore la coloration Shiki/rehype** du MDX ; point à traiter avant la migration d'un article qui en dépend.
- Le champ `hero.visual` accepte uniquement un module enregistré ; son affichage visuel et sa hiérarchie de titres doivent être confirmés au cas par cas.
- Le thème EN conserve certains libellés hérités de l'étape 2 ; une revue i18n complète sera requise avant la première publication EN JSON.
- L'article draft de démonstration n'est **pas** un article éditorial : ne pas le publier par simple changement de statut.

## Pipeline de données et SEO

1. `json-source.mjs` charge et valide les JSON locaux, métadonnées, types de blocs, champs inconnus, médias, ancres, liens, traductions et références.
2. `src/lib/blog/articles.ts` fusionne les listes **MDX + JSON**, détecte les collisions interformats et calcule le temps de lecture depuis le **texte éditorial JSON** (hors snippets de code).
3. `src/app/(localized)/[locale]/blog/[slug]/page.tsx` conserve les fonctions SEO existantes et délègue **uniquement** le corps au renderer JSON pour `format === 'json'`.
4. `src/app/sitemap.ts`, les cartes d'index, `generateStaticParams()` et l'image sociale réutilisent déjà `getPublishedArticles()` / `getPublishedArticle()` : l'ajout d'articles JSON publiés est automatiquement propagé.
5. `scripts/validate-blog.mjs` contrôle tous les fichiers et réutilise le validateur existant des liens pour les destinations du JSON.
6. Le test SEO historique doit être adapté via `npm run blog:test:seo` (lire `INSTALLATION.md`). Il doit tester les pages JSON publiées exactement comme les pages MDX.

## Stabilité et accessibilité

- Ancres `sections[].id` stables et uniques : utilisées pour le sommaire responsive, les deep links et la progression.
- H1 unique généré par le shell ; H2 par `BlogSection`, H3/H4 contrôlés.
- Figures locales sous `/blog/<slug>/`, texte alternatif et dimensions ; code et tableau avec défilement horizontal sur mobile.
- Checklist `localStorage` ; aucune clé de l'ancien guide n'est modifiée. Pour la future migration du guide, reprendre **exactement** `vd_guide_checklist_v1` et les 14 IDs d'origine.
- Sections et paragraphes rendus en Server Components ; seules les interactions spécifiques utilisent `"use client"`.

## Contrôles réalisés

- **10 tests Node natifs réussis** (validateur, médias, collisions, intégrité structurelle, dates, URLs, profondeur, patch SEO).
- **Parsing TS/TSX : 14 fichiers, 0 erreur de syntaxe**, mais aucun `tsc --noEmit` complet.
- **Parsing CSS : validé**.
- **Non exécuté dans ce livrable isolé :** `next build`, lint du dépôt complet, Playwright, navigation navigateur Next réelle et `blog:test:seo` après intégration.

## Conditions de validation finale de l'étape 3

- [ ] Intégration sur branche dédiée depuis le commit de référence, résoudre les conflits en cas de commit plus récent.
- [ ] `npm run blog:validate`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run blog:test:seo` au vert.
- [ ] Les deux URL MDX existantes restent accessibles, avec leurs fonctions interactives.
- [ ] `/fr/blog/json-preview` affiche la fixture en développement ; route non publiée et absente du sitemap ; Showcase affiche la section JSON.
- [ ] Captures 1440, 820, 390 et 320 px, clair/sombre ; vérifier la colonne de lecture, tables, code, checklist et sommaire.
- [ ] Publication pilote d'un **vrai** article JSON validée (canonical, OG, JSON-LD, sitemap et carte d'index), seulement après validation éditoriale.


> **dev03 :** le patcher SEO historique n'est plus requis. Le test SEO est adapté directement pour les articles JSON. Les articles MDX existants gardent leur rendu `ArticleLayouts` et leur métadonnée `seoTitle`.
