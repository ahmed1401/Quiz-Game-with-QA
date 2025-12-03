# QA Test Suites — Quiz Game

Ce répertoire regroupe toutes les suites de tests à exécuter pour Quiz Game. Chaque sous-dossier contient les artefacts, plans et scripts liés aux campagnes menées pendant le Sprint 1.

## 1. Aperçu des sections et livrables

| Dossier | Rôle | Ce qui a été exécuté | Rapports associés |
|---------|------|----------------------|-------------------|
| `01_Manual_Functional/` | Cas de test manuels structurés (Auth, Quiz, Scores, Leaderboard). | RUN-FT-001 → RUN-FT-005 (30 cas exécutés, 2 défauts ouverts). | `QA_Bundle/05_Reports/ExecutionDailyLog.md`, `ExecutionFinalSummary.md`. |
| `02_Automation_UI/` | Stratégie Cypress + specs E2E Angular. | Parcours Login → Quiz → Leaderboard automatisés, scénarios smoke. | `QA_Bundle/06_FinalReports/Synthese_Resultats_Tests.md` (section UI auto). |
| `03_Automation_API/` | Tests Jest/SuperTest sur endpoints Express. | Vérification CRUD utilisateurs, scoring, catalogue questions (MongoMemoryServer). | `QA_Bundle/05_Reports/DefectReport.md` (DEF-002), logs Jest. |
| `04_NonFunctional/` | Scénarios k6, Lighthouse, OWASP ZAP. | RUN-NFR-001 (k6 50 VUs + Lighthouse + ZAP backend/frontend). | `QA_Bundle/05_Reports/PerfSecurityReport.md`, `zap-backend.html`, `zap-frontend.html`, `k6-result.json`. |

Les suites peuvent être utilisées indépendamment ou intégrées dans le pipeline CI/CD. Les décisions GO/NO-GO et les synthèses finales sont centralisées dans `QA_Bundle/06_FinalReports/` (`Plan_de_Test.md`, `Synthese_Resultats_Tests.md`, `Note_Decision_Cloture.md`).

## 2. Guide d'exécution complète

```
# 0. Prereqs
- Terminal A: start backend Mongo memory server as needed (optional).
- Terminal B: ensure deps installed: `npm install` in both `/backend` and `/frontend`.

# 1. Backend API tests (Jest + SuperTest)
1. `cd backend`
2. `npm test`
	- Uses MongoMemoryServer; no extra services required.

# 2. Frontend unit/integration tests (Karma + Jasmine)
1. Ensure Edge path (or Chrome) is available.
2. `cd frontend`
3. `$env:CHROME_BIN="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
4. `npm test -- --watch=false --browsers=ChromeHeadless`

# 3. Cypress E2E UI tests
1. Terminal A: `cd frontend && npm run start:test` (serves app on http://localhost:4300).
2. Terminal B: `cd frontend && npx cypress open --browser edge` (runs Cypress headless against the dev server).

# 4. Lighthouse multi-route audits
1. Reuse Terminal A dev server from step 3 (must be running).
2. `cd frontend`
3. `npm run lh:audit:auth`
	- Reports land under `frontend/lighthouse-reports/<timestamp>/`.

# 5. Additional API smoke (if split)
1. `cd backend`
2. `npm run test:api`

# 6. OWASP ZAP quick scans

1. Backend API scan:
	- `cd C:\Users\user\Downloads\QUIZ-GAME-2025-master\QUIZ-GAME-2025-master
java -Xmx512m -jar tools\zap\ZAP_2.16.1\zap-2.16.1.jar `
  -cmd `
  -quickurl http://localhost:5000/api/questions `
  -quickout QA_Bundle\05_Reports\zap-backend.html `
  -quickprogress`

2. Frontend SPA scan (ensure dev server on :4300):
	- `cd C:\Users\user\Downloads\QUIZ-GAME-2025-master\QUIZ-GAME-2025-master
java -Xmx512m -jar tools\zap\ZAP_2.16.1\zap-2.16.1.jar `
  -cmd `
  -quickurl http://localhost:4300 `
  -quickout QA_Bundle\05_Reports\zap-frontend.html `
  -quickprogress`

  
	- Reports overwrite the HTML files referenced in `PerfSecurityReport.md`.
```
