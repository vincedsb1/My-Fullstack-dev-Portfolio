# On-Page SEO — re-audit 2026-09-09

## Résolu

- **Canonical par route** — `/en` et `/fr` s'auto-canonicalisent sur le bon domaine.
- **hreflang** — 3 alternates (`en`, `fr`, `x-default`) par page.
- **Métadonnées localisées** — `/fr` sert « Portfolio de Vincent » et une description
  française. Les clés `metadata.*` de `src/i18n/fr.json`, jusqu'ici inutilisées, sont
  désormais lues par `generateMetadata`.
- **Liens crawlables** — de 3 `href` à 8 uniques dans le HTML serveur. Les 4 profils
  (LinkedIn, GitHub, X, Malt) et le CV PDF sont désormais des ancres réelles avec
  `rel="me"`, au lieu de `<button onClick={window.open()}>`.
- **Bloc FAQ** — possède maintenant son propre `H2` (« Do you have any questions? »).
  La page compte 4 `H2` au lieu de 3, et les 5 questions ne sont plus rattachées à
  la section « Journey ».

## Plan de titres actuel (`/en`)

```
H1  Vincent DESBROSSES
  H2  Skills            → 6 H3 (Design & Product, Front-end, Back-end, Desktop,
                                DevOps, AI-assisted Development)
  H2  Projects          → Allaw ×2, Other Projects → 9 H4
  H2  Journey           → 8 H3
  H2  Do you have any questions?  → 5 H3
```
Un `H1`, hiérarchie sans saut de niveau. **Structure correcte.**

## Reste

### Medium — « Allaw » apparaît 3 fois en titre
Deux `H3` consécutifs sous *Projects*, un troisième sous *Journey*. Trois entités
distinctes (le produit, l'étude de cas, le poste occupé) portant le même libellé.
Qualifier chacune, p. ex. « Allaw — plateforme d'annuaire juridique » vs
« Allaw — Lead developer (2023-2026) ».

### High — titre et description encore génériques
`« Vincent's portfolio »` / `« Portfolio de Vincent »` ne portent aucun signal de
recherche : ni métier, ni stack, ni statut freelance. La mécanique i18n est en place,
seules les chaînes sources restent à réécrire. Reporté par le propriétaire (éditorial).

C'est aujourd'hui le premier frein On-Page restant, et le moins coûteux à lever.
