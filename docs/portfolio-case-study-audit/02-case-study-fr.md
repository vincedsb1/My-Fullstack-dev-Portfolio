# Iconise — proposition d’étude de cas (FR)

> **Statut éditorial : candidat à validation.** Audit du dépôt GitHub privé `vincedsb1/Iconise`, branche `main`, commit `b43adaf` au 20 octobre 2026. Les preuves renvoient à `01-project-audit.json`. Aucune exécution de test ou vérification de la production n’a été réalisée.

## 1. Positionnement éditorial

**Angle principal :** construire un SaaS créatif qui organise les décisions, l’itération et la livraison d’une icône d’application. L’intérêt du projet n’est pas seulement l’appel à un générateur d’images : il réside dans la continuité du contexte et l’architecture qui permet de revenir sur ses choix.

**Angles secondaires :** orchestration de génération avec crédits ; UX de décision progressive ; architecture Next.js/PostgreSQL et intégrations. **Format conseillé : STANDARD aujourd’hui ; RICH après de nouvelles captures d’interface authentifiée.**

## 2. Hero proposé

**Iconise — De l’idée à l’icône : un workflow de création structuré**

Application web conçue pour transformer un besoin initial en direction visuelle, comparer des propositions, conserver les décisions et produire des fichiers d’icône exploitables. Le même parcours accepte des prompts utilisés dans un outil externe ou une génération intégrée lorsque celle-ci est activée.

**Stack hero :** Next.js · React · TypeScript · PostgreSQL · Stripe.

**Rôle et période : à confirmer.** Ne pas afficher « fondateur / seul développeur » sans confirmation. **Média principal : à capturer.** `doc/reference/visual-reference.png` est une référence documentaire, pas une preuve d’écran de production.

## 3. Présentation du projet

La création d’une icône suppose une série de décisions : contexte de l’application, intention graphique, variantes, sélection, proportions, ajustements optiques, fond et rendu final. Quand ces choix se dispersent dans plusieurs conversations ou fichiers, reprendre une étape peut rendre les étapes suivantes incohérentes.

Iconise matérialise ce processus en huit étapes numérotées, puis un écran final. Le projet, ses contraintes et ses itérations sont persistés côté serveur. Le client n’accède pas directement à la base de données ni aux clés des fournisseurs.

## 4. Problème utilisateur

**Comment explorer librement sans perdre le fil ?** Une planche séduisante ne suffit pas si l’on ne peut plus reconstituer le prompt, la référence retenue ou l’effet d’une modification sur les étapes suivantes. Le produit privilégie donc la traçabilité plutôt qu’une génération ponctuelle isolée.

**Public cible documenté comme hypothèse :** un développeur indépendant préparant une nouvelle application ou une refonte, sans designer d’identité dédié. Ce positionnement n’est pas une preuve de validation marché.

## 5. Fonctionnalités significatives

- **Brief et intentions visuelles :** création de projet, questionnaire, préférences et directions créatives.
- **Workflow contrôlé :** étapes dépendantes, validations et transitions d’état ; raffinements facultatifs avant le master.
- **Exploration :** planches actuelles de neuf propositions (3 × 3, A–I), import d’image et sélection d’une case ; ancien format 4 × 2 conservé pour la lecture des itérations historiques.
- **Deux modes de production :** compilation de prompt utilisable manuellement ou génération intégrée d’images avec Gemini, sous conditions d’accès.
- **Révisions :** conservation des itérations et invalidation explicite des étapes aval lorsqu’un choix antérieur est rouvert.
- **Livraison :** master, tracé SVG dérivé, déclinaisons et archive de favicons.
- **Fonctions SaaS :** comptes Better Auth, workspace isolé, abonnement et crédits synchronisés par Stripe.
- **Écosystème :** six locales, landing SEO, emails SES, waitlist et parrainage — selon disponibilité et configuration d’environnement.

Ces fonctionnalités sont **présentes dans le code** ; cela ne signifie ni que toutes sont ouvertes en production ni qu’elles ont été utilisées par des clients.

## 6. Workflow candidat — « De l’intention au master »

1. **Cadrer.** Décrire le projet et compléter le questionnaire guidé. *Visuel : écran setup / brief.*
2. **Orienter.** Définir les préférences et comparer des directions créatives. *Visuel : sélection de direction.*
3. **Explorer.** Produire ou importer une planche de neuf propositions, puis retenir une case. *Visuel : grille A–I.*
4. **Affiner.** Ajuster géométrie, perception optique et fond si nécessaire. *Visuel : comparaison avant/après ou mini-flow.*
5. **Finaliser.** Obtenir le master, l’export SVG dérivé et les formats favicon. *Visuel : écran final et livrables.*

**Alternatives éditoriales :** « Deux voies, une seule planche » (manuel vs intégré), et « Réviser sans effacer » (réouverture et statut `stale`). Les trois workflows sont structurés dans le JSON avec IDs et preuves.

## 7. Architecture expliquée

L’interface React et les routes Next.js App Router dialoguent avec des services métier TypeScript. Chaque requête protégée récupère la session Better Auth, résout le workspace côté serveur, puis accède à des repositories Drizzle/PostgreSQL. L’application utilise Postgres.js et documente PgBouncer pour les connexions runtime ; les migrations sont séparées.

Les intégrations sont encapsulées : **Gemini** pour les images, **OpenAI** pour les directions textuelles, **Stripe** pour la facturation, **Amazon SES** pour les mails. L’état accessible des fonctionnalités dépend de paramètres externes qui n’ont pas été lus pendant l’audit.

**Flux représentatif :** interface → route génération → compilation du prompt serveur → réservation d’opération → réponse HTTP 202 → `after()` et fournisseur IA → validation de l’image → suivi de statut dans l’interface.

Autre flux : événement Stripe signé → relecture des objets côté Stripe → synchronisation de la facturation et des crédits en base. Huit nœuds et huit relations vérifiées sont fournis pour le diagramme interactif ; le schéma reste volontairement lisible.

## 8. Défis techniques

### Un workflow qu’on peut reprendre sans l’abîmer

Rouvrir une décision créative doit préserver le passé tout en évitant de réutiliser des choix dépendants devenus périmés. Le service applique des transitions contrôlées et marque l’aval `stale`, sans supprimer les itérations. **Preuve :** `src/application/workflow/service.ts` (EV-005).

### Une génération facturée ne doit pas être débitée deux fois

Les appels au fournisseur peuvent durer, échouer ou laisser le navigateur sans réponse. L’API utilise une clé d’idempotence, retourne un HTTP 202, puis lance l’exécution via `after()`. Les événements Stripe sont signés et les attributions de crédit reposent sur des factures relues. **Preuves :** EV-008, EV-007, EV-015, EV-016.

### Les images IA ne respectent pas toujours le contrat graphique

Une grille erronée peut rendre les découpes inutilisables. Le domaine vérifie le format 3 × 3, des dimensions et le niveau d’« encre » aux bords des cases. **Preuve :** `src/application/generation/image-validation.ts` (EV-009). Aucun taux de réussite mesuré n’est affirmé.

### L’isolation du workspace ne peut pas dépendre du navigateur

Une session vérifiée et un workspace résolu côté serveur précèdent les lectures métier ; les relations en base participent à la séparation des données. **Preuves :** EV-017, EV-018, EV-019, EV-020. Cela ne constitue pas un audit de sécurité complet.

### Transformer un master bitmap en fichiers réellement utilisables

L’export SVG est un **tracé dérivé**, pas un fichier vectoriel natif fourni par le générateur. La construction du pack favicon utilise des réductions successives pour améliorer le rendu des petites tailles. **Preuves :** EV-038, EV-037, EV-036.

## 9. Décisions d’ingénierie

- **Un domaine distinct de Next.js et Drizzle**, consigné dans l’ADR-001 pour limiter le couplage et concentrer les frontières d’autorisation.
- **Un seul workflow pour génération manuelle et intégrée**, acté dans l’ADR-002 ; l’itération reste l’unité commune.
- **Idempotence des événements et crédits transactionnels**, préférée à une attribution sur simple redirection Checkout.
- **Ports pour les fournisseurs IA**, autorisant un fournisseur simulé sans consommation payante.
- **Langue du produit distincte de la langue du projet**, arbitrage de l’ADR-003 pour conserver la compatibilité des projets historiques.

**Point de vigilance documentaire :** l’ADR-002 décrit un ancien format 4 × 2 tout en mentionnant un amendement ; le code courant utilise une grille 3 × 3 et demande une planche de génération en 4:3. Ne pas reprendre les anciennes règles sans vérifier la version.

## 10. UX/UI

Le projet illustre une UX de décisions successives : questionnaire guidé, sélection de direction au clavier, planche stable pendant le chargement et état final dédié. L’import accepte fichier, collage et glisser-déposer. Une sauvegarde automatique différée gère la continuité de la saisie ; des annonces `aria-live` et attributs `aria-*` sont présents dans plusieurs composants. **Ce sont des choix d’implémentation, pas des résultats d’audit WCAG ni des gains mesurés.**

## 11. Stack

**Socle :** Next.js 16 App Router, React 19, TypeScript, Node.js, PostgreSQL, Drizzle ORM, Better Auth.

**Intégrations :** Gemini via `@google/genai`, API OpenAI pour les directions textuelles, Stripe, Amazon SES, next-intl.

**Images :** Sharp, `@neplex/vectorizer`, canvas navigateur et ZIP favicon.

**Qualité/infra :** Node test runner, Playwright, scripts TypeScript, Vercel en cible d’hébergement. Disponibilité effective non contrôlée.

## 12. Qualité, sécurité et exploitation

Le dépôt comporte **204 fichiers sous `tests/`** et des scripts `typecheck`, `build:types`, `test` et `db:check`. Les thèmes couverts dans les noms et fichiers incluent facturation, sessions, i18n, workflow, waitlist, SVG et HTTP. **La suite n’a pas été exécutée pendant cet audit : aucune affirmation de tests verts ou de couverture chiffrée.**

Les contrôles observés incluent signature Stripe, exigences de session, gardes de quota, contrôle des origines et construction d’une Content Security Policy. Cette CSP conserve `unsafe-inline` pour certains contenus ; la sécurité complète du runtime ne peut pas être établie par le code seul.

## 13. Résultats vérifiables

Le dépôt contient un workflow structuré et révisable, des adaptateurs de génération d’images et de texte, une persistance workspace, un mécanisme de facturation et crédits, un export SVG/favicons et une architecture i18n six langues. **Aucun chiffre de chiffre d’affaires, clients, performance, disponibilité ou conversion n’est documenté comme résultat vérifié de cet audit.**

Les offres actuellement codées sont Free, Studio (10 €/mois, 25 générations) et Pro (30 €/mois, 80 générations), avec quotas configurables. La documentation de lancement traite toutefois le prix commercial comme une **hypothèse encore en validation**, et examine d’autres modèles : ne pas publier ces valeurs comme promesses commerciales actuelles sans confirmation.

## 14. Enseignements proposés

1. Dans un outil créatif, le suivi des décisions est aussi important que la qualité des images.
2. Les coûts et les échecs des fournisseurs IA doivent être traités dans le domaine, pas uniquement dans le bouton « Générer ».
3. Une identité livrable exige des contrôles de format et des exports adaptés aux usages réels.

*Ces enseignements sont des formulations éditoriales candidates ; confirmer qu’ils reflètent votre expérience personnelle.*

## 15. Limites à présenter avec discernement

Le dépôt est privé. L’accès public réel (waitlist ou ouvert), les intégrations effectivement activées et les résultats commerciaux ne sont pas établis. Les captures de recette et prototypes marketing sont historiques. Une route `/registry` figure dans le README mais ne ressort pas dans l’inventaire courant des pages protégées ; la documenter comme active nécessiterait une nouvelle preuve. Certains runbooks anciens décrivent aussi des écrans export/import retirés depuis.

## 16. Médias à utiliser

À l’état actuel : `doc/reference/visual-reference.png` pour expliquer la conception, les captures de recette dans `doc/archive/evidence/recette-visuelle-ux2/` **uniquement avec leur statut d’archive**, et les logos `public/` pour l’identité. Les captures landing dans `iconise.fyi-audit/screenshots/` nécessitent vérification de fraîcheur. Les explorations `marketing/video/` montrent des travaux de direction artistique, **pas un film commercial achevé**.

Pour un portfolio premium, réaliser de nouvelles captures en 16:9 ou 4:3 du projet, des préférences, de la comparaison des directions, de la grille A–I et du résultat final ; compléter par un zoom mobile. Voir `04-media-inventory.md`.

## 17. Sections à masquer pour l’instant

**Vidéo : OMIT** (pas de vidéo versionnée). **Galerie : OPTIONAL** (captures actuelles requises). **GitHub public : OMIT** (dépôt privé). Conserver une section « qualité » prudente, sans badge de CI verte.

## 18. Éléments à faire valider avant publication

Rôle et périmètre personnel ; dates ; mode de lancement effectif ; captures autorisées ; mesures réelles ; URL publique opérationnelle ; décision de rendre le dépôt public ou non. Le fichier `05-evidence-and-gaps.md` hiérarchise les questions, sources et divergences.
