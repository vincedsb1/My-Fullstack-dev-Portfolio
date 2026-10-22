# Architecture du blog

## Sources et rendu

Les deux sujets publiés vivent sous `src/content/blog-json/{fr,en}/` : guide `guide-premier-emploi-developpeur` / `first-developer-job-guide`, et SaaS `internationaliser-saas-lancement` / `internationalize-saas-at-launch`. Les deux variantes de chaque sujet partagent une clé de traduction stable. Le moteur JSON v1 charge `src/content/blog-json/<locale>/<slug>.json` (format versionné et validé) et `JsonArticlePage` leur fournit le même shell éditorial. Le catalogue accepte encore MDX pendant la transition ; seule la fixture technique `mdx-compatibility-fixture.mdx`, en brouillon, subsiste dans cette source.

`src/lib/blog/article-source.mjs` lit les fichiers locaux avec `yaml`, valide leurs métadonnées, repère les collisions de routes et vérifie les relations de traduction. Il s’assure aussi que le titre du frontmatter reste l’unique H1 et que les images locales référencées existent sous `public/blog/`. `scripts/validate-blog-links.mjs`, appelé par `npm run blog:validate`, vérifie que les liens internes ciblent une route existante et publiée et que les ressources locales existent. `src/lib/blog/articles.ts` expose les articles publiés, leur ordre, leurs versions traduites, leur temps de lecture et leur URL d’image sociale.

Les pages utilisent les Server Components de l’App Router. `generateStaticParams()` énumère les paires locale/slug publiées et `dynamicParams = false` ferme les routes inconnues. Le chargeur officiel `@next/mdx` compile les imports locaux pendant le build ; Vercel sert ensuite le HTML généré sans lire ni compiler le fichier à chaque visite. Le contenu MDX est du code du dépôt, de confiance. Ne jamais y injecter de contenu utilisateur ou distant.

`@next/mdx` compile les fichiers MDX locaux pendant le build. `remark-frontmatter` repère le YAML et `remark-mdx-frontmatter` le convertit en export MDX (les métadonnées affichées sont lues séparément par le validateur). `remark-gfm` prend en charge les tableaux, listes de tâches et autres extensions GitHub. `rehype-pretty-code` colore le code pendant la génération. Les blocs `<Callout>`, `<Figure>`, `<Diagram>` et `<YouTubeEmbed>` sont exposés dans `src/features/blog/MdxComponents.tsx`.

## Articles React spécialisés

Un article peut déclarer `renderer: guide` dans son frontmatter pour réutiliser un rendu React interactif enregistré. Avant l’étape 5, le guide du premier emploi était rendu par des composants serveur typés dans `src/features/guide/` afin de conserver sa checklist, ses ancres, sa progression, sa persistance locale, la copie, le partage, l’impression, le thème et ses icônes. Son contenu et ses interactions partagent les routes, métadonnées, images sociales et le sitemap du blog.

Ce renderer historique n’est plus utilisé par une route publiée ; il est conservé pour les tests d’interopérabilité jusqu’à l’étape 6. Les nouveaux articles standards utilisent le moteur JSON sans registre manuel d’articles à mettre à jour. Le MDX reste supporté pendant la transition.

## Routes et langues

- `/fr/blog` liste les articles français publiés.
- `/fr/blog/<slug>` rend un article publié.
- `/en/blog` liste les publications anglaises. Un index de langue vide reste accessible, en `noindex` et hors sitemap ; une route d’article sans source publiée reste en 404. Une route anglaise publiée doit partager un `translationKey` avec un article français publié.
- Les traductions peuvent avoir des slugs différents et sont associées par `translationKey` ; seuls les articles traduits entre les langues produisent des liens hreflang.

`generateMetadata()` lit la même source que les pages. Les liens canonical et hreflang ne mentionnent que les versions réellement publiées. Les pages d’article publient un JSON-LD `BlogPosting` avec les dates et l’auteur réels, ainsi qu’un `BreadcrumbList` aligné sur le fil d’Ariane visible.

`next.config.mjs` redirige l’ancienne URL du guide vers la nouvelle avec HTTP 308. Les anciennes routes d’images sociales sont redirigées vers l’image actuelle. Les barres obliques finales sont redirigées vers l’URL sans barre en un seul saut. Le sitemap Next.js ajoute l’index et chaque article publié ; il exclut les brouillons, l’ancienne URL et l’index anglais tant qu’aucun article anglais n’est publié.

## Médias

Range les médias d’un article sous `public/blog/<slug>/`. Déclare une image de couverture dans le frontmatter avec `cover` et `coverAlt`. Sans couverture, l’image de partage produite pour l’article sert aussi de visuel de carte.

Les images MDX peuvent être écrites avec la syntaxe Markdown standard ; des dimensions par défaut évitent un décalage de mise en page. Utilise `<Figure>` quand une légende ou des dimensions précises sont nécessaires. `<Diagram>` affiche un SVG/PNG local pré-rendu. Les sources Mermaid restent versionnées à côté des SVG ; aucun moteur de rendu ou navigateur n’est chargé chez le lecteur.

`<YouTubeEmbed id="…" title="…" />` affiche une miniature, un lien de repli et un bouton de lecture. L’iframe `youtube-nocookie.com` n’est créée qu’après une action explicite. La miniature externe `i.ytimg.com` est chargée paresseusement ; héberge une miniature locale si un article doit éviter cette requête tierce avant lecture.

## Partage social

`src/app/(localized)/[locale]/blog/blog-index-image.png/route.tsx` génère l’image de partage de l’index depuis ses catégories publiées. `src/app/(localized)/[locale]/blog/[slug]/social-image/route.tsx` génère celle de chaque article ; le guide réutilise son image sociale existante. Les deux utilisent le même générateur PNG de 1200 × 630. Open Graph et Twitter déclarent dimensions, texte alternatif et image cohérente avec la page.

## Validation et publication

`npm run blog:validate` contrôle les métadonnées, slugs, dates, médias, liens locaux et traductions. `npm run dev` et `npm run build` exécutent cette validation avant de démarrer Next.js ou de compiler le site. Le build génère les routes, le sitemap et les images sociales. Après le build, `npm run blog:test:seo` démarre le build localement et vérifie le HTML pré-rendu, les métadonnées, le JSON-LD, les images sociales, le sitemap, les brouillons et les redirections, sans dépendre du site distant.

## Fichiers principaux

- `src/app/(localized)/[locale]/blog/page.tsx` : index et métadonnées du blog.
- `src/app/(localized)/[locale]/blog/[slug]/page.tsx` : articles, SEO et pré-rendu statique.
- `src/app/(localized)/[locale]/blog/[slug]/social-image/route.tsx` : images sociales statiques.
- `src/app/(localized)/[locale]/blog/blog-index-image.png/route.tsx` : image sociale de l’index.
- `src/features/blog/` : cartes, navigation, layout partagé et composants MDX.
- `src/content/blog/` : frontmatter et contenu éditorial.
- `public/blog/` : images et schémas locaux.
- `src/app/sitemap.ts` : index et articles publiés.
- `scripts/validate-blog.mjs` : validation préalable au build.
- `scripts/validate-blog-links.mjs` : contrôle des liens internes et ressources locales.
- `scripts/test-blog-seo.mjs` : vérification SEO du build local.

## Gabarits et navigation communs

Le registre `src/features/blog/ArticleLayouts.tsx` associe `default`, `guide` et
`editorial` aux gabarits. L’ancien article MDX exportait `GuideArticle` ; `GuideBody.tsx` assemble ses sections typées sous `src/features/guide/sections/`, sans injection de HTML brut ;
son contrôleur conserve la clé `vd_guide_checklist_v1`, désormais partagée avec la traduction anglaise canonique du guide. Les styles du guide ne sont
chargés que par son composant. Tous les gabarits utilisent l’en-tête, le pied de
page et les contrôles de thème/langue communs. `seoTitle` permet un titre SEO
court sans changer le H1. `relatedProjects` référence uniquement des fiches
publiées dans la langue de l’article et produit des liens de détail visibles.


## Organisation consolidée sur dev04

- `src/features/blog/design-system/` : composants et styles du Showcase (isolés par `.blog-ds`).
- `src/features/blog/json/` : présentation des blocs JSON, checklist et registre custom explicite.
- `src/lib/blog/json-source.mjs`, `.d.mts`, `json-types.ts` : validation structurelle + types du schéma v1.
- `src/content/blog-json/fr/json-demo-blog.json` : fixture `draft`, prévisualisable via `/fr/blog/json-preview?slug=json-demo-blog` en développement et visible dans le Showcase.
- `src/app/(localized)/[locale]/blog/showcase/` : catalogue visuel de référence `noindex`.
- `scripts/blog-json-tests/` : tests Node dédiés ; `npm run blog:test:json`.
- `docs/blog/README.md` : index et limites avant migration.

Ne pas utiliser l'ancien patcher SEO de l'archive : les contrôles du moteur JSON et du test SEO sont intégrés directement à leurs scripts respectifs.

**Shell d’article JSON :** ne pas réintroduire un deuxième `header` ou `footer` global ; les pages héritent déjà de `SiteHeader` / `SiteFooter` depuis le layout `[locale]`. Le hero et les commandes de lecture restent propres à `JsonArticlePage`.

## Modules React contrôlés

Le registre JSON exposé par `JsonCustomRegistry.tsx` admet désormais les cinq widgets SaaS existants **sans les réimplémenter** ; ils se rendent sous l’enveloppe CSS de leur article d'origine. Les widgets et l’illustration du hero utilisent les messages `blogSaas` FR/EN sans duplication de leur logique. Les champs JSON `seoTitle` et `relatedProjects` sont facultatifs ; les vidéos YouTube passent par le composant de consentement déjà présent dans le blog. Les décisions, la politique de migration et les critères de qualité sont consignés dans [PREPARATION_ETAPE_4.md](PREPARATION_ETAPE_4.md).


## Contrats consolidés et recette

Le manifeste `json-custom-modules.json` est partagé par le validateur et les noms TypeScript du registre React. Les IDs produits par les sections, le shell et les widgets sont validés ensemble. Les contrôles de projets publiés sont mutualisés entre les sources MDX et JSON dans `project-references.mjs`.

Le renderer utilise la même bibliothèque que le Showcase : accordéons, figures, cartes riches, actions communes et `JsonChecklist`. Il n’existe plus de deuxième logique de checklist/questionnaire dans une démo JSX. Le coloriseur de code déjà installé pour le MDX travaille au serveur ; le JSON ne transporte ni HTML, ni styles, ni code exécutable.

Les liens JSON sont transmis au validateur comme destinations structurées, sans conversion intermédiaire en Markdown. Le validateur contrôle aussi les ancres des articles JSON cibles et les clés de stockage publiées. Le scan de fichiers JSON bénéficie d’une inclusion de traçage explicitement bornée dans `next.config.mjs`.

`blog:test:publication` vérifie une publication synthétique FR/EN, son SEO et l’interopérabilité réelle avec la checklist du guide, puis retire ses sources et restaure le build normal. `blog:test:preview` vérifie le shell en développement, tandis que les E2E normaux contrôlent les pages publiques et le Showcase en production locale. Les commandes utilisant `.next` doivent être exécutées successivement.

Voir [JSON_ENGINE.md](JSON_ENGINE.md) pour le schéma et [AUDIT_FINAL_ETAPES_1_2_3.md](AUDIT_FINAL_ETAPES_1_2_3.md) pour les preuves. L’article SaaS est migré en étape 4 : voir [ETAPE_4_MIGRATION_SAAS.md](ETAPE_4_MIGRATION_SAAS.md). Le guide est migré en étape 5 : voir [ETAPE_5_MIGRATION_GUIDE.md](ETAPE_5_MIGRATION_GUIDE.md).

## Migration SaaS (étape 4)

`src/content/blog-json/fr/internationaliser-saas-lancement.json` porte le texte, ses cinq sections/ancres historiques et les appels aux cinq widgets. L’ancien MDX est retiré du catalogue dans la même bascule ; son contenu reste récupérable à la révision `04c6e15`. Aucun import d’article ni route spécialisée n’a été ajouté. Les renderers MDX et le gabarit `editorial` sont conservés en attendant le nettoyage de l’étape 6.

`InternationalisationHeroArt.tsx` extrait l’illustration serveur existante ; le gabarit historique et le registre `saas-hero` partagent cette seule implémentation. Le Showcase utilise ce même visuel. Les cinq modules de `InternationalisationArticleModules.tsx` sont inchangés.

Les options JSON facultatives `hero.eyebrow`, `hero.titleHighlight`, `readingNote` et `legacyAnchors` préservent les détails éditoriaux et les anciens fragments sans branchement par slug dans le moteur. La biographie française réutilise la signature auteur commune ; seul le hero éditorial conserve un portrait `Avatar`, le footer étant fourni par le portfolio. Ces options ne sont pas nécessaires pour écrire un article standard.

## Migration du guide (étape 5)

`guide-premier-emploi-developpeur.json` porte le contenu et les métadonnées du guide. Le MDX publié et le brouillon de préparation sont retirés dans la même bascule. La checklist utilise `JsonChecklist` et la clé historique `vd_guide_checklist_v1`, sans changement d’IDs ni de format. Les ancres des chapitres et des modèles restent stables ; les dates de publication et de révision éditoriale ne changent pas.

Aucun composant, style ou branchement de rendu générique n’a été nécessaire pour cette bascule. Les fichiers `src/features/guide/` restent conservés, de même que les renderers MDX et les anciens styles SaaS ; leur retrait relève de l’étape 6. La fixture MDX technique évite un glob dynamique vide avec Turbopack et n’a ni route publiée, ni image sociale, ni présence au sitemap.

Le pilote de publication crée temporairement une route utilisant les vrais `GuideBody` et `GuideInteractive` pour tester l’aller-retour des sauvegardes avec le guide JSON public. Les routes techniques sont retirées et le build normal est restauré à la fin du pilote. La recette partagée du guide tourne sur le build de production local et en développement, sans duplication de logique de test. Voir [ETAPE_5_MIGRATION_GUIDE.md](ETAPE_5_MIGRATION_GUIDE.md).

## Disponibilité française et anglaise

La navigation conserve la langue choisie depuis l’accueil, l’index et les pages d’erreur. Le sélecteur associe les articles par `translationKey`, même avec des slugs différents ; une traduction absente renvoie à l’index de la langue cible. Le preview de développement accepte FR et EN et reste fermé en production.

La paire canonique du guide conserve les 14 IDs et la clé historique dans les deux langues. Cette seule exception est contrôlée dans le validateur ; les autres checklists publiées doivent conserver des clés distinctes. Voir [MISE_EN_PLACE_FR_EN.md](MISE_EN_PLACE_FR_EN.md).
