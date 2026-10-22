# Correctif local de braces

Basé sur `braces@3.0.3` et le correctif de profondeur du [PR amont #72](https://github.com/micromatch/braces/pull/72), commit `28d440b5dd449dbf1fe6f3506cf94ecca4d02660`. L’avis GHSA-vfj7-8cjw-p6xm concerne les motifs de profondeur arbitraire et n’a toujours pas de version corrigée publiée. Ce paquet local limite à 100 niveaux l’imbrication analysée et la récursion des parcours AST.

Ce correctif reste temporaire : vérifier les publications amont et retirer le paquet local dès qu’une version officielle corrigée est disponible. Le code est testé avec le jeu de motifs normal du portfolio, les limites 100/101 et le build/lint du projet.
