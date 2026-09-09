# Schema / données structurées — re-audit 2026-09-09

## Résolu — le constat Critical initial est levé

L'audit initial relevait **zéro donnée structurée exploitable** : le schéma `Person`
transitait par le champ `other` des Metadata Next, rendu en
`<meta name="application/ld+json">` au lieu d'un `<script>`. Aucun analyseur ne le lisait.

Vérifié en production aujourd'hui :
```
<script type="application/ld+json">  : 1
<meta  name="application/ld+json">   : 0
JSON.parse                            : valide
```

## Contenu du bloc

```
@type      Person
name       Vincent DESBROSSES
url        https://vincent.desbrosses.net/en   (varie par locale)
image      https://vincent.desbrosses.net/pp.jpg   → HTTP 200, image/jpeg
jobTitle   Fullstack Developer
sameAs     4 profils
knowsAbout 8 entrées
655 octets, 10 clés
```

**Complétude** — champs requis (`@context`, `@type`, `name`) : présents.
Champs recommandés (`url`, `image`, `jobTitle`, `description`, `sameAs`, `knowsAbout`,
`email`) : tous présents.

**Résolution des `sameAs`** (vérifiée en HTTP) :

| Profil | Code |
|---|---|
| LinkedIn | 200 |
| GitHub | 200 |
| X / Twitter | 200 |
| Malt | **403** |

Le 403 de Malt est très probablement sa protection anti-robot, pas une URL morte — un
contrôle serveur ne permet pas de trancher. **À vérifier manuellement dans un navigateur.**
Si l'URL était réellement invalide, un `sameAs` non résolvable affaiblit la corroboration
d'entité au lieu de la renforcer.

## Conformité aux règles produit

- **Aucun `FAQPage` ajouté**, bien que la page contienne un bloc FAQ. Conforme : Google a
  retiré les résultats enrichis FAQ pour tous les sites le 7 mai 2026 — aucun bénéfice SERP.
  Le contenu n'étant pas un Q&A d'utilisateurs, `QAPage` ne s'applique pas davantage.
  Signalé en Info, aucune action.
- **Aucun `HowTo`** (déprécié depuis septembre 2023).
- Tous les champs correspondent à de l'information **réellement visible ou vérifiable**
  sur la page : nom (H1), intitulé de poste (hero), compétences (section Skills), profils
  (boutons visibles). Rien d'inventé.

## Point ouvert — `email`

`vincedsb@gmail.com` figure dans le schéma, mais **n'est affiché nulle part** sur la page :
le bouton « Email » ne fait que le copier dans le presse-papier. Les règles Google sur les
données structurées demandent que l'information balisée soit visible pour l'utilisateur.

Deux options cohérentes : afficher l'adresse, ou retirer le champ. L'état actuel est
défendable mais pas strictement conforme.

## Opportunités non retenues

`ProfilePage` et `WebSite` avaient été proposés lors de l'audit initial. Ils restent
possibles, mais l'apport est marginal pour un site de 2 URLs dont l'entité principale est
déjà correctement décrite. À ne considérer qu'après le travail éditorial.
