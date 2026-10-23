# Étape 5 — guide JSON et identité commune des articles

## Périmètre et verdict

Bascule réalisée sur `dev04`, à partir de `05da53b990714bf0da29f68f3148f55328d644fe`, après autorisation explicite de l’étape 5. Le guide et l’article SaaS sont désormais deux articles JSON publiés, rendus par **le même `JsonArticlePage` et les mêmes composants du design system**. Leurs URLs sont inchangées :

- `/fr/blog/guide-premier-emploi-developpeur`
- `/fr/blog/internationaliser-saas-lancement`

Le décalage visuel venait de la coexistence du guide MDX (`GuideBody`, `guide.css`, `GuideInteractive`) et du SaaS déjà migré. La bascule retire le guide MDX du catalogue et active son JSON préparé, sans ajouter de composant, de CSS, de route Next.js ou de condition spécifique dans le rendu générique.

**Verdict : étape 5 validée fonctionnellement en local ; base prête pour le nettoyage distinct de l’étape 6.** Le budget JavaScript global de l’accueil reste rouge et empêche de présenter la CI entière comme validée. Aucun déploiement en production, aucune modification de `main`.

## Sources et présentation

`src/content/blog-json/fr/guide-premier-emploi-developpeur.json` remplace le brouillon `guide-premier-emploi-migration.json` et le MDX public dans la même modification : aucun doublon de slug. Le catalogue contient deux publications et deux brouillons techniques (démonstration JSON et compatibilité MDX).

Les deux articles partagent le fil d’Ariane, le hero, les métadonnées visibles, les boutons, la typographie, le sommaire automatique, la colonne de lecture, les sections numérotées, la carte auteur, les articles associés et les règles d’impression. L’en-tête, le pied de page et le thème restent ceux du portfolio. Le guide n’a pas d’illustration de hero ; le SaaS conserve son illustration et ses cinq widgets existants. Ces différences de contenu utilisent les variantes du même système.

Un prochain article standard nécessite seulement un JSON local et ses éventuels médias. Les modules React spécifiques restent accessibles par le registre explicite ; aucun HTML ou JavaScript exécutable n’est accepté dans les données. L’activation du guide n’a nécessité aucune extension de ce moteur préparé à l’étape précédente.

## Parité éditoriale et SEO

Le contrat indépendant `contracts/guide-content-v1.json`, exporté du rendu historique avant conversion, reste inchangé. Les tests comparent :

- Les onze sections, leur ordre, leurs titres et leur texte complet, les deux paragraphes d’introduction, les emphases et le code en ligne.
- Les dix conseils, le tableau de candidatures, les quatorze actions et les liens existants.
- Les dix ancres de chapitre et les fragments `msg-template` / `prompt-template` ; la conclusion reçoit l’ID stable `faire-avancer-recherche`. Les anciens IDs techniques des contrôles ne constituent pas des ancres éditoriales et cèdent la place au composant commun.
- Les deux modèles à copier, caractère par caractère, dans le JSON et dans le presse-papier simulé du navigateur.
- Le titre SEO, la description, canonical, hreflang, Open Graph, Twitter, BlogPosting et BreadcrumbList, comparés aux valeurs historiques dans le navigateur.
- Les dates du 11 octobre 2026 et du 21 octobre 2026, sans date de migration présentée comme révision éditoriale.
- L’image sociale historique : SHA-256 `c86d500f1e70c2da5db1eb77d50844ed647a374b660fbbea024b9ad599af8339`, inchangé sur la route réelle.

Le contrôle SEO du build confirme aussi le sitemap, l’exclusion des brouillons et des routes anglaises sans traduction, les liens et les redirections permanentes de l’ancienne URL. Le JSON SaaS et ses widgets ne sont pas modifiés par cette étape.

## Progression des lecteurs

La clé demeure **`vd_guide_checklist_v1`** ; les IDs demeurent **`chk-1` à `chk-14`**, dans leur ordre et avec leurs libellés d’origine. Le format ne change pas : objet contenant uniquement les IDs cochés avec la valeur booléenne `true`. Aucun transfert, renommage, effacement ni réinitialisation automatique n’est effectué.

Le pilote de publication crée temporairement une route utilisant les vrais composants historiques `GuideBody` et `GuideInteractive`. Le navigateur coche les cases 1 et 14 dans ce contrôleur, retrouve les deux dans le guide JSON public, ajoute la case 7, puis retrouve les trois dans le contrôleur historique. Il vérifie ensuite une réinitialisation annulée, une réinitialisation confirmée, la sauvegarde `{}` et le retour au contrôleur historique sans case cochée. Ce test remplace le simple aller-retour avec une fixture du nouveau composant ; la logique historique n’est pas réimplémentée.

Une autre recette restaure les quatorze cases, contrôle les libellés et la progression, décoche la dernière et vérifie le format exact des treize restantes. Les tests communs couvrent aussi stockage corrompu/refusé, synchronisation entre onglets et clavier. Le guide publié est rechargé après une modification pour vérifier la restauration réelle.

Le preview utilise maintenant `/fr/blog/json-preview?slug=guide-premier-emploi-developpeur` en développement. Sur la même origine locale, il partage la sauvegarde de l’article public. L’ancien slug de préparation est retiré. Le preview reste inaccessible en production.

## Recette locale

| Commande | Résultat |
|---|---|
| `npm ci` | Réussi ; zéro vulnérabilité signalée |
| `npm run blog:validate` | Réussi ; 2 publications, 2 brouillons, 3 JSON |
| `npm run blog:test:json` | 28 tests réussis |
| `npm run lint` | Zéro erreur ; 5 avertissements de tokens préexistants hors de ce lot |
| `npm test` | 11 tests réussis |
| `npx tsc --noEmit` | Réussi |
| `npm run build` | Réussi, articles pré-rendus |
| `npm run blog:test:seo` | Réussi |
| `PORTFOLIO_E2E_PORT=3109 npm run test:e2e` | 29 tests réussis sur le build de production local |
| `npm run blog:test:publication` | 2 tests réussis ; vrais contrôleurs historique/JSON, fixtures retirées, build normal restauré |
| `npm run blog:test:preview` | 5 tests réussis, dont la console et le tableau en développement |
| `npm run audit:verify` | Échec : accueil FR/EN à 221,45 Kio gzip pour 150 Kio |

La recette du guide est partagée entre les E2E de production locale et les tests Turbopack : parité du contenu et du SEO, typographie calculée identique au hero SaaS, quatre largeurs (320, 390, 820, 1440 px), deux thèmes, axe WCAG A/AA, un seul H1/main, aucun ID dupliqué, aucune ancre cassée, copie, clavier, persistance et impression. Le parcours SaaS → guide → rechargement → SaaS observe `console.error` et `pageerror` sans filtrage ; le tableau ne contient aucun nœud texte entre ses balises structurelles.

La recette preview produit encore des avertissements de développement sur les parcours 404 techniques (balises script React) et sur la miniature vidéo de démonstration (LCP). Ils ne sont pas des erreurs d’hydratation des articles ; leur parcours réel est contrôlé séparément avec une liste d’erreurs console strictement vide.

Les captures PNG des deux routes publiques ont été observées côte à côte aux quatre largeurs et dans les deux thèmes. Les PDF des deux articles sont produits ; le PDF sombre du guide a été rendu et ses onze pages contrôlées, sur papier blanc, avec tableau, modèles, cartes et checklist lisibles. Les artefacts restent ignorés dans `tests/visual-artifacts/` et sont collectés par la CI. Ces preuves sont locales ; aucun rendu en production n’est déduit de cette recette.

## Réserves et suite

Le dépassement de budget JavaScript de l’accueil est documenté dans l’audit des étapes 1–3 et antérieur aux migrations du blog. La mesure reste 221,45 Kio gzip FR/EN ; le plafond de 150 Kio n’est pas relevé. Le correctif relève de l’optimisation de l’accueil, pas d’une modification du contenu du guide. Les avertissements de tokens existants restent signalés.

Les composants et styles historiques, le moteur MDX et sa fixture de compatibilité sont volontairement conservés. Aucune suppression du chantier de nettoyage de l’étape 6 n’est effectuée. Cette étape devra notamment remplacer le pilote historique avant de retirer son contrôleur, retirer la fixture MDX avec le chargement dynamique et conserver les contrats de contenu, de SEO et de sauvegarde comme protections de non-régression.
