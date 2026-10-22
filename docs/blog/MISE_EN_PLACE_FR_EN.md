# Mise en place des deux articles en français et en anglais

## Périmètre

Base : `3c52ae8c93379b1d26030748ec55f01fdec98f4a`, branche `dev04`. Cette intervention suit l’audit [AUDIT_I18N_BLOG.md](AUDIT_I18N_BLOG.md) et l’autorisation explicite de rendre les deux articles disponibles en anglais. Aucun CMS, nouvelle dépendance, duplication de renderer, nettoyage de l’étape 6 ou déploiement en production.

## Articles disponibles

| Sujet | Français | Anglais | Clé de traduction |
|---|---|---|---|
| Premier emploi | `/fr/blog/guide-premier-emploi-developpeur` | `/en/blog/first-developer-job-guide` | `first-developer-job-guide` |
| Internationalisation SaaS | `/fr/blog/internationaliser-saas-lancement` | `/en/blog/internationalize-saas-at-launch` | `saas-internationalization-launch` |

Chaque variante est un fichier JSON natif dans `src/content/blog-json/<locale>/`. Les versions anglaises contiennent une traduction complète des introductions, onze/cinq sections, encadrés, listes, tableaux, dix conseils, modèles à copier, quatorze actions et notes imprimables concernés. Les identifiants de sections et d’items sont conservés entre langues. Les faits et nuances, notamment le contexte français du conseil sur la photo de CV, restent présents.

Les dates FR restent inchangées. Les versions EN portent le 22 octobre 2026 comme première publication prévue de ces traductions, sans `updatedAt` fictif. Les liens internes et articles associés ciblent la langue courante ; la fiche projet Iconise est déjà disponible en anglais. Le choix de l’image sociale historique du guide FR reste inchangé ; les images sociales EN utilisent les métadonnées anglaises du générateur commun.

L’ajout de `translationKey` est la seule modification des métadonnées éditoriales FR. Les contrats historiques de contenu, de SEO et de sauvegarde ne sont pas réécrits. Les assertions de parité autorisent explicitement les nouveaux hreflang et la clé de traduction, tout en comparant les autres valeurs et le contenu français aux références indépendantes.

## Navigation et index

Le menu global, le lien du hero, la carte et le lien global de la section Blog de l’accueil gardent la langue choisie. L’accueil continue d’afficher une seule carte issue du catalogue de sa langue ; il ne remplace plus silencieusement une liste anglaise vide par du contenu français.

Le sélecteur cherche la variante publiée du même sujet via `translationKey`. S’il n’existe pas de traduction, sa destination est l’index de la langue cible. Une page d’article sans source publiée reste en 404.

Les index FR/EN sont accessibles même vides, avec les textes de leur langue. Un index vide est `noindex` et reste hors sitemap ; son image sociale peut être générée avec les textes de repli localisés. La page 404 localisée conserve elle aussi la langue pour son lien Blog.

Le preview accepte `/fr/blog/json-preview?slug=...` et `/en/blog/json-preview?slug=...` en développement. Il reste fermé en production et non indexable. Le Showcase technique reste français, hors catalogue et sitemap : il n’est pas une page de lecture publiée.

## Widgets et illustrations

Les cinq modules SaaS conservent une seule implémentation et les mêmes IDs, calculs, interactions et huit décisions. Les textes sont dans `src/i18n/messages/{fr,en}.json`, sous `blogSaas`. Le contexte client du blog transmet ce seul ensemble supplémentaire aux widgets ; il n’est pas ajouté au contexte global de l’accueil. L’illustration serveur utilise les mêmes catalogues.

Les six langues illustrées restent intentionnellement multilingues. La langue du site localise les commandes et descriptions ; les deux sélecteurs de la démonstration continuent de choisir indépendamment la langue simulée de l’interface et celle du contenu. La démonstration s’ouvre en anglais sur la page EN et en français sur la page FR. Les noms et descriptions de matrice sont localisés ; les 36 cellules, 12 mises en évidence et quatre étapes du funnel restent identiques.

Le registre n’interdit plus EN aux composants maintenant localisés. La validation des noms, props, placements, occurrences et IDs reste active. Le contrôle d’empreinte du fichier source des widgets, devenu incompatible avec une modification autorisée de leurs libellés, cède la place à la parité du DOM FR et aux tests métier FR/EN ; la référence historique elle-même est conservée.

Pour les prochains articles, une image statique passe par `figure`. Une illustration React/SVG paramétrable ou interactive passe par un module `custom` enregistré, avec props typées et validées et libellés localisés. Aucun code exécutable n’est fourni par le JSON.

## Checklist : progression commune sans migration

La paire canonique du guide partage **`vd_guide_checklist_v1`**, les **14 IDs `chk-1` à `chk-14`** et le format contenant uniquement les cases cochées avec la valeur `true`. Aucun renommage de clé, transfert de données ou reset automatique. Les libellés et la confirmation de réinitialisation sont localisés.

Le validateur n’autorise cette clé qu’aux slugs canoniques FR/EN et exige l’association du guide EN par la bonne clé de traduction. Le partage publié n’est autorisé que pour les deux membres de cette paire ; toutes les autres collisions de clés restent rejetées. Une traduction avec des IDs réattribués ou une autre clé de sujet est refusée.

La recette navigateur charge un état français existant, passe à la traduction anglaise, ajoute une action au clavier, revient en français, vérifie la synchronisation entre onglets, annule puis confirme le reset en anglais. Le contrôleur historique reste également testé par le pilote de publication.

## Correction de la recette de développement

La dernière CI avant ce lot échouait lors d’un second `.check()` juste après le retour sur une page possédant déjà une case sauvegardée. La recette vérifie désormais la restauration avec une assertion réessayée `toBeChecked()` avant de naviguer. Elle ne clique plus sur une case déjà attendue cochée pendant sa restauration. Aucun délai arbitraire, retry global ou filtre d’erreurs console n’est ajouté.

## Validation

Contrôles exécutés le 22 octobre 2026, Node 22.19.0, sur le checkout complet de `dev04` :

| Commande | Résultat local |
|---|---|
| `npm ci` | Réussi ; aucune modification de dépendance, 0 vulnérabilité signalée |
| `npm run blog:validate` | Réussi : 4 variantes publiées, 2 brouillons, dont 5 sources JSON |
| `npm run blog:test:json` | 30 tests réussis, dont paires réelles et protection du stockage partagé |
| `npm run lint` | 0 erreur ; 5 avertissements de tokens préexistants |
| `npm test` | 11 tests réussis |
| `npx tsc --noEmit` | Réussi |
| `npm run build` | Réussi ; les quatre routes d’articles et leurs images sont pré-rendues |
| `npm run blog:test:seo` | Réussi, y compris après restauration du build normal par le pilote |
| `npm run test:e2e` | 34 tests réussis sur le serveur de production local, port 3109 |
| `npm run blog:test:publication` | 2 tests réussis ; interopérabilité historique, fixtures retirées et build normal restauré |
| `npm run blog:test:preview` | 5 tests réussis en développement, y compris les deux previews anglais et la régression d’hydratation du guide |
| `npm run audit:verify` | **Échec conservé** : accueil FR/EN à 221,44 Kio gzip pour 150 Kio |

La recette EN vérifie accueil → index → articles, les bascules FR/EN réciproques, les liens et ancres, un seul `main` et H1, l’absence d’IDs dupliqués et de débordement à 320/390/820/1440 px, et les thèmes clair/sombre. Aucun échec axe sur les règles WCAG A/AA testées à 390 et 1440 px ; aucune erreur console ni exception de page dans ce parcours. Les sélecteurs indépendants, les 36 cellules au clavier et les huit résultats du questionnaire restent fonctionnels. Canonical, hreflang, JSON-LD, sitemap, images sociales et lecture sans JavaScript sont vérifiés sur les vraies traductions.

Les captures anglaises aux quatre largeurs ont été inspectées, avec observation de la fin d’article allégée. Les exports A4 anglais ont été générés dans les deux thèmes ; les rendus de la checklist (14 items) et de la matrice ont aussi été inspectés. Les contrats de contenu FR et les empreintes des images sociales historiques passent sans modification des références.

Les preuves navigateur sont locales et les captures/PDF restent ignorés dans `tests/visual-artifacts/`. Aucun résultat de production n’est déduit des tests locaux. Le dépassement du budget JavaScript de l’accueil reste une réserve distincte : plafond inchangé de 150 Kio gzip ; environ 221,44 Kio mesurés dans ce lot.

**Verdict : les deux sujets sont disponibles en anglais sur la branche de travail, avec le même moteur JSON et une seule implémentation des widgets. Les contrôles fonctionnels du lot sont validés localement ; la validation globale reste partielle à cause du budget JavaScript de l’accueil.** Son diagnostic antérieur et ses mesures comparatives figurent en section 7 de [AUDIT_FINAL_ETAPES_1_2_3.md](AUDIT_FINAL_ETAPES_1_2_3.md). Aucun seuil n’est relevé et aucune CI entièrement verte n’est revendiquée.
