# Étape 4 — migration SaaS vers le moteur JSON

## Périmètre et référence

Migration autorisée après l’audit des étapes 1 à 3, sur `dev04`, le 22 octobre 2026. Référence avant conversion : `04c6e150ab2c48217921a27eb5db216773b47ba1`. Le guide reste en MDX ; aucune intervention sur `main`, fusion ou mise en production.

L’article est désormais porté par [`internationaliser-saas-lancement.json`](../../src/content/blog-json/fr/internationaliser-saas-lancement.json). L’URL reste `/fr/blog/internationaliser-saas-lancement`. La source MDX correspondante a été retirée du catalogue dans la même bascule pour éviter une collision ; les composants historiques restent disponibles pour le retour arrière et le nettoyage ultérieur.

## Conservation du contenu

[`contracts/internationaliser-saas-v1.json`](contracts/internationaliser-saas-v1.json) est un export du DOM MDX réalisé **avant** la conversion : contenu dans son ordre réel, formats riches, liens, modules, métadonnées et JSON-LD. Il conserve également les empreintes SHA-256 du MDX original, du fichier des cinq widgets et de l’image sociale originale. Ce contrat est une référence de test, pas une seconde source éditoriale ; ne pas le régénérer depuis le JSON pour faire passer un test.

Le passage a d’abord été préparé sous `internationaliser-saas-migration`, en `draft`, pendant que l’article public restait en MDX. Le brouillon temporaire a été retiré après la comparaison, avant la livraison.

| Élément | Résultat |
|---|---|
| Texte | 26 paragraphes, dont le premier devient un bloc `lead` ; aucun texte réécrit |
| Formats | Deux listes / six items, trois emphases, lien Iconise et code en ligne `hreflang` conservés |
| Chapitres | Cinq H2, titres et ordre inchangés |
| Fragments historiques | `accessible`, `complexite`, `marches`, `demande`, `decision`, ainsi que `article-top` et `article-body` |
| Navigation | Sommaire dérivé des cinq sections, guide associé et projet Iconise accessibles |
| Habillage éditorial | Illustration 6 × 6 / douze cellules accentuées, titre accentué, CTA, lettrine, note de lecture, signature « La suite se mesure. » et biographie conservés |
| Langue | Français uniquement ; aucune traduction ajoutée |

Les tests Node confrontent les blocs et leurs formats à l’export MDX. Les tests navigateur refont cette confrontation sur le HTML rendu, y compris le texte initial des cinq widgets. La présence du contenu, des liens et des anciennes ancres est également vérifiée sans JavaScript.

## Cinq modules réutilisés

`InternationalisationArticleModules.tsx` conserve exactement son empreinte avant migration : aucune deuxième logique métier n’a été créée.

| Registre | Vérifications réelles |
|---|---|
| `saas-mosaic` | Six langues et leurs textes |
| `saas-language-demo` | Deux sélecteurs indépendants, aperçu d’interface anglais et contenu japonais |
| `saas-language-matrix` | 36 cellules, douze cas signalés, sélection, flèches, Home/End et focus unique |
| `saas-acquisition-funnel` | Quatre étapes et mention explicite du caractère conceptuel |
| `saas-decision-tree` | Trois questions, huit combinaisons de réponses, résultats et réinitialisation |

Ces contrôles ont été exécutés sur le brouillon JSON, puis sur la route finale. Le Showcase réutilise ces mêmes modules.

## Architecture livrée

Le catalogue, les routes statiques, le sitemap, l’index, les images sociales et la construction SEO restent communs aux sources MDX et JSON. Aucune page Next.js ni branche conditionnelle par slug n’a été ajoutée pour cet article.

L’illustration existante a été extraite dans `InternationalisationHeroArt.tsx`, composant serveur partagé par le gabarit historique, le registre JSON et le Showcase. Le module `saas-hero`, sans props, est limité au hero et au français. Il ne contient aucune logique interactive et ne remplace pas l’un des cinq widgets.

Les extensions facultatives du schéma v1 sont typées et validées :

- `hero.eyebrow` : libellé éditorial affiché, sans altérer la catégorie SEO ;
- `hero.titleHighlight` : première occurrence d’un extrait exact du titre, rendu comme texte échappé ;
- `readingNote: {title, content}` : note de sommaire en texte riche validé, rendue au serveur ;
- `legacyAnchors: {top?, content?}` : anciens fragments, contrôlés dans le même espace d’IDs que les sections et widgets.

Le texte final utilise `afterBlocks`, le guide `related.slugs` et le projet `meta.relatedProjects`, déjà disponibles. La carte auteur commune conserve la biographie française existante et réutilise `Avatar` du portfolio pour ses portraits. Aucune dépendance n’a été ajoutée ; le JSON ne contient ni HTML, ni import, ni style ni JavaScript exécutable.

Un nouvel article standard nécessite toujours uniquement son JSON et ses éventuels médias. Ces options sont facultatives ; un composant métier nouveau passe par le registre explicite.

## Parité visuelle et accessibilité

Comparaisons locales avant/après à 320, 390, 820 et 1440 px, dans les deux thèmes. La référence originale et le rendu final ont été capturés sur le même environnement macOS/Chromium, depuis un build de production local ; le brouillon intermédiaire a aussi été observé dans le preview de développement.

Le rendu reprend les composants du design system validé : fonds et contrastes communs, colonne de 720 px, titres de section standardisés, sommaire automatique avec titres complets, boutons et carte auteur communs. Les retours à la ligne, positions et hauteurs de page évoluent avec cette harmonisation ; la conservation revendiquée est éditoriale, fonctionnelle et graphique, pas une identité pixel par pixel de l’ancien gabarit spécialisé.

Le contrôle couvre un H1 et un `main`, l’unicité des IDs, les ancres, l’absence de débordement, axe, les thèmes et le mouvement réduit. Le clavier parcourt réellement les liens du sommaire mobile et de bureau ; le focus arrive sur les cinq sections. Les widgets sont testés à la souris et au clavier.

Deux corrections visuelles ont été nécessaires : les marges des paragraphes imbriqués de l’introduction et une carte de projets liés noire à l’impression depuis le thème sombre. La carte partagée utilise maintenant les tokens éditoriaux dans le shell JSON, y compris leurs valeurs d’impression. Une assertion contrôle son fond blanc et la visibilité de ses liens avant chaque PDF.

Les PDF A4 du SaaS ont été rendus et examinés, y compris les huit pages issues du thème sombre après correction : papier blanc, illustration claire, contenu et modules lisibles, projet Iconise présent. Les commandes et le chrome du site sont masqués. Le guide conserve aussi ses contrôles d’impression.

Les E2E et le preview produisent **48 PNG et 6 PDF**, ignorés par Git et archivés par le workflow qualité. Les captures SaaS publiées portent désormais `blog-saas-json-*` ; les anciennes références MDX restent disponibles dans les artefacts de l’audit et dans l’historique CI. Aucun PNG/PDF n’est ajouté aux sources.

## SEO et publication statique

La comparaison navigateur porte sur le titre de document, toutes les balises meta/canonical/hreflang exportées avant conversion et les blocs JSON-LD. Ils sont identiques. Le SHA-256 du PNG social servi reste `83e17740d6706a083ed7cb2b97d82572c61bf8649ebfccef835fac8f3b63ce66`.

La date de publication reste `2026-10-19`. Aucun `updatedAt` artificiel n’est ajouté. `seoTitle`, titre H1, description, extrait, catégorie, auteur, projet lié, URL canonical, Open Graph et données structurées sont conservés. Seul le champ MDX `renderer: editorial` disparaît des métadonnées JSON ; le format du catalogue choisit le moteur générique.

Le build pré-rend la route et son image sociale. Les tests SEO vérifient aussi l’index, le sitemap, les redirections du guide, l’exclusion du brouillon de démonstration et les 404 anglais. Le preview reste absent de la production.

## Recette locale finale

| Commande | Résultat |
|---|---|
| `npm ci` | Réussi ; audit de dépendances : zéro vulnérabilité |
| `npm run blog:validate` | Réussi ; deux articles publiés, un brouillon ; SaaS JSON et guide MDX |
| `npm run blog:test:json` | 24 tests réussis |
| `npm run lint` | Zéro erreur ; cinq avertissements de tokens préexistants hors de ces changements |
| `npm test` | 11 tests réussis |
| `npx tsc --noEmit` | Réussi |
| `npm run build` | Réussi ; routes statiques et images générées |
| `npm run blog:test:seo` | Réussi |
| `npm run test:e2e` | 26 tests réussis, dont parité SaaS, SEO exact, image sociale et lecture sans JavaScript |
| `npm run blog:test:publication` | Deux tests réussis ; pilote FR/EN et sauvegardes du guide ; données temporaires retirées et build normal restauré |
| `npm run blog:test:preview` | Deux tests réussis ; fixture et SaaS, quatre largeurs et deux thèmes |
| `npm run audit:verify` | **Échec** : accueil FR/EN à 221,45 Kio gzip pour un plafond de 150 Kio |

Les commandes de build, publication, preview et E2E ont été exécutées successivement pour éviter un conflit dans `.next`. Le pilote de publication a confirmé la compatibilité du format `vd_guide_checklist_v1` sans modifier le guide ni ses quatorze IDs.

Le dépassement JavaScript de l’accueil reste celui établi dans [l’audit précédent](AUDIT_FINAL_ETAPES_1_2_3.md) et confirmé par sa [CI](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/actions/runs/39831774893). La mesure locale reste 221,45 Kio après la migration, le seuil reste 150. Le socle Next/React et les composants d’accueil sont un chantier distinct ; aucune amélioration en production n’est revendiquée ici. La validation globale ne peut donc pas être présentée comme entièrement verte.

## Limites, retour arrière et suite

Les preuves portent sur le dépôt et des serveurs locaux. Aucun déploiement, contrôle de la production ou approbation visuelle humaine n’est revendiqué. Les polices et moteurs de rendu peuvent produire des écarts de capture entre macOS et Linux ; les comparaisons sémantiques et fonctionnelles ne dépendent pas de ces pixels.

Le retour arrière consiste à restaurer le MDX à partir de `04c6e15` et retirer son JSON dans la même modification, puis repasser les validations en adaptant les tests de migration. `ArticleLayouts`, le gabarit `editorial`, les styles et les contrôles historiques restent présents ; aucune réécriture d’historique n’est nécessaire.

**Verdict : étape 4 validée fonctionnellement et migration SaaS livrée sur la branche de travail, avec la réserve globale de performance ci-dessus.** Le guide peut faire l’objet de l’étape 5 sur demande distincte ; il n’est pas migré par ce lot. Le nettoyage de l’étape 6 reste différé.
