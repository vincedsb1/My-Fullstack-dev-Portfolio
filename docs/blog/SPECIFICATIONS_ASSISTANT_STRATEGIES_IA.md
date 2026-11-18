# Assistant de portrait et de stratégies face à l’IA

## Spécifications fonctionnelles et techniques — cadrage des choix produit confirmé

- Date : 18 novembre 2026.
- Statut : choix produit Q1–Q3 confirmés le 18 novembre 2026 ; implémentation locale réalisée et vérifiée sur demande explicite. Voir [le guide d’intégration et de recette](ASSISTANT_STRATEGIES_IA.md).
- Dépôt inspecté : `My-Fullstack-dev-Portfolio`, branche `codex/article-ia-emploi-fr-en`, HEAD `c403e06ad2588c4e0865d7db5d349003a0079afa`.
- Langues visées : français et anglais, en cohérence avec les deux variantes de l’article.
- Référence visuelle : [assistant.html](../maquettes/assistant.html), conservée sans modification.
- Source métier : `/Users/vincentdesbrosses/Downloads/moteur_strategies_ia` ; prototype version 1.0, questionnaire et catalogue `schemaVersion: 1.0.0`.
- Portée de cette phase : documenter le parcours, le portrait, le calcul, l’intégration, les limites et la recette. Les noms de nouveaux fichiers ou de fonctions ci-dessous sont des propositions, pas des éléments déjà disponibles.

## 1. Objectif et état des lieux

### 1.1 Résultat attendu

Depuis l’article consacré à l’avenir des emplois intellectuels, le lecteur lance un assistant, choisit un questionnaire court ou approfondi, renseigne ses préférences, consulte son portrait puis demande des pistes de préparation adaptées aux réponses. Le résultat explique les raisons des suggestions, leurs limites et les premières actions possibles.

« Soumettre » signifie ici déclencher un calcul déterministe dans le navigateur. Le prototype fourni ne nécessite ni service de génération de texte, ni transmission des réponses à un serveur. L’assistant aide à explorer des possibilités ; il ne calcule pas un risque de chômage ni la réussite d’une reconversion.

### 1.2 Sources réellement inspectées

| Source                                                                                      | Rôle constaté                                                                                           |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `questionnaire.json` du dossier fourni                                                      | Questions, options, dimensions, modes, consignes d’interprétation et de portrait, textes français       |
| `strategies.json` du dossier fourni                                                         | 22 stratégies, un socle commun, familles, signaux, bonus, actions et réserves                           |
| `recommandations.ts` du dossier fourni                                                      | Validation des réponses, scores dimensionnels et sélection des recommandations                          |
| `ResultatsStrategies.tsx` du dossier fourni                                                 | Exemple React d’affichage des recommandations ; ne fournit ni formulaire ni portrait rédigé             |
| `tests.cjs`, `tsconfig.json`, `README.md` du dossier fourni                                 | Tests autonomes, configuration du moteur et intentions documentées                                      |
| [Maquette](../maquettes/assistant.html)                                                     | Panneau central, cartes de choix, progression, retour/continuer, récapitulatif modifiable, clair/sombre |
| [Moteur du blog](JSON_ENGINE.md), `src/lib/blog/json-types.ts`, manifeste et registre React | Contrat des blocs JSON et intégration des interactions métier                                           |
| `src/i18n/routing.ts`, `paths.ts`, `LocaleLinks.tsx`, `SiteHeader.tsx`                      | Routage localisé et sélecteur de langue                                                                 |
| `src/components/ui/Button.tsx`, `Dialog.tsx`, provider de thème                             | Primitives utilisables, dialogue natif, thème du portfolio                                              |
| `scripts/validate-blog-links.mjs`, `src/app/sitemap.ts`, helpers SEO                        | Validation des liens internes et indexation                                                             |

Les deux articles existent dans le checkout, encore non suivis par Git :

- `src/content/blog-json/fr/ia-emplois-intellectuels-preparer-avenir.json` ;
- `src/content/blog-json/en/ai-knowledge-work-jobs-prepare-future.json`.

Ils partagent `translationKey: ai-knowledge-work-personal-strategy` et l’ancre `outil-strategie`. La mention « outil à venir » a été explicitement retenue lors de leur création. Elle ne sera remplacée que lorsque le parcours réel sera disponible et vérifié.

### 1.3 Inventaire vérifié du questionnaire

| Caractéristique                                            | Court                     | Complet                  |
| ---------------------------------------------------------- | ------------------------- | ------------------------ |
| Questions                                                  | 40                        | 80                       |
| Sections                                                   | 8, cinq questions chacune | 8, dix questions chacune |
| Questions à échelle                                        | 39                        | 78                       |
| Choix multiples                                            | `q015`                    | `q015` et `q080`         |
| Dimensions mesurables avec toutes les échelles renseignées | 37 sur 48                 | 48 sur 48                |
| Dimensions reposant sur une seule question                 | 36                        | 21                       |
| Durée annoncée dans la source                              | 6–10 minutes              | 12–20 minutes            |

Les durées sont des estimations du prototype, à confirmer par l’usage. Les huit sections sont : raisonnement, création, apprentissage, organisation, relations, management, commerce, aspirations. Les dimensions sont regroupées en neuf rubriques, dont l’environnement ; ce découpage du portrait ne se confond pas avec celui des questions.

Les échelles ont cinq positions de désaccord/accord et une sixième réponse « Je ne sais pas / pas concerné ». La réponse neutre vaut zéro ; la sixième vaut `null` et ne mesure aucune dimension. `q015` et `q080` imposent chacune une à deux sélections, sans option inconnue dans la source.

### 1.4 Écarts du prototype audités avant implémentation

- Le formulaire et sa navigation, le récapitulatif des réponses et le parcours de correction.
- Le portrait structuré et ses formulations localisées ; `generationGuide` décrit une intention, pas une implémentation.
- La traduction anglaise du questionnaire, du catalogue et des phrases produites par le moteur.
- Un contrat de version commun aux données, au moteur et aux résultats.
- Une validation structurelle des données ; les conversions `as unknown as` de l’exemple React ne constituent pas cette validation.
- La gestion des erreurs, des modifications après calcul et de la sauvegarde locale facultative.
- Les tests d’intégration au portfolio et les corrections du repli décrites en section 6.

## 2. Décisions produit confirmées

Le propriétaire a confirmé les trois choix suivants le 18 novembre 2026. Ils constituent le périmètre de référence de l’implémentation ; la page dédiée et la mémoire seule comme unique mode de conservation ne sont plus des variantes à arbitrer.

| ID  | Sujet        | Décision confirmée                                     | Conséquence                                                                                                   |
| --- | ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Q1  | Ouverture    | Fenêtre superposée à l’article                         | Module React enregistré dans le moteur JSON, dialogue accessible et chargement du questionnaire à l’ouverture |
| Q2  | Conservation | Sauvegarde locale facultative pour reprendre plus tard | Fonction disponible dès la V1, désactivée initialement, avec reprise, suppression et gestion des versions     |
| Q3  | Résultats    | Un socle commun + quatre pistes adaptées               | Exactement cinq éléments, dont le premier est explicitement commun à tous                                     |

La fermeture de la fenêtre conserve le brouillon pendant la visite. La reprise après rechargement ou départ du site dépend de l’activation volontaire de la sauvegarde locale. Le portrait et les pistes sont recalculés à partir des réponses restaurées.

Les autres choix de conception décrits dans ce document restent des propositions d’implémentation : calcul local déterministe, FR/EN dès la V1, formulaire complet avant soumission, portrait qualitatif sans pourcentages, absence de compte, de collecte d’identité et de nouvelle dépendance. Ils ne nécessitent pas de rouvrir Q1–Q3.

## 3. Parcours fonctionnel

### 3.1 Entrée depuis l’article

Dans la section `outil-strategie`, remplacer l’encart d’indisponibilité par une invitation comprenant :

- titre FR « Construire mon portrait et explorer mes pistes » et équivalent anglais ;
- indication des deux formats, du calcul local et de la nature exploratoire du résultat ;
- action principale FR « Commencer le questionnaire » / EN « Start the questionnaire » ;
- action de fermeture qui restitue le focus au déclencheur, dans la même section de l’article.

Le contenu environnant doit décrire le nombre réel de pistes et distinguer le socle commun des propositions adaptées. Aucun résultat personnalisé n’est affiché avant la soumission.

Employer un bloc `custom` enregistré, nommé provisoirement `career-strategy-assistant`, qui affiche une invitation et un vrai bouton ouvrant le dialogue. Le déclencheur expose son état et la relation avec le dialogue ; il est localisé en FR/EN. Les blocs `cards` de navigation ne sont pas détournés pour lancer une modale. Le module ne rend aucun H1 supplémentaire ; son éventuel titre d’invitation est un H3 dans la section H2 de l’article.

### 3.2 Accueil et choix du mode

L’écran initial présente la finalité, les limites courtes et les cartes « Version courte — 40 questions » / « Version approfondie — 80 questions ». Aucune réponse n’est présélectionnée. Les durées sont identifiées comme indicatives.

Après choix explicite du mode, « Commencer » ouvre la première section. Le H1 reste celui de l’article en arrière-plan. Le titre stable du dialogue est un H2 ; les titres d’étapes sont des H3. Le questionnaire peut être quitté via la fermeture explicite du dialogue, qui rend le focus au bouton de l’article. Un brouillon en mémoire propose « Reprendre » ; une sauvegarde valide propose « Reprendre ma progression » ou « Recommencer ».

### 3.3 Saisie en huit sections

Proposition : un écran par section, soit cinq questions en mode court et dix en mode complet. Les cartes généreuses de la maquette sont réservées au choix du mode ; chaque échelle utilise des options plus compactes pour que la hauteur de page reste raisonnable.

Chaque question conserve son identifiant et son ordre source. Une échelle emploie un groupe de radios natifs, les choix multiples des cases à cocher. Toute la surface de l’option est activable, avec un état sélectionné distinct du simple survol. Les questions sont reformulées au vouvoiement en français, sans changer leur sens ni leur polarité.

Règles de progression :

1. Indiquer « Section 3 sur 8 » et « 12 réponses sur 40 » ; les réponses inconnues comptent comme renseignées, mais pas comme informatives.
2. « Précédent » conserve toutes les sélections ; une sélection n’avance jamais automatiquement.
3. « Continuer » vérifie les questions de la section. S’il en manque, afficher les erreurs près des questions, un résumé accessible et placer le focus sur la première erreur.
4. Demander 100 % des réponses du mode avant le résultat. La possibilité « Je ne sais pas / pas concerné » évite de transformer une absence d’avis en accord ou désaccord.
5. Pour `q015` et `q080`, afficher « Choisissez une ou deux réponses ». Une troisième sélection est refusée avec une explication annoncée ; les choix déjà cochés restent modifiables.
6. Ne pas ajouter silencieusement une option « ignorer » aux choix multiples : elle modifierait le contrat métier du prototype. Une telle évolution demande un changement explicite de schéma et de tests.
7. L’accès direct à une étape future ne contourne pas les validations.

### 3.4 Révision et portrait

Après la huitième section, un écran « Vérifier mes réponses » présente les sections et leur état de complétude. Chaque section peut être dépliée pour relire les libellés et les réponses, avec « Modifier cette section ». Le retour depuis la correction mène au récapitulatif, sans refaire tout le parcours ; l’action principale y reste soumise à la validation complète.

« Construire mon portrait » calcule le portrait localement et affiche ses rubriques, les tendances nuancées et les incertitudes. Le lecteur peut revenir modifier ses réponses ou demander ses conseils par une action distincte : « Voir mes pistes de stratégie ». La validation finale précède cette action de calcul des recommandations.

La soumission ne doit créer ni requête réseau contenant les réponses, ni paramètre d’URL, ni résultat publié. Aucun temps d’attente artificiel n’est ajouté pour simuler une analyse distante. Une indication de calcul n’apparaît que si une tâche réelle le justifie.

### 3.5 Recommandations

Sous le portrait, afficher exactement cinq éléments conformément à Q3 :

- un bloc « Socle commun » en premier, visuellement explicite sur son absence de personnalisation ;
- quatre pistes sélectionnées avec titre, famille, horizon, explication, premières actions, points de vigilance et limite.

Les raisons proviennent de préférences réellement observées. Une piste peu étayée porte « Piste exploratoire » ; un résultat globalement insuffisant porte « Pistes générales ». Ne pas qualifier ces deux cas de conseils fortement personnalisés. Le score interne de classement n’apparaît pas, même sous forme de jauge ou de pourcentage.

Actions V1 : revoir les réponses, revenir au portrait, recommencer avec confirmation, revenir à l’article. Une modification invalide les deux résultats calculés ; aucun ancien conseil ne reste affiché comme s’il correspondait aux nouvelles réponses. L’impression, la copie et les exports sont hors du périmètre minimal proposé.

### 3.6 Mode, langue et sortie du parcours

- Pour passer de court à complet, conserver les 40 réponses communes et demander les 40 nouvelles. Les résultats précédents sont invalidés.
- Pour passer de complet à court, demander confirmation avant d’écarter les réponses approfondies, y compris dans la sauvegarde activée. Le payload court contient uniquement les questions du mode court ; le moteur actuel refuse les autres IDs.
- Fermer par la croix, Échap ou « Revenir à l’article » conserve le brouillon en mémoire tant que le module reste monté. Rouvrir reprend la phase et la section courantes ; « Recommencer » efface brouillon, sauvegarde et résultats après confirmation.
- Désactiver la fermeture au clic sur l’arrière-plan pour limiter les sorties accidentelles. Réutiliser la primitive `Dialog` avec une option locale si nécessaire, sans changer le comportement des autres dialogues.
- Sauvegarde désactivée : expliquer que le rechargement ou le départ de l’article perd le brouillon. La fermeture seule ne l’efface pas. Ne pas compter sur le cache du navigateur pour une reprise ultérieure.
- Sauvegarde activée : chaque modification valide met à jour le brouillon local ; l’état enregistré est visible. Si l’écriture échoue, conserver la session en mémoire et signaler que la reprise ultérieure n’est pas garantie.
- Le changement de thème conserve les réponses. Les IDs et les calculs sont indépendants de la langue.
- Le header est inactif tant que le dialogue modal est ouvert. Pour changer de langue, le lecteur ferme l’assistant puis utilise le sélecteur existant vers le même article traduit. Avec une sauvegarde activée et valide, l’assistant de l’autre langue propose la reprise du même brouillon, puis localise à nouveau portrait et conseils. Sans sauvegarde, annoncer dès l’accueil que le changement de page ou de langue fait perdre la session ; ne pas promettre une conservation interlangue en mémoire.
- Aucun transfert de réponses dans les liens du sélecteur de langue. Aucun blocage global du retour navigateur ou dialogue à chaque fermeture : fermer la modale ne détruit pas la session. Les confirmations sont réservées à la réinitialisation et aux changements qui suppriment des réponses.

## 4. Construction du portrait

### 4.1 Données et calcul

Réutiliser `calculateDimensions` comme base. Pour chaque dimension renseignée, conserver la moyenne pondérée entre −2 et +2, le nombre d’items exploitables, les IDs de questions contributrices et le signal de réponses divergentes.

Les réponses inconnues et les dimensions non mesurées sont absentes du calcul. Un zéro signifie une moyenne neutre, jamais une donnée manquante. Les choix multiples peuvent alimenter une rubrique de priorités déclarées, avec leur libellé exact ; leurs `signals` ne créent pas artificiellement de nouveaux traits.

Le README évoque un affaiblissement des réponses contradictoires : dans le code actuel, cet affaiblissement intervient au classement des stratégies, pas dans la valeur de la moyenne dimensionnelle. Préserver cette distinction dans la documentation du moteur intégré.

### 4.2 Interprétation qualitative proposée

| Valeur brute         | Interprétation technique          |
| -------------------- | --------------------------------- |
| −2 ≤ valeur ≤ −1,2   | Pôle opposé marqué                |
| −1,2 < valeur ≤ −0,4 | Tendance vers le pôle opposé      |
| −0,4 < valeur < 0,4  | Nuancée / pas de préférence nette |
| 0,4 ≤ valeur < 1,2   | Tendance favorable                |
| 1,2 ≤ valeur ≤ 2     | Préférence marquée                |

Ces intervalles rendent explicites les bornes que la source décrit avec des recouvrements. Les noms techniques ne sont pas les phrases affichées : chaque dimension a des formulations FR/EN validées pour ses deux pôles et pour la neutralité. Une faible valeur d’« autonomie », par exemple, ne devient pas automatiquement une incapacité à travailler seul.

Une dimension reposant sur un seul item ou sur des réponses divergentes est présentée comme un indice à confirmer, même si sa moyenne est extrême. Le mode complet reste exploratoire : 21 dimensions y reposent encore sur un seul item.

### 4.3 Assemblage du texte

Créer un constructeur pur et déterministe de portrait, distinct du classement des stratégies. Il retourne des rubriques, tendances, priorités et incertitudes structurées, pas du HTML ni du texte généré à distance.

Pour chaque rubrique parmi les neuf groupes de dimensions :

- montrer au plus deux tendances dans la synthèse ; sélectionner d’abord les observations étayées par plusieurs items sans divergence, puis les autres comme indices à confirmer ;
- à qualité égale, départager par intensité absolue puis par identifiant technique ;
- ne pas transformer des réponses neutres en tendances fortes ;
- permettre de consulter le détail des dimensions effectivement mesurées, avec nombre de réponses exploitables ;
- pour un groupe sans donnée exploitable, afficher une absence d’information sans inventer de description.

Terminer par les contrastes utiles et incertitudes. Des préférences différentes, comme le besoin de calme et l’envie de prendre la parole, ne constituent pas par elles-mêmes une contradiction. Ne pas attribuer de nom de personnalité, de profession, de niveau de compétence ou d’information identitaire.

La formulation reste descriptive, conformément au `generationGuide` fourni : « Ce profil suggère… », avec les réserves à proximité des constats. Les textes de pôles, de transitions et de contrastes sont un livrable éditorial FR/EN de l’implémentation ; leur présence ne peut pas être remplacée par un assemblage automatique des noms techniques.

## 5. Référence visuelle et accessibilité

### 5.1 Adaptation de la maquette

Conserver son panneau centré d’environ 900 px maximum, ses surfaces, la progression visible, les cartes de choix, la navigation basse et le récapitulatif modifiable. La teinte indigo de l’assistant peut être conservée dans des variables CSS locales ; elle ne remplace pas les tokens d’accent du portfolio entier.

Remplacer les données de démonstration « Audience / Rétention / Conversion », « puissance de calcul », export et granularité par le vrai contenu métier. Les cinq étapes codées en dur de la maquette ne correspondent pas aux huit sections du questionnaire. Employer une progression par phases — choix, questionnaire, révision, portrait, pistes — complétée par la progression précise des huit sections.

Conserver les thèmes du portfolio via son provider et ses classes `.light` / `.dark`. Les attributs `data-theme` du fichier autonome ne constituent pas un second système de thème à importer. Adapter rayons, surfaces, focus et typographie avec les primitives existantes et un CSS Module propre à l’outil. Sur mobile, limiter les marges et empiler les options ; aucun panneau à hauteur fixe ne doit tronquer des questions.

Le menu « Lab », ses scénarios, les scripts inline, `innerHTML`, le faux délai de 1,5 seconde et l’erreur de connexion sont des mécanismes de démonstration. Le moteur réel est local ; ses erreurs portent sur la validation, le chargement des ressources ou le calcul, selon le cas.

### 5.2 Exigences de recette

- Conserver le `main` et le H1 uniques de l’article. Le dialogue a un titre H2 accessible ; ses phases utilisent H3 puis H4 pour leurs sous-parties, sans deuxième `main`.
- `fieldset` et `legend` ou équivalents natifs cohérents ; libellé, aide et erreur associés à chaque groupe.
- Radios navigables aux flèches, cases à l’espace, actions à Entrée ; ne pas cacher les champs avec une technique qui les rend inaccessibles au focus.
- Focus visible sur toute la carte et cible tactile d’au moins 44 px dans le parcours proposé.
- Après changement d’étape, focus sur son titre ; après erreur, focus sur son résumé ou le premier champ en erreur. Les étapes masquées sortent du parcours de tabulation.
- Annonces `aria-live="polite"` pour la progression et les limites de sélection, sans relire tout le formulaire à chaque réponse.
- Clair/sombre, contraste du texte et des états sélectionnés, absence de dépendance à la couleur seule.
- Mouvement réduit respecté ; aucun changement de scroll forcé à chaque sélection.
- Tests à 320 / 390 / 820 / 1440 px, zoom 200 %, titres anglais longs et navigation clavier complète.
- Réutiliser `Dialog`, vérifier le focus initial, le confinement, Échap et le retour au déclencheur. La fermeture garde le brouillon sans confirmation destructive. Rendre l’arrière-plan inactif, bloquer son défilement pendant l’ouverture puis restaurer sa position. Prévoir une seule zone de défilement dans le dialogue ; sur petit écran, la fenêtre peut occuper presque toute la surface disponible tout en restant superposée à l’article. Ne pas réinitialiser les réponses au changement de largeur.

La maquette a été ouverte dans Chromium à 390 et 1440 px, en clair et sombre ; le choix initial et le passage au choix du mode ont été inspectés. Cela valide la lecture de la référence, pas l’accessibilité de la future intégration.

## 6. Contrat du moteur et corrections nécessaires

### 6.1 Comportements à conserver

- Moyenne dimensionnelle : somme de `valeur × direction × poids`, divisée par les poids exploitables.
- Seules les échelles alimentent ces moyennes ; les bonus de `q015` et `q080` restent qualitatifs, plafonnés à 10 points.
- Le score des stratégies reste interne : base 50, contribution pondérée multipliée par 34 et bonus, borné entre 0 et 100.
- La contribution d’une dimension divergente est multipliée par 0,5 ; celle d’une dimension à un item par 0,85 lorsqu’elle n’est pas divergente.
- Diversification actuelle : pénalité de 12 par élément déjà retenu dans la famille et de 9 dans le pilier ; socle compté initialement dans la sécurité.
- Même questionnaire, moteur, catalogue et réponses doivent produire les mêmes IDs et le même ordre, quelle que soit la langue d’affichage.

Le prototype accepte 75 % de réponses, soit 30 en court et 60 en complet. L’interface V1 proposée exige 40/80 ; ce contrat plus strict doit aussi être appliqué par la fonction de soumission commune, pas uniquement par l’état d’un bouton.

### 6.2 Écarts constatés et cible

| ID  | Constat vérifié                                                                                                                                                                               | Correction à prévoir                                                                                                                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M1  | `Result` expose des dimensions et des recommandations, aucun portrait rédigé                                                                                                                  | Ajouter un constructeur de portrait et son contrat de contenu FR/EN                                                                                                                                                                                                |
| M2  | Si moins de six dimensions ont une valeur absolue ≥ 0,4, `useGenericFallback` trie d’abord quatre IDs génériques ; la sélection retrie ensuite par score et pénalités, annulant leur priorité | Créer une branche de repli explicite, testée sur le résultat final et distincte du classement personnalisé                                                                                                                                                         |
| M3  | Le code relâche la limite de pilier si aucun candidat n’est admissible, contrairement à la lecture stricte du README                                                                          | En V1, rendre la limite de deux par pilier et par famille explicite et stricte ; catalogue insuffisant = erreur de configuration testée, pas relaxation silencieuse                                                                                                |
| M4  | Les quatre IDs génériques d’origine comprennent trois pistes dans le pilier employabilité                                                                                                     | Valider un ensemble de repli compatible avec M3. Ensemble retenu lors de l’implémentation : `maintien_employabilite`, `apprendre_ia`, `reseau_confiance`, `reconversion_progressive` ; ordre fixe, sans bonus ni prétention de personnalisation |
| M5  | Certaines phrases et erreurs sont françaises dans le moteur ; des égalités sur les raisons sont départagées par leur texte français                                                           | Retourner des codes/IDs et paramètres, localiser au rendu et départager par IDs stables                                                                                                                                                                            |
| M6  | `ResultatsStrategies.tsx` importe les deux manifestes dans un composant client et les force par double conversion de type                                                                     | Charger/valider les données côté serveur, transmettre un contrat sérialisable à l’îlot interactif                                                                                                                                                                  |
| M7  | La source `q080` associe `revenus` à `stabilite`, et `liberte_geo` à deux dimensions différentes                                                                                              | Conserver le traitement direct des bonus ; ne pas utiliser ces associations comme preuves de traits pour le portrait                                                                                                                                               |
| M8  | L’ID réel `service_packagé` contient un accent                                                                                                                                                | Préserver exactement les IDs existants pour l’intégration ; une normalisation éventuelle nécessiterait une migration/version explicite                                                                                                                             |

Ne pas présenter M3 ou le nouvel ensemble de repli comme une simple copie à comportement inchangé. Ces décisions modifient des cas limites du prototype et devront être évaluées sur des profils synthétiques.

### 6.3 Reproduction du défaut de repli

En mode court, répondre `ne_sais_pas` à toutes les échelles et choisir `imaginer` pour `q015`. Aucune dimension n’est mesurée. Le résultat observé est pourtant :

1. `socle_financier` ;
2. `conception_produit` ;
3. `microproduit_recurrent` ;
4. `activite_accompagnement` ;
5. `audience_ciblee`.

Ces éléments portent la note « Piste générale », mais ils ne sont pas les quatre IDs de repli annoncés dans le code. Les assertions existantes de `tests.cjs` ne vérifient pas cette sélection finale. Ajouter un test indépendant qui échoue avec le prototype et passe après correction.

### 6.4 Validation et versions

Valider au chargement : schémas, versions, unicité des sections/questions/dimensions/stratégies, tiers, références d’options, valeurs finies, sens ±1, poids positifs, bornes de sélection, familles, réserves, bonus et existence de l’ensemble de repli. La validation porte aussi sur le nombre déclaré et réel de questions dans chaque mode et sur la parité des clés FR/EN.

Les réponses reçues par la fonction de soumission sont traitées comme des données inconnues à valider : objet attendu, mode connu, IDs du mode exclusivement, bonnes valeurs et bons types, absence de doublon dans les choix multiples, cardinalités et complétude requises. Les erreurs sont des codes localisables associés à un champ ; elles ne doivent pas dépendre de l’analyse d’un message français.

Séparer les versions du schéma, du questionnaire, du catalogue et du moteur. `questionnaireId: portrait-professionnel-universel` ne suffit pas à identifier une révision. Conserver ces versions dans le résultat et dans toute éventuelle sauvegarde. La langue n’est pas une version du calcul.

## 7. Architecture technique proposée

### 7.1 Architecture retenue : module et dialogue superposé

L’assistant vit dans les deux routes d’article existantes. Aucune page dédiée ni nouvelle route de résultats n’est créée. Nom proposé du module, encore absent du registre : `career-strategy-assistant`, sans props libres et limité à une occurrence par article.

Le module comprend une enveloppe serveur légère avec l’invitation, puis un déclencheur client qui ouvre la primitive `Dialog` et charge l’assistant à la demande. Le questionnaire, le catalogue et les restitutions détaillées ne sont pas importés statiquement dans le registre ni dans le déclencheur.

Les sources métier sont chargées et validées lors de la préparation du site. Produire des ressources JSON statiques localisées et versionnées sous `public/career-strategy/<contentVersion>/{fr,en}.json`. Un petit descripteur serveur associe la version attendue à l’URL de la locale ; seules cette URL et les données d’affichage légères du déclencheur sont incluses dans l’article initial.

À l’ouverture, le client charge le module JavaScript différé et la ressource statique de sa langue, vérifie son contrat/version puis initialise l’état. Cette requête lit des données publiques du site et ne contient aucune réponse. Le calcul du portrait et des pistes reste intégralement local. Aucun endpoint recevant des réponses n’est créé. Aucun manifeste canonique n’est importé directement dans un composant client.

La production des ressources doit être reproductible depuis les sources, reliée aux phases existantes `predev` et `prebuild`, et contrôlée pour éviter une ressource manquante ou obsolète. Le chemin versionné change dès que le questionnaire, les règles ou les traductions du paquet changent ; aucun ancien fichier immuable n’est remplacé par un contenu différent. La politique de version du brouillon décide séparément si les réponses peuvent être reprises.

Après la première ouverture, conserver le composant et son état pendant la visite, même fenêtre fermée ; les champs fermés restent inaccessibles au clavier. Ne pas lancer le chargement lourd avant interaction. Une erreur de chargement affiche « Réessayer » dans le dialogue sans supprimer une progression déjà disponible. Vérifier réseau et payload HTML/RSC : le découpage du JavaScript seul ne suffit pas à différer les 80 questions.

### 7.2 Organisation prévisionnelle

| Emplacement proposé                                                | Responsabilité                                                                                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `src/content/career-strategy/questionnaire.json`                   | Définition canonique, IDs, ordre, tiers, dimensions et règles                                        |
| `src/content/career-strategy/strategies.json`                      | Catalogue canonique, IDs, signaux, familles, bonus et réserves codées                                |
| `src/content/career-strategy/{fr,en}.json`                         | Questions, options, sections, stratégies et formulations du portrait localisées, référencées par IDs |
| `src/features/career-strategy/types.ts`                            | Contrats questionnaire/réponses/portrait/résultat et codes d’erreurs                                 |
| `src/features/career-strategy/validation.ts`                       | Validation pure des données et de la soumission                                                      |
| `src/features/career-strategy/loaders.ts`                          | Chargement de préparation du site, validation et assemblage des ressources localisées                |
| `src/features/career-strategy/engine.ts`                           | Adaptation du moteur fourni, sans dépendance React/Next/locale                                       |
| `src/features/career-strategy/portrait.ts`                         | Interprétation qualitative, niveaux d’étayage et sélection des tendances                             |
| `src/features/career-strategy/Assistant.tsx`                       | État du parcours, étapes, corrections et soumission côté client                                      |
| `src/features/career-strategy/QuestionField.tsx`                   | Radios et choix multiples accessibles                                                                |
| `src/features/career-strategy/Portrait.tsx`, `Recommendations.tsx` | Restitutions adaptées au portfolio                                                                   |
| `src/features/career-strategy/Assistant.module.css`                | Composition et variantes de la maquette, styles bornés à l’outil                                     |
| `src/i18n/messages/{fr,en}.json`                                   | Messages d’interface et erreurs localisées sous un namespace dédié                                   |

Ajouter une enveloppe serveur de module, un déclencheur client léger, un adaptateur de stockage et un producteur de ressources statiques au découpage ci-dessus. Leurs chemins exacts seront choisis lors de l’implémentation dans les dossiers de cette fonctionnalité. Les fichiers servis sous `public/career-strategy/` sont dérivés de ces sources et ne constituent pas un second catalogue éditorial à modifier manuellement.

Cette séparation évite de dupliquer les poids dans les traductions. Le découpage des composants peut rester plus petit si cela conserve les responsabilités. Ne pas copier `build/`, le `tsconfig.json` autonome ou l’exemple d’affichage tel quel dans l’application.

### 7.3 Intégrations du registre JSON et du dialogue

Déclarer le module dans `src/lib/blog/json-custom-modules.json`, son type explicite dans `json-types.ts`, puis sa correspondance dans `JsonCustomRegistry.tsx`. Attention : `SaaSModuleName` inclut actuellement tous les modules sauf deux ; l’ajout d’un assistant ne doit pas le transformer par erreur en widget SaaS. Rendre cette union et le mapping SaaS explicites avant l’enregistrement.

Le manifeste précise zéro prop libre, une occurrence maximale et les IDs DOM stables réellement produits par l’enveloppe. Si elle produit un H3, déclarer ce comportement au validateur. Les IDs internes des questions et du dialogue sont préfixés par instance avec `useId` pour éviter les collisions ; les IDs métier `q001`…`q080` restent inchangés dans les réponses. Ne pas créer de lien éditorial vers un élément qui n’existe qu’après ouverture du dialogue.

Charger le contenu lourd à l’ouverture depuis une frontière client, en respectant la documentation Next embarquée. Un import dynamique depuis un composant serveur ne garantit pas à lui seul le découpage différé. Réutiliser `Dialog` et le provider de thème ; vérifier la stabilité des callbacks de fermeture et l’absence d’effacement au montage/démontage du dialogue.

La sauvegarde est isolée dans un adaptateur de la fonctionnalité. Elle ne réutilise ni les données ni les clés de la checklist historique. Pour désactiver le clic de fond et gérer le défilement, une option typée et compatible de `Dialog` est admissible ; préserver et tester le comportement des autres appelants.

### 7.4 Articles, langues, SEO et préparation des ressources

- Les deux JSON d’articles : ajouter le module `custom`, retirer la mention d’indisponibilité une fois l’outil validé, annoncer explicitement le socle commun et les quatre pistes. Conserver la clé de traduction et les ancres.
- `src/i18n/messages/{fr,en}.json` : ajouter les textes d’interface et les erreurs du module. Les traductions du questionnaire et du catalogue gardent les mêmes IDs et règles.
- Le sélecteur de langue continue de relier les deux articles par leur `translationKey`. Aucune route dédiée n’est à ajouter à `routing.ts`, `paths.ts`, `SiteHeader.tsx` ou `LocaleLinks.tsx` pour l’assistant ; la reprise interlangue passe par la sauvegarde locale choisie par le lecteur.
- Le validateur des liens d’articles ne nécessite pas d’exception de routage pour ce module. Les ressources statiques versionnées sont validées par le producteur de paquets métier et leurs tests ; ce ne sont pas des médias `figure` sous `/blog/<slug>/`.
- Les métadonnées, canonical, hreflang, images sociales, JSON-LD et sitemap restent ceux des articles, fournis par les mécanismes existants. Aucun nouveau `BlogPosting` ni entrée sitemap pour le dialogue ou ses résultats.
- Aucune réponse, sauvegarde ou restitution personnalisée dans les métadonnées, le HTML pré-rendu, le payload serveur de l’article, les URLs ou le sitemap. Les données publiques du questionnaire sont chargées depuis les ressources à l’ouverture.
- Intégrer le producteur et son contrôle de cohérence aux scripts de préparation existants ; aucune nouvelle dépendance n’est nécessaire. Ne pas écrire de ressources pendant une requête de lecteur.

Si l’article n’a pas encore été déployé, l’outil peut faire partie de sa publication initiale. Sinon, appliquer la politique existante d’`updatedAt` pour la révision réelle. La date du présent document ne doit pas devenir automatiquement une date de mise à jour.

## 8. État, données et confidentialité de fonctionnement

### 8.1 Contrat d’état proposé

L’état contient : phase courante, mode, ID de section, réponses par ID, destination de retour après correction, révision des réponses, erreurs et résultats associés à cette révision. Les fonctions de calcul ne mutent pas le questionnaire, le catalogue ou le brouillon.

Phases : accueil → questions → révision → portrait → pistes. Une action de modification invalide les sorties calculées avant de retourner aux questions. « Recommencer » remet mode, réponses, erreurs et résultats à zéro après confirmation. La soumission reste idempotente et ne déclenche pas deux calculs concurrents.

Les résultats regroupent : versions, mode, nombre de réponses renseignées/informatives, dimensions et preuves, portrait structuré, état de personnalisation, socle et pistes avec leurs IDs. Les données d’affichage et les codes métier sont séparés ; les identifiants exacts de la source sont préservés entre FR/EN.

### 8.2 Fonctionnement sans sauvegarde activée

Le brouillon et le résultat restent dans l’état de l’assistant. La fermeture du dialogue ne détruit pas cet état pendant la visite. Aucun stockage de réponses en cookie, URL, sessionStorage ou serveur ; localStorage est utilisé seulement après activation explicite de la sauvegarde décrite ci-dessous.

Le cookie de langue, le stockage du thème et les requêtes habituelles du portfolio continuent d’exister. L’ouverture charge des ressources statiques du questionnaire ; ne pas afficher « ce site ne fait aucune requête » ou « aucun cookie ».

Formulation produit proposée : « Vos réponses servent à calculer votre portrait et ces pistes dans votre navigateur. Elles ne sont pas envoyées à un serveur pour ce calcul. Vous pouvez fermer et rouvrir cet assistant pendant votre visite. Pour reprendre après un rechargement ou une nouvelle visite, activez la sauvegarde sur cet appareil. »

Le portfolio peut charger Umami via son layout. Ne pas envoyer de réponse, texte du portrait, ID de stratégie, score, profil ou donnée détaillée via les événements, logs ou rapports d’erreurs. Aucun nouvel événement analytique n’est nécessaire à la V1. La recette inspecte les requêtes pendant tout le parcours, y compris le chargement initial des ressources.

### 8.3 Sauvegarde locale facultative — incluse dans la V1

Conformément à Q2, proposer « Enregistrer ma progression sur cet appareil » dès l’accueil, désactivé initialement, puis accessible dans les étapes et les résultats. Afficher son effet, sa durée et une action de suppression. L’activer en cours de saisie enregistre immédiatement le brouillon valide courant. Elle ne conditionne ni le portrait ni les conseils.

Proposition de conception : clé propre au sujet `vd_ai_career_strategy_draft_v1`, indépendante de la locale, enveloppe versionnée et expiration après 30 jours depuis la dernière modification valide. Cette durée est une valeur de conception proposée, pas une réponse supplémentaire demandée au propriétaire. Ce n’est pas une clé de `JsonChecklist` ; son contrat appartient à l’assistant.

Enregistrer uniquement les versions requises, le mode, les réponses et la phase/section de reprise ; ne pas persister de portrait, de scores ou de conseils. À la réouverture dans l’une ou l’autre langue, lire la sauvegarde côté client après hydratation, revalider les versions et les valeurs, puis proposer explicitement de reprendre ou de recommencer. Reprendre recalcule les sorties si le lecteur était déjà arrivé aux résultats, sans lui demander de ressaisir ses réponses.

Les écritures suivent les changements valides ; un état visible distingue « Enregistrement… », « Progression enregistrée » et un échec. Ne pas prétendre qu’une dernière modification est sauvegardée avant la réussite de son écriture. La fermeture conserve aussi l’état en mémoire ; elle ne déclenche pas de suppression.

- Désactiver la sauvegarde ou « Supprimer la sauvegarde » retire immédiatement la copie durable et laisse la saisie courante en mémoire, avec une explication claire.
- « Recommencer » confirme puis efface la saisie courante, les résultats et la copie durable ; l’option de sauvegarde revient désactivée.
- Une sauvegarde expirée est retirée ; une sauvegarde invalide ou incompatible n’est pas réinterprétée silencieusement. Expliquer l’impossibilité de reprise et permettre un nouveau parcours sans bloquer l’outil.
- Le changement du texte d’une traduction n’invalide pas nécessairement les réponses. Un changement d’IDs, d’options ou de sens des questions exige une compatibilité explicitement définie. Un nouveau moteur/catalogue peut recalculer des conseils différents ; signaler la version actuelle lors d’une reprise.
- Stockage refusé, quota dépassé ou suppression externe : le questionnaire reste utilisable en mémoire, avec le statut de sauvegarde mis à jour.
- Conflit entre onglets : ne pas remplacer silencieusement une session active. Détecter la révision externe et suspendre les écritures automatiques ; proposer de reprendre la copie externe ou de conserver et enregistrer explicitement la session courante.

La langue ne figure pas dans la clé : le même brouillon alimente FR et EN, avec de nouvelles formulations localisées et les mêmes calculs. Aucun mécanisme ne synchronise les réponses vers un compte ou un autre appareil.

## 9. Plan de réalisation et critères d’acceptation

### 9.1 Lots d’implémentation

| Lot                                  | Livrable                                                                                                                         | Condition de sortie                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1 — Contrats et adaptation du moteur | Sources versionnées dans le dépôt, validation, tests autonomes portés, correction du repli, règles de diversification explicites | Déterminisme vérifié et jeux de profils synthétiques relus            |
| 2 — Portrait et traductions          | Portrait structuré, textes des pôles/nuances, traduction complète FR/EN                                                          | Même calcul et mêmes IDs, différences limitées aux textes affichés    |
| 3 — Assistant visuel                 | Accueil, huit sections, révision, portrait, pistes, corrections                                                                  | Parcours complet court/complet utilisable au clavier sur mobile       |
| 4 — Intégration blog et navigation   | Module et dialogue, sauvegarde, langue, thème, contenu de l’article aligné                                                       | Liens validés et aucune régression du shell ou des articles existants |
| 5 — Recette                          | Tests métier, navigateur, SEO, captation réseau et comparaison à la maquette                                                     | Aucun nouvel échec ; problèmes préexistants identifiés séparément     |

Les choix Q1–Q3 sont confirmés et intégrés au plan. La demande suivante du propriétaire a autorisé l’implémentation de ce plan ; son état concret est documenté dans [ASSISTANT_STRATEGIES_IA.md](ASSISTANT_STRATEGIES_IA.md).

### 9.2 Matrice d’acceptation

| ID   | Vérification attendue                                                                                                                                 |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC01 | Depuis chaque article, le bouton ouvre le dialogue dans la bonne langue ; fermer restaure le focus au déclencheur sans perdre la session              |
| AC02 | Court = 40 questions ; complet = 80 ; chaque section contient les IDs et options d’origine dans le bon ordre                                          |
| AC03 | Aucune sélection initiale, retour/correction sans perte involontaire, limites 1–2 des choix multiples effectives                                      |
| AC04 | Une soumission incomplète/altérée est refusée ; une réponse inconnue et une réponse neutre restent distinguées                                        |
| AC05 | Le portrait n’invente aucune des onze dimensions non mesurées en court ; tous les indices à un item sont identifiés comme tels                        |
| AC06 | Les deux langues produisent les mêmes dimensions, niveaux, IDs de stratégies et ordre avec les mêmes réponses et versions                             |
| AC07 | La sortie comporte exactement cinq éléments : un socle commun en premier et quatre pistes adaptées, avec raisons, actions, horizons et limites        |
| AC08 | Le cas de repli reproduit en section 6 passe par la branche générique attendue, sans score de réussite ni fausse personnalisation                     |
| AC09 | Diversification vérifiée sur la sélection finale, égalités stables, absence de doublons et invariance à l’ordre des clés de réponses                  |
| AC10 | Modifier une réponse invalide les résultats ; recommencer et changer de mode respectent les confirmations prévues                                     |
| AC11 | Radio/clavier, erreurs, focus, annonces, langue, thème, 320/390/820/1440 px et zoom 200 % sont vérifiés au navigateur                                 |
| AC12 | Sauvegarde facultative désactivée initialement ; reprise FR/EN, effacement, expiration, versions, quota et conflits testés ; aucune réponse transmise |
| AC13 | Les articles, index, social images et sitemap restent corrects ; aucune route ni entrée d’indexation créée pour le dialogue ou ses résultats          |
| AC14 | Aucun poids ou règle ne dépend d’une traduction ; les schémas et références locales invalides font échouer les contrôles                              |
| AC15 | L’article seul ne charge pas le formulaire complet ; une erreur de chargement de l’outil permet une reprise sans effacer le brouillon déjà saisi      |

### 9.3 Stratégie de tests

Porter les assertions fournies dans la configuration Vitest existante, puis ajouter des tests indépendants couvrant : toutes les réponses inconnues, neutres ou extrêmes, divergences, bornes exactes, 29/30/39/40 et 59/60/79/80 réponses, types invalides, modes incorrects, bonus plafonnés, égalités, immutabilité et configurations de catalogue insuffisantes. Les seuils 30/60 documentent le comportement bas niveau existant ; 40/80 vérifient la soumission publique proposée.

Les tests du portrait utilisent des attentes éditoriales explicites et des dimensions choisies ; ne pas se contenter de comparer une fonction à sa propre sortie. Ajouter une recette des profils « créateur prudent », « terrain », réponses très neutres et profil orienté stabilité, avec examen du texte des raisons et réserves.

Les E2E couvrent les deux parcours dans les deux langues, les corrections depuis le récapitulatif, le passage court/complet, les résultats génériques, la fermeture/réouverture et les sauvegardes facultatives, y compris la reprise interlangue et les conflits entre onglets. Faire une revue visuelle réelle des étapes et des résultats ; axe seul ne valide pas la ressemblance à la maquette. Surveiller les requêtes réseau et erreurs console.

Commandes déjà disponibles à utiliser après implémentation, successivement pour celles partageant `.next` :

1. `npm run blog:validate`
2. `npm run blog:test:json`
3. `npm run lint`
4. `npx tsc --noEmit`
5. `npm test`
6. `npm run build`
7. `npm run blog:test:seo`
8. `npm run test:e2e`
9. Si le moteur/registre JSON ou ses validations changent : `npm run blog:test:publication`, puis `npm run blog:test:preview`.

Les nouveaux tests navigateur s’intègrent à la configuration existante. Ne pas lancer simultanément build, preview, publication synthétique et serveurs concurrents utilisant le même `.next`.

## 10. Preuves de cadrage, réserves et livraison

### 10.1 Contrôles réalisés pour ce document

Le moteur a été compilé avec le TypeScript installé dans le dépôt et ses tests exécutés sur une copie temporaire sous `/tmp/portfolio-strategy-spec-audit/`, sans modifier le dossier Downloads. Les assertions fournies passent pour les deux modes et les profils contrastés. Le contre-exemple de repli de section 6 a été exécuté séparément et confirme M2.

La lecture des données confirme 80 questions, 48 dimensions, 22 stratégies et un socle. La maquette a été rendue au navigateur dans quatre configurations, sans débordement horizontal sur ces captures initiales. Ce constat ne prétend pas vérifier les 40/80 questions ni un assistant intégré qui n’existe pas encore.

Empreintes SHA-256 des références principales inspectées :

| Fichier                         | Empreinte                                                          |
| ------------------------------- | ------------------------------------------------------------------ |
| `questionnaire.json`            | `5ba1c185a62510b2df34d782cff96fb4c176684e13e9208d6b066c7887245697` |
| `strategies.json`               | `38a7f8aca7e4d2fdfa8d9c88937373470080e439174de8bace016031a687eac9` |
| `recommandations.ts`            | `bcaa9e4d06d12e87ef308fb75b15ab68dfec672ebf2ad8550caf211b58b50b06` |
| `docs/maquettes/assistant.html` | `e4917207c3ede02ccef4e1d0f549c0afaddd3e2c292d58e3ac469da992f4bd2c` |

Ces empreintes identifient l’audit ; elles ne créent pas une approbation automatique de futurs contenus ou d’une modification des règles métier.

### 10.2 Réserves techniques du dépôt

La mission précédente, sur le même HEAD, a constaté un test historique SaaS en échec, une erreur de formatage lint, une assertion SEO globale portant sur une classe de l’index et une alerte de sécurité Next.js. Ils ne sont pas corrigés par ce document et devront être recontrôlés au début de l’implémentation pour distinguer régressions et état antérieur. Aucun nouveau build complet n’est nécessaire pour la seule création de cette spécification.

### 10.3 Périmètre exclu de la V1 proposée

Compte utilisateur, base de données, envoi d’email, API de recommandations, génération distante, mesure de risque de remplacement, diagnostic psychologique, personnalisation financière fondée sur des données non recueillies, exports PDF/CSV, nouveau questionnaire raccourci, refonte du blog et nettoyage MDX historique.

La livraison d’implémentation sera un assistant FR/EN relié à l’article, des données et un moteur versionnés dans le dépôt, des tests et preuves visuelles, ainsi qu’un rapport de validation. Le présent livrable est le document de cadrage ; les décisions Q1–Q3 y sont confirmées et déclinées dans le parcours, l’architecture et la recette. Aucun commit, push ou déploiement n’est inclus.
