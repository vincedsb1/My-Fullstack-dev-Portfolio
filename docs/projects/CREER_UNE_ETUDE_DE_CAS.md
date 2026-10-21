# Créer une étude de cas à partir du template Iconise

La page Iconise est la référence visuelle. Toutes les fiches utilisent le même
composant `src/app/components/projects/ProjectCaseStudyTemplate.tsx`. Leurs données
sont chargées depuis des fichiers JSON locaux ; aucune base de données ni requête
HTTP de contenu n’est nécessaire. Les routes existantes génèrent les pages au build.

## Ce qui est commun et ce qui change

| Élément                                                                    | Source                                                                               |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Ordre des sections, layout, espacements, couleurs, animations, responsive  | `src/app/components/projects/ProjectCaseStudyTemplate.tsx` et ses composants enfants |
| Titres de sections, navigation, contact et libellés génériques             | Entrée `caseStudy` de `src/i18n/fr.json` et `src/i18n/en.json`                       |
| Textes, workflow, architecture, défis, technologies et résultats du projet | `src/content/projects/manifests/<locale>/<slug>.json`                                |
| Titre et libellés accessibles propres à la vidéo                           | Objet `video` du JSON ; libellés génériques localisés en secours                     |
| Identité du projet, liens externes vérifiés, ordre et statut par langue    | `src/content/projects/catalog.ts`                                                    |
| Fichiers image                                                             | `public/`, référencés par leur chemin public dans le JSON                            |
| Illustrations en composants                                                | `ProjectVisualFrame.tsx`, sélectionnées par `hero.visual.imageId`                    |

Ne pas dupliquer le JSX ou le CSS d’Iconise pour ajouter un projet. Une évolution
du template commun s’applique à toutes les fiches : elle doit être vérifiée sur
les fiches déjà disponibles.

## Ajouter le contenu

1. Copier `docs/projects/CASE_STUDY_TEMPLATE.json` dans
   `src/content/projects/manifests/fr/<slug>.json`.
2. Remplacer les textes explicitement marqués « à compléter », le slug et
   `projectId` par ceux du projet du catalogue. Le modèle est une fixture hors
   publication : pour une fiche destinée au portfolio public, passer `status` à
   `published` et `seo.noindex` à `false` dès l’intégration. Réserver `draft` et
   `seo.noindex: true` à une demande explicite de brouillon. Les informations
   doivent provenir du contenu fourni ou de sources vérifiées.
3. Renseigner les médias et les icônes disponibles. Retirer une section facultative
   sans contenu plutôt que conserver les données d’Iconise ou inventer un média.
4. Créer `en/<slug>.json` uniquement si le contenu anglais est disponible, avec
   `locale: "en"`. Les identifiants du projet, du workflow et des nœuds restent
   stables entre les langues. Les textes sont indépendants ; aucun fallback
   éditorial silencieux ne remplace une langue absente.
5. Importer les JSON dans `src/content/projects/manifests/index.ts` avec
   l’attribut `with { type: "json" }`, puis les ajouter à `sources`. Le registre
   valide chaque JSON et refuse les doublons ainsi que les fixtures.
6. Renseigner pour chaque langue disponible `caseStudyByLocale` dans `catalog.ts` :
   `status: "published"` et `manifestFile` pointant vers son JSON. Conserver
   `not-started` pour une langue dont la fiche n’existe pas. Les routes utilisent
   ce catalogue et le registre : aucun nouveau fichier de page n’est nécessaire.

Les fiches intégrées au portfolio sont publiques et indexables par défaut,
conformément à la consigne du propriétaire. Aligner le statut du catalogue et
celui du JSON sur `published`, avec `seo.noindex: false`. Allaw, Iconise, Suggst
et SmartFlow suivent cette règle dans les deux langues. Les fixtures de
développement restent hors publication et non indexables. Ce statut local
n’autorise ni push ni déploiement.

## Champs et sections

Le modèle contient les blocs de la page Iconise, dans l’ordre du renderer :

1. `hero` : accroche, introduction, badge et visuel d’ouverture.
2. `overview` : problème, solution, public, contribution et périmètre.
3. `video` : démonstration facultative, source vérifiée, titre et libellés accessibles.
4. `workflow` : étapes avec leur représentation visuelle.
5. `architecture` : nœuds, relations et nœuds mis en avant.
6. `gallery` : galerie facultative ; absente du modèle de base et d’Iconise.
7. `challenges` : contraintes et solutions, quatre cartes affichées au maximum.
8. `stack` : identifiants des technologies.
9. `outcomes` : trois résultats affichés au maximum.

La navigation entre projets et le footer sont gérés par le template. Les champs
`meta` et `seo` accompagnent chaque contenu. Les données historiques `decisions`
et `limitations` d’Iconise sont conservées dans ses JSON ; le template actuel ne
les affiche pas comme sections supplémentaires.

La structure et les types acceptés sont définis dans `types.ts` et contrôlés à
l’exécution dans `manifest-shape.ts`. Les fautes de noms de champs sont signalées.
JSON n’accepte pas les commentaires : utiliser ce guide pour les explications.

### Médias et icônes

- `hero.visual.type` : `image`, `mockup`, `illustration`, `diagram` ou `placeholder`.
  Une image utilise `src` et `alt`. Une illustration existante utilise `imageId` :
  `iconise-product-figure` conserve l’illustration actuelle d’Iconise.
- `workflow[].visual.type` : `icon`, `mockup`, `flow` ou `result`. Les icônes du
  workflow sont `sparkles`, `code`, `database`, `monitor`, `workflow` et `layers`.
- `architecture.nodes[].icon` : `browser`, `client`, `api`, `service`, `worker`,
  `async`, `database`, `storage`, `cloud`, `code`, `globe` ou `default`.
  `featuredNodeIds` sélectionne jusqu’à quatre nœuds dans l’ordre d’affichage.
  Les relations doivent référencer des identifiants de nœuds existants.
- `video` : le lecteur actuel utilise YouTube. Renseigner `provider: "youtube"`,
  `url`, `verified: true`, `playLabel` et `regionLabel` dans la langue
  du fichier. Omettre `video` pour masquer la section. Une source non vérifiée
  conserve une façade d’indisponibilité ; aucune vidéo d’exemple n’est publiée.
- `stack` : utiliser les identifiants de `technologyIds` dans `types.ts`.

Une nouvelle illustration en code peut être ajoutée au registre de visuels ;
le JSON référence ce composant, il ne contient pas de JSX. Le dessin interne
d’une illustration existante conserve son contenu et son comportement.

## Vérifier la fiche

```sh
npm run projects:validate
npm run lint
npm run build
```

`projects:validate` vérifie les vrais fichiers JSON, leur correspondance avec le
catalogue, le modèle à remplir et les fixtures de développement. Cette validation
s’exécute aussi avant `dev` et `build`. Une erreur de JSON ou de contrat bloque le
chargement et le build avec un chemin de champ explicite.

Observer ensuite `/fr/projets/<slug>` et `/en/projects/<slug>` lorsque ces langues
sont présentes : desktop et mobile, clair et sombre, clavier et mouvements réduits.
Les textes longs doivent être vérifiés dans le rendu réel, même si la structure
JSON est valide. Pour une migration sans changement graphique, comparer les
captures avant/après, le contenu, les dimensions des sections et les métadonnées.

## Prompt pour une prochaine fiche

Utilise le template commun des études de cas, dont Iconise est la référence
visuelle. Lis ce guide, puis ajoute le contenu fourni dans les JSON du projet et
enregistre-les dans le catalogue et le registre. Conserve les styles, les
espacements, l’ordre des sections et les animations. Utilise uniquement les médias
et traductions disponibles. Signale les informations manquantes sans les inventer,
puis valide les données, le build et le rendu responsive dans les deux thèmes.
