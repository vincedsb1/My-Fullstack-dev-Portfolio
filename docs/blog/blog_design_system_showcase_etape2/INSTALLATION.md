# Installation — Blog Design System + Showcase (étape 2)

## Contenu du ZIP

- `src/app/components/blog/design-system/blog-design-system.css` : palette/tokens +  composant styles, scoped `.blog-ds`.
- `src/app/components/blog/design-system/BlogUI.tsx` : éléments éditoriaux réutilisables.
- `src/app/components/blog/design-system/BlogReadingControls.tsx` : sommaire, lecture, PDF et retour en haut.
- `src/app/components/blog/design-system/BlogShowcaseInteractive.tsx` : checklist et questionnaire interactifs de démonstration.
- `src/app/components/blog/design-system/BlogShowcase.tsx` : page Showcase complète.
- `src/app/(localized)/[locale]/blog/showcase/page.tsx` : route Next.js française, statique, `noindex`.
- `docs/blog/DESIGN_SYSTEM.md` : décisions de design, tokens, contrats et checklist de validation.
- `preview/showcase-preview.html` : aperçu HTML autonome à ouvrir dans un navigateur (prévisualisation représentative, **pas** le composant React de production).

## Installation dans le dépôt

1. Depuis la racine du dépôt, décompresser l'archive en préservant son arborescence.
2. Le patch n'édite **aucun fichier existant** du dépôt : il n'ajoute que les fichiers ci-dessus.
3. Lancer le serveur local et ouvrir `http://localhost:3006/fr/blog/showcase`.
4. Vérifier `http://localhost:3006/fr/blog/guide-premier-emploi-developpeur` et `http://localhost:3006/fr/blog/internationaliser-saas-lancement` : ils doivent être inchangés.
5. Tester sombre/clair, mobile, clavier, questionnaire, checkbox et impression.
6. Exécuter les commandes de validation du projet (`npm run lint`, `npm run blog:validate`, `npm run build`, `npm run blog:test:seo`).

## Publication / confidentialité

La route a un `robots: noindex, nofollow` et n'est pas référencée dans l'index du blog ou son sitemap. **Elle reste accessible à quiconque possède l'URL directe**. Pour une route véritablement privée, ajouter une restriction d'accès côté serveur ou au niveau du déploiement avant de publier.

## Portée

Ne pas migrer les articles à cette étape. La direction graphique de ce Showcase reste une proposition à valider avant de devenir la référence de production.
