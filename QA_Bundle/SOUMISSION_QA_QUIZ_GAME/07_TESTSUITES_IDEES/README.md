# 07_TESTSUITES_IDEES — Synthèse des suites QA

Ce répertoire réécrit les idées clés du dossier `QA_TestSuites/` afin de livrer, dans la soumission officielle, une vue synthétique et exploitable des différentes approches de test. Chaque fichier se concentre sur un levier :

| Fichier | Objectif |
|---------|----------|
| `07.1_MANUEL_FONCTIONNEL.md` | Résumer les cas manuels (Auth, Quiz, Scores, Leaderboard, NFR rapides) et leurs prérequis. |
| `07.2_AUTOMATION_UI.md` | Formaliser la stratégie Cypress (structure projet, specs, commandes custom, critères CI). |
| `07.3_AUTOMATION_API.md` | Décrire la couverture Jest/SuperTest pour `/api/users/*` et `/api/questions`. |
| `07.4_NON_FUNCTIONAL.md` | Capturer les scénarios performance, charge, sécurité, accessibilité et résilience. |

Les résultats d'exécution correspondants résident dans les dossiers `03_EXÉCUTION_TESTS`, `04_PERFORMANCE_SÉCURITÉ` et `05_CLÔTURE_ET_DÉCISION`. Ce chapitre 07 sert de passerelle entre les intentions de tests et les preuves archivées.
