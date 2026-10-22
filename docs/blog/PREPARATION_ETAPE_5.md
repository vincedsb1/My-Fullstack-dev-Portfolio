# Préparation de l’étape 5 — guide et identité commune

## Verdict et périmètre

Les corrections du tableau et la préparation du moteur permettent de passer à l’étape 5. **La bascule publique du guide n’est pas effectuée dans ce lot**, conformément à la demande de signaler quand cette étape peut commencer. Les deux URLs publiques conservent leur contenu et leur SEO ; `main` et la production ne sont pas modifiés.

Référence avant correction : `1b9386d476349b47108978078c2d9a84ae9e12a5` sur `dev04`. Le SaaS utilise déjà le shell JSON ; le guide public utilise encore `GuideBody`, `GuideInteractive` et `guide.css`. Cette coexistence explique l’écart visuel constaté : les deux pages publiques ne partageront réellement leur présentation qu’après la bascule de l’étape 5.

## Erreurs React corrigées

`GuideOrganiserRechercheSection.tsx` contenait des expressions JSX de la forme `{"\n    "}` comme enfants directs de `table`, `thead`, `tbody` et `tr`. Ces chaînes créaient des nœuds texte invalides à ces endroits du tableau et déclenchaient les quatre avertissements signalés. Elles ont été retirées sans modifier les cellules, les libellés, la structure du tableau ou ses styles.

Les tests précédents de production et les écouteurs `pageerror` ne suffisaient pas : ces diagnostics sont des erreurs **de console en développement**. La nouvelle recette Turbopack observe aussi `console.error`, au chargement et lors de la navigation réelle depuis le SaaS vers le guide. Elle exige zéro erreur sur ces parcours et vérifie les enfants DOM du tableau. Un test TypeScript AST contrôle également que les chaînes d’espacement ne reviennent pas dans les balises structurelles du composant historique.

## Brouillon de référence commun

Le fichier `src/content/blog-json/fr/guide-premier-emploi-migration.json` est un **brouillon**. Il est visible uniquement en développement à :

`/fr/blog/json-preview?slug=guide-premier-emploi-migration`

Il utilise `JsonArticlePage`, les mêmes hero, sommaire, sections, typographie, cartes, tableau, copie, checklist et carte auteur que le SaaS. Aucun renderer React spécifique au guide ni CSS propre à ce brouillon n’a été créé. Le hero peut se passer d’illustration : la variation de contenu ne crée pas un deuxième système de mise en page.

Le contrat `contracts/guide-content-v1.json` a été exporté depuis l’article historique avant conversion. Il conserve les métadonnées, les textes dans leur ordre, les emphases, les liens, les fragments, les deux modèles exacts à copier et l’empreinte de l’image sociale. Il constitue une référence de comparaison, pas la source éditoriale du futur article.

La comparaison couvre les onze sections, les dix ancres de chapitre existantes, `msg-template`, `prompt-template`, les deux textes d’introduction, les liens, les cellules du tableau, les dix conseils et les quatorze actions. Le dernier chapitre, auparavant sans ID, reçoit `faire-avancer-recherche`. Les textes, leur ordre et les emphases sont comparés au DOM historique ; les modèles sont aussi comparés caractère par caractère dans le presse-papier.

## Sauvegardes des lecteurs

La clé publique reste `vd_guide_checklist_v1`, avec les quatorze IDs `chk-1` à `chk-14` et le format contenant uniquement les cases cochées : `{"chk-1":true}`. Le contrat de checklist existant reste inchangé.

Le brouillon utilise volontairement **`vd_guide_migration_preview_v1`**. Tester ce preview ne peut donc ni écraser ni réinitialiser la progression d’un lecteur sur l’article public. La recette navigateur vérifie cette séparation. Le pilote de publication existant vérifie toujours l’aller-retour entre le contrôleur historique et `JsonChecklist` avec la vraie clé, ainsi que restauration, progression, réinitialisation annulée/confirmée et retour vers le guide.

Lors de l’étape 5, remplacer la clé du brouillon par `vd_guide_checklist_v1` dans la même modification que sa bascule au slug publié. Ne pas renommer ni réattribuer les IDs.

## Compléments apportés au moteur

- `code.id?` conserve les fragments des modèles ; il est contrôlé dans l’espace d’IDs commun. Les blocs `language: "text"` replient les lignes et réutilisent le bouton de copie du portfolio.
- `author.description` permet de conserver la biographie originale avec la même carte auteur.
- Le hero commun affiche `updatedAt` lorsqu’il diffère de `publishedAt`, sans inventer une nouvelle date. Le guide préparé conserve les 11 et 21 octobre 2026.
- `checklist.printNote?` conserve la note imprimable, en italique, sans l’afficher dans l’interface de lecture.
- Le choix de l’image sociale historique du guide dépend désormais de son URL française stable plutôt que de son ancien renderer. Sa future migration ne changera donc pas cette image.

La fixture technique MDX `mdx-compatibility-fixture.mdx` reste en `draft`. Elle conserve une cible du chargement MDX dynamique pour Turbopack lorsque le dernier article historique sera retiré ; un glob sans aucune source empêchait la compilation pendant la préparation. Elle ne crée aucune route publique et pourra être retirée avec le moteur historique à l’étape 6.

Ces champs sont facultatifs, typés et validés. Les données ne contiennent ni HTML, ni JavaScript exécutable, ni import ou style arbitraire. Aucun changement de dépendance n’est nécessaire.

## Recette et réserves

La recette comprend les validations JSON, ESLint, TypeScript, tests unitaires, build statique, SEO, E2E, pilote de publication et preview. Les quatre nouveaux tests Node contrôlent le texte complet, les modèles, les IDs et le tableau historique. Les trois nouveaux tests de développement contrôlent le brouillon dans les deux thèmes et les erreurs de console des routes réelles.

Les contrôles visuels et axe portent sur 320, 390, 820 et 1440 px. La recette compare aussi les valeurs calculées de la typographie du hero du brouillon avec celles du SaaS à chaque largeur, dans les deux thèmes. Des PNG et PDF du brouillon sont produits dans les artefacts ignorés par Git.

Le budget JavaScript global de l’accueil reste un problème distinct : environ 221,45 Kio gzip pour 150 Kio. La [CI de l’étape 4](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/actions/runs/39837030088) confirme que son seul échec est `audit:verify`. Ce budget n’est pas relevé et ne doit pas être annoncé comme validé.

## Résultats locaux

- `npm ci` : réussi, zéro vulnérabilité.
- `blog:validate` : réussi ; deux publications, trois brouillons (démonstration JSON, préparation du guide et fixture MDX).
- `blog:test:json` : 28 tests réussis ; tests unitaires : 11 réussis.
- ESLint : zéro erreur, cinq avertissements de tokens préexistants hors de ce lot.
- TypeScript, build statique et `blog:test:seo` : réussis.
- `test:e2e` : 26 tests réussis sur le site publié localement.
- `blog:test:publication` : deux tests réussis, dont l’interopérabilité de la vraie sauvegarde du guide ; sources temporaires nettoyées et build normal restauré.
- `blog:test:preview` : cinq tests réussis ; parité des onze sections, formats riches, presse-papier, identité visuelle partagée, axe, PDF et console de développement. L’image sociale du guide publié est identique à sa référence SHA-256.
- `audit:verify` : échec conservé sur le budget d’accueil à 221,45 Kio gzip / 150 Kio.

Les captures ont été observées et le PDF de onze pages du guide préparé a été rendu et contrôlé. Ces preuves sont locales ; aucune conformité en production n’est déduite de ces tests. Les avertissements de développement liés aux routes 404 de la recette preview restent distincts des parcours d’articles, dont la console est contrôlée sans filtrer ses erreurs.

## Bascule à réaliser en étape 5

1. Renommer le JSON de préparation au slug `guide-premier-emploi-developpeur`, rétablir `status: published` et la clé de checklist historique.
2. Retirer simultanément le MDX du catalogue, sans collision ; conserver les composants historiques jusqu’à validation des deux migrations.
3. Vérifier les sauvegardes réelles dans les deux sens, les dates, l’image sociale, canonical, JSON-LD, sitemap et redirections.
4. Comparer **les deux routes publiques** avec les composants communs, aux quatre largeurs, clair/sombre, clavier et impression ; écouter la console en développement.
5. Repasser la recette, puis livrer la bascule sur la branche de travail sans déploiement en production. Le nettoyage de l’étape 6 reste distinct.
