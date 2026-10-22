# Portfolio : conventions de travail

Lire `AGENTS.md` avant toute intervention. Le site utilise Next.js 16.4, React 19,
TypeScript, Tailwind CSS 3 et next-intl 4. Lire la documentation Next embarquée
sous `node_modules/next/dist/docs/` avant de modifier une API du framework.

- `src/app/` contient les routes et les styles de segment.
- `src/features/` regroupe accueil, projets, blog, guide et la page Julie Dieris.
- `src/components/` contient les primitives, le layout, le thème, les révélations et JSON-LD.
- `src/content/` contient les articles MDX, les manifestes et le catalogue projets.
- `src/i18n/routing.ts` définit les chemins FR/EN. `paths.ts` les construit avec des
  paramètres typés, sans charger la navigation client ; `navigation.ts` expose les
  adaptateurs next-intl quand une navigation client est nécessaire.
- `src/lib/site.ts` centralise l’identité, les contacts et l’origine du site.
- Le thème clair/sombre/système utilise le provider maison et le même résolveur
  pour son initialisation en ligne, y compris la 404 et la page autonome.
- Les sections statiques restent côté serveur. Les îlots reçoivent des données
  d’affichage : ne jamais importer les manifestes dans un composant client.
- Les tokens CSS et Tailwind portent couleurs, rayons, ombres et mouvement. Utiliser
  les primitives de `src/components/ui/` ; les illustrations gardent leur dessin.
- Le mouvement utilise CSS/WAAPI et la révélation progressive. Framer Motion ne
  subsiste que dans le workflow interactif, avec `LazyMotion`.
- Les fichiers d’origine des images optimisées sont conservés dans `assets-src/`,
  ignoré par Git. Les WebP publiés sont associés à leurs imports statiques.

Pour les fiches, lire `docs/projects/CREER_UNE_ETUDE_DE_CAS.md`. Pour les articles,
lire les trois guides de `docs/blog/`. Ne pas inventer de traduction, de résultat,
de source ou de date de publication. Les gabarits d’articles sont choisis par le
frontmatter `renderer`, pas par leur slug.

`npm run dev` écoute sur 3006. Les vérifications sont `npm run lint`, `npm test`,
`npm run build`, `npx tsc --noEmit`, `npm run blog:test:seo` et `npm run test:e2e`.
La CI lance ces contrôles et Chromium. `npm run analyze` produit un rapport de bundle avec Webpack. La galerie des primitives est disponible
uniquement en développement à `/fr/preview/ui` et `/en/preview/ui`.

Préserver les modifications présentes. Ne pas committer, pousser, déployer,
réécrire l’historique ou changer les secrets sans instruction explicite.
