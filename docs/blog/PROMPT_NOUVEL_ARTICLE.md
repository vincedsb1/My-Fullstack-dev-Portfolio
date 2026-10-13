# Prompt de création d’un article

Copie ce formulaire dans Codex ou Claude Code et complète les champs utiles. Le statut publié est le choix par défaut.

```text
SUJET :
[SUJET]

OBJECTIF :
[OBJECTIF]

PUBLIC CIBLE :
[PUBLIC]

LANGUE :
[LANGUE]

NOTES :
[NOTES]

RESSOURCES :
[RESSOURCES]

CONTRAINTES :
[CONTRAINTES]
```

## Consignes pour l’agent

1. Lis les instructions du dépôt (`AGENTS.md` ou `CLAUDE.md`) et la documentation de `docs/blog/`.
2. Vérifie les articles existants et les conventions avant de choisir un titre, un slug et une catégorie.
3. Rédige un article naturel, utile et précis. Préserve le sens des notes et n’invente pas d’expérience, de chiffre, de source, de citation ni de résultat.
4. Crée un seul fichier `src/content/blog/<locale>/<slug>.mdx` avec tous les champs requis. Choisis `status: published` sauf demande explicite de brouillon. N’impose aucune relecture bloquante.
5. Utilise la date réelle de première publication. Vérifie le contenu et l’historique du dépôt ; si elle reste inconnue, demande la date avant de la renseigner.
6. Ajoute uniquement les médias qui améliorent réellement l’article. Vérifie leurs droits, textes alternatifs, chemins locaux et dimensions. Pré-rends les diagrammes Mermaid en SVG/PNG.
7. Utilise `<YouTubeEmbed>`, `<Figure>`, `<Diagram>`, `<Callout>` et les blocs de code documentés si nécessaire.
8. Garde le H1 généré depuis `title` et commence le corps au niveau H2. Vérifie les liens, les chemins locaux d’images, le rendu MDX, l’accessibilité clavier, les contrastes, le mode sombre et la largeur mobile.
9. Lance `npm run blog:validate`, puis `npm run build` et `npm run blog:test:seo`. Vérifie que la route, l’image sociale et le sitemap contiennent l’article publié. Retire tout fixture temporaire.
10. Donne l’URL finale `/<langue>/blog/<slug>`, les modifications, les contrôles exécutés et toute vérification non réalisée.

Les articles français sont accessibles sous `/fr/blog`. Une route anglaise n’est publiée que si un fichier anglais réel existe. Le build et le sitemap s’actualisent à partir du frontmatter ; aucun registre d’articles ne doit être modifié à la main.
