# Audit contradictoire — Design system et Showcase du blog

**Date :** 22 octobre 2026  
**Dépôt cible :** `vincedsb1/My-Fullstack-dev-Portfolio`, branche `main`, commit de référence `1b217e7790ef3429ceadf37c176143122107a005`  
**Livrable audité :** `blog_design_system_showcase_etape2.zip` (9 fichiers, sources TSX/CSS, documentation et aperçu HTML)  
**Statut :** **PROTOTYPE ACCEPTABLE POUR REVUE VISUELLE — NON VALIDÉ COMME DESIGN SYSTEM DE PRODUCTION.**

## Actualisation dev04

Le présent document est l’audit historique du ZIP. Le statut ci-dessus décrit ce prototype, pas la consolidation courante. Le bilan vérifié est dans [AUDIT_FINAL_ETAPES_1_2_3.md](AUDIT_FINAL_ETAPES_1_2_3.md).

| Réserve historique | État consolidé |
|---|---|
| P0-01 / P1-09 / P1-10 — démos concurrentes | une checklist réutilisée partout, vrai questionnaire et cinq widgets historiques dans le registre ; démos concurrentes supprimées |
| P0-02 / P0-04 — absence de rendu et de recette | build local, navigateur, référence CI téléchargée, captures des quatre largeurs/deux thèmes, états et PDF ; résultats consignés dans l’audit final |
| P0-03 — contrat JSON absent | schéma v1, validation runtime, types et tests ; contenu riche, cartes imbriquées et registre contrôlé |
| P1-01 — variantes manquantes | tons implémentés, variantes info/action effectives et visibles ; contrôle axe des variantes ouvertes |
| P1-02 / P1-03 — code et médias | coloriseur MDX réutilisé au serveur, copie exacte, images réelles et YouTube au clic dans la fixture |
| P1-04 — interface EN | labels du shell consolidés et vérifiés par pilote synthétique EN ; aucune traduction d’article ajoutée ; widgets SaaS toujours FR |
| P1-05 / P1-06 / P1-08 — navigation et chrome | TOC depuis les sections JSON, articles liés publiés, header/footer et boutons du portfolio réutilisés |
| P1-07 — clavier, ancres, impression | IDs complets validés, focus des sections, stockage refusé, PDF clair depuis les deux thèmes et restauration des accordéons testés |
| P2-01 — fichier UI central | petit catalogue serveur conservé ; code coloré séparé pour sa dépendance serveur ; pas de fragmentation systématique |
| P2-02 / P2-03 — tokens et aperçu autonome | CSS comme source des valeurs ; documentation réalignée ; HTML ancien explicitement non contractuel |

La mesure de performance de l’accueil reste rouge et est analysée séparément. Ne pas présenter la CI globale comme verte. Les articles MDX n’ont pas été convertis.

## 1. Périmètre et méthode

Analyse de l'intégralité des fichiers de l'archive : route `showcase`, composants `BlogUI.tsx`, contrôles de lecture, démonstrations interactives, page Showcase, CSS, documentation et aperçu autonome. Confrontation aux sources des deux articles et à la documentation de l'étape 1.

**Contrôles réellement réalisés :**

- Comparaison binaire ZIP ↔ arborescence du livrable : **9/9 fichiers identiques**.
- Analyse syntaxique TypeScript/TSX : **5 fichiers analysés ; 0 erreur de parsing**. Cela ne constitue **pas** un `tsc --noEmit` et n'assure ni la validité des types importés, ni un build Next.js.
- Parsing CSS (`tinycss2`) : **202 règles de premier niveau, 0 erreur de parsing**. Cela ne prouve pas un rendu correct.
- Inspection structurelle de l'aperçu HTML : **1 H1, 8 H2, 0 ID dupliqué, 0 ancre interne manquante**, 3 cases à cocher, 3 groupes de questions.
- Contraste des couleurs principales calculé : accent rouge clair sur fond papier **5,18:1**, texte blanc sur bouton rouge **5,56:1**, accent sombre sur fond sombre **8,02:1**, texte secondaire clair sur fond papier **4,71:1**. Ces résultats ponctuels ne remplacent pas un audit exhaustif de tous les états, tailles et composants.
- Inspection du code du dépôt `main` pour la route blog, les renderers historiques et l'infrastructure SEO.

**Contrôles non réalisés :** aucune compilation du dépôt complet, pas de captures fiables dans le navigateur Next.js, pas d'audit automatisé axe ou Lighthouse, pas de test de régression sur les deux articles, pas de test de performance réelle. Les tentatives d'ouverture directe des pages publiées et de chargement Chromium local ont été bloquées dans l'environnement d'audit. Ne pas présenter l'apparence et les interactions comme vérifiées en production.

## 2. Ce qui est réellement solide

1. **Isolation raisonnable :** le CSS est essentiellement placé sous `.blog-ds`, les fichiers TSX sont ajoutés sans réécrire les articles publiés, et le thème de l'application est réutilisé.
2. **Séparation partielle serveur/client :** articles, cartes, citations et wrappers de modules sont des composants serveur ; sommaire, progression et interactions sont isolés côté client.
3. **Structure de route adaptée :** `/fr/blog/showcase` est une route statique explicite, exclue de la liste éditoriale, avec `robots: noindex, nofollow`.
4. **Fondations esthétiques documentées :** tokens clair/sombre, largeur de lecture, conteneurs, rythme vertical et variantes sémantiques.
5. **Prise en compte d'un socle UX :** H1 unique dans le Showcase, listes ordonnées du sommaire, `aria-current`, focus clavier, reduced motion, styles d'impression, boutons de questionnaire et checklist opérants dans les implémentations respectives.
6. **Préservation annoncée des données du guide :** la documentation identifie précisément `vd_guide_checklist_v1` et les 14 cases, sans les effacer avec les données fictives du Showcase.

Ces points justifient de conserver la proposition comme **v1 de travail** plutôt que de la jeter.

## 3. Réserves prioritaires et corrections

### P0 — À corriger avant de déclarer l'étape 2 terminée

**P0-01 — Showcase non exhaustif par rapport à l'inventaire gelé.**  
Les cinq modules existants dans `InternationalisationArticleModules.tsx` (mosaïque six langues, démo de sélecteurs de langues, matrice interactive 6 × 6, funnel et questionnaire de décision) ne sont pas montrés avec leur véritable logique ou leurs états. Le Showcase substitue à ces modules un simple schéma et un questionnaire de trois questions différent. Les trois grandes cartes du guide, sa checklist de 14 éléments avec persistance, ses deux snippets copiables et sa présentation numérotée des dix conseils sont également seulement représentés de manière partielle.  
**Action :** établir une matrice exhaustive *inventaire étape 1 → composant réel → variante → état normal/dark/mobile/interactive/imprimé → capture ou test*. Montrer chaque famille réellement réutilisable et au moins un véritable module spécifique de chaque article. Éviter de dupliquer le JSX métier pour la démonstration : réutiliser les composants importés, éventuellement alimentés par des données de démonstration.

**P0-02 — Il n'existe pas encore de référence visuelle vérifiée.**  
Les valeurs CSS sont des **propositions**, non des rendus acceptés. La référence initiale n'avait pas de captures vérifiées. En outre, `preview/showcase-preview.html` est une seconde implémentation HTML et JavaScript indépendante des sources React, avec ses propres boutons et sa propre gestion des états. Son apparence peut diverger de Next (`next/font`, styles globaux, `next/image`, thèmes).  
**Action :** utiliser **la route Next.js réelle comme référence**, produire les captures à 1440×900, 820×1180 et 390×844 en clair/sombre (éventuellement 320 px), ainsi que des captures des états interactifs et de l'impression. Mettre en place des captures reproductibles Playwright. L'HTML autonome doit être marqué *aperçu conceptuel non contractuel*, ou retiré.

**P0-03 — Contrats des blocs JSON non anticipés suffisamment.**  
`BlogSection` reçoit `children: ReactNode`, `BlogAccordion` se limite à `{title, content: string}`, `BlogInfoCard` distingue un `description: string` et des `children` React ; `BlogModuleFrame` expose également un slot React. Ce sont de bons composants JSX mais **pas encore un contrat garantissant qu'un article JSON riche sera reproduisible sans perte** (mise en valeur, lien dans une carte, paragraphe imbriqué, contenus multi-blocs, ancre stable, légende, code, callout).  
**Action :** dès cette étape, figer les **types de blocs et exemples JSON** (sans construire encore tout le moteur), avec `schemaVersion`, champs obligatoires, blocs récursifs contrôlés et registre `componentId → props` pour le custom. Préférer un arbre de nœuds rich text typés à un champ `text` brut si la richesse éditoriale le demande. Interdire JSX/JS/HTML libres dans le JSON.

**P0-04 — Absence de validation de bout en bout.**  
La précédente réponse indiquait « fichiers prêts » et « démo fonctionnelle », mais seul le parsing syntaxique était prouvé. L'intégration avec Next.js 16, `next-intl`, Tailwind 3, le thème et la route locale n'a **pas** été compilée. Le script de test SEO existant du dépôt ne prévoit pas spécifiquement `/blog/showcase`.  
**Action :** intégrer le patch sur branche dédiée, exécuter `npm run lint`, `npm run blog:validate`, `npm run build`, `npm run blog:test:seo`; ajouter des vérifications explicites de la route Showcase (`200 FR`, absence de route EN, `noindex`, exclusion sitemap/index), vérifier les deux articles inchangés, l'absence de warning d'hydratation et la navigation interne.

### P1 — Important pour la pérennité et l'expérience

**P1-01 — Variantes déclarées mais non réalisées en CSS.**  
`BlogModuleFrame` accepte `tone: BlogTone` (`neutral`, `accent`, `success`, `warning`, `info`). Pourtant le CSS ne définit des apparences explicites pour le module que sur `success` et `info`, hors base par défaut. `BlogIconList` accepte aussi `tone`, mais aucune règle `[data-tone=…]` ne modifie son icône : une croix rouge reste utilisée quel que soit le ton.  
**Action :** compléter les variantes *ou* réduire les unions TypeScript pour refléter les vrais comportements. Ajouter un test visuel pour chaque combinaison `component × tone × thème`.

**P1-02 — Régression possible des blocs de code.**  
`BlogCodeSample` affiche du code brut (`<pre><code>{code}</code></pre>`) avec copie, mais sans coloration syntaxique par langage, sans méta ligne/titre ; l'existant MDX dispose de `rehype-pretty-code`.  
**Action :** réutiliser la couche de rendu de code ou extraire `BlogCodeBlock` avec langage, titre, coloration au build, lignes optionnelles, copie et scroll horizontal. Un simple échantillon non coloré ne peut pas devenir la référence définitive.

**P1-03 — Familles média insuffisantes.**  
L'API `BlogFigure({children, caption, label})` n'illustre pas les véritables images `next/image`, sources WebP/SVG, ratios, vidéos YouTube, alternatives et charges différées. Le `role="img"` sur un conteneur aux `children` arbitraires empêche de l'utiliser sans précaution pour des contenus interactifs.  
**Action :** séparer `ArticleImage`, `ArticleFigure`, `ArticleDiagram`, `ArticleVideo` et `CustomVisualization`; documenter alt, dimensions, responsive, ratio, légendes, chargement, vidéo à consentement/clic.

**P1-04 — Internationalisation de l'interface incomplète.**  
`BlogSiteHeader` prévoit partiellement `fr/en`, mais `BlogBreadcrumbs` utilise toujours `aria-label="Fil d’Ariane"`, `BlogPageFooter` affiche toujours « Tous les articles », `BlogAuthorCard` affiche « Derrière ces articles » et « Découvrir mes projets » en français, et plusieurs labels d'actions sont codés en dur.  
**Action :** injecter un dictionnaire UI `locale` unique, avec typage `BlogLocale`; ne pas mettre le contenu éditorial traduit dans le composant lui-même. Vérifier la page EN avant d'en publier une.

**P1-05 — Sommaire et articles suivants gérés manuellement.**  
Dans `BlogShowcase.tsx`, le sommaire (`toc`) est un tableau indépendant des 8 sections. Le lien du prochain article est codé en dur. Dans la migration, cela crée des risques d'ancres orphelines, d'erreurs de titres et de liens vers des brouillons.  
**Action :** générer le TOC depuis les sections JSON publiées (`toc: true/false`, `id` stable), et sélectionner le suivant via une règle documentée (ordre chronologique, recommandation explicite, fallback, respect de la locale et du statut).

**P1-06 — Éléments du shell non réellement verrouillés.**  
`BlogArticleHero` permet librement `headingLevel=1|2`, reçoit plusieurs libellés précalculés, un auteur codé par défaut, une photo `/pp.jpg` fixe et un CTA. `BlogPageFooter` reproduit un footer propre au blog sans décision ferme sur l'articulation avec le footer du portfolio.  
**Action :** définir un `ArticleLayout` officiel (`metadata + slots limités`), imposer un seul H1 sur une route article, maîtriser les overrides permis, décider formellement du header/footer et centraliser la carte auteur. Garder la possibilité d'une illustration hero custom, pas d'un hero entièrement arbitraire.

**P1-07 — États UX et accessibilité incomplètement prouvés.**  
La police « méta » descend à 10–11 px ; plusieurs boutons d'utilité affichent `min-height: 40px`, certains contrôles deviennent visuellement petits. Le CTA pointe vers `#blog-showcase-body`, qui n'a pas de règle propre explicite `scroll-margin-top` alors que le header est sticky. La navigation à une ancre ne garantit pas le transfert de focus clavier.  
**Action :** contrôler les cibles tactiles proches de 44×44 px, tailles lisibles (méta 12–14 px selon priorité), zoom 200/400 %, raccourcis clavier, états focus/hover/disabled, scroll des ancres sous le header, lecteurs d'écran, RTL potentiel, reduced motion et impression.

**P1-08 — Cohérence avec le portfolio au-delà du blog non arbitrée.**  
Le Showcase adopte son propre header/footer, couleur de papier et composants alors que le portfolio a `Header.tsx`/`Footer.tsx` séparés. L'affirmation « style homogène partout » vaut aujourd'hui **à l'intérieur de la proposition de blog**, non entre le site principal, l'index et les pages d'article.  
**Action :** décider quels tokens sont globaux (`brand`, `focus`, typo) et quels tokens sont locaux au blog (`paper`, largeur de lecture) ; tester le passage portfolio → index → article et fixer les règles de déclinaison sans dupliquer le même footer.

**P1-09 — Checklist de démonstration ≠ composant réutilisable.**  
`BlogChecklistDemo` contient ses 3 items en dur, un état volatile et une logique intrinsèque. La vraie checklist possède 14 cases, `localStorage['vd_guide_checklist_v1']`, un reset et des clés stables `chk-1…chk-14`.  
**Action :** extraire un `BlogChecklist` générique `{id, items, persistence?}` ; `persistence` optionnelle pour le Showcase ; migrer l'ancien format en garantissant la compatibilité de lecture et de sauvegarde. Les tests doivent couvrir rechargement, reset et stockage indisponible.

**P1-10 — Questionnaire de démonstration non équivalent au métier.**  
`BlogDecisionDemo` choisit « deux réponses positives sur trois » pour son résultat ; le questionnaire SaaS d'origine applique d'autres règles explicites dépendant des combinaisons de réponses.  
**Action :** distinguer la présentation générique d'un `Questionnaire` (questions, choix, état, feedback) de la logique métier propre au composant SaaS ; montrer le vrai module pour préserver le comportement existant.

### P2 — À cadrer sans retarder inutilement

**P2-01 — Fichier `BlogUI.tsx` trop centralisé à terme.**  
Environ 10 Ko de JSX regroupent header, hero, cards, footer, figures et code. Découpage recommandé par catégorie (layout, typography, content, media, actions) lors de l'arrivée du moteur JSON ; ne pas fractionner chaque élément minuscule mécaniquement.

**P2-02 — Tokens déclarés mais pas encore un contrat testable.**  
Une même source CSS sert de vérité pour les couleurs tandis que les documents contiennent des tableaux recopiés manuellement et que certains contrôles héritent de classes Tailwind historiques.  
**Action :** formaliser un fichier de tokens versionné et une convention de nommage, puis tester les tokens sémantiques et la parité des variantes.

**P2-03 — Aperçu autonome fragile.**  
La fonctionnalité « Copier » utilise `navigator.clipboard.writeText` sans gestion d'échec dans le JS de l'aperçu ; selon le contexte d'ouverture elle peut être indisponible. La police Inter n'est pas chargée via `next/font` dans ce HTML.  
**Action :** ne pas traiter cet HTML comme validation contractuelle ; documenter les limites, ajouter feedback d'erreur et utiliser en priorité le Showcase React.

## 4. Critères de sortie recommandés pour l'étape 2

| Critère | Attendu avant validation | État actuel |
|---|---|---|
| Référence visuelle | Captures issues de `/fr/blog/showcase` en plusieurs tailles/thèmes + validation explicite | **À faire** |
| Exhaustivité UI | Correspondance tracée avec chaque type inventorié à l'étape 1 | **Partielle** |
| Bibliothèque fiable | API de composants typée ; variantes CSS réellement supportées | **À compléter** |
| Contenu riche | Texte, liens, images, vidéos, code, cartes et callouts rendables depuis blocs typés | **Contrat non figé** |
| Composants custom | Cadre + registre contrôlé, sans JSX/CSS arbitraire dans JSON | **Principe seul** |
| Interactions | Tests fonctionnels des originaux réutilisés, mobile/clavier/thème/print | **À faire** |
| Build/intégration | Lint, typecheck, build, route FR/noindex, régressions SEO | **Non exécutés** |
| Compatibilité futurs articles | TOC auto, next-article, locale, slugs, dates, médias, validation de schéma | **À définir** |

**Définition d'un « terminé » honnête :** le Showcase Next.js sert de démonstrateur et de référence visuelle approuvée ; tous les blocs récurrents issus de l'inventaire y sont testables ; les modules custom sont préservés ; un schéma JSON minimal est arrêté ; le build, l'accessibilité de base et les régressions SEO passent.

## 5. Ordre de correction proposé

1. **Réalité du rendu** : intégrer sur branche de travail, compiler, prendre des captures Next.js et comparer aux deux références historiques ; figer les arbitrages esthétiques.
2. **Couverture des composants** : compléter Showcase avec vrais modules (mosaïque, matrice, sélecteurs, funnel, décision) et catégories absentes (images, vidéo, code coloré, snippets copiables, tableaux, checklist persistante).
3. **API stable avant JSON** : définir types discriminés `ArticleBlock`, arbre de texte riche, `sectionId`, props médias, registre `custom`, dictionnaire de traduction ; ne pas écrire tout le parseur maintenant.
4. **Consolidation** : corriger variantes CSS et sémantique, limiter overrides de shell, générer le TOC et la navigation d'articles à partir des données.
5. **Recette** : tests TS, build, SEO, accessibilité, interaction et mobile ; captures de référence acceptées.

## 6. Recommandation finale

**Conserver le ZIP d'étape 2 comme prototype v1, pas comme livraison finale à fusionner en production.** Ne pas démarrer la migration JSON tant que les contrats de blocs et la couverture des modules existants ne sont pas clarifiés. Il n'est pas nécessaire de tout réécrire : la correction la plus efficace est une **v1.1 de consolidation ciblée** avec tests, vrais modules et API JSON anticipée.

**Sources principales :** fichiers contenus dans `blog_design_system_showcase_etape2.zip`, `01_inventaire_reference_visuelle_blog.md`, `docs/blog/ARCHITECTURE.md`, code du commit `1b217e7` du dépôt GitHub précité.
