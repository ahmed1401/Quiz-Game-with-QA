# SOUMISSION_QA_QUIZ_GAME

## Contexte
- Projet : Plateforme Quiz Game (Angular 18 + Node/Express + MongoDB)
- Périmètre : campagne QA/QE complète (fonctionnel, E2E, perf, sécurité, conformité)
- Équipe QA : Ahmed Hajjej & Skander Hakouna (référents uniques mentionnés dans chaque livrable)
- Environnement outillage : Jest/SuperTest, Karma/Jasmine, Cypress Edge, k6, Lighthouse, OWASP ZAP 2.16.1

## Structure du dossier
1. `01_PLANIFICATION/01.1_PLAN_DE_TEST_PRINCIPAL.md` – Master Test Plan au format Certilog.
2. `01_PLANIFICATION/01.2_STRATÉGIE_DE_TEST.md` – Stratégie outillage + jalons GO/NO-GO.
3. `01_PLANIFICATION/01.3_EXIGENCES_FONCTIONNELLES.md` – Inventaire des exigences & user stories QA.
4. `01_PLANIFICATION/01.4_PÉRIMÈTRE_DE_TEST.md` – Portée, risques, hypothèses, environnements.
5. `02_CONCEPTION_TESTS/02.1_CAS_DE_TEST.md` – Matrice des cas fonctionnels/E2E/NFR.
6. `02_CONCEPTION_TESTS/02.2_DOSSIER_QA_COMPLET.md` – Traçabilité complète + matrices RACI.
7. `03_EXÉCUTION_TESTS/03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.md` – Journal quotidien d’exécution.
8. `03_EXÉCUTION_TESTS/03.2_SYNTHÈSE_EXÉCUTION.md` – Synthèse finale des campagnes.
9. `03_EXÉCUTION_TESTS/03.3_RAPPORT_DÉFAUTS.md` – Récapitulatif des anomalies.
10. `04_PERFORMANCE_SÉCURITÉ/04.1_RAPPORT_PERFORMANCE_SÉCURITÉ.md` – Consolidé Lighthouse/k6/ZAP.
11. `04_PERFORMANCE_SÉCURITÉ/04.2_RÉSULTATS_BRUTS_K6.json` – Résultats bruts k6.
12. `04_PERFORMANCE_SÉCURITÉ/04.3_SCAN_SÉCURITÉ_ZAP_BACKEND.html` & `04_PERFORMANCE_SÉCURITÉ/04.4_SCAN_SÉCURITÉ_ZAP_FRONTEND.html` – Rapports OWASP ZAP.
13. `05_CLÔTURE_ET_DÉCISION/05.1_RAPPORT_CLÔTURE_TEST.md` – PV de recette QA.
14. `05_CLÔTURE_ET_DÉCISION/05.2_NOTE_DÉCISION_CLÔTURE.md` – Note GO/NO-GO.
15. `05_CLÔTURE_ET_DÉCISION/05.3_SYNTHÈSE_RÉSULTATS.md` – Résumé exécutif.
16. `06_TOUT_EN_UN.md` – Rapport consolidé (ce fichier).
17. `07_TESTSUITES_IDEES/` – Synthèse réécrite des suites manuelles, UI, API et NFR (idées issues de `QA_TestSuites`).

## Consignes d’utilisation
- Tous les fichiers sont en Markdown/JSON/HTML pour faciliter la relecture dans VS Code ou navigateur.
- Chaque section rappelle l’origine (AHMED bundle) et reste autoportante ; aucune dépendance à des PDF.
- Les hyperliens internes utilisent les nouveaux noms pour éviter toute ambiguïté.
- Pour rejouer les tests : consulter les sections "Procédures d’exécution" dans `01.1` et `02.2`, puis suivre les scripts référencés.

## Historique rapide
- 2025-11-29 : RA complète + mise en conformité Certilog.
- 2025-11-30 : Repackaging SOUMISSION demandé (ce dossier), incluant renommages + contrôles d’auteurs.

## Points de contact
- QA Lead : Ahmed Hajjej – ahmed.hajjej@enicar.ucar.tn
- QA Co-lead : Skander Hakouna – skander.hakouna@enicar.ucar.tn

