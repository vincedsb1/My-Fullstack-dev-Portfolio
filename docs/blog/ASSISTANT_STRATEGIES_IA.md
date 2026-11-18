# Parcours « Mes pistes professionnelles » : intégration

Mini-parcours éditorial interactif intégré aux deux variantes de l’article sur l’IA et l’emploi
(`/fr/blog/ia-emplois-intellectuels-preparer-avenir`, `/en/blog/ai-knowledge-work-jobs-prepare-future`).
Il remplace, depuis le 18 novembre 2026, l’ancien diagnostic de 30 questions (portrait et moteur de
recommandations), décrit dans la [spécification historique](SPECIFICATIONS_ASSISTANT_STRATEGIES_IA.md).

## Principe narratif

Le visiteur lance ce qui ressemble à un questionnaire de 30 questions. Après deux vraies réponses, le
questionnaire s’interrompt volontairement : les grands leviers sont souvent les mêmes pour tout le
monde, il présente donc directement cinq pistes. Le retournement ne doit être annoncé ni dans
l’article, ni dans l’invitation, ni à l’accueil.

| Étape | Écran                                                                                           | Progression affichée                  |
| ----- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1     | Accueil « 30 questions » (inchangé dans l’esprit)                                               | Aperçu · 30 questions · Pistes        |
| 2–3   | Questions `q001` et `q002` du questionnaire d’origine, échelle à 5 niveaux + « Je ne sais pas » | Chapitre 1/8, `1 / 30`, `2 / 30`      |
| 4     | Retournement « Bon… on va s’arrêter là. »                                                       | « 5 pistes », barre à 5 segments vide |
| 5–9   | Pistes : compétences, patrimoine, entreprise, produits, audience                                | `1 / 5` … `5 / 5`                     |
| 10    | Conclusion, bouton « Terminer » qui ferme la modale                                             | `5 / 5`                               |

Navigation : avancement automatique après une réponse, bouton Précédent à chaque étape, raccourcis
`1`–`5` et `←` sur les questions, `←`/`→` sur les écrans narratifs. La croix et Échap ferment
toujours ; le clic hors de la modale ne ferme qu’à partir du retournement, pour ne pas perdre les
questions par accident. Fermer conserve la position pendant la visite ; « Terminer » remet le
parcours à l’accueil.

## Fichiers

- `src/features/career-strategy/journey.ts` : structure statique (étapes, deux questions, échelle,
  cinq pistes, icônes lucide). Aucun texte.
- `Assistant.tsx` : machine à étapes ; les deux réponses restent dans un `useState`, sans calcul,
  stockage ni envoi.
- `Welcome.tsx`, `QuestionField.tsx` : accueil et questions, styles de `Questionnaire.module.css`.
- `StoryScreen.tsx` : retournement, pistes et conclusion, dans le même habillage (en-tête, barre de
  progression, transitions, pied de navigation).
- `Trigger.tsx` / `Module.tsx` : invitation dans l’article et import différé de l’assistant à la
  première ouverture. Aucune ressource JSON n’est plus chargée.
- `src/i18n/messages/{fr,en}.json`, namespace `careerStrategy` : tous les textes, y compris les deux
  questions et les cinq pistes.

Le bloc `custom` `career-strategy-assistant` (zéro prop, une occurrence par article) est inchangé.

## Supprimé

Moteur (`engine.ts`), portrait (`build-portrait.ts`), contrat et validation du paquet
(`schema.mjs`, `types.ts`), cartes de recommandations, données `src/content/career-strategy/`,
script `career:prepare` et ressources générées sous `public/career-strategy/`.

## Recette

- `tests/career-strategy.test.ts` : ordre des étapes, deux questions conservées, parité FR/EN des
  messages, textes des pistes (2 à 4 phrases, deux actions).
- `scripts/blog-json-tests/career-strategy.node.mjs` : intégration du module dans les deux articles,
  absence de la section « Quelques précisions pratiques ».
- `tests/browser/career-strategy.spec.ts` : parcours FR/EN complet, focus, retour arrière, fermeture
  (croix, Échap, clic extérieur), absence de stockage et de requête liée aux réponses, axe ; matrice
  320/390/820/1440 px × clair/sombre avec captures dans `tests/visual-artifacts/career-assistant/`.
