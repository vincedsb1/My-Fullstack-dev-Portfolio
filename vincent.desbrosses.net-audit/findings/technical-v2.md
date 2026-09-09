# Technical SEO — re-audit 2026-09-09 (post-déploiement)

Toutes les valeurs ci-dessous sont mesurées en production sur `vincent.desbrosses.net`.

## Résolu depuis l'audit initial

| Constat initial | Sévérité | État |
|---|---|---|
| Canonical/hreflang/og vers un domaine NXDOMAIN | Critical | **Résolu** — tout sur `vincent.desbrosses.net` |
| Toutes les sous-pages canonicalisées vers l'accueil | Critical | **Résolu** — canonical par route |
| HTTP 500 sur les chemins pointés non appariés | Critical | **Résolu** — `/llms.txt` `/ads.txt` `/favicon.png` → 404 |
| `Disallow: /integration` inopérant | High | **Résolu** — page supprimée, règle retirée |
| En-têtes de sécurité absents | High | **Résolu** — 5 en-têtes présents |
| Sitemap listant 4 URLs mortes | Critical | **Résolu** — 2 URLs valides |

## Mesures actuelles

**Redirections — toutes propres, aucune chaîne anormale**
```
https://…/        307 → /en            1 saut
https://…/en/     308 → /en            1 saut
https://…/fr/     308 → /fr            1 saut
http://…/         308 → https://…/     2 sauts au total
```
Le seul point perfectible : l'entrée en `http://` coûte 2 sauts (upgrade TLS, puis locale).
Non bloquant, et hors de portée applicative (géré par Vercel).

**Rendu et cache**
```
x-vercel-cache: HIT      age: 199      x-matched-path: /en
cache-control: public, max-age=0, must-revalidate
TTFB: 165 / 234 / 246 ms  (3 mesures)
```
`generateStaticParams` a bien fait passer `/en` et `/fr` en SSG : les pages sont servies
depuis le cache edge de Vercel, ce qui explique le TTFB sous 250 ms.

**En-têtes de sécurité** — présents sur les pages ET sur les assets (`nosniff` vérifié
sur une réponse `/_next/image`) :
`x-content-type-options: nosniff` · `x-frame-options: SAMEORIGIN` ·
`referrer-policy: strict-origin-when-cross-origin` ·
`permissions-policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` ·
`strict-transport-security: max-age=63072000; includeSubDomains`

CSP toujours absente — décision assumée : elle doit être construite contre les origines
réelles et validée en preview, pas posée à l'aveugle.

## Reste

- **Pas de données de terrain.** Aucune clé API Google configurée : ni CrUX, ni statut
  d'indexation GSC, ni impressions. C'est la principale limite de cet audit — il décrit une
  configuration correcte, sans pouvoir confirmer que Google l'a effectivement re-crawlée.
- **`/llms.txt` renvoie 404** (correct), mais aucun fichier n'est publié. Optionnel et
  d'utilité non démontrée : llms.txt n'est pas consommé par Google Search.
