# SOUMISSION_QA_QUIZ_GAME

## Contexte
- Projet : Plateforme Quiz Game (Angular 18 + Node/Express + MongoDB)
- Périmètre : campagne QA/QE complète (fonctionnel, E2E, perf, sécurité, conformité)
- Équipe QA : Ahmed Hajjej & Skander Hakouna (référents uniques mentionnés dans chaque livrable)
- Environnement outillage : Jest/SuperTest, Karma/Jasmine, Cypress Edge, k6, Lighthouse, OWASP ZAP 2.16.1

## Structure du dossier
- Racine
  - `00_GUIDE.pdf` – version scellée de cet index.
  - `06_full_user_journey_live.mp4` – démonstration vidéo de l’exécution Cypress “live E2E”.
  - `INDEX_FICHIERS.txt` – sommaire horodaté pour contrôle d’intégrité.

1. `01_PLANIFICATION/`
	- `01.1_EXIGENCES_FONCTIONNELLES.pdf` – inventaire des user stories et critères d’acceptation.
	- `01.2_PLAN_DE_TEST_PRINCIPAL.pdf` – master test plan Certilog (portée + jalons GO/NO-GO).
	- `01.3_STRATÉGIE_DE_TEST.pdf` – gouvernance QA, outillage et RACI.
	- `01.4_PÉRIMÈTRE_DE_TEST.pdf` – risques, hypothèses, environnements.
	- `01.0_SCREENSHOTS_QuizGame/` – preuves UI : `login.png`, `register.png`, `welcome.png`, `quiz.png`, `end_of_quiz.png`, `leaderboard.png`.

2. `02_CONCEPTION_TESTS/`
	- `02.1_CAS_DE_TEST.pdf` – matrice des cas fonctionnels/E2E/NFR.
	- `02.2_MATRICE_DE_TRAÇABILITÉ.xlsx` – mapping bidirectionnel exigences ↔ tests ↔ défauts.
	- `02.3_DOSSIER_QA_COMPLET.pdf` – consolidation des procédures, checklists et critères.
	- `02.4_SCRIPTS_DES_TESTS/`
		- `Backend_Jest_Supertest/` – scripts d’intégration API : `questionRoutes.test.js`, `setup.js`, `userRoutes.test.js`.
		- `Frontend_E2E/` – specs Cypress : `auth-guard.cy.ts`, `full_user_journey.cy.ts`, `full_user_journey.live.cy.ts`, `leaderboard.cy.ts`, `login.cy.ts`, `quiz.cy.ts`, `register.cy.ts`, `welcome.cy.ts`.

3. `03_EXÉCUTION_TESTS/`
	- `03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.pdf` – RUN-FT chronologique.
	- `03.2_SYNTHÈSE_EXÉCUTION.pdf` – bilan des campagnes FT/NFR.
	- `03.3_RAPPORT_DÉFAUTS.pdf` – détail DEF-00x.
	- `03.0_TEST_SUITES_IDEES/` – déclinaisons PDF : `03.0.1_MANUEL_FONCTIONNEL.pdf`, `03.0.2_AUTOMATION_UI.pdf`, `03.0.3_AUTOMATION_API.pdf`, `03.0.4_NON_FUNCTIONAL.pdf`.
	- `03.4_SCREENSHOTS_EXÉCUTION_DES-TESTS/` – captures d’évidence : `Backend-JEST.png`, `Cypress.png`, `E2E_tests.png`, `karma_jasmine_frontend_tests.png`.

4. `04_PERFORMANCE_SÉCURITÉ/`
	- `04.1_RAPPORT_PERFORMANCE_SÉCURITÉ.pdf` – synthèse Lighthouse/k6/ZAP.
	- `04.2_RÉSULTATS_BRUTS_K6_JSON.json` – sortie brute k6 (50 VUs).
	- `04.3_SCAN_SÉCURITÉ_ZAP_BACKEND.html` & `04.4_SCAN_SÉCURITÉ_ZAP_FRONTEND.html` – rapports OWASP ZAP passifs.

5. `05_CLÔTURE_ET_DÉCISION/`
	- `05.1_RAPPORT_CLÔTURE_TEST.pdf` – PV de recette QA (métriques + décision).
	- `05.2_NOTE_DÉCISION_CLÔTURE.pdf` – synthèse GO/NO-GO.
	- `05.3_SYNTHÈSE_RÉSULTATS.pdf` – résumé exécutif à destination du COMEX.



## Points de contact
- QA Lead : Ahmed Hajjej – ahmed.hajjej@enicar.ucar.tn
- QA Co-lead : Skander Hakouna – skander.hakouna@enicar.ucar.tn

