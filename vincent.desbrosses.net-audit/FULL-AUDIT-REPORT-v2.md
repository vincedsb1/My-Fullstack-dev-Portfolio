# Audit SEO — re-audit du 2026-09-09 (post-déploiement)

**Site :** vincent.desbrosses.net · Portfolio de freelance · Next.js 16 + next-intl · Vercel
**Périmètre :** 2 URLs (`/en`, `/fr`) — `/integration` supprimée depuis l'audit initial

## Score de santé SEO : 40 → **75** / 100

| Catégorie | Poids | Avant | Après | Δ |
|---|---|---|---|---|
| Technical SEO | 22 % | 25 | **88** | +63 |
| Content Quality | 23 % | 58 | **66** | +8 |
| On-Page SEO | 20 % | 30 | **72** | +42 |
| Schema | 10 % | 5 | **85** | +80 |
| Performance (CWV) | 10 % | 78 | *78* | non re-mesuré |
| AI Search Readiness | 10 % | 35 | **58** | +23 |
| Images | 5 % | 62 | **72** | +10 |

> ⚠️ **La note Performance est reportée, pas mesurée.** Le quota PSI était épuisé (HTTP 429)
> et Chrome n'a pas pu être lancé pour Lighthouse. La valeur de 78 provient de l'audit
> initial, réalisé sur une architecture différente (rendu dynamique, désormais SSG).
> **10 % du score total repose donc sur une donnée périmée.** Score hors Performance : 74.

## Les 6 constats Critical/High initiaux sont tous levés

Vérifiés en production, pas seulement dans le code :

| Constat initial | État |
|---|---|
| Canonical/hreflang/og vers un domaine NXDOMAIN | Résolu |
| Sous-pages canonicalisées vers l'accueil | Résolu — canonical par route |
| Aucune donnée structurée exploitable | Résolu — `Person` JSON-LD valide |
| HTTP 500 sur les chemins pointés | Résolu — 404 propres |
| 3 liens crawlables sur tout le site | Résolu — 8 `href`, 6 URLs uniques |
| En-têtes de sécurité absents | Résolu — 5 en-têtes |

Gains d'infrastructure au passage : `/en` et `/fr` passés en **SSG**, servis depuis le cache
edge Vercel (`x-vercel-cache: HIT`, `x-nextjs-prerender: 1`), TTFB mesuré à **147–306 ms**.

---

## Nouveaux constats de ce tour

### HIGH — 18 % du contenu est invisible aux extracteurs
Les 5 réponses de la FAQ (~140 mots sur 752) sont dans des panneaux d'accordéon fermés :
`CustomAccordion.tsx:42-44` produit `aria-hidden="true"` + `max-h-0 opacity-0`.

**À cadrer correctement — ce n'est PAS un problème d'indexation Google.** Vérifié : le texte
est bien dans le HTML brut et compte dans les 752 mots ; Google indexe le contenu
d'accordéons. Le problème concerne les **extracteurs de contenu** (type trafilatura) utilisés
par certains pipelines d'IA : testés en mode par défaut *et* en `favor_recall`, ils écartent
ces réponses dans les deux cas.

Or ce sont les seuls passages en prose, à la première personne, réellement citables de la
page — exactement ce qu'un moteur de réponse chercherait. Correctif : révéler le panneau aux
lecteurs non interactifs (CSS/ARIA), sans réécriture de contenu.

### MEDIUM — dimensions `og:image` fausses
Lecture de l'en-tête JPEG du fichier servi : `pp.jpg` fait **1084 × 1084 px**, alors que
`[locale]/layout.tsx` déclare `og:image:width 819` / `og:image:height 823`. Valeurs codées en
dur, désynchronisées du fichier. Préférable : produire une carte dédiée **1200 × 630**.

### MEDIUM — libellés de compétences non traduits sur `/fr`
Les 6 catégories du bloc Skills sont identiques dans `en.json` et `fr.json`. Les `H2`
se traduisent correctement (Compétences, Projets, Parcours), pas les `H3`.

**Nuance : seuls 2 des 6 sont réellement fautifs.** « Front-end », « Back-end », « DevOps »
et « Desktop » sont l'usage courant du français technique — les traduire dégraderait le
texte. Seuls **« Design & Product »** et **« AI-assisted Development »** lisent comme non
traduits (→ « Design & Produit », « Développement assisté par IA »).

### MEDIUM — « Allaw » toujours en triple `H3`
Non corrigé depuis l'audit initial : deux fois sous *Projects*, une fois sous *Journey*.
Trois entités distinctes sous un libellé identique.

### INFO — `sameAs` Malt non vérifiable
LinkedIn, GitHub et X répondent 200. Malt renvoie **403**, très probablement sa protection
anti-robot. Impossible à trancher côté serveur — **à contrôler manuellement**.
Réciprocité GitHub confirmée (le profil pointe bien vers le domaine).

---

## Lecture SXO — à interpréter avec prudence

Un échantillonnage SERP ponctuel montre que le site **n'apparaît pas dans le top 10 sur son
propre nom** ; c'est le profil LinkedIn qui ressort.

**L'attribution compte ici.** La tentation est d'accuser le `<title>` générique. Mais jusqu'à
ce matin, chaque page déclarait un canonical vers un domaine qui ne résolvait pas — le signal
le plus destructeur possible pour l'indexation. La cause la plus probable est celle-là, et
elle est **corrigée depuis quelques heures**. Une reprise d'indexation prend typiquement 2 à
6 semaines.

Conclusion : ne pas conclure trop vite sur le titre. Il faut d'abord laisser Google
re-crawler, puis mesurer. Sans données GSC, tout le reste est hypothèse.

Le rapport SXO relève par ailleurs que la page se présente comme un *portfolio* plutôt que
comme une *offre de prestation* (ni disponibilité, ni cadre d'intervention). Persona le plus
mal servi : le CTO qui compare des freelances (43/100). C'est de l'éditorial, hors périmètre
technique.

---

## Limites de cet audit

- **Aucune donnée de terrain.** Pas de clé API Google : ni CrUX, ni indexation GSC, ni
  impressions. L'audit décrit une configuration désormais correcte, sans pouvoir confirmer
  que Google l'a re-crawlée.
- **Performance non re-mesurée** (quota PSI, Chrome indisponible).
- **SXO** fondé sur ~3 requêtes et ~17 URLs échantillonnées, sans suivi de position.
- Backlinks non analysés (uniquement le palier Common Crawl, sans intérêt ici).
