# Design system éditorial du blog — v1

> **Phase 2 : direction visuelle + bibliothèque Showcase.** Ce document décrit les composants implémentés dans `src/features/blog/design-system/` et la page `/fr/blog/showcase`. Il ne remplace pas encore les deux rendus historiques. Référence initiale : `main` à `1b217e7790ef3429ceadf37c176143122107a005` (22 octobre 2026).

## 1. Intentions et décisions

- **Style de référence :** esthétique éditoriale de l'article « Internationaliser un SaaS » (fond papier, grandes marges, titres expressifs, bordures discrètes), sans recopier son layout dédié.
- **Cohérence produit :** conserver la police **Inter**, déjà initialisée dans le layout racine, et la famille des accents rouges du blog existant.
- **Structure fixe :** navigation, breadcrumb, hero, byline, progression de lecture, sommaire, colonne de lecture, carte auteur, article suivant et pied de page partagent la même grammaire visuelle.
- **Contenu variable :** sections H2, prose, citations, figures, tableaux, cartes, CTA, checklists et questionnaires composables.
- **Modules exceptionnels :** même cadre externe (`BlogModuleFrame`) mais React libre à l'intérieur. Pas de styles métiers injectés dans le JSON.
- **Sémantique :** un seul H1 pour un article, H2 pour les chapitres, H3 pour les sous-parties. La page Showcase possède son propre H1, les sections d'exemple restent H2.
- **Performance :** composants éditoriaux rendus sur le serveur ; `BlogReadingControls`, `BlogShowcaseInteractive` et commandes existantes sont de petits composants client.
- **Multi-langues :** démonstration FR uniquement pour l'instant ; composants architecturés pour accepter `locale` quand cela a un sens. Ne pas présenter le Showcase comme une traduction EN publiée.

## 2. Design tokens

Les variables sont **scopées sous `.blog-ds`** et changent par `.dark .blog-ds` : aucun changement des articles historiques ni des autres pages du portfolio. Le thème global est contrôlé par le `ThemeToggle` existant et `ThemeContext`.

### 2.1. Palette sémantique (valeurs exactes du CSS)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--blog-bg` | `#f7f7f5` | `#171817` | papier / fond global |
| `--blog-surface` | `#ffffff` | `#202220` | cartes, modules, popovers |
| `--blog-ink` | `#20201f` | `#f2f2ed` | titres, texte fort |
| `--blog-body` | `#50504d` | `#c0c1b9` | corps de lecture |
| `--blog-muted` | `#6f6f6a` | `#a2a69e` | métadonnées, commentaires |
| `--blog-line` | `#e2e2dd` | `#343831` | bordures, séparateurs |
| `--blog-soft` | `#eeeee9` | `#292c27` | fond secondaire / code |
| `--blog-accent` | `#c62b28` | `#ff8e84` | lien, bouton, focus, chapitre |
| `--blog-accent-hover` | `#aa211f` | `#ffaaa1` | hover |
| `--blog-accent-soft` | `#fff0ed` | `#382321` | badge accent |
| `--blog-success` | `#366f4f` | `#a6cfaf` | succès, illustration sélective |
| `--blog-success-soft` | `#edf3ec` | `#26392c` | fond de module réussite |
| `--blog-warning` | `#966010` | `#f3c675` | avertissement |
| `--blog-warning-soft` | `#fff5e2` | `#3b3020` | fond avertissement |
| `--blog-info` | `#26577c` | `#98caed` | information |
| `--blog-info-soft` | `#edf4fa` | `#213442` | fond information |

**Règles de couleur :** rouge = interaction/hiérarchie ; vert = explication positive ou module lié au produit ; ambre = avertissement ; bleu = information. Ne pas attribuer des couleurs différentes à chaque article. Les labels des états existent indépendamment de la couleur.

### 2.2. Dimensions et rythmes

| Token / règle | Valeur | Application |
|---|---|---|
| `--blog-shell-width` | `1248px` | enveloppe globale |
| `--blog-reading-width` | `720px` | texte éditorial |
| Sommaire desktop | `210px`, puis `175px` | colonne latérale |
| Gouttière de lecture | `64px`, puis `40px` | séparation sidebar / prose |
| `--blog-radius-sm` | `9px` | CTA et callout |
| `--blog-radius` | `16px` | cartes et modules |
| `--blog-radius-lg` | `22px` | surfaces plus généreuses |
| Échelle d'espacement | `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px` | layout |
| Header desktop / mobile | `74px` / `64px` min-height | navigation sticky |
| Accent de lecture | `2px` | barre de progression |
| Paragraphes | `16px`, line-height `1.85` | confort de lecture |
| Corps mobile | `15px` | largeur réduite |
| Titres de section | `clamp(27px, 3vw, 34px)` | H2 |
| Hero | `clamp(40px, 4.75vw, 68px)` | H1/H2 de démonstration |

**Breakpoint de composition :** `<=1100px` : resserrer les colonnes ; `<=900px` : sommaire repliable et lecture pleine largeur ; `<=600px` : hero sur une seule colonne, cartes empilées. Ce ne sont pas des seuils métier ; les futurs blocs doivent s'adapter au conteneur et non multiplier des breakpoints ad hoc.

## 3. API des composants créés

| Composant | Type | Usage / props déterminantes |
|---|---|---|
| `BlogSiteHeader` | serveur + boutons client | marque, lien blog, thème, partage, impression, `progressTargetId` |
| `BlogBreadcrumbs` | serveur | tableau `{label, href?}` ; dernier élément = page courante |
| `BlogArticleHero` | serveur | `category`, `title`, `excerpt`, auteur, date, lecture, `illustration?`, CTA ; `headingLevel=1` par défaut |
| `BlogReadingLayout` | serveur | grille colonne nav + contenu |
| `BlogReadingNavigation` | client | `items: [{id,label}]` ; suivi de chapitre et menu mobile |
| `BlogReadingProgress` | client | `targetId` DOM ; progression scroll |
| `BlogSection` | serveur | `id`, `title`, `number?`, `eyebrow?`, `children` ; H2 |
| `BlogBadge` | serveur | variante `neutral/accent/success/warning/info` |
| `BlogButton` | serveur | liens primaire / secondaire / texte ; `external` |
| `BlogInfoCard` | serveur | titre, description, numéro, action facultative |
| `BlogCallout` | serveur | titre, contenu, ton sémantique |
| `BlogQuote` | serveur | citation + attribution facultative |
| `BlogAccordion` | serveur | liste d’éléments HTML `<details>` natifs |
| `BlogIconList` | serveur | liste d’erreurs, de risques ou de points importants |
| `BlogFigure` | serveur | légende, `label` accessible, contenu visuel enfant |
| `BlogCodeSample` | serveur + bouton client existant | langage/label, code copiable |
| `BlogModuleFrame` | serveur | cadre éditorial générique avec title/description/note/tone |
| `BlogChecklistDemo` | client | démo fonctionnelle, état mémoire uniquement |
| `BlogDecisionDemo` | client | démo fonctionnelle, 3 réponses binaires |
| `BlogAuthorCard` | serveur | bio et lien portfolio |
| `BlogNextArticle` | serveur | titre, href, eyebrow facultatif |
| `BlogPageFooter` | serveur | signature et lien index |
| `BlogBackToTop` / `BlogPrintButton` | client | navigation haut et export via `window.print()` |

Ces composants forment une **bibliothèque de référence**, pas encore un moteur JSON. Ils ne sont **pas** importés par les deux articles de production. La migration viendra au lot suivant.

## 4. Contrats de mise en page

### Shell fixe d'article

```text
BlogSiteHeader (sticky + actions + barre de lecture)
  BlogBreadcrumbs
  BlogArticleHero (slot illustration optionnel)
  BlogReadingLayout
    BlogReadingNavigation
    ArticleBody
      BlogSection[] (blocs composables)
      BlogAuthorCard
      BlogNextArticle (optionnel si une destination valide existe)
  BlogPageFooter
BlogBackToTop (mobile / longue page)
```

Le **pied de site global du portfolio** n'a pas été modifié ici : `BlogPageFooter` est le pied éditorial des pages du blog ; la question d'alignement final avec le footer du portfolio se décide au moment de migrer les pages, sans dédoubler un footer global.

### Éléments standards, variantes et custom

- Un composant **standard** porte le style de toutes les occurrences (titre, paragraphes, cartes, tableau, lien, citation).
- Une **variante** n'existe que si un besoin éditorial réel l'exige et qu'elle reste dans les valeurs documentées.
- Un composant **custom** est du code React identifié par un registre contrôlé ; seules les **props sérialisables** sont injectées via le JSON. Jamais de JSX, de code JavaScript arbitraire ou de CSS libres dans les données.

### Sauvegarde des particularités historiques

- La checklist de l'ancien guide utilise `localStorage['vd_guide_checklist_v1']` et les IDs `chk-1` à `chk-14` : **ne pas** l'effacer ni remplacer sa clé avec la démo du Showcase.
- La matrice de langues, la démo de localisation, le funnel et le questionnaire de l'article SaaS restent des composants spécifiques. Leur logique ne doit pas être réécrite en JSON.
- Les ancres actuelles (`les-trois-piliers`, `accessible`, etc.), les URL existantes et le SEO ne changent pas à cette étape.
- L'article suivant ne doit plus être codé en dur dans un wrapper propre à l'article lors de la migration.

## 5. Accessibilité / responsive / impression

- Navigation clavier et `:focus-visible` avec contraste ; un seul H1 ; fil d'Ariane et sommaire avec balises nav.
- État des boutons choix via `aria-pressed`, checklist via `<input type="checkbox">`, progression checklist via `role="progressbar"`, statut questionnaire via `role="status"`.
- `aria-current="location"` sur le chapitre actif ; `id` stable pour les liens profonds.
- Sommaire latéral sur desktop, `<details>` natif repliable sur mobile ; colonnes de cartes et hero empilées sur petit écran.
- Respect de `prefers-reduced-motion`, styles `@media print` pour épurer le document imprimé.
- Aucun moteur de données supplémentaire ; aucun service externe requis par les nouveaux composants.

### Vérifications à faire dans un vrai navigateur du dépôt

La compilation du projet complet n'a pas été effectuée ici (pas de copie locale du dépôt, uniquement la source lue depuis GitHub). Vérifier sur les vrais contextes `next-intl`, Tailwind et le thème courant :

1. `npm run lint`, `npm run blog:validate`, `npm run build`, `npm run blog:test:seo`.
2. Captures desktop `1440x900`, tablette `820x1180`, mobile `390x844` en clair et sombre.
3. Vérifier navigation clavier, ouverture du sommaire, surlignage d'ancres, CTA, copier, partage et impression.
4. Vérifier que les deux routes d'articles publiés n'ont pas bougé et que le Showcase n'apparaît ni dans le catalogue ni dans le sitemap.
5. Vérifier l'absence d'erreurs TypeScript / ESLint / hydratation / console.

## 6. Statut de validation et suite

- ✅ Tokens et composants **implémentés dans les fichiers livrés**.
- ✅ Page de démonstration fonctionnelle construite à `/fr/blog/showcase`.
- ✅ Les articles existants n'ont aucun changement dans ce lot.
- ✅ Métadonnée `robots: { index: false, follow: false }` pour la page Showcase.
- ⚠️ **Décision graphique en attente** : typographie et palette proposées, pas encore approuvées sur de vraies captures du site.
- ⚠️ **Intégration / build du dépôt complet non réalisés** dans le livrable isolé.

**Prochaine étape après validation du Showcase :** schéma JSON versionné + registre de blocs + moteur de rendu puis migration progressive de l'article internationalisation et du guide.


> **dev03 :** les composants résident dans `src/features/blog/design-system/`. Le Showcase est une référence en cours de validation visuelle ; les modules métier spécialisés ne sont pas encore tous portés.

**Composition dans le portfolio actuel :** le header/footer de navigation sont fournis par `src/app/(localized)/[locale]/layout.tsx` (composants `SiteHeader` et `SiteFooter`). Le design system fournit le hero, la barre de progression et la barre d’outils, sans reproduire le chrome global.
