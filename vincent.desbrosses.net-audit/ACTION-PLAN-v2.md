# Plan d'action v2 — 2026-09-09

Le volet technique critique est clos. Ce qui reste se répartit en trois natures très
différentes : quelques correctifs code peu coûteux, du travail éditorial, et de l'attente.

---

## Phase 1 — Correctifs code restants (~45 min au total)

### 1.1 Rendre les réponses FAQ extractibles — HIGH · ~15 min
`src/app/components/CustomAccordion.tsx:42-44`. Les panneaux fermés cumulent
`aria-hidden="true"` et `max-h-0 opacity-0` ; ~140 mots (18 % de la page) sont écartés par
les extracteurs de contenu, alors que ce sont les seuls passages en prose citables.

Ce n'est pas un problème d'indexation Google — c'est un problème de citabilité par les
moteurs de réponse. Piste : ouvrir le premier panneau par défaut, ou retirer `aria-hidden`
au profit d'un masquage purement visuel.

**Comment savoir si c'est raté :** extraire la page avec trafilatura — les réponses doivent
apparaître dans le texte retenu.

### 1.2 Corriger les dimensions `og:image` — MEDIUM · ~5 min
`src/app/[locale]/layout.tsx` déclare 819 × 823 ; le fichier fait 1084 × 1084.
Corriger les deux nombres, ou mieux : produire une carte 1200 × 630 (voir 2.2).

### 1.3 Traduire 2 libellés de compétences — MEDIUM · ~5 min
Dans `src/i18n/fr.json` uniquement : « Design & Product » → « Design & Produit », et
« AI-assisted Development » → « Développement assisté par IA ».
**Ne pas toucher** à Front-end, Back-end, DevOps ni Desktop : usage français courant.

### 1.4 Désambiguïser les trois « Allaw » — MEDIUM · ~10 min
Qualifier chaque `H3` par son contexte (produit / étude de cas / poste occupé).

### 1.5 Vérifier le profil Malt — INFO · ~2 min
`https://www.malt.fr/profile/vincentdesbrosses` renvoie 403 aux requêtes automatisées.
Ouvrir l'URL dans un navigateur : si elle est morte, ce `sameAs` affaiblit la corroboration
d'entité au lieu de la renforcer.

---

## Phase 2 — Éditorial (le vrai gisement restant)

### 2.1 Titres et descriptions — HIGH
Reste le premier frein On-Page. La mécanique i18n est en place, seules les chaînes sources
sont à réécrire. **Attendre toutefois quelques semaines de re-crawl avant d'en juger l'effet**
(voir Phase 3) : l'absence actuelle sur les requêtes de marque s'explique plus probablement
par le canonical cassé que par le titre.

### 2.2 Carte sociale 1200 × 630 — MEDIUM
Remplace aussi 1.2. Une image carrée est recadrée sur LinkedIn et X quel que soit le ratio
déclaré.

### 2.3 Signaux d'autorité — HIGH (axe le plus faible : 13/25)
E-E-A-T global 68/100, mais l'Autoritativité n'a quasiment pas bougé (+2) : aucune validation
tierce n'a été ajoutée. Par ordre de valeur : témoignages clients nommés → note Malt exposée
→ bio factuelle (années d'expérience, localisation).

### 2.4 Cadrage « prestation » plutôt que « portfolio » — MEDIUM
La page ne dit ni disponibilité, ni cadre d'intervention. Persona CTO/fondateur : 43/100.
Hypothèse SXO non étayée par des données de position — à traiter après la Phase 3.

---

## Phase 3 — Mesurer avant de continuer

C'est aujourd'hui le blocage le plus important : **on optimise à l'aveugle.**

1. **Clé API Google** — `claude-seo run google_auth.py --setup`. Débloque CrUX, l'état
   d'indexation GSC et les impressions. Sans elle, ni la performance ni l'indexation ne sont
   mesurables.
2. **Search Console** : confirmer la propriété sur le `.net`, soumettre le sitemap, demander
   la suppression des deux anciennes URLs `/integration`.
3. **Re-mesurer la performance** — non re-mesurée ce tour (quota PSI épuisé, Chrome
   indisponible). La note de 78 date d'une architecture différente, avant le passage en SSG.
4. **Reprendre un baseline drift** sur l'état sain, pour que les prochains déploiements
   soient comparés à une référence correcte.
5. **Attendre 2 à 6 semaines**, puis vérifier la réindexation sur la requête de marque.

---

## Ordre recommandé

Phase 1 maintenant (45 min, tout est cadré et vérifiable) → Phase 3 points 1, 2 et 4 dans la
foulée (mise en place de la mesure) → attendre le re-crawl → Phase 2 en s'appuyant sur des
données réelles plutôt que sur des hypothèses.
