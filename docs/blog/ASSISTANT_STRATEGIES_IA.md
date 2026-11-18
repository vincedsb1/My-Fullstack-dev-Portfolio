# Assistant de portrait et de stratégies — intégration

Implémentation locale du 18 novembre 2026, selon les [spécifications](SPECIFICATIONS_ASSISTANT_STRATEGIES_IA.md) et la [maquette de référence](../maquettes/assistant.html). Aucun déploiement n’est inclus.

## Point d’entrée

Les deux articles JSON utilisent un bloc `custom` nommé `career-strategy-assistant`, sans props. Le manifeste le limite à une occurrence par article. Son invitation produit un H3 ; le dialogue conserve le H1 de l’article et utilise H2 puis H3/H4 pour ses écrans.

Le module serveur `src/features/career-strategy/Module.tsx` transmet uniquement la locale et le descripteur de ressource au déclencheur client. `Trigger.tsx` charge le code de l’assistant et son JSON statique à la première ouverture. Fermer puis rouvrir conserve le composant et la session. Aucun formulaire métier, poids ni questionnaire complet n’est injecté dans le HTML initial de l’article.

La primitive `Dialog` existante accepte désormais un identifiant, une classe locale, un contrôle du clic de fond et un verrouillage du défilement. Les valeurs par défaut conservent les autres usages. L’assistant refuse la fermeture au clic de fond, accepte Échap et restitue le focus au déclencheur.

## Sources et préparation

- `src/content/career-strategy/questionnaire.json` : 80 questions, deux modes 40/80, 48 dimensions ; règles et identifiants communs aux deux langues.
- `src/content/career-strategy/strategies.json` : 22 stratégies, socle commun, signaux, bonus, réserves et liste de repli.
- `src/content/career-strategy/fr.json` et `en.json` : tous les textes du questionnaire, du portrait et du catalogue, sans duplication des règles.
- `src/i18n/messages/{fr,en}.json`, namespace `careerStrategy` : interface, erreurs et messages de sauvegarde.
- `src/features/career-strategy/schema.mjs` : validation commune du producteur et des ressources reçues par le client.

Les sources proviennent du dossier fourni `/Users/vincentdesbrosses/Downloads/moteur_strategies_ia`. Ses fichiers ont été conservés. Les empreintes du prototype audité figurent dans la spécification. Les questions et les valeurs d’origine sont conservées, avec vouvoiement harmonisé ; les phrases de portrait sont des contenus éditoriaux ajoutés pour interpréter prudemment les dimensions.

`npm run career:prepare` valide les données, les références et la parité structurelle FR/EN, puis produit des fichiers immuables sous `public/career-strategy/<empreinte>/{fr,en}.json`. Cette préparation est exécutée par `predev`, `prebuild` et `pretest`.

Les ressources publiques générées sont ignorées par Git. Le petit `bundle-manifest.json` est suivi avec les sources afin que le typecheck fonctionne également avant un premier build ; il est régénéré si le contenu change. Après édition des données, exécuter `npm run career:prepare` et inclure le descripteur actualisé dans le diff. Le build recrée les ressources publiques avant de compiler Next.js.

Les versions du schéma, du questionnaire, du catalogue et du moteur sont séparées. Une modification du sens des questions, des options ou des IDs exige une nouvelle version du questionnaire ; une traduction seule peut conserver cette version. L’empreinte du paquet change à chaque modification des données localisées. La constante `ENGINE_VERSION` du contrat doit évoluer lorsque les règles du moteur évoluent.

## Calcul et portrait

Le moteur pur est dans `engine.ts`, le portrait dans `build-portrait.ts`. Les réponses inconnues sont exclues des scores ; une réponse neutre reste une observation à zéro. Les dimensions non mesurées sont absentes. Le portrait indique les indices fondés sur une seule question et les réponses divergentes ; ses formulations ne prétendent pas mesurer des compétences.

Le contrat bas niveau conserve le seuil de 75 % du prototype pour les tests et usages internes. La soumission de l’interface exige 100 % des questions du mode. `q015` et `q080` exigent une ou deux sélections ; aucune option inconnue n’a été ajoutée.

Le résultat comprend exactement cinq éléments : un socle commun, puis quatre pistes. Les scores servent au classement interne et ne sont jamais affichés comme des probabilités ou des pourcentages de réussite.

Corrections explicites par rapport au prototype :

- le repli général est une branche distincte, sans bonus ni classement personnalisé ; sa liste finale est `maintien_employabilite`, `apprendre_ia`, `reseau_confiance`, `reconversion_progressive` ;
- les limites de deux pistes par famille et par pilier sont strictes ; un catalogue insuffisant produit une erreur de configuration ;
- les égalités sont départagées par identifiants, sans dépendance aux textes traduits ;
- le moteur retourne des identifiants de raisons et de réserves, localisés au rendu.

Ces règles sont des choix éditoriaux déterministes, pas une calibration psychométrique.

## Sauvegarde facultative

La sauvegarde est désactivée initialement. La clé `vd_ai_career_strategy_draft_v1` est commune aux deux langues et indépendante de la checklist historique. Elle contient le mode, les réponses, la phase/section, le retour après correction, les versions, une révision et une expiration 30 jours après la dernière modification enregistrée. Aucun portrait, score ou conseil n’est persisté.

La reprise est proposée explicitement ; les données sont revalidées et les résultats recalculés avec le catalogue actuel. Supprimer la sauvegarde conserve la session en mémoire. Recommencer efface session et sauvegarde après confirmation. Les données expirées, corrompues, incompatibles et le stockage refusé sont traités sans bloquer le questionnaire.

Un changement de révision dans un autre onglet suspend les écritures automatiques et demande quelle session conserver. Une lecture de révision précède aussi chaque écriture pour détecter un changement non encore notifié. Le stockage reste local à cet appareil et à cette origine.

Le chargement initial lit un fichier statique du site. Les réponses ne sont envoyées ni à une API de recommandations, ni à Umami, ni dans l’URL. Le thème, le cookie de langue et les requêtes habituelles du portfolio conservent leur fonctionnement.

## Recette

- `tests/career-strategy.test.ts` : contrats, valeurs inversées, données inconnues, seuils, repli, diversification, invariance FR/EN, portrait et sauvegardes.
- `scripts/blog-json-tests/career-strategy.node.mjs` : intégration native, zéro prop et unicité du module dans les deux articles.
- `tests/browser/career-strategy.spec.ts` : parcours 40/80 FR/EN, correction, portrait, cinq pistes, fermeture/réouverture, reprise interlangue, suppression, conflits, stockage refusé, ressources indisponibles et matrice des quatre largeurs/deux thèmes avec axe.
- Captures locales : `tests/visual-artifacts/career-assistant/` et `tests/visual-artifacts/career-*-results.png`, ignorées par Git.

La suite globale du blog conserve les contrôles du guide, des widgets SaaS, du catalogue, des métadonnées et du sitemap. Deux assertions anciennes ont été actualisées : les métadonnées SaaS vérifient explicitement leur couverture déjà présente ; le test SEO ne déduit plus l’absence de débordement d’un ancien nom de classe typographique. Le débordement réel des index est vérifié au navigateur dans la matrice de recette. Une erreur de formatage du test historique du guide a également été corrigée.

## Résultats de validation locale

Recette effectuée le 18 novembre 2026 :

| Contrôle                         | Résultat                                                                                                                    |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `blog:validate`                  | 8 articles publiés, 2 brouillons, 9 sources JSON valides                                                                    |
| `blog:test:json`                 | 32 tests réussis                                                                                                            |
| `npm test`                       | 28 tests réussis, dont 17 pour le moteur, le portrait et le stockage                                                        |
| TypeScript                       | Réussi                                                                                                                      |
| Lint                             | Aucune erreur ; quatre avertissements de tokens préexistants ailleurs dans le portfolio                                     |
| Build de production              | Réussi après le rappel de sécurité Next.js                                                                                  |
| SEO local                        | Routes, index FR/EN, canonical, hreflang, images sociales, JSON-LD et sitemap validés                                       |
| Suite navigateur complète        | 44 tests réussis, dont 10 scénarios dédiés à l’assistant                                                                    |
| Dernière recette visuelle ciblée | 16 combinaisons FR/EN × 320/390/820/1440 px × clair/sombre ; accueil, questions et résultats ; axe et débordement contrôlés |
| Publication synthétique          | 2 tests navigateur réussis, SEO vérifié et build normal restauré                                                            |
| Prévisualisation                 | 5 scénarios réussis en développement                                                                                        |

La suite générale a aussi nécessité de corriger un sélecteur historique qui incluait le drapeau décoratif, masqué dans le nom accessible du lien « English ». La navigation réelle et le dialogue natif des projets passent après correction de cette attente, sans modifier le sélecteur de langue du produit.

Le pilote de publication relance désormais une seule fois un build arrêté par le message explicite `SecurityFatalError` invitant à réessayer la même commande. Les autres erreurs restent bloquantes. Ce traitement est nécessaire parce que le pilote construit successivement une fixture puis le site normal ; il ne désactive pas l’évaluation de sécurité et ne change aucune dépendance.

Le CLI Next.js signale toujours une alerte de sécurité et recommande une mise à niveau. Cette mise à niveau n’est pas incluse dans l’intégration du questionnaire. La maquette et les fichiers du dossier Downloads sont conservés ; aucune fixture de publication temporaire ne reste dans le dépôt. Aucun commit, push ou déploiement de production n’a été effectué.
