# Iconise — audit pour étude de cas portfolio

**Date :** 20 octobre 2026  
**Dépôt :** `https://github.com/vincedsb1/Iconise` (privé)  
**Branche auditée :** `main`  
**Commit figé :** `b43adaff9737b05f24b9ee98c68eb26f60330a6a`  
**Working tree :** non observable depuis une lecture GitHub distante.

## Livrables (six fichiers)

1. `01-project-audit.json` — données structurées du template, fonctionnalités, graphe, preuves et **154 médias**.
2. `02-case-study-fr.md` — récit éditorial français candidat, proche publication après validation.
3. `03-case-study-en.md` — brouillon anglais explicitement non validé.
4. `04-media-inventory.md` — manifeste de tous les médias repérés avec chemins et tailles, captures manquantes.
5. `05-evidence-and-gaps.md` — preuves, écarts documentaires et questions prioritaires.
6. `README.md` — synthèse et protocole de transfert.

## Constats clés

- **22 fonctionnalités** classées par état de preuve et disponibilité conditionnelle.
- **7 défis techniques** ; **8 décisions d’ingénierie** ; **3 workflows candidats**.
- Diagramme principal : **8 nœuds et 8 relations**.
- **154 fichiers média** dans le commit, essentiellement visuels historiques, de marque ou de préproduction ; **zéro vidéo MP4/WebM/GIF versionnée**.
- **204 fichiers de tests** recensés sous `tests/` ; **tests non exécutés** pendant cet audit.
- Le produit lie un parcours manuel et une génération intégrée dans un workflow unique. Le domaine contient des contrôles d’idempotence, de facturation, d’isolation workspace et de validité des images.
- Grille courante : **3 × 3 (A–I)** ; génération d’image ciblée **4:3**. Documentation historique non entièrement alignée.
- Aucun chiffre d’affaires, résultat commercial, satisfaction utilisateur ou taux de succès n’est affirmé.

## Niveau de complétude

**STANDARD recommandé immédiatement. RICH après captures actuelles et confirmation du statut public.** L’audit est profond sur les principaux modules, mais non exhaustif fichier par fichier : inventaire de 1642 fichiers Git, lecture ciblée des sources à forte valeur. Les binaires n’ont pas été inspectés, les tests et le runtime non exécutés.

**Sections INCLUDE :** hero, vue produit, workflow, architecture, défis, décisions, stack, qualité prudente, résultats vérifiables, enseignements, limites, CTA contact.  
**OPTIONAL :** galerie, navigation autre projet.  
**OMIT :** vidéo non versionnée, CTA GitHub public tant que le dépôt reste privé.

## Cinq confirmations prioritaires

1. Attribution : rôle exact et contributions personnelles.
2. Statut réel : waitlist vs ouvert, composants et fournisseurs actifs en production.
3. Captures actuelles et autorisation de leur publication.
4. Trois décisions/obstacles réellement assumés et contexte de création.
5. Résultats mesurés ou tests de recette datés et publiables, s’ils existent.

## Transfert dans le portfolio

Copier ce **dossier entier** comme données de travail, pas directement comme contenu public. Charger `01-project-audit.json`, mapper ses IDs au template, puis sélectionner les sections avec `sectionRecommendations`. Vérifier les `evidenceIds` et `mediaId`; conserver des chemins d’origine ou transférer les médias autorisés dans le projet portfolio. Ne pas afficher les URLs GitHub privées aux visiteurs. Les textes FR/EN nécessitent relecture et la traduction anglaise est un **brouillon**.

## Validation

Le script local de génération vérifie la validité du JSON, l’unicité des IDs, les références de preuves/médias, les relations du graphe, les chemins d’assets connus dans l’inventaire et la présence des six fichiers. Aucune commande ni mutation de dépôt, aucun commit, push, migration ou déploiement. Les chemins d’autres sources ont été établis par l’arborescence et la lecture ciblée via GitHub.
