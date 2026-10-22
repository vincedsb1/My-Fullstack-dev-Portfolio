# Design system éditorial du blog

Référence consolidée sur `dev04`, le 22 octobre 2026. La bibliothèque est utilisée par le Showcase et les deux articles publiés en JSON. Le guide et le SaaS partagent le hero, la typographie, le sommaire, les sections, les commandes de lecture et la signature auteur. Leurs blocs et illustrations dépendent du contenu. Voir [ETAPE_5_MIGRATION_GUIDE.md](ETAPE_5_MIGRATION_GUIDE.md) pour la recette des deux routes publiques.

## Direction et intégration

L’article SaaS reste la référence : titres expressifs, papier neutre, marges généreuses, colonne de lecture, accents rouges et illustrations sauge. Inter, le thème, la navigation, le pied de site, les boutons, la copie et le partage proviennent du portfolio. Aucun `BlogSiteHeader` ou `BlogPageFooter` parallèle n’est maintenu.

`src/app/(localized)/[locale]/layout.tsx` fournit `SiteHeader` et `SiteFooter`. `JsonArticlePage` fournit le fil d’Ariane, le hero, la barre de lecture, les commandes PDF/partage, le sommaire automatique, les sections, l’auteur et les liens associés. Le Showcase montre ces mêmes composants ; ses exemples JSON passent par le même validateur et le même renderer que les articles.

## Tokens et composition

La source des tokens est `src/features/blog/design-system/blog-design-system.css`. Les variables `--blog-*` sont limitées à `.blog-ds`, avec variantes sous `.dark .blog-ds`. Le thème est celui du portfolio ; aucune préférence de thème propre au blog.

| Rôle | Clair | Sombre |
|---|---|---|
| Fond / surface | `#f7f7f5` / `#ffffff` | `#171817` / `#202220` |
| Encre / corps | `#20201f` / `#50504d` | `#f2f2ed` / `#c0c1b9` |
| Secondaire | `#62625e` | `#a2a69e` |
| Bordure / fond secondaire | `#e2e2dd` / `#eeeee9` | `#343831` / `#292c27` |
| Accent / survol / texte du bouton | `#c62b28` / `#aa211f` / blanc | `#ff8e84` / `#ffaaa1` / `#171817` |
| Succès | `#366f4f` | `#a6cfaf` |
| Avertissement | `#966010` | `#f3c675` |
| Information | `#26577c` | `#98caed` |

Enveloppe : 1 248 px ; lecture : 720 px ; sommaire : 210 puis 175 px ; gouttière : 64 puis 40 px. Rayons éditoriaux : 9 / 16 / 22 px. Corps : 16 px, interligne 1,85 ; 15 px sous 600 px. H1 : `clamp(40px, 4.75vw, 68px)` ; H2 : `clamp(27px, 3vw, 34px)`.

À 1 100 px, les colonnes se resserrent ; à 900 px, le sommaire devient un `<details>` ; à 600 px, hero et cartes s’empilent. Les tableaux et le code défilent dans leur propre conteneur, accessible au clavier. Les listes ont leurs vrais marqueurs, les H4 et le code en ligne ont un style dédié.

## Composants réutilisés

| Famille | Composants / contrat |
|---|---|
| Structure | `BlogBreadcrumbs`, `BlogArticleHero`, `BlogReadingLayout`, `BlogSection` |
| Lecture | `BlogReadingNavigation`, `BlogReadingProgress`, `BlogBackToTop`, `BlogPrintButton` |
| Actions | `BlogButton` et CTA du hero adaptent `ButtonLink` ; impression/reset réutilisent `Button` ; copie et partage réutilisent les composants existants |
| Contenu | `BlogCallout`, `BlogQuote`, `BlogAccordion`, `BlogInfoCard`, `BlogIconList`, `BlogBadge` |
| Médias | `BlogFigure` et Next Image ; portraits via `Avatar` partagé ; `YouTubeEmbed` existant avec iframe au clic |
| Code | `BlogCodeSample`, coloré au serveur par `rehype-pretty-code`, déjà utilisé en MDX ; thèmes GitHub à contraste renforcé ; aucun coloriseur envoyé au navigateur |
| Interaction | `JsonChecklist`, avec sauvegarde facultative pour les démos ; les cinq vrais widgets SaaS dans le registre contrôlé |
| Fin d’article | `BlogAuthorCard`, `BlogNextArticle`, `RelatedProjects` existant |

Les tons `neutral`, `accent`, `info`, `success`, `warning` sont implémentés et montrés dans l’accordéon des fondations du Showcase. `BlogInfoCard` expose `info` et `action` ; une carte JSON `action` exige un lien. Les cartes peuvent contenir des blocs structurés et une action distincte.

`BlogAccordion` accepte du contenu React structuré : le renderer JSON ne crée pas un second accordéon. `JsonChecklist` sert à la fois à la démonstration sans stockage et au bloc persistant. Les anciennes démos de checklist/questionnaire, avec leur logique concurrente, ont été retirées. Le questionnaire présenté est celui du SaaS.

## Sémantique, clavier et impression

- Un `main` et un H1 par page. Les sections JSON produisent les H2 ; les titres explicites sont H3/H4. Le visuel métrique du hero utilise un paragraphe, pas un H3 placé avant les sections.
- Les IDs de sections, de leurs titres, du shell et des modules sont contrôlés ensemble. Le sommaire déplace le focus vers une section et replie sa version mobile.
- Les choix métier exposent `aria-pressed`, les champs ont leurs labels, les états et résultats sont annoncés. La matrice garde son focus mobile avec flèches, Home et End.
- Les animations sont désactivées avec `prefers-reduced-motion`.
- À l’impression : papier blanc même depuis le thème sombre, marges A4, chrome global et commandes cachés, code repliable sur plusieurs lignes, tableaux lisibles, accordéons ouverts pour la sortie puis restaurés. Le contenu des widgets conserve sa lisibilité.

## Référence et vérification

La référence est `/fr/blog/showcase`, pas `previews/showcase-preview.html`, qui reste un aperçu historique non contractuel. La prévisualisation complète du shell est `/fr/blog/json-preview?slug=json-demo-blog`, en développement uniquement.

Les tests couvrent 320 / 390 / 820 / 1440 px dans les deux thèmes, les contrôles DOM, axe, les interactions, les états ouverts/focus/hover et les PDF. Les captures et PDF sont ignorés par Git et archivés par GitHub Actions. Voir [AUDIT_FINAL_ETAPES_1_2_3.md](AUDIT_FINAL_ETAPES_1_2_3.md) pour les résultats, la comparaison avec les références CI et les limites.

## Ajustements de la migration SaaS

Le hero illustré conserve une répartition 1,65 / 1 à grande largeur, son mot accentué et l’illustration `InternationalisationHeroArt` partagée avec l’ancien gabarit. Le registre la réserve au hero ; elle n’ajoute pas de titre ni de JavaScript client. Le Showcase utilise aussi ce visuel, au lieu d’une deuxième grille JSX.

Un premier bloc `lead` dans `introBlocks` reçoit une lettrine ; les paragraphes imbriqués de l’introduction et de la fin d’article conservent leurs espacements. La note facultative du sommaire est rendue au serveur et suit la colonne de lecture à grande largeur. Les captures de parité sont décrites dans [ETAPE_4_MIGRATION_SAAS.md](ETAPE_4_MIGRATION_SAAS.md).

## Fin d’article allégée

La signature `BlogAuthorCard` est textuelle, sans second portrait ni fond de carte. La biographie reste disponible en petit corps. Le portrait du hero et le footer du portfolio conservent leur rôle.

`JsonArticlePage` regroupe la signature, les articles associés et les projets liés dans la colonne de lecture. `BlogNextArticle` affiche un lien secondaire de taille modérée, sans encadré. `RelatedProjects` réutilise son catalogue et ses destinations avec la variante `compact` dans ce groupe ; son rendu historique reste disponible. Les deux destinations se placent côte à côte si la largeur le permet, puis s’empilent sur mobile. Aucun bloc vide n’est rendu sans relation.

Le Showcase présente cette même composition. Les couleurs secondaires utilisent les tokens clair/sombre existants ; les liens ont un état survol et le focus visible commun. Le sommaire du SaaS ne contient plus la note « Le point de départ », retirée à la demande de l’auteur. Cette simplification de présentation ne modifie ni les sections, ni leurs ancres, ni les widgets et sauvegardes.

Recette de cette finition : validation du catalogue et 28 tests JSON, 11 tests unitaires, TypeScript, build statique et SEO réussis ; ESLint sans erreur, avec les cinq avertissements de tokens déjà connus. Les 29 E2E contrôlent aussi l’absence de portrait dans la signature, le regroupement des liens et le sommaire sans note. Les cinq tests de développement contrôlent le preview et la console des articles. Les rendus des deux pages ont été observés à 320, 390, 820 et 1440 px dans les deux thèmes, avec navigation clavier et impression. Le budget JavaScript global de l’accueil reste une réserve distincte, déjà documentée dans l’audit.
