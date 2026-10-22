# Préparation de l’étape 4

Référence : consolidation `dev04` depuis `dev03` (`8ec765f`). Les décisions produit restent celles du 22 octobre 2026. L’[audit final des étapes 1 à 3](AUDIT_FINAL_ETAPES_1_2_3.md) est la référence des contrôles actuels ; les anciennes mentions de build non exécuté ou de modules non portés sont dépassées.

## Contrats établis

- Direction graphique SaaS, avec shell commun et chrome du portfolio réutilisé.
- JSON local pour les nouveaux articles standards ; composants spécifiques par registre fermé ; aucun HTML, JS, import ou style arbitraire issu des données.
- Cinq widgets SaaS existants réutilisés intégralement, FR uniquement, une occurrence de chaque module par article. Les huit décisions, la matrice et ses commandes clavier sont testées.
- Publication française ; infrastructure EN testée avec des données synthétiques temporaires, sans article traduit ajouté.
- Migration SaaS d’abord, puis guide ; aucune bascule des articles n’est réalisée dans cet audit.
- `vd_guide_checklist_v1`, ses 14 IDs ordonnés et ses libellés sont conservés. Le nouveau composant échange des sauvegardes avec l’ancien guide dans un vrai navigateur.

## Critères d’acceptation de la migration SaaS

1. Exporter le contenu et les métadonnées MDX à la révision auditée : paragraphes, titres, liens, emphases, ancres, visuels, projets et cinq widgets. L’inventaire détaillé de conservation appartient à l’étape 4.
2. Préparer un JSON `draft` avec un slug temporaire différent ; éviter aussi une `translationKey` dupliquée. Utiliser `/fr/blog/json-preview?slug=<slug>` en développement.
3. Comparer les rendus ancien/nouveau à 320, 390, 820 et 1440 px, clair/sombre, mouvement réduit, clavier et impression. Préserver le sens et les interactions ; contrôler les nouveaux espaces et titres dans le shell commun.
4. Vérifier la parité fonctionnelle : six langues, deux sélecteurs, 36 cellules, quatre étapes conceptuelles, trois questions et huit résultats possibles, reset et absence d’IDs en double.
5. Valider `blog:validate`, `blog:test:json`, lint, tests unitaires, TypeScript, build, SEO, E2E, pilote de publication et prévisualisation. Garder le contrôle du budget d’accueil séparément et expliciter son état rouge tant qu’il subsiste.
6. Basculer le MDX vers le JSON **atomiquement**, au même slug, sans collision, après la demande distincte de migration. Confirmer même URL, titre SEO, dates, canonical, JSON-LD, image sociale, liens et sitemap.
7. Ne pas supprimer les sources historiques réutilisées tant que les deux migrations ne sont pas validées. Conserver un retour possible au renderer MDX.

## État de la préparation

Le moteur permet la création d’un nouvel article standard en ajoutant un JSON, sans modifier le renderer générique. Le pilote local vérifie routes, index, métadonnées, hreflang, images et sitemap ; il nettoie ses sources puis reconstruit le site normal.

Les captures de [l’ancienne CI](https://github.com/vincedsb1/My-Fullstack-dev-Portfolio/actions/runs/39819779089) ont été téléchargées et confrontées au dépôt. Les références consolidées ajoutent le guide, le shell de prévisualisation, les états et les PDF.

Le budget JavaScript d’accueil de 150 Kio reste dépassé : environ 221 Kio avant et après l’intégration du blog, à dépendances identiques. Il relève du socle Next/React et des composants d’accueil, notamment du carrousel animé ; le seuil est conservé. Cette réserve interdit d’annoncer une validation globale entièrement verte et doit être traitée comme chantier distinct.

Le verdict précis et les limites de preuve sont consignés dans l’audit final. La migration de l’article n’est pas démarrée par ce document.

## Suite donnée après autorisation de l’étape 4

La migration demandée séparément est maintenant réalisée sur `dev04`. Ce document conserve les critères d’entrée ci-dessus ; l’état livré, les comparaisons avant/après et les limites sont décrits dans [ETAPE_4_MIGRATION_SAAS.md](ETAPE_4_MIGRATION_SAAS.md). Le guide n’est pas migré.
