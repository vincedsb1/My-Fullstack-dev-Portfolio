# Étape 1 — Inventaire et gel de la référence visuelle du blog

**Projet :** [My-Fullstack-dev-Portfolio](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio)  
**Branche auditée :** `main`  
**Révision figée :** [`1b217e7790ef3429ceadf37c176143122107a005`](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/tree/1b217e7790ef3429ceadf37c176143122107a005) — 21 octobre 2026 à 22:28 UTC  
**Date d'analyse :** 22 octobre 2026  
**Statut :** **Inventaire du code et des règles visuelles terminé** ; **captures de référence et validation graphique finale encore à faire**.  
**Portée :** articles existants et composants transverses susceptibles d'influencer leur rendu. **Aucune modification du dépôt.**

> **Important — degré de vérification.** Les constats ci-dessous proviennent des sources TSX, MDX, CSS, de la documentation et du code d'interaction du commit identifié. L'accès direct aux URL de production n'a pas permis d'obtenir de captures ni de faire une inspection de pixels réels. Les dimensions, couleurs et comportements notés sont des **valeurs du code**, pas des mesures obtenues sur un navigateur. Il serait inexact d'affirmer qu'une référence *visuelle photographique* est gelée : seul le **code de référence immuable** est figé à ce stade. Une procédure de capture reproductible est décrite en section 10.

## 1. Objet et résultat attendu

Cette première étape doit répondre aux questions suivantes **avant** de concevoir le système de composants et le JSON :

1. Quels éléments d'interface existent **réellement** dans chaque article ?
2. Quels éléments appartiennent à la structure fixe d'un article et lesquels sont éditoriaux ou exceptionnels ?
3. Quelles variantes et interactions ne doivent pas disparaître pendant la migration ?
4. Quelles caractéristiques visuelles observées dans le code peuvent servir de référence commune ?
5. Quelles divergences doivent être résolues à l'étape « design system » et quels choix nécessitent un arbitrage ?

**Livrables de ce document :** référentiel des sources, deux fiches d'articles, inventaire typologique, matrice comparative, signatures graphiques, comportements responsive et interactifs, proposition de référence visuelle, protocole de gel, critères de sortie de l'étape 1.

## 2. Sources examinées et traçabilité

### 2.1. Les deux URL cibles

| Repère | Article | URL |
|---|---|---|
| **A — GUIDE** | Comment décrocher son premier emploi de développeur en 2026 ? | https://vincent.desbrosses.net/fr/blog/guide-premier-emploi-developpeur |
| **B — SAAS** | Faut-il internationaliser son SaaS dès le lancement ? | https://vincent.desbrosses.net/fr/blog/internationaliser-saas-lancement |

### 2.2. Fichiers de référence du commit figé

Les URL ci-dessous pointent **sur le commit**, non sur la branche `main` qui évoluera.

| Identifiant | Chemin | Ce que le fichier permet de vérifier |
|---|---|---|
| `ROUTE` | [`src/app/(localized)/[locale]/blog/[slug]/page.tsx`](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/blob/1b217e7790ef3429ceadf37c176143122107a005/src/app/%28localized%29/%5Blocale%5D/blog/%5Bslug%5D/page.tsx) | Choix du renderer, enveloppe, JSON-LD, métadonnées |
| `DOCUMENT` | `src/app/components/blog/ArticleDocument.tsx` | Branchement HTML du guide ou MDX |
| `GUIDE-CONTENT` | [`src/app/guide-premier-emploi-developpeur/guideContent.ts`](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/blob/1b217e7790ef3429ceadf37c176143122107a005/src/app/guide-premier-emploi-developpeur/guideContent.ts) | Structure et contenu HTML complets du guide |
| `GUIDE-UX` | `src/app/guide-premier-emploi-developpeur/GuideInteractive.tsx` | Cases cochées, copie, toast, lecture, scroll |
| `GUIDE-STYLE` | `src/app/guide-premier-emploi-developpeur/guide.css` | Exceptions de style, mode sombre, icônes, impression |
| `SAAS-MDX` | [`src/content/blog/fr/internationaliser-saas-lancement.mdx`](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/blob/1b217e7790ef3429ceadf37c176143122107a005/src/content/blog/fr/internationaliser-saas-lancement.mdx) | Texte, ancrages, modules et ordre des sections |
| `SAAS-LAYOUT` | `src/app/components/blog/InternationalisationArticle.tsx` | Header, hero, auteur, corps, pied, suivant |
| `SAAS-STYLE` | [`src/app/components/blog/InternationalisationArticle.module.css`](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/blob/1b217e7790ef3429ceadf37c176143122107a005/src/app/components/blog/InternationalisationArticle.module.css) | Palette, typographie, grilles et responsive |
| `SAAS-MODULES` | `src/app/components/blog/InternationalisationArticleModules.tsx` | Mosaïque, demo, matrice, funnel, questionnaire |
| `SAAS-READING` | `src/app/components/blog/InternationalisationReading.tsx` | Sommaire, section active, barre de lecture, impression |
| `SHARED` | `src/app/components/blog/BlogComponents.tsx` | Breadcrumb, hero standard, footer standard, cartes |
| `PROSE` | `src/app/(localized)/[locale]/blog/blog.css` | Typographie/HTML génériques des articles MDX |
| `MDX` | `src/app/components/blog/MdxComponents.tsx` | Figure, diagramme, Callout, images, code, YouTube |
| `META-A` | `src/content/blog/fr/guide-premier-emploi-developpeur.mdx` | Frontmatter du guide, `renderer: guide` et absence de corps |
| `INDEX` | `src/app/components/blog/BlogIndex.tsx` | Présentation des cartes de l'index du blog |
| `THEME` | `src/app/ThemeContext.tsx` ; `public/theme-initializer.js` | Source commune des modes clair/sombre |
| `LAYOUT` | `src/app/(localized)/[locale]/blog/layout.tsx` | Import simultané `blog.css` + `guide.css` |

Références documentaires : `docs/blog/ARCHITECTURE.md` et `docs/blog/CREER_UN_ARTICLE.md`. Leurs chemins peuvent être retrouvés dans l'arbre du commit indiqué.

**Architecture vérifiée :**

```text
/fr/blog/[slug]             → route statique commune
├── renderer === "guide"    → HTML guide autonome + GuideInteractive + guide.css
├── slug SaaS spécifique     → InternationalisationArticle + MDX + modules + CSS Module
└── tout autre slug         → BlogSiteNavigation + ArticleHeader + MDX + ArticleFooter
```

**Conclusion structurelle :** les deux articles ne diffèrent pas uniquement par leur contenu. Ils contiennent **deux systèmes de page distincts**, en parallèle d'un troisième système « article standard » déjà présent dans le dépôt.

---

## 3. Fiche A — Guide du premier emploi

**Identifiant d'inventaire :** `A-GUIDE`  
**Source éditoriale réelle :** `guideContent.ts` (chaîne HTML) ; le fichier `.mdx` ne porte que le frontmatter.  
**Rendu :** `GuideInteractive`, qui insère le HTML et attache les interactions.  
**Identité visuelle lue dans le code :** guide pédagogique, **une colonne de lecture relativement étroite**, accents rouges et cartes pratiques avec touches bleu/ambre.

### 3.1. Carte de la page, dans l'ordre

```text
[Barre de progression fixe en haut, 4 px]
[Header sticky : nom / Blog / PDF / partager / thème]
[Conteneur principal ~700 px]
  [Breadcrumb : Portfolio / Blog / titre]
  [Sommaire repliable dans le flux, 10 entrées]
  [Hero éditorial]
    Catégorie en badge/pilule avec icône
    H1 + chapeau + deux paragraphes d'ouverture
    Auteur avec avatar « VD », dates, durée de lecture
    CTA « Commencer la lecture » + bouton « Enregistrer en PDF »
  [Corps de l'article : 10 sections principales]
    Chapitres numérotés 01→10, paragraphes, sous-titres,
    listes, cartes, badges, modèles de textes, tableau,
    citation/alerte, grille de conseils,
    liste d'erreurs, checklist interactive.
  [Bloc final « Pour faire avancer ta recherche »]
    Carte auteur + lien vers portfolio
[Footer : copyright / blog / portfolio / PDF]
[Toast de confirmation flottant]
[Bouton « Retour en haut » flottant sur mobile]
```

### 3.2. Sections de contenu à préserver

| Ordre | ID d'ancre existant | Titre H2 | Éléments structurants |
|---:|---|---|---|
| 01 | `les-trois-piliers` | Construire les trois piliers de sa crédibilité | 3 grandes cartes : CV, LinkedIn, portfolio ; icônes, listes |
| 02 | `developper-reseau` | Développer activement son réseau | liste de rôles en chips, modèle de message copiable |
| 03 | `trouver-opportunites` | Multiplier les opportunités | puces et citation/avertissement avec fond ambre |
| 04 | `creer-contenu` | Créer du contenu pour être visible | grille de cartes « idées de contenus », conseils |
| 05 | `preparer-entretiens` | Se préparer aux entretiens | 4 sous-sections RH, algorithmique, technique, architecture ; modèle de prompt copiable |
| 06 | `organiser-recherche` | Organiser sa recherche | tableau de suivi des candidatures avec statuts en badges |
| 07 | `rencontrer-professionnels` | Sortir des candidatures en ligne | texte et renvoi aux rencontres professionnelles |
| 08 | `dix-conseils` | Dix conseils supplémentaires pour se démarquer | grille **10 cartes** numérotées, chacune avec action |
| 09 | `erreurs-a-eviter` | Ce qu'il faut éviter | liste d'erreurs avec icônes négatives |
| 10 | `checklist-finale` | Ta checklist pour passer à l'action | **14 checkbox**, compteur, barre d'avancement, reset |

**Après les dix chapitres :** un **onzième H2**, « Pour faire avancer ta recherche », accompagne la conclusion/CTA. Il n'apparaît **pas** dans les dix liens du sommaire : cette distinction doit être conservée ou tranchée explicitement à l'étape 2.

### 3.3. Inventaire des éléments visibles du guide

| Identifiant | Élément | Quantité / variante observée | Données et comportement à conserver |
|---|---|---|---|
| `G-01` | Barre de progression | 1, en haut du viewport | progression au scroll ; distincte de la checklist |
| `G-02` | Navigation sticky | 1 | nom, lien blog, commandes thème/PDF/partage |
| `G-03` | Breadcrumb | 1 | Portfolio > Blog > article |
| `G-04` | Sommaire/accordéon | 1, **10 liens** | `<details>` repliable, ancres stables et chapitre actif |
| `G-05` | H1 + chapeau | 1 chacun | titre/description issus du frontmatter |
| `G-06` | Badge éditorial | 1 dans hero | catégorie + qualificatif développement web |
| `G-07` | Bloc auteur du hero | 1 | initiales VD, nom, métier, dates et durée |
| `G-08` | CTA de lecture + PDF | 2 dans hero | scroll à la première section, impression |
| `G-09` | H2 principaux | **11 au total** | 10 chapitres numérotés + conclusion |
| `G-10` | H3 | **22 balises H3 dans la source** | sous-titres, titres de cartes et auteur final |
| `G-11` | Texte riche | multiples | paragraphes, gras, liens, listes |
| `G-12` | Grandes cartes éditoriales | 3 (CV, LinkedIn, portfolio) | icône et contenu interne à puces |
| `G-13` | Chips/badges de rôle | 6 | CTO, Tech Leads, etc. |
| `G-14` | Modèles copiables | **2** | message LinkedIn, prompt IA ; bouton copier |
| `G-15` | Citation / avertissement | 1 `<blockquote>` | fond ambre, bordure gauche, titre |
| `G-16` | Grille d'idées de contenu | 1 grille à plusieurs cartes | titres / exemples courts |
| `G-17` | Tableau | **1** | colonnes entreprise, poste, statut, prochaine action |
| `G-18` | Grille « dix conseils » | **10 cartes** | numéro/titre, justification, action concrète |
| `G-19` | Liste d'erreurs | 1 | puces à icônes négatives |
| `G-20` | Checklist | **14 items** | valeur cochée, progression, reset |
| `G-21` | Carte auteur de fin | 1 | photo `/pp.jpg`, lien portfolio |
| `G-22` | Footer simple | 1 | copyright, blog, portfolio, PDF |
| `G-23` | Feedback toast | 1 | succès/échec copie, réinitialisation et sauvegarde |
| `G-24` | Retour en haut mobile | 1 | bouton flottant visible au-delà du seuil de scroll |
| `G-25` | Images éditoriales de contenu | **aucune illustration/figure d'article repérée** | le portrait final n'est pas une image de contenu |
| `G-26` | Formulaire avec envoi serveur | **aucun** | checklist locale uniquement |

**Mesures structurales du HTML inspecté :** 11 éléments `<section>` (dix avec un `id` et un bloc final non numéroté), 11 H2, 22 H3, 14 `<input>` checkbox, un `<details>`, un `<table>`, un `<blockquote>`, une image `<img>`. Les comptes portent sur les balises de la chaîne HTML à ce commit ; ils ne sont pas des mesures de composants React séparés.

### 3.4. Checklist : contrat de non-régression

- **14 identifiants existants**, de `chk-1` à `chk-14`. Ne pas les réattribuer par index sans migration des données utilisateur.
- État stocké dans `localStorage` sous **`vd_guide_checklist_v1`**.
- Progression affichée sous forme **« N/14 étapes terminées »** et barre de pourcentage.
- Les cases cochées changent aussi de présentation visuelle (texte barré).
- Bouton « Réinitialiser » avec confirmation, puis effacement de l'état.
- En cas de stockage indisponible, l'UI reste utilisable ; le guide peut afficher un retour d'erreur.
- La progression de checklist est **indépendante** de la barre de lecture.
- Les deux textes copiables utilisent des IDs distincts : `msg-template` et `prompt-template`.

### 3.5. Ancrages et navigation à figer

Le sommaire de dix liens cible exactement les IDs de la section 3.2. Le CTA de lecture cible `les-trois-piliers`. Conserver ces ancres après migration ; si un changement d'ID est nécessaire, gérer la compatibilité des anciens liens profonds.

---

## 4. Fiche B — Internationaliser un SaaS dès le lancement

**Identifiant d'inventaire :** `B-SAAS`  
**Source éditoriale réelle :** `internationaliser-saas-lancement.mdx`.  
**Rendu :** composant de page `InternationalisationArticle.tsx` + `ArticleDocument` + cinq modules de `InternationalisationArticleModules.tsx`.  
**Identité visuelle lue dans le code :** mise en page **éditoriale**, typographie expressive, rouge comme accent principal, touches **vert sauge** dans les illustrations et modules, sommaire latéral desktop.

### 4.1. Carte de la page, dans l'ordre

```text
[Skip link « Aller au contenu »]
[Header sticky : nom + point rouge / Le blog / PDF / partager / thème]
[Barre de progression fine sous le header]
[Breadcrumb : Portfolio / Blog / article]
[Hero éditorial sur 2 colonnes, desktop]
  Colonne gauche : eyebrow, H1 avec un mot rouge,
  chapeau, portrait d'auteur, date, temps de lecture,
  CTA « Explorer la réflexion »
  Colonne droite : illustration HTML/CSS
  « 6 × 6 », 36 cellules dont 12 mises en avant,
  sticker « Plus de valeur ? »
[Zone de lecture]
  [Sidebar sticky : sommaire 5 chapitres + note/CTA Iconise]
  [Corps MDX : prose + 5 modules]
    Introduction avec lettrine
    Mosaïque des six langues
    Chapitre 1 — facile techniquement + mise en exergue
    Chapitre 2 — complexité + démo langues + matrice
    Chapitre 3 — langues ≠ marchés + mise en exergue
    Chapitre 4 — mesurer la demande + funnel
    Chapitre 5 — décision + mise en exergue + questionnaire
  [Pied éditorial : punchline / partager / haut de page]
  [Carte auteur avec portrait]
  [Carte « Pour continuer la lecture » vers le guide]
[Colophon : auteur / tous les articles]
```

### 4.2. Sections et ancres réelles

| Ordre | ID de l'ancre MDX | Titre H2 | Élément remarquable |
|---:|---|---|---|
| 01 | `accessible` | Internationaliser n'a jamais été aussi accessible | réflexion sur l'accessibilité technique ; emphase |
| 02 | `complexite` | Sur Iconise, la complexité ne s'arrêtait pas aux traductions | démo langue interface/contenu, matrice 6 × 6 |
| 03 | `marches` | Six langues ne signifient pas six marchés conquis | emphase sur acquisition ≠ traduction |
| 04 | `demande` | Mesurer la demande plutôt que multiplier les langues | funnel de conversion conceptuel |
| 05 | `decision` | Alors, faut-il internationaliser dès le départ ? | emphase de position, questionnaire à 3 questions |

**Particularité :** les libellés du sommaire sont **raccourcis et codés séparément** dans `InternationalisationReading.tsx` (« La facilité technique », « La complexité cachée », etc.). Les IDs sont ajoutés via des `<span>` avant les H2, plutôt que sur les balises H2 elles-mêmes.

### 4.3. Inventaire des éléments visibles du SaaS

| Identifiant | Élément | Quantité / variante observée | Informations à préserver |
|---|---|---|---|
| `S-01` | Skip link accessible | 1 | saut vers `#article-body` |
| `S-02` | Header sticky | 1 | marque, blog, PDF, partager, thème |
| `S-03` | Barre de lecture | 1, fine | barre sous l'en-tête ; progression du corps |
| `S-04` | Breadcrumb | 1 | composant `ArticleBreadcrumbs` partagé |
| `S-05` | Hero éditorial | 1 | eyebrow, titre, extrait, auteur, CTA |
| `S-06` | Illustration hero | **1 construction CSS/HTML** | 6 × 6, 36 cases, 12 accentuées, sticker |
| `S-07` | Avatar auteur | 1 dans hero | portrait `/pp.jpg` |
| `S-08` | Sommaire desktop | 1 sidebar sticky, 5 entrées | chapitre actif au défilement |
| `S-09` | Sommaire mobile | 1 `<details>`, 5 entrées | déploiement/repliement, même destination |
| `S-10` | Note de sidebar | 1 | texte sur la valeur de l'international, lien Iconise |
| `S-11` | Chapitres H2 | **5** | numérotation CSS 01→05, bordures de section |
| `S-12` | Paragraphe d'ouverture | 1 style spécial | plus grand, lettrine flottante |
| `S-13` | Texte standard | multiples | paragraphes, gras, listes, lien Iconise, code inline `hreflang` |
| `S-14` | Blocs « emphase » | **3** | citation/position mise en avant avec ligne rouge |
| `S-15` | Mosaïque de langues | **1 module** | six tuiles ; tons neutres/sauge |
| `S-16` | Démo interface/contenu | **1 module interactif** | 2 sélecteurs indépendants + preview |
| `S-17` | Matrice de langues | **1 module interactif** | grille 36 cellules, navigation clavier, légende |
| `S-18` | Funnel de conversion | **1 module visuel** | 4 étapes, échelle illustrative et non métrique |
| `S-19` | Questionnaire de décision | **1 module interactif** | 3 questions oui/non, résultat contextuel, reset |
| `S-20` | Animation de lecture | 1 système | reveal sur modules/H2 via `IntersectionObserver` |
| `S-21` | Conclusion typographique | 1 | marqueur « La suite se mesure. » |
| `S-22` | Actions de fin | 1 groupe | partager, retour haut |
| `S-23` | Carte auteur | 1 | image, bio, lien vers les projets |
| `S-24` | Article suivant | 1 lien | actuellement **codé en dur** vers le guide |
| `S-25` | Colophon/footer | 1 | nom de l'auteur et tous les articles |
| `S-26` | Photographie éditoriale dans le corps | **aucune** | les visuels sont des modules React et HTML/CSS |
| `S-27` | Commentaires, téléchargement fichier, formulaire backend | **aucun** | aucun besoin à inventer dans la migration |

### 4.4. Les cinq modules spécifiques : fiche fonctionnelle

| Code `variant` | Nom dans le code | Type | Contrat fonctionnel et sémantique |
|---|---|---|---|
| `mosaic` | `LanguageMosaic` | illustration structurée | 6 tuiles avec langue + phrase ; article lisible sans interaction |
| `demo` | `LanguagePairDemo` | widget interactif | deux sélecteurs pour langue interface/contenu, six options chacun ; sortie mise à jour ; valeurs initiales français/japonais |
| `matrix` | `LanguageMatrix` | tableau interactif | 6 × 6 ; cellule active, affichage des deux langues ; 12 cases illustratives ; boutons, clavier flèches/Home/End |
| `funnel` | `AcquisitionFunnel` | schéma conceptuel | visiteurs → inscriptions → projets démarrés → clients payants ; **largeurs non liées à de vrais taux** |
| `decision` | `DecisionTree` | questionnaire | 3 réponses oui/non ; recommandation différente selon le profil ; bouton recommencer |

**Précaution éditoriale majeure :** les **12 cases mises en évidence de la matrice sont une illustration**, pas la liste certifiée des douze tests réellement exécutés. Le composant le précise déjà. Ne pas transformer ce repère graphique en affirmation de couverture de tests.

### 4.5. Comportements de lecture

- La barre de progression mesure le déplacement dans `#article-body`, et non l'ensemble de la page (à la différence du guide).
- Le sommaire observe cinq IDs définis en dur ; il met à jour `aria-current="location"`.
- Sur mobile, le sommaire devient un `<details>` repliable ; le clic ferme le panneau.
- Les ancres se déplacent en douceur, sauf préférence de mouvement réduit.
- L'animation de révélation ne fait pas partie du contenu essentiel : les textes et modules doivent rester visibles sans animation.
- L'article suivant doit rester un lien valide après migration, mais son choix ne doit plus dépendre du contenu codé en dur.

---

## 5. Matrice comparative exhaustive des familles d'interface

**Légende :** **✓** présent dans l'article ; **—** absent du rendu publié ; **var.** présent avec une forme visuelle très différente ; **lib.** bibliothèque déjà disponible dans le dépôt, sans occurrence dans ces deux pages.

| Famille | GUIDE | SAAS | Catégorie future | Décision d'inventaire |
|---|:---:|:---:|---|---|
| Header blog sticky | ✓ | ✓ | **FIXE** | deux rendus à unifier |
| Fil d'Ariane | ✓ | ✓ | **FIXE** | mêmes segments sémantiques |
| Barre de progression lecture | var. | var. | **FIXE** | modes de calcul différents à arbitrer |
| Bouton thème | ✓ | ✓ | **FIXE** | un seul contrôle réutilisable |
| Partage | var. | var. | **FIXE** | un seul composant + feedback |
| PDF / impression | ✓ | ✓ | **FIXE** | rendu print unifié |
| Lien d'évitement | — | ✓ | **FIXE** | généraliser |
| Sommaire | ✓ | ✓ | **FIXE** | auto-généré depuis les sections |
| Sommaire collant desktop | — | ✓ | **FIXE** | variante par viewport, non par article |
| Sommaire mobile repliable | ✓ | ✓ | **FIXE** | même comportement |
| Hero/H1/chapeau | ✓ | ✓ | **FIXE** | contenu configurable, style unique |
| Catégorie/eyebrow | var. | var. | **FIXE** | style unique ; sous-libellé éditorial optionnel |
| Avatar/bio dans hero | ✓ | ✓ | **FIXE** | même composant, valeur de repli |
| Dates et durée | ✓ | ✓ | **FIXE** | frontmatter/JSON ; dates réelles |
| CTA « commencer » | ✓ | ✓ | **FIXE** | action/texte configurables |
| Illustration de hero | — | ✓ | **SLOT** | optionnelle ; pas de layout alternatif complet |
| Colonnes lecture + sommaire | — | ✓ | **FIXE** | un seul comportement responsive |
| Pied d'article | ✓ | ✓ | **FIXE** | actions, auteur, liens communs |
| Carte auteur finale | ✓ | ✓ | **FIXE** | rendre systématique ou par règle éditoriale commune |
| Lien vers article suivant | — | ✓ | **FIXE conditionnel** | depuis catalogue d'articles |
| Footer / colophon | ✓ | ✓ | **FIXE** | éviter pied HTML ad hoc |
| Bouton retour haut | ✓ | ✓ | **FIXE** | apparence selon viewport, règle commune |
| H2/H3, paragraphes, gras, liens | ✓ | ✓ | **BLOC** | styles prose uniques |
| Titres de chapitre numérotés | ✓ | ✓ | **BLOC** | numérotation standardisée |
| Liste à puces | ✓ | ✓ | **BLOC** | même indentation/couleur |
| Liste numérotée éditoriale | — | — | **BLOC disponible** | support futur ; ne pas confondre sommaire |
| Citation/blockquote | ✓ | — | **BLOC** | variante neutre/citation |
| Emphase éditoriale | — | ✓ | **BLOC** | style propre, distinct d'une vraie citation |
| Callout/avertissement | ✓ | — | **BLOC** | `Callout` existant comme base |
| Cartes de contenu | ✓ | ✓ | **BLOC** | structure réutilisable, variantes limitées |
| Grille de cartes | ✓ | ✓ | **BLOC** | colonnes responsive uniformisées |
| Chips/badges dans le texte | ✓ | — | **BLOC** | composant standard |
| Snippet texte copiable | ✓ | — | **BLOC** | un bouton copie accessible |
| Tableau de données classique | ✓ | — | **BLOC** | adaptatif sur mobile |
| Liste avec icônes oui/non | ✓ | — | **BLOC** | possibilité de liste sémantique réutilisable |
| Checklist persistante | ✓ | — | **BLOC interactif** | 14 IDs et stockage à conserver |
| Mosaïque 6 langues | — | ✓ | **CUSTOM** | composant spécifique |
| Démo de deux langues | — | ✓ | **CUSTOM** | logique React propre |
| Matrice sélectionnable 6 × 6 | — | ✓ | **CUSTOM** | tableau métier spécifique |
| Funnel de conversion illustratif | — | ✓ | **BLOC ou CUSTOM** | générique possible, à confirmer étape 2 |
| Questionnaire / décision | — | ✓ | **CUSTOM** | moteur React et données validées |
| Figure + légende | — | — | **lib. / BLOC futur** | `Figure` disponible en MDX standard |
| Diagramme SVG/PNG | — | — | **lib. / BLOC futur** | `Diagram` disponible, pas utilisé ici |
| Vidéo YouTube | — | — | **lib. / BLOC futur** | `YouTubeEmbed` disponible, pas utilisé ici |
| Bloc de code coloré | — | — | **lib. / BLOC futur** | `pre` + coloration déjà en place |
| Formulaire / collecte de réponses | — | — | **hors périmètre** | questionnaire ne soumet pas de données |

**Classification :**

- **FIXE :** comportement et style déterminés par le site ; seules certaines valeurs de texte et médias changent.
- **SLOT :** emplacement visuel prévu par le layout fixe, facultatif.
- **BLOC :** famille réutilisable alimentée par les données JSON.
- **CUSTOM :** module React conservé pour une interaction ou représentation très spécifique, mais inséré dans un cadre de surface et d'espacement commun.
- **lib. :** capacité du blog générique à conserver, **non observée dans ces deux articles**.

---

## 6. Photographie des styles actuels : signatures à comparer

**Cette section fige les règles CSS de la révision auditée ; elle ne prescrit pas encore les tokens finaux.**

### 6.1. Couleurs et surfaces

| Aspect | GUIDE — code existant | SAAS — code existant | Écart significatif |
|---|---|---|---|
| Fond principal clair | `bg-neutral-100` dans l'enveloppe guide ; header blanc | `--paper: #f7f7f5` | neutre froid vs papier chaud |
| Fond principal sombre | `dark:bg-neutral-900` dans l'enveloppe guide | `--paper: #171817` | deux profondeurs de fond |
| Surface claire | blanc / neutral-50 / neutral-100 selon bloc | `--surface: #fff` ; `--soft: #eeeee9` | styles de cards différents |
| Texte principal clair | neutral-900, CSS `#171717` | `--ink: #20201f` | contrastes proches mais non identiques |
| Texte de paragraphe clair | `#404040` (guide.css), neutral-600 | `--body: #50504d` | lecture perçue différente |
| Texte secondaire | neutral-500/600, quelques overrides | `--muted: #73736e` | 2 systèmes sémantiques |
| Bordure | neutral-200 / neutral-800 | `--line: #e2e2dd` | chaleur et contraste distincts |
| Accent rouge | classes `red-500`, `red-600`, etc. ; `#dc2626` dans CSS | `--red: #da302c` ; sombre `#ff8e84` | teintes et états non alignés |
| Accent secondaire | bleu et ambre dans des blocs spécifiques | `--green: #366f4f`, `--sage: #edf3ec` | couleur secondaire non codifiée |
| Rayon de cartes | `rounded-xl`, `rounded-2xl`, `rounded-3xl` | surtout 12–18 px, certains rayons spéciaux | échelle de radius incohérente |

**Éléments remarquables SAAS :** thème sombre explicitement défini avec `--paper: #171817`, `--surface: #202220`, `--ink: #f2f2ed`, `--body: #c0c1b9`, `--line: #343831`, `--sage: #26392c`, `--green: #a6cfaf`. Le guide repose surtout sur des classes `dark:*` et quelques styles spécifiques : il n'utilise pas ces tokens.

### 6.2. Typographie, échelle, densité

| Aspect | GUIDE | SAAS | Point à figer pour la comparaison |
|---|---|---|---|
| Famille principale | Inter global (`next/font/google`), avec fontes Phosphor pour les icônes | Inter global ; certains chiffres en monospace et lettrine en Georgia | une seule police d'interface ; traitements éditoriaux exceptionnels autorisés |
| Hero H1 | `text-4xl` / `md:text-5xl`, `font-extrabold` | `clamp(42px, 4.75vw, 68px)`, poids 750, tracking `-0.065em` ; à 600 px max : `clamp(34px, 9.6vw, 54px)` | hiérarchie et impact très différents |
| Texte d'introduction | `text-lg` à `text-xl` | `--dek` 17 px desktop / 15 px petits écrans | tailles différentes |
| Corps | `.editorial-content p`, hauteur ligne `1.75` | `.prose` 16 px, hauteur ligne `1.9`, 15 px sous 600 px | rythme et lisibilité différents |
| H2 | guide `1.5rem`, `1.875rem` dès 768 px | 31 px desktop / 27 px sous 600 px, bordure supérieure et numérotation | style différent de la structure des titres |
| H3 | guide `1.25rem` (avec exceptions) | 25 px pour titres de modules ; H3 du corps moins utilisés | taille et traitement différents |
| Chapitres | numéros HTML séparés | compteur CSS automatique `01...05` | source de vérité différente |
| Premières lettres | standard | grande lettrine flottante de 72 px, 66 px mobile | signature visuelle distinctive |
| Petites étiquettes | principalement Tailwind `text-xs` / `text-sm` | plusieurs labels de 9, 10, 11 px | **risque de lisibilité** à ne pas copier aveuglément |
| Styles « emphase » | blockquote d'avertissement ponctuel | texte 22 px avec bordure rouge, 20 px mobile | composant réutilisable intéressant |

### 6.3. Largeurs, grille et navigation

| Aspect | GUIDE | SAAS |
|---|---|---|
| Enveloppe globale du contenu | `max-w-7xl` extérieur mais `article max-w-[700px]` | `max-width: 1248px` pour la page |
| Largeur du texte | ~700 px | colonne de lecture jusqu'à ~760 px, paragraphes limités à ~652 px |
| Hero | essentiellement une colonne éditoriale | grille `1.65fr 1fr`, illustration à droite ; 1 colonne sous 600 px |
| Sommaire | dans le flux, `<details>` | sidebar de ~210 px desktop, puis sommaire repliable à `max-width: 900px` |
| Espaces hero | `mb-16` et utilitaires de flux | padding bas 72 px desktop / 40 px sous 600 px |
| Espaces entre chapitres | marge des sections et H2 selon guide.css | H2 marge haute 72 px / 52 px sous 600 px |
| Header | 64 px (`h-16`), sticky | 76 px desktop / 64 px sous 600 px, sticky |
| Barre de lecture | fixe en haut, **4 px** | au bas de la navigation, **2 px** |

**Responsive du SAAS lu dans CSS :** adaptations à `max-width: 1100px`, `900px`, `600px` et une règle `min-width: 1400px`. Sur les petits écrans, le hero passe sur une colonne, le bloc PDF du header est masqué, le sommaire devient repliable, les mosaïques passent à deux colonnes, les contrôles de démo s'organisent autrement, la matrice réduit ses cellules et le questionnaire est resserré. Dans le guide, les utilitaires responsive Tailwind et `guide.css` gouvernent la mise en page ; il n'existe pas de grilles/mesures partagées avec le SaaS.

### 6.4. Icônes, illustrations, animations

| Sujet | GUIDE | SAAS | Décision provisoire |
|---|---|---|---|
| Bibliothèque d'icônes dans ces pages | polices locales Phosphor (sous-ensembles) | `lucide-react` | choisir une bibliothèque commune au lot design system ; éviter un remplacement gratuit avant comparaison |
| Hero artwork | absent | illustration responsive avec 36 cellules ; sticker pivoté | **conserver la composition** comme cas de test du slot graphique |
| Modules éditoriaux | cartes et listes pratiques | surfaces en papier/sauge, graphiques et démos | préserver les compositions propres dans le cadre commun |
| Animations | scroll, hover et états check/copie | animation d'entrée du hero + `IntersectionObserver` sur modules/H2 + transitions | respecter `prefers-reduced-motion` ; priorité à la lisibilité |
| Mode sombre | utilitaires `dark:*` + corrections CSS | variables `.dark` du module | comparer les deux en clair ET en sombre |
| Impression | `@media print` dans `guide.css` | `@media print` dans CSS Module | figer un protocole unique et valider contenu + pagination |

**Attention :** le hero du SAAS applique `title.split("internationaliser")` pour colorer un mot. Il s'agit d'une dépendance à la rédaction, **pas d'un vrai style générique**. Le futur système devra exprimer l'accentuation dans des données structurées ou éviter l'effet si inutile.

---

## 7. Ce qui constitue le « style de référence » recommandé

### 7.1. Proposition, non validation implicite

Je recommande de prendre **le SaaS comme référence de direction artistique** pour l'enveloppe du blog, **sans reprendre à l'identique toutes ses décisions CSS**. Il présente une composition plus aboutie du point de vue éditorial : largeur maîtrisée, hiérarchie de texte marquée, sommaire contextualisé, hero expressif et modules intégrés dans un rythme de lecture cohérent.

**Ce choix reste une proposition soumise à validation visuelle**, car les captures des pages en production n'ont pas été effectuées. Le gel du code permet toutefois de tracer précisément cette recommandation.

### 7.2. Éléments à conserver comme références positives

| Référence | Origine privilégiée | Justification | Statut |
|---|---|---|---|
| Fond « papier » neutre légèrement chaud | SAAS | donne une signature éditoriale sobre | **PROPOSÉ** |
| Rouge comme accent de marque | Commun aux deux | meilleure continuité avec le portfolio | **PROPOSÉ** |
| Grille de lecture avec sommaire latéral desktop | SAAS | lecture et repérage sur articles longs | **PROPOSÉ** |
| Sommaire repliable mobile | Les deux | continuité des interactions et gain d'espace | **À CONSERVER** |
| Titres de chapitres numérotés | Les deux | repères de lecture ; même règle pour tous | **À CONSERVER** |
| Hero à hiérarchie forte | SAAS | donne une identité à la page sans multiplier les variantes | **PROPOSÉ** |
| Slot d'artwork optionnel dans le hero | SAAS | conserve les compositions custom quand elles enrichissent le fond | **À CONSERVER** |
| Cartes de conseils, chiffres, checklists, snippets | GUIDE | richesse du contenu pratique et réutilisabilité | **À CONSERVER** |
| Cartes auteur et liens de continuation | SAAS + GUIDE | sortie de lecture cohérente et navigation utile | **À CONSERVER** |
| Mode sombre, impression, partage, progressions | Les deux | attentes fonctionnelles transverses | **À CONSERVER** |
| Variantes de surfaces pour les modules | SAAS + GUIDE | permet des composants personnalisés sans rompre le système | **PROPOSÉ** |

### 7.3. Anti-références : ne pas copier comme conventions globales

- **Trop petites polices :** plusieurs labels du SaaS font 7 à 11 px dans certaines compositions ou breakpoints. Elles doivent être réévaluées pour la lisibilité, pas transformées en tokens globaux.
- **Incohérence de marque :** portrait réel contre initiales, Phosphor contre Lucide, badges rouges de plusieurs nuances.
- **Hero dépendant du texte exact :** découpage du mot « internationaliser » en TSX.
- **Pages parallèles :** styles complets du hero, du footer et de la navigation à l'intérieur d'un article custom.
- **Couleurs métier qui deviennent arbitraires :** le vert sauge peut soutenir une illustration de l'internationalisation, mais ne doit pas s'imposer à tous les articles.
- **Animations au détriment de l'accès au contenu :** révélation ne doit pas masquer un titre si l'API d'animation ne fonctionne pas.
- **Styles « créatifs » à usage universel :** lettrine, rotation du sticker, grand chiffre de fond et colonnes spéciales sont des options éditoriales, pas des obligations de chaque article.

### 7.4. Périmètre visuel proposé pour la maquette de référence future

Le modèle de référence commun devrait présenter :

```text
┌ Header du blog (navigation et outils identiques) ──────────────────────┐
│ Progression de lecture                                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Breadcrumb                                                             │
│ HERO = eyebrow + H1 + chapeau + auteur + dates + CTA                   │
│        [slot d'illustration optionnel, dimensionné par le layout]      │
├───────────────────┬────────────────────────────────────────────────────┤
│ Sommaire desktop  │ Texte / H2 / paragraphes / listes / cartes          │
│ sticky            │ Citations / callouts / tableaux / médias / code     │
│                   │ Checklist / questionnaire / modules custom React    │
├───────────────────┴────────────────────────────────────────────────────┤
│ Partager / haut de page / carte auteur / article suivant si présent   │
│ Footer blog commun                                                     │
└────────────────────────────────────────────────────────────────────────┘
```

Cette composition est une **direction de référence à préparer**, pas le nouveau design system livré. Les valeurs définitives des tokens et l'UI de la page de démonstration relèvent des étapes suivantes.

---

## 8. Comportements et états à capturer pour éviter les régressions

| Élément | État de base | Variantes / états à figer par capture ou test | Contrat de qualité |
|---|---|---|---|
| Header | en haut de page | après scroll, mobile, thème sombre | lisible, actions accessibles |
| Hero | bureau clair | bureau sombre, mobile clair/sombre | H1, extrait, auteur jamais tronqués |
| Sommaire | repos | ouvert/replié, chapitre actif, navigation clavier | ancres exactes, repère actif |
| Carte | repos | hover, focus clavier, mobile | contraste, pas d'élément coupé |
| Partager | repos | après copie, API de partage disponible/absente | feedback clair, pas de doublon |
| Impression | navigateur | aperçus PDF A4, sections longues et modules | contenu lisible, contrôles inutiles cachés |
| Guide : checklist | 0/14 | cases 1 et 14, 14/14, reload, reset, erreur stockage | état persistant et progression exacte |
| Guide : copies | repos | chacun des 2 boutons, toast visible | texte copié intégralement |
| Guide : tableau | desktop | petit écran, overflow horizontal | aucune donnée invisible sans possibilité de scroll |
| SaaS : hero artwork | desktop | mobile et sombre | 36 cellules et sticker sans débordement |
| SaaS : demo langues | fr/ja | fr/en, ja/fr, sélectionner deux langues identiques | preview cohérente avec les deux sélecteurs |
| SaaS : matrice | fr/ja | cases surlignées/non surlignées, flèches/Home/End | focus visible, légende correctement nuancée |
| SaaS : funnel | 4 étapes | mobile, impression, réduit animations | taux ne doivent pas apparaître comme données réelles |
| SaaS : questionnaire | non répondu | 3 oui, 3 non, réponses mixtes, reset | résultat déterministe, annonce accessible |
| SaaS : article suivant | carte visible | clic et retour, mobile | bonne URL, bonne langue et statut publié |
| Theme | système | bascule clair/sombre, reload | persistance / `prefers-color-scheme` |
| Reduced motion | animation standard | `prefers-reduced-motion: reduce` | pas d'animation obligatoire |

**Points de vigilance :** des labels et plusieurs contrôles sont plus petits sur mobile dans le CSS SaaS. La campagne visuelle devra vérifier les cibles tactiles, le focus et les contrastes avec l'apparence réellement rendue.

---

## 9. Divergences objectivées et décisions à prendre lors de l'étape 2

| ID | Problème constaté | Évidence | Résolution souhaitée | Priorité |
|---|---|---|---|---|
| `D-01` | Trois rendus de page | condition `renderer === 'guide'`, slug SaaS, fallback standard | un seul shell d'article | **P0** |
| `D-02` | Deux identités de header | HTML guide vs TSX SaaS | un header commun avec mêmes actions | **P0** |
| `D-03` | Deux styles de hero | texte seul vs illustration 2 colonnes | hero commun avec slot facultatif | **P0** |
| `D-04` | Deux sommaires et logiques | HTML/JS guide vs React SaaS | sommaire produit depuis titres/IDs des données | **P0** |
| `D-05` | Deux méthodes de calcul progression | page entière vs corps | convention commune, mesure stable | **P0** |
| `D-06` | Deux largeurs/rythmes | 700 px vs 760/652 px | une largeur de lecture et une échelle d'espaces | **P0** |
| `D-07` | Deux types de footer | copyright simple vs colophon + carte | pied commun ; article suivant conditionnel | **P0** |
| `D-08` | Palette non centralisée | Tailwind et variables CSS SaaS | tokens sémantiques light/dark | **P0** |
| `D-09` | Styles dépendants du sujet | vert sauge et maquette « 6 × 6 » | encadrer les customs ; pas de CSS global arbitraire | P1 |
| `D-10` | Sommaire SaaS figé | tableau de 5 IDs dans `InternationalisationReading` | extraction automatique de sections | P1 |
| `D-11` | Lien vers guide codé en dur | `nextArticle` du SaaS | sélection depuis catalogue publié | P1 |
| `D-12` | Icônes hétérogènes | Phosphor vs Lucide | standardiser, vérifier poids et cohérence | P1 |
| `D-13` | Tailles de légendes trop faibles | 9–11 px dans CSS SaaS | élargir échelle typographique accessible | P1 |
| `D-14` | Checklist encore en HTML impératif | `GuideInteractive.tsx` + `innerHTML` | composant React à données JSON, sans perte de stockage | **P0 fonctionnel** |
| `D-15` | Accent H1 lié à un mot précis | `title.split("internationaliser")` | segments ou highlight déclaratif | P1 |
| `D-16` | Même CSS guide chargé dans le blog entier | `blog/layout.tsx` | isoler et supprimer après migration | P2 |
| `D-17` | Visuel actuel sans snapshots | absence de captures vérifiées dans cet audit | capturer baseline à révision figée | **P0 avant implémentation** |

**P0** = bloquant pour passer à une migration sans risque ; **P1** = essentiel pour cohérence et qualité ; **P2** = dette technique à retirer après migration.

---

## 10. Protocole de « gel visuel » reproductible

Cette procédure fait partie du livrable de l'étape 1. Elle définit ce qui doit être conservé pour pouvoir comparer « avant » et « après » lors des étapes suivantes.

### 10.1. Quelle version capturer ?

**Priorité : le rendu local du commit `1b217e7790ef3429ceadf37c176143122107a005`**, avec dépendances figées par le lockfile de cette révision. Ne pas utiliser `main` au moment de la future migration comme baseline : celle-ci pourrait déjà différer.

La production peut être capturée **en complément**, mais il faut archiver sa date et, si possible, son commit de déploiement. Sans vérification du commit effectivement déployé, ne jamais considérer la capture de production comme une preuve du comportement du commit audité.

### 10.2. Conditions de capture

- Navigateur : Chromium récent ; relever version et système d'exploitation.
- `deviceScaleFactor` : 1 pour une comparaison simple et stable.
- Viewports proposés : **1440 × 900** (desktop), **1024 × 768** (tablette), **390 × 844** (mobile), **320 × 700** (mobile étroit / stress test).
- Deux thèmes pour chaque article : **clair** et **sombre** ; stocker le mode explicitement, ne pas laisser l'OS décider pendant le benchmark.
- Attendre les polices et images avant capture ; privilégier les animations désactivées pour des captures reproductibles.
- Captures **full page** pour la structure et **par élément** pour les variantes/interactions.
- Ne pas capturer seulement le premier écran : archiver également les sections centrales, les modules et les pieds d'article.
- Documenter la présence éventuelle d'un état personnalisé dans `localStorage` ; la baseline initiale de la checklist est `0/14`.
- Relever les erreurs console/hydratation, images cassées et éventuels débordements horizontaux.

### 10.3. Arborescence suggérée des captures

```text
docs/blog/reference-visuelle/
  README.md                       # commit, protocole, navigateurs, observations
  2026-10-22-commit-1b217e7/
    guide/
      desktop-light-full.png
      desktop-dark-full.png
      tablet-light-full.png
      mobile-light-full.png
      mobile-dark-full.png
      mobile-320-light-full.png
      toc-open-mobile.png
      checklist-0.png
      checklist-partial.png
      checklist-14.png
      copy-feedback.png
      print-a4.pdf
    internationalisation/
      desktop-light-full.png
      desktop-dark-full.png
      tablet-light-full.png
      mobile-light-full.png
      mobile-dark-full.png
      mobile-320-light-full.png
      toc-active-desktop.png
      toc-open-mobile.png
      language-demo.png
      language-matrix-active.png
      decision-answered.png
      article-footer.png
      print-a4.pdf
```

Les noms décrivent **les fichiers attendus**, pas des fichiers déjà générés. Ajouter des captures d'états au besoin, notamment pour les menus et transitions.

### 10.4. Fiche de traçabilité à associer aux captures

Pour chaque capture, documenter au minimum :

| Champ | Exemple attendu |
|---|---|
| `article` | `guide-premier-emploi-developpeur` |
| `commit` | `1b217e7790ef3429ceadf37c176143122107a005` |
| `source` | `localhost:3006` / production (avec mention du déploiement) |
| `viewport` | `1440x900` |
| `deviceScaleFactor` | `1` |
| `theme` | `light` |
| `motion` | `reduced` pour snapshots déterministes |
| `state` | `toc=open`, `checklist=partial`, etc. |
| `browser` | nom + version |
| `capturedAt` | ISO 8601 |
| `notes` | anomalie visuelle éventuelle |

### 10.5. Critères de comparaison après migration

Ne pas exiger un pixel-perfect intégral : **le chantier vise justement à uniformiser le style**. Le gel sert à détecter des **pertes de contenu ou de fonction**, à vérifier que les customs restent exploitables et à objectiver le résultat.

**Comparaison obligatoire :**

1. Tous les chapitres, titres, paragraphes, liens et modules de contenu sont présents.
2. Chaque bloc conserve son information, sa sémantique et, si nécessaire, son interactivité.
3. Les éléments partagés (header, hero, fil d'Ariane, sommaire, corps, pied de page) ont le **même langage visuel** dans les deux articles migrés.
4. Les variantes mobile, sombre, impression et reduced motion fonctionnent.
5. Le guide conserve les 14 états de checklist et les modèles copiables ; l'article SaaS conserve les cinq modules et leurs comportements.
6. Les URLs et ancres historiques restent accessibles ; pas de régression de SEO, de titre H1 unique ou d'accessibilité.

---

## 11. Critères de sortie de l'étape 1

| Critère | État | Preuve / suite nécessaire |
|---|---|---|
| Révision source identifiée et immuable | **FAIT** | SHA et liens ci-dessus |
| Inventaire des deux shells (en-tête, hero, corps, footer) | **FAIT** | sections 3 et 4 |
| Familles de composants recensées et classées | **FAIT** | section 5 |
| Modules interactifs décrits avec état et contrat | **FAIT** | sections 3.4, 4.4 et 8 |
| Règles CSS existantes consignées | **FAIT** | section 6 |
| Direction de référence éditoriale proposée | **PROPOSÉ** | section 7 ; à approuver à l'étape 2 |
| Captures desktop/tablette/mobile dans les deux thèmes | **À FAIRE** | section 10 ; nécessitent exécution navigateur |
| Captures d'états interactifs et impression | **À FAIRE** | section 10 |
| Validation des captures sur le commit local | **À FAIRE** | comparer commit local / éventuelle production |
| Choix de design final et tokens cibles | **HORS ÉTAPE 1** | relève de l'étape 2 |

### Conclusion de cette étape

L'inventaire technique est suffisamment précis pour **préparer le design system** : on dispose de la taxonomie, des modules à préserver, des divergences visuelles et d'une direction éditoriale recommandée.

**La référence graphique finale ne doit cependant pas être déclarée « validée » avant constitution des captures et vérification des états.** La prochaine action concrète pour achever intégralement cette étape est donc de produire les snapshots du commit figé selon la section 10, puis d'entériner le choix de direction graphique : **esthétique éditoriale du SaaS pour le shell, richesse fonctionnelle du guide dans les blocs.**

Aucun fichier du dépôt n'a été modifié dans le cadre de cet audit. Le présent document est le compte rendu de l'inventaire et le protocole de gel.
