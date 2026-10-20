# Iconise — preuves et informations manquantes

**Révision :** `main` `b43adaff9737b05f24b9ee98c68eb26f60330a6a` — dépôt privé — 20 octobre 2026.

## A. PREUVES PRINCIPALES

Chaque identifiant renvoie à un objet `evidence[]` du JSON, avec chemin et éventuellement lignes observées. Les références GitHub privées ne sont accessibles qu’aux personnes autorisées.

### Produit / workflow
- EV-003 : configuration réelle des étapes et master.
- EV-004 : format courant 3×3 et lecture legacy 4×2.
- EV-005 : étapes aval `stale` et historique conservé.
- EV-025 à EV-033 : vues projet, comparaison, import, autosave et finalisation.

### Génération et fiabilité
- EV-006 : compilation serveur bornée au workspace.
- EV-007 / EV-008 : orchestrateur, idempotence, HTTP 202 et `after()`.
- EV-009 / EV-010 : règles de validation de grilles et adaptateur image Gemini.
- EV-011 / EV-012 / EV-013 : directions textuelles OpenAI et sélection de fournisseurs.

### Persistance, authentification, facturation
- EV-014 : catalogue de plans codé (non équivalent à une offre commerciale validée).
- EV-015 / EV-016 : événements Stripe et vérification de signature.
- EV-017 à EV-021 : schéma workspace, Drizzle, sessions, frontières d’accès.
- EV-022 : transport SES de l’authentification.

### Internationalisation / SEO / waitlist
- EV-023 / EV-024 : locales et stratégie de référencement.
- EV-041 à EV-043 : opt-in et worker waitlist.
- EV-044 / EV-045 : capture et réconciliation du parrainage.
- EV-046 / EV-047 : contrôle waitlist/open par commit et configuration.
- EV-048 / EV-049 : analytics avec consentement et CSP.

### Exports / UI / médias / tests
- EV-034 à EV-040 : master, favicon, export SVG et redimensionnement.
- EV-058 à EV-062 : fichiers de test présents, résultats non exécutés.
- EV-063 / EV-064 : migration et média documentaire.
- EV-065 : capture landing conservée en archive.

## B. QUESTIONS À CONFIRMER (par priorité)

### gap-01 — CRITICAL
**Question :** Quel était votre rôle exact (conception, design, développement, contenu, QA) et y avait-il des collaborateurs ?
**Champ :** `responsibilities` — **Impact :** Attribution personnelle et crédibilité. — **État :** UNKNOWN.

### gap-02 — CRITICAL
**Question :** L’application est-elle actuellement en waitlist ou ouverte ? Quelles fonctionnalités sont activées en production ?
**Champ :** `project.maturity` — **Impact :** Ne pas présenter une implémentation conditionnelle comme accessible. — **État :** UNKNOWN.

### gap-03 — HIGH
**Question :** Pouvez-vous produire 6 à 8 captures actuelles avec données fictives ?
**Champ :** `gallery` — **Impact :** Hero, stepper et galerie fiables. — **État :** UNKNOWN.

### gap-04 — HIGH
**Question :** Quelles décisions et obstacles ont été réellement les vôtres, au-delà des ADR rédigées ?
**Champ :** `challenges` — **Impact :** Renforcer le récit de décision individuelle. — **État :** UNKNOWN.

### gap-05 — HIGH
**Question :** Existe-t-il des mesures réelles et publiables (tests datés, taux d’échec IA, lancement, clients, performances) ?
**Champ :** `results` — **Impact :** KPI éventuels sans invention. — **État :** UNKNOWN.

### gap-06 — MEDIUM
**Question :** Souhaitez-vous rendre public le dépôt, publier seulement le lien produit ou aucun des deux ?
**Champ :** `links.github` — **Impact :** Le dépôt audité est privé. — **État :** VERIFIED_PRIVATE.

### gap-07 — MEDIUM
**Question :** Les images issues des prototypes marketing et maquettes sont-elles autorisées pour le portfolio ?
**Champ :** `media.rights` — **Impact :** Droits et contexte d’utilisation à confirmer. — **État :** UNKNOWN.

### gap-08 — MEDIUM
**Question :** Quelle est la période de réalisation et quelles sont les dates de lancement vérifiables ?
**Champ :** `project.period` — **Impact :** Période du hero. — **État :** UNKNOWN.

### gap-09 — LOW
**Question :** Une vidéo produit approuvée existe-t-elle hors Git ?
**Champ :** `video` — **Impact :** Section vidéo conditionnelle. — **État :** UNKNOWN.

### gap-10 — MEDIUM
**Question :** La route /registry annoncée dans le README est-elle retirée ou disponible sur une autre branche ?
**Champ :** `features.registry` — **Impact :** Ne pas affirmer une fonctionnalité sans route actuelle. — **État :** UNKNOWN.

## Divergences documentaires identifiées

1. **Grilles :** ADR-002 (ancien format 4×2 et amendement) vs `src/domain/board-layout.ts` (3×3 courant) et `src/application/generation/image-validation.ts` (génération 4:3). Source de vérité : code du commit audité.
2. **Registre :** la route `/registry` est listée par README, mais l’inventaire des pages courantes sous `src/app/(protected)/` ne montre pas `registry/page.tsx`. Ne pas publier cette promesse sans lecture complémentaire.
3. **Export/import :** un ancien runbook prévoit import, export et reset ; le README indique la suppression de ces écrans le 30 septembre 2026.
4. **Tarifs :** `src/domain/billing/plans.ts` code Free/Studio/Pro ; `docs/launch/README.md` décrit le pricing comme hypothèse en validation et une autre formule possible.
5. **Déploiement :** des documents historiques mentionnent une recette internationalisée en production, mais les flags actuels et l’ouverture commerciale ne sont pas vérifiés ici.
6. **Tests :** `doc/IMPLEMENTATION_STATUS.md` rapporte des succès ciblés et cinq échecs préexistants à une date donnée ; cela ne remplace pas une exécution au commit audité.

## Contrôles non effectués

- Pas de checkout local, donc working tree et fichiers ignorés inconnus.
- Pas de commande `npm test`, `npm run build`, migrations ou génération facturée.
- Pas de lecture des secrets, d’accès bases, d’inspection de Stripe ou de configuration Vercel.
- Pas de téléchargement des images binaires ; dimensions, droits, qualité et données privées à revoir.
- Pas d’accès authentifié au produit réel ; aucune déclaration d’usage, de revenu ou de disponibilité.

## Conseils de publication

N’utiliser dans le portfolio comme **faits définitifs** que les fonctionnalités étayées dans le JSON. Les descriptions « valeur attendue », décisions personnelles et résultats non mesurés ne doivent pas devenir des chiffres ou témoignages inventés. Préférer une démonstration métier de quatre à six captures réelles à une accumulation d’écrans de maquette.
