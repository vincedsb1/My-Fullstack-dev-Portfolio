# Livraison cumulative — étapes 2 + 3 du blog

Dépôt : `vincedsb1/My-Fullstack-dev-Portfolio` (référence main `1b217e7790ef3429ceadf37c176143122107a005`). Ce ZIP est **cumulatif** : il contient les composants design system de l'étape 2 ainsi que le moteur JSON de l'étape 3. Aucune installation de package supplémentaire n'est requise.

## Avant l'intégration

Créer une branche de travail depuis une copie à jour du dépôt. Si le `main` a changé depuis le commit de référence, **revoir les trois fichiers remplacés** avant écrasement :

- `src/lib/blog/articles.ts` — catalogue MDX + JSON ;
- `src/app/(localized)/[locale]/blog/[slug]/page.tsx` — délégation conditionnelle du rendu JSON, SEO conservé ;
- `scripts/validate-blog.mjs` — validation commune des articles.

Les autres fichiers sont des ajouts ou des modifications localisées des fichiers de l'étape 2 (`BlogUI`, `BlogShowcase`, `BlogReadingControls`, CSS). La route et les articles MDX historiques ne sont pas migrés.

## Installation depuis la racine du dépôt

```bash
# Exemple : archive téléchargée dans ~/Downloads
unzip -o ~/Downloads/blog_etape3_moteur_json.zip -d .

# Adapter impérativement le contrôle SEO historique à la prise en charge du JSON
node scripts/patch-blog-json-seo-tests.mjs

# Valider les règles JSON indépendamment de Next.js
node --test tests/*.test.mjs

# Contrôles d'intégration (dépendances npm du dépôt installées)
npm run blog:validate
npm run lint
npx tsc --noEmit
npm run build
npm run blog:test:seo

# Voir le rendu en local
npm run dev
```

- `http://localhost:3006/fr/blog/showcase` : Showcase enrichi des blocs lus du JSON.
- `http://localhost:3006/fr/blog/json-preview` : vrai renderer d'article JSON, **disponible uniquement en développement**.
- `http://localhost:3006/fr/blog/json-demo-blog` : doit rester 404 (`status: draft`).
- Les deux articles déjà publiés conservent leurs URL et leurs renderers actuels.

L'adaptation SEO est idempotente et s'arrête si le fichier de test ne correspond plus à la structure attendue (aucun remplacement silencieux). Elle ne remplace pas `scripts/test-blog-seo.mjs` dans cette archive, mais le modifie de façon contrôlée **après extraction**.

## Publier un nouvel article JSON

Créer `src/content/blog-json/fr/<slug>.json` en copiant les conventions du fichier de démo, **sans reprendre son faux contenu**, puis renseigner `meta.status: "published"`. L'article rejoint les routes, l'index, le sitemap et les images sociales. En anglais, publier une vraie traduction française correspondante avec `translationKey` commune.

**Important :** le code est validé par tests unitaires et parsing de fichiers, **pas par compilation Next.js complète** dans l'environnement de création du livrable. Ne pas fusionner en production sans exécuter les vérifications ci-dessus. Le plan de consolidation esthétique de l'étape 2.1 demeure distinct ; les modules très spécifiques aux deux articles seront migrés aux étapes 4/5.
