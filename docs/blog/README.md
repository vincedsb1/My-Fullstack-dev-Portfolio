# Blog — documents de référence

Branche de consolidation : `dev04`, issue de `dev03` à `8ec765f38b3bc0e69b41a7230f2404e8c5a5e902`. Les étapes 1 à 3 sont auditées. Les étapes 4 et 5 migrent les deux articles vers le même moteur JSON, à URLs, contenus et SEO constants ; la checklist du guide conserve les sauvegardes historiques. Le nettoyage de l’étape 6 reste distinct. Aucun déploiement en production.

## Lire et écrire

1. [AUDIT_FINAL_ETAPES_1_2_3.md](AUDIT_FINAL_ETAPES_1_2_3.md) : constats, corrections, preuves et verdict d’entrée en étape 4.
2. [ARCHITECTURE.md](ARCHITECTURE.md) : catalogue unique MDX/JSON et responsabilités.
3. [CREER_UN_ARTICLE.md](CREER_UN_ARTICLE.md), [JSON_ENGINE.md](JSON_ENGINE.md), [ARTICLE_TEMPLATE.json](ARTICLE_TEMPLATE.json) : création d’un article standard en JSON local.
4. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) : composants effectivement partagés, variantes et impression.
5. [ETAPE_4_MIGRATION_SAAS.md](ETAPE_4_MIGRATION_SAAS.md) : migration, parité et recette ; [PREPARATION_ETAPE_4.md](PREPARATION_ETAPE_4.md) garde les critères d’entrée.
6. [ETAPE_5_MIGRATION_GUIDE.md](ETAPE_5_MIGRATION_GUIDE.md) : bascule publique du guide, identité commune, contenu et sauvegardes ; [PREPARATION_ETAPE_5.md](PREPARATION_ETAPE_5.md) conserve les critères d’entrée.
7. [contracts/internationaliser-saas-v1.json](contracts/internationaliser-saas-v1.json) : export du rendu MDX avant migration, contenu et SEO ; [contracts/guide-checklist-v1.json](contracts/guide-checklist-v1.json) : clé, format, 14 IDs et libellés à conserver.

[01_inventaire_reference_visuelle_blog.md](01_inventaire_reference_visuelle_blog.md) et [03_audit_critique_showcase_blog.md](03_audit_critique_showcase_blog.md) conservent l’analyse historique du prototype. Leur actualisation `dev04` distingue ce qui a été résolu des observations de l’ancien commit. L’[aperçu HTML](previews/showcase-preview.html) est historique et non contractuel ; la référence est la route React.

## Points d’entrée

- `src/content/blog-json/fr/<slug>.json` : nouveaux articles ; `src/content/blog/` : fixture MDX technique non publiée.
- `src/lib/blog/` : types, validation, registre de contrats et catalogue unifié.
- `src/features/blog/design-system/` : bibliothèque éditoriale ; `src/features/blog/json/` : renderer, shell et checklist.
- `/fr/blog/showcase` : catalogue réel, non indexé.
- `/fr/blog/json-preview?slug=<slug>` : prévisualisation d’un JSON en développement uniquement ; 404 en production.

Les commandes de validation et les captures sont décrites dans l’audit. `audit:verify` conserve le plafond de 150 Kio ; le dépassement de l’accueil existait avant les étapes du blog. Les résultats fonctionnels et cette réserve globale sont rapportés séparément.
