# Audit FR/EN du blog

> État historique avant mise en œuvre. Les corrections autorisées ensuite sont décrites dans [MISE_EN_PLACE_FR_EN.md](MISE_EN_PLACE_FR_EN.md).

## Périmètre et verdict

Audit du checkout `dev04` à `3c52ae8c93379b1d26030748ec55f01fdec98f4a`, le 22 octobre 2026. État initial propre. Inspection des sources, des contrats, du validateur, du routage et du rendu local sur `http://localhost:3006` ; aucune conclusion sur une version déployée n’est déduite de ces observations.

**Le blog n’est pas encore bilingue en contenu. Son infrastructure est en grande partie compatible FR/EN, mais plusieurs restrictions explicites empêchent une utilisation anglaise complète.** Ce n’est pas une panne générale de next-intl. La publication française uniquement était une contrainte des étapes précédentes ; le nouveau besoin demande de faire évoluer ce choix, ses tests et sa documentation.

Ce rapport ne modifie ni le code applicatif, ni les articles, ni leurs statuts. Aucune version EN n’est créée pendant l’audit. La mise en œuvre et la traduction complète des deux articles font l’objet de la clarification de périmètre posée pendant cette intervention.

## Reproduction locale

| Parcours | Résultat observé |
|---|---|
| `/en` | HTTP 200, document `lang="en"` |
| Menu Blog sur `/en` | Libellé « Blog in French », href `/fr/blog` |
| Lien Blog du hero anglais | href `/fr/blog` ; le clic aboutit au document français |
| Carte d’article de l’accueil anglais | Titre/chapeau français, lien vers le SaaS FR, « Read this French article » |
| Lien global de la section Blog anglaise | « Read the blog (in French) », href `/fr/blog` |
| `/en/blog` | HTTP 404 ; pas de redirection HTTP vers le français |
| `/fr/blog` | HTTP 200, document `lang="fr"` |
| Sélecteur English depuis `/fr/blog` | href `/en`, car aucun article anglais n’est publié |

Le changement vers le français vient des **destinations de liens calculées**, pas d’une redirection HTTP du proxy.

Les deux articles publiés sont français et n’ont pas encore de `translationKey`. Le catalogue JSON contient aussi un brouillon technique français ; la source MDX conserve sa fixture de compatibilité non publiée. Aucun article anglais réel n’existe.

## Éléments déjà prêts

- Next-intl et la table de routes reconnaissent FR/EN et `/blog` dans les deux langues.
- Le catalogue lit `src/content/blog-json/<locale>/<slug>.json` et accepte `locale: "fr" | "en"`.
- Une paire d’articles peut utiliser des slugs différents et partager le même `meta.translationKey`.
- Le pré-rendu statique des pages et images sociales énumère les articles publiés du catalogue.
- Les métadonnées et le JSON-LD utilisent la langue de l’article ; canonical et hreflang sont construits depuis les traductions publiées.
- Le sitemap sait référencer les deux langues et les relations de traduction.
- L’index, les cartes, dates, libellés de partage, copie, lecture vidéo et la plupart des contrôles de lecture ont déjà une variante anglaise.
- Les projets liés utilisent les fiches de la langue courante, déjà disponibles pour Iconise.
- Le pilote de publication possède un scénario synthétique FR/EN. Il prouve une capacité du moteur, pas la traduction des vrais articles et widgets.

## Constats et corrections nécessaires

| Priorité | Constat | Action nécessaire |
|---|---|---|
| P0 | Aucun fichier d’article EN ; aucune clé de traduction sur les articles FR | Rédiger les deux traductions complètes sous `src/content/blog-json/en/`, avec métadonnées EN et clés partagées avec les FR. Préserver les faits, dates justifiées, liens et contexte de France du guide. |
| P0 | Le manifeste réserve `saas-hero` et les cinq widgets à `locale: "fr"` | Localiser l’illustration et les cinq widgets dans leur implémentation existante, puis ouvrir le manifeste aux langues effectivement prises en charge. Ne pas seulement retirer l’interdiction du validateur. |
| P1 | Le menu global et le lien Blog du hero choisissent FR quand EN est vide | Faire pointer les entrées anglaises vers l’index anglais, avec une politique cohérente pour l’index vide. |
| P1 | L’accueil remplace les articles EN absents par les articles FR ; `BlogResource` déduit sa destination de cette liste | Filtrer strictement les contenus selon la langue courante et localiser le lien « tous les articles ». Conserver une seule carte en accueil, conformément à la composition existante. |
| P1 | Le sélecteur de langue renvoie vers l’accueil quand le catalogue cible est vide | Aller à la traduction correspondante si elle existe ; sinon proposer l’index de la langue cible et un état explicite, sans afficher le texte FR comme une traduction EN. |
| P1 | L’index EN et son image sociale répondent volontairement 404 sans article EN | Décider entre ouverture avec les traductions publiées et index vide anglais accessible. Si l’index vide devient accessible, adapter métadonnées, robots, image sociale, sitemap et tests ensemble. |
| P1 | Le preview de développement ne génère que FR et refuse explicitement EN | Permettre `/en/blog/json-preview?slug=...` en développement, tout en conservant le 404 en production et le noindex des previews. |
| P1 | La clé `vd_guide_checklist_v1` est réservée au slug FR et les clés publiées sont globalement uniques | Préserver strictement la clé FR, les 14 IDs et le format historique. Définir la politique de progression entre traductions avant la bascule EN ; ne pas réutiliser la même clé sans adapter le contrat et les validations. |
| P1 | Les textes métier et accessibles des widgets sont en français dans React | Traduire titres, sélecteurs, légendes, axes/cellules, étapes, résultats et commandes du questionnaire. Conserver une seule logique pour la matrice, le funnel et les huit décisions. Les exemples volontairement multilingues de la démonstration doivent rester distincts de la langue du site. |
| P2 | La biographie par défaut du composant auteur n’a pas de texte EN ; la confirmation de reset historique est littéralement française | Prévoir une vraie biographie anglaise ; localiser la confirmation si le contrat de sauvegarde est étendu aux traductions. Les autres libellés de checklist sont déjà bilingues. |
| P2 | La page 404 localisée comporte un lien Blog fixé à `/fr/blog` | Construire ce lien selon la langue courante et la politique de disponibilité de l’index. |
| P2 | Des messages d’accueil décrivent encore un blog français uniquement | Actualiser les libellés FR/EN et retirer l’annonce française du parcours anglais une fois celui-ci réellement disponible. |
| P2 | Les contrats de migration comparent exactement les anciennes métadonnées et l’empreinte du fichier des widgets | Autoriser explicitement l’ajout des clés de traduction et le changement des libellés localisés dans les tests, sans réécrire les références historiques pour masquer une régression. Conserver la comparaison du contenu FR et des comportements métier. |
| P2 | La documentation et les prompts imposent encore FR uniquement | Décrire les fichiers par langue, les clés partagées, les relations locales, les médias et les modules bilingues. Un dossier préparatoire bilingue reste distinct des deux JSON natifs finalement publiés. |

### Fichiers principaux

- `src/components/layout/SiteHeader.tsx` : menu Blog avec fallback FR.
- `src/features/home/Header.tsx` : destination Blog du hero.
- `src/app/(localized)/[locale]/page.tsx` : sélection d’articles avec fallback FR.
- `src/features/home/BlogResource.tsx` : carte et lien global de l’accueil.
- `src/components/layout/LocaleLinks.tsx` : correspondance des traductions et fallback vers l’accueil.
- `src/app/(localized)/[locale]/blog/page.tsx` : refus d’index anglais vide.
- `src/app/(localized)/[locale]/blog/blog-index-image.png/route.tsx` : refus d’image d’index anglais vide.
- `src/app/(localized)/[locale]/blog/json-preview/page.tsx` : preview FR uniquement.
- `src/app/(localized)/[locale]/not-found.tsx` : lien Blog français fixe.
- `src/lib/blog/json-custom-modules.json`, `JsonCustomRegistry.tsx`, `InternationalisationArticleModules.tsx`, `InternationalisationHeroArt.tsx` : manifeste, adaptation et textes des modules.
- `src/lib/blog/json-source.mjs` et `src/features/blog/json/JsonChecklist.tsx` : contrat de persistance.
- `src/i18n/messages/en.json` : messages d’accueil encore orientés vers le blog français.

## Politique recommandée

### Index et navigation

Deux solutions sont possibles :

1. Ajouter les traductions publiées : le code actuel ouvre automatiquement l’index EN et cesse plusieurs fallbacks FR. C’est le déblocage minimal, mais les bascules vers FR reviendraient si la langue cible n’avait plus aucun article.
2. Garder les liens Blog dans la langue courante et rendre l’index anglais accessible même vide, avec un message anglais et une politique noindex/sitemap adaptée tant qu’aucun article n’est publié.

La deuxième solution rend le parcours plus prévisible. Dans les deux cas, une route d’article sans traduction doit rester indisponible ; aucune copie française sous une URL anglaise.

### Traductions et identifiants

Employer une clé stable par sujet, par exemple `first-developer-job-guide` ou `saas-internationalisation-launch`, partagée entre les deux JSON. Les slugs peuvent être traduits ; conserver les IDs de sections et d’items entre les variantes facilite la maintenance des relations et des états. Les textes visibles, métadonnées, liens éditoriaux internes, alt/légendes, modèles à copier et contenus des widgets doivent être revus dans chaque langue.

Le validateur exige actuellement une version FR publiée pour publier la version EN. Il faut donc publier les deux sources dans la même bascule, ou ajouter EN à une source FR déjà publiée avec sa clé. Ne pas créer d’article EN isolé en supposant que le catalogue l’acceptera.

### Sauvegarde du guide

Les deux politiques possibles sont :

- **Progression indépendante par langue** : une clé EN distincte reste compatible avec le validateur actuel ; l’état FR n’est pas effacé, mais un lecteur qui change de langue ne retrouve pas ses cases dans l’autre version.
- **Progression commune au sujet traduit** : conserver les 14 IDs et la clé historique permettrait un état commun. Cela exige une exception contrôlée pour la paire de traductions du guide, ainsi que des tests FR → EN → FR, de reset et de synchronisation. Ne pas desserrer globalement le contrôle d’unicité des clés.

Cette décision doit être explicite. Dans tous les cas, préserver les données françaises déjà enregistrées, sans reset ou migration silencieuse.

## Illustrations et composants spécifiques

Le besoin est déjà prévu :

- Image/illustration statique : bloc `figure`, média local sous `public/blog/<slug>/`, alt et légende localisés. Aucun composant React n’est nécessaire pour une simple image.
- Illustration React/SVG paramétrable ou module interactif : bloc `custom` associé à une entrée explicite du manifeste et du registre. Les props sont typées et validées ; aucun chemin d’import, HTML, CSS ou JavaScript arbitraire dans le JSON.
- Illustration de hero : le registre contrôle aussi le placement. Les composants actuels admis au hero sont `metric-panel` et `saas-hero`, ce dernier restant FR-only à la révision auditée.

Un nouveau module peut prendre en charge FR/EN. Il doit localiser ses libellés et descriptions accessibles, conserver sa logique unique et être testé dans les deux langues. Le registre actuel n’est pas encore une bibliothèque universelle d’illustrations : un besoin réellement nouveau peut nécessiter son ajout en React, puis être réutilisé par les articles suivants.

## Contrôles réalisés

- Inspection de toutes les routes et entrées de navigation citées.
- Navigateur Chromium : accueil EN, clic réel sur le Blog du hero, index EN/FR et destination du sélecteur de langue.
- Lecture du catalogue réel : deux publications françaises, aucune anglaise, aucune clé de traduction sur les publications.
- `npm run blog:validate` : réussi, 2 publications, 2 brouillons, 3 JSON.
- `npm run blog:test:json` : 28 tests réussis.
- `npm run blog:test:seo` sur le build local existant : réussi. Il vérifie actuellement que l’index EN sans article répond 404 ; un test vert ne prouve donc pas l’objectif bilingue demandé.
- Essais du validateur en mémoire, sans écrire de source EN : le guide EN avec la clé historique est refusé ; le SaaS EN est refusé par la restriction de son hero ; un guide avec clé distincte passe la structure même si ses textes restent français. Le validateur ne remplace pas une revue de traduction.
- La [CI du commit audité](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/actions/runs/39848966204) échoue sur `blog:test:preview` : `locator.check: Clicking the checkbox did not change its state`, dans `guide-readiness.spec.ts:211`, après un retour vers le guide qui possède déjà une case sauvegardée. Quatre tests de preview passent et un échoue. Une course entre restauration de l’état et commande de clic est une hypothèse à vérifier ; cet audit ne présente pas cette hypothèse comme un diagnostic confirmé. La synchronisation de la recette et le comportement réel doivent être examinés avant correction, sans ajouter de délai arbitraire ni masquer les erreurs.
- Le budget `audit:verify` n’a pas été atteint dans cette CI ; son dépassement antérieurement documenté reste une réserve distincte. Le test synthétique de publication FR/EN et les autres étapes précédant le preview ont réussi dans cette exécution.

Aucun nouveau build, aucune traduction anglaise réelle et aucune recette de parité des vrais widgets EN ne sont prétendus dans cet audit.

## Préparation des prochains articles bilingues

Le dossier d’échange recommandé évolue vers `portfolio-blog-preparation-v2` avec un tableau `articles` contenant les variantes FR et EN. Chaque variante prépare un article JSON natif avec son `meta.locale`, ses textes et son slug, mais les deux partagent `meta.translationKey`. Les médias, sources, demandes de modules et questions restent dans les annexes du dossier, hors des fichiers natifs du moteur.

Ce dossier préparatoire n’est pas un nouveau format accepté par le renderer. L’intégration extrait et valide deux fichiers sous les dossiers de langue existants. La traduction EN est explicitement demandée, fidèle aux faits du texte source ; aucun contenu français ne doit être publié sous une URL anglaise pour simuler cette traduction.

## Critères d’acceptation de la mise en œuvre

1. Depuis `/en`, le menu, le hero, la carte d’article et le lien « tous les articles » restent dans `/en` ; aucun fallback français implicite.
2. `/en/blog` présente une interface anglaise, les articles anglais disponibles et la politique d’état vide retenue.
3. Les deux articles sont intégralement traduits, y compris leurs métadonnées, contenus riches, modèles, illustrations, widgets et textes accessibles.
4. Le sélecteur FR/EN ouvre la variante du même sujet lorsque disponible ; les slugs traduits sont correctement associés.
5. Canonical propre à chaque URL, hreflang réciproque, JSON-LD et images sociales dans la bonne langue ; aucun lien EN vers une route FR par erreur.
6. Le preview fonctionne pour FR et EN en développement, reste fermé en production ; brouillons et traductions absentes restent exclus du catalogue publié.
7. Les cinq widgets conservent les mêmes comportements en FR et EN, avec une seule implémentation et sans régression de leurs contenus français.
8. Les 14 cases du guide et les sauvegardes FR restent intactes ; la politique de progression entre langues est testée.
9. Les deux thèmes et 320/390/820/1440 px sont contrôlés au navigateur, avec clavier, console, absence de débordement et impression.
10. Les tests et documents suivent la nouvelle politique ; les contrôles rouges, notamment le budget JavaScript de l’accueil déjà documenté, restent signalés.

**Verdict : infrastructure réutilisable, mais blog non prêt pour une expérience anglaise complète sans ces corrections et de vraies traductions.**
