# Moteur JSON v1

Référence consolidée : `dev04`, 22 octobre 2026. Le JSON est le format par défaut des nouveaux articles standards. L’article SaaS est publié en JSON depuis l’étape 4 ; seul le guide reste en MDX jusqu’à sa migration distincte.

## Écrire et prévisualiser

1. Copier [ARTICLE_TEMPLATE.json](ARTICLE_TEMPLATE.json) dans `src/content/blog-json/fr/<slug>.json` et rédiger le contenu réel.
2. Conserver des IDs et une éventuelle clé de checklist stables. Ranger les images dans `public/blog/<slug>/`.
3. Lancer `npm run blog:validate` puis `npm run dev`. Ouvrir `/fr/blog/json-preview?slug=<slug>` pour un brouillon ; sans query, la fixture de démonstration est affichée.
4. Vérifier le contenu, le clavier, les deux thèmes et le mobile. Utiliser `status: "published"` pour une publication demandée, `draft` pour une préparation.
5. Exécuter `npm run blog:test:json`, `npm run build`, `npm run blog:test:seo`. L’article, son index, ses métadonnées, son image sociale et son entrée sitemap sont générés automatiquement. Aucun registre de pages ou import d’article à modifier.

Le preview refuse les slugs absents, les fichiers MDX et les chemins arbitraires. En production il retourne 404 avant de lire les données ou les paramètres de requête. Le Showcase est `noindex, nofollow`, hors catalogue et sitemap. La fixture `json-demo-blog.json` reste `draft` : ne pas la publier.

## Structure

```json
{
  "schemaVersion": 1,
  "meta": {
    "title": "Titre H1 unique",
    "description": "Description précise de l’article",
    "excerpt": "Chapeau éditorial",
    "slug": "mon-article",
    "locale": "fr",
    "category": "Architecture",
    "publishedAt": "2026-10-22",
    "status": "draft"
  },
  "introBlocks": [{"type":"lead","content":[{"text":"Introduction."}]}],
  "sections": [{
    "id":"premiere-section",
    "title":"Première section H2",
    "number":true,
    "blocks":[{"type":"paragraph","content":[{"text":"Contenu."}]}]
  }],
  "related":{"slugs":[]}
}
```

Champs facultatifs de `meta` : `updatedAt`, `cover`, `coverAlt`, `translationKey`, `seoTitle`, `relatedProjects`. Les dates sont des jours ISO existants ; `updatedAt` ne peut précéder `publishedAt`. `coverAlt` est obligatoire avec une couverture. `seoTitle` est limité à 39 caractères hors suffixe, comme en MDX. Les projets liés doivent être réellement publiés dans la langue de l’article.

`hero.primaryCta` reçoit `{label, target: "content"}`. `hero.visual` accepte `metric-panel` ou `saas-hero` (illustration serveur française, réservée au hero). `hero.eyebrow` remplace facultativement le libellé de catégorie affiché ; `hero.titleHighlight` accentue la première occurrence d’un extrait exact du titre sans modifier le H1 ni les métadonnées. `introBlocks` précède les sections ; `afterBlocks` les suit. `related.slugs` contient des articles publiés dans la même langue ; aucun lien suivant fictif n’est ajouté par défaut.

## Blocs standards

| Type | Contrat |
|---|---|
| `paragraph`, `lead`, `highlight` | `content: RichNode[]` |
| `heading` | `level: 3 ou 4`, `text`, `id?` ; aucun H1/H2 déclaré dans les blocs |
| `list` | `items: RichNode[][]`, `ordered?` ; vrais marqueurs HTML |
| `quote` | `content`, `attribution?` |
| `callout` | `title?`, `tone?`, `blocks` récursifs |
| `cards` | `variant: info/action`, items avec `title`, `description` riche, `blocks?`, `number?`, `href?`, `actionLabel?` ; `action` exige un lien |
| `table` | `caption`, `columns: string[]`, `rows: string[][]` ; nombre de cellules contrôlé |
| `figure` | `src`, `alt`, `caption?`, `width?`, `height?` ; dimensions fournies ensemble, valeurs positives ≤ 8 192 ; défaut 1 200 × 675 |
| `video` | `provider: youtube`, `id` de 11 caractères, `title` |
| `code` | `language`, `code`, `title?`, `copyable?` ; langue/titre conservés même sans copie |
| `checklist` | `storageKey`, `items: [{id,label}]` |
| `accordion` | `items: [{title,blocks}]`, via l’accordéon commun |
| `custom` | `component` connu et `props` strictement validées |

`RichNode` contient `text` et éventuellement `bold`, `italic`, `code`, `link: {href, external?}`. Les espaces entre emphases sont préservés. Ce texte est échappé par React ; aucune interprétation HTML/JS/CSS. `external` ouvre le lien avec `noopener noreferrer`. Les contenus de tableaux restent textuels ; les questionnaires métier passent par le registre React.

La hiérarchie tient compte des H3 produits par les cartes et modules. Un H4 exige un H3 préalable dans sa section. Les introductions ne peuvent commencer par un H3 ou un bloc produisant implicitement ce H3. La profondeur récursive est bornée à cinq niveaux.

## Registre React

La liste des noms, props admises, langues et IDs DOM est centralisée dans `src/lib/blog/json-custom-modules.json`. Les noms TypeScript et la correspondance React en dérivent ; le validateur utilise le même manifeste.

| ID | Props / implémentation |
|---|---|
| `saas-hero` | zéro props, illustration serveur historique ; placement hero uniquement, FR |
| `metric-panel` | `{value, label, caption?}`, rendu serveur |
| `saas-mosaic` | zéro props, mosaïque historique |
| `saas-language-demo` | zéro props, deux sélecteurs indépendants |
| `saas-language-matrix` | zéro props, matrice 6 × 6 et clavier |
| `saas-acquisition-funnel` | zéro props, funnel conceptuel à quatre étapes |
| `saas-decision-tree` | zéro props, huit combinaisons de réponses et reset |

Les cinq widgets SaaS sont FR uniquement, une occurrence chacun par article. `JsonCustomRegistry` adapte les composants existants et leur CSS encapsulé ; il n’en copie pas la logique. Leurs IDs participent à la détection des collisions avec les sections et titres.

Ajouter un module réellement nouveau exige du code React et une entrée de registre contrôlée. Écrire un article avec les blocs standards ou ces modules existants exige seulement du JSON et, si nécessaire, des médias.

## Persistance et ancres

Une checklist sauvegarde uniquement les cases cochées, sous la forme `{"id":true}`. La lecture ignore les valeurs non booléennes, données corrompues et tableaux. La progression suit les vrais items ; reset, rechargement et synchronisation entre onglets sont testés. Lorsque le stockage est refusé, les cases restent utilisables dans la page et un message explique que la progression n’est pas enregistrée.

Les clés respectent `^vd_[a-z0-9_]+$` (par exemple `vd_mon_article_v1`). Deux checklists d’un article, ou de deux articles publiés, ne peuvent partager la même clé. `vd_guide_checklist_v1` est réservée au guide FR à son slug historique, avec les 14 IDs ordonnés `chk-1` à `chk-14`. Le contrat complet est [contracts/guide-checklist-v1.json](contracts/guide-checklist-v1.json). Ne pas renommer cette clé ni réattribuer les IDs. Le reset de ce composant demande confirmation, comme le guide.

`legacyAnchors: {top?, content?}` conserve les anciens fragments d’un article migré. Ces IDs sont validés dans le même espace que les autres ancres ; les liens existants vers `#article-top` et `#article-body` du SaaS restent valables. `readingNote: {title, content: RichNode[]}` permet une courte note éditoriale de sommaire, au serveur, avec les mêmes contrôles de texte et de liens.

Les IDs de sections, `${id}-heading`, titres explicites, shell et widgets doivent être uniques. Les liens `#id` sont vérifiés, ainsi que les ancres vers un autre article JSON publié. Les liens locaux conservent leur destination exacte, y compris les parenthèses ; ils ne sont plus convertis en faux Markdown. Pages, articles, ressources et projets locaux doivent exister ; les protocoles acceptés sont HTTP(S), mailto et tel. Le validateur ne garantit pas la disponibilité future des sites externes.

## Catalogue, SEO et langues

`articles.ts` fusionne MDX et JSON dans un seul catalogue. Les collisions `locale/slug`, slugs internes réservés, titres/descriptions publiés dupliqués, associations de traductions et liens vers des brouillons sont refusés. Un brouillon n’a ni route publique d’article, ni image sociale publique, ni entrée d’index/sitemap.

Les routes génériques utilisent `generateStaticParams`, `dynamicParams=false` et les mêmes métadonnées/JSON-LD pour les deux formats. Canonical, Open Graph, Twitter, BlogPosting, BreadcrumbList, sitemap, index et images 1 200 × 630 proviennent de ce catalogue. Aucun patcher SEO ni page par article.

Le shell accepte FR/EN. Un article EN publié exige une vraie version FR publiée avec le même `translationKey`. Les traductions ne sont pas générées. Les fixtures EN du test de publication sont des données synthétiques temporaires, retirées avant livraison ; aucun article EN n’est ajouté au site.

Le scan JSON a une inclusion de traçage explicite et bornée dans `next.config.mjs` ; les racines injectables des tests ne doivent pas faire embarquer tout le dépôt.

## Recette reproductible

- `npm run blog:test:json` : schéma, médias, sécurité des props/liens, IDs, hiérarchie, stockage, contrats historiques.
- `npm run test:e2e` après le build : pages publiées et Showcase, thèmes, largeurs, axe, widgets, copie, vidéo au clic, impression et stockage.
- `npm run blog:test:publication` : crée deux JSON synthétiques publiés FR/EN et une route de test de checklist **uniquement sur le disque local** ; build, SEO et navigateur ; retire ces fichiers puis reconstruit le build normal, même après un échec. Ne pas lancer en parallèle d’un autre build/serveur utilisant `.next`.
- `npm run blog:test:preview` : lance un serveur de développement dédié, contrôle le shell complet et produit les captures des quatre largeurs/deux thèmes.

Ces deux dernières commandes font partie de la CI. Aucun article synthétique de test, capture PNG ou PDF n’est versionné. L’export sémantique MDX `contracts/internationaliser-saas-v1.json` est conservé volontairement comme contrat de parité. Voir [AUDIT_FINAL_ETAPES_1_2_3.md](AUDIT_FINAL_ETAPES_1_2_3.md) pour le verdict et le budget de performance global restant.
