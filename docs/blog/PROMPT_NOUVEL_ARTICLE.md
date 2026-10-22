# Prompt de création d’un article

Renseigner le sujet, l’objectif, le public, la langue, les notes, les ressources vérifiables et les contraintes. La publication est française pour le moment ; ne pas produire une traduction artificielle.

## Consignes pour l’agent

1. Lire `AGENTS.md`, `docs/blog/ARCHITECTURE.md`, `CREER_UN_ARTICLE.md`, `JSON_ENGINE.md` et le gabarit `ARTICLE_TEMPLATE.json`.
2. Examiner les deux sources du catalogue avant de choisir un titre, un slug et une catégorie. Respecter les notes : ne fabriquer ni expérience, chiffre, citation, source, date ni résultat.
3. Créer un fichier `src/content/blog-json/fr/<slug>.json`. Utiliser `schemaVersion: 1`, les métadonnées requises, une introduction et des sections à IDs stables. Ne pas créer de page, de wrapper d’article ou de CSS spécifique.
4. Employer les blocs standards et le registre React existant. N’ajouter un composant React que pour un besoin métier absent ; enregistrer son contrat et ses props de façon explicite. Aucun HTML, script, import ou style arbitraire dans les données.
5. Pour une demande de publication, choisir `status: published`, sauf demande explicite de brouillon ; ne pas ajouter une approbation éditoriale bloquante. Utiliser la date réelle prévue pour cette publication. Ne changer `updatedAt` qu’après une révision éditoriale réelle.
6. Ajouter seulement des médias utiles, locaux, correctement décrits et dimensionnés. Pré-rendre les diagrammes. Vérifier les liens, les ancres, les projets et les éventuels articles associés.
7. Prévisualiser en développement avec `/fr/blog/json-preview?slug=<slug>` ; vérifier mobile, clair/sombre, clavier, lecture et interactions. Le titre est le H1 ; les sections produisent les H2 ; les titres de blocs sont H3/H4.
8. Exécuter `npm run blog:validate`, `npm run blog:test:json`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run blog:test:seo`. Pour une évolution du moteur, exécuter aussi les tests navigateur et les pilotes de publication/prévisualisation.
9. Vérifier les routes, le canonical, l’image sociale et le sitemap depuis le build local. Rapporter les contrôles rouges et les vérifications non réalisées.
10. Donner l’URL finale et les fichiers modifiés. Ne pas publier, pousser ou déployer sans autorisation correspondante. Ne pas migrer les deux articles MDX pendant une simple création d’article.
