# Framework Structure Overview

## 1. Repository Layout
```
repo-root/
├── backend/                     # Express API + Jest/SuperTest suites
│   ├── app.js                   # API entrypoint
│   ├── controllers|routes|...   # Business logic & REST endpoints
│   ├── tests/                   # API regression suite
│   │   ├── questionRoutes.test.js
│   │   ├── userRoutes.test.js
│   │   └── setup.js             # mongodb-memory-server bootstrap
│   └── package.json             # jest, supertest, mongodb-memory-server
├── frontend/                    # Angular 18 SPA + Cypress/Karma
│   ├── src/                     # Standalone components, guards
│   ├── cypress/                 # End-to-end suite (Edge headless)
│   │   ├── e2e/*.cy.ts          # auth, quiz, leaderboard specs
│   │   └── support/commands.ts  # custom login helpers
│   ├── karma.conf.ts            # unit/integration config
│   └── package.json             # Angular CLI, Cypress, Karma deps
├── QA_Bundle/                   # QA delivery artifacts
│   ├── SOUMISSION_QA_QUIZ_GAME/
│   │   ├── 01_PLANIFICATION/…   # Test plans & requirements (PDF)
│   │   ├── 02_CONCEPTION_TESTS/ # Matrices + scripts copy
│   │   ├── 03_EXÉCUTION_TESTS/  # Logs, defect reports, screenshots
│   │   ├── 04_PERFORMANCE_SÉCURITÉ/ # k6, Lighthouse, ZAP evidence
│   │   ├── 05_CLÔTURE_ET_DÉCISION/ # PV & GO/NO-GO notes
│   │   └── 06_TOUT_EN_UN.md     # Consolidated narrative
│   └── 05_Reports/automation-reports/
│       ├── backend-jest-report.(xml|html)
│       └── cypress-(results.xml|report.html)
└── tools/                       # k6 & ZAP binaries (optional)
```

## 2. Test Types & Execution Flows
| Layer | Location | Tooling | Command | Report |
|-------|----------|---------|---------|--------|
| API regression | `backend/tests/*.test.js` | Jest + SuperTest + mongodb-memory-server | `cd backend && npm test` | `backend-jest-report.(xml|html)` |
| SPA unit/integration | `frontend/src/**/*.spec.ts` | Karma + Jasmine (ChromeHeadless) | `cd frontend && npm test -- --watch=false --browsers=ChromeHeadless` | Console + screenshots (`03.4_SCREENSHOTS_EXÉCUTION_DES-TESTS`) |
| End-to-end UI | `frontend/cypress/e2e/*.cy.ts` | Cypress Edge headless | `cd frontend && npm run test:e2e` | `cypress-results.xml` + `cypress-report.html` |
| Performance | `QA_TestSuites/04_NonFunctional/k6_scenario.js` | k6 CLI (tools/k6) | `./tools/k6/k6.exe run ...` | `04_PERFORMANCE_SÉCURITÉ/04.2_RÉSULTATS_BRUTS_K6_JSON.json` |
| Security | `tools/zap/*` | OWASP ZAP baseline | `java -jar zap-2.16.1.jar -cmd ...` | `04_PERFORMANCE_SÉCURITÉ/04.3_*.html` |

## 3. Dependencies & Environment
- **Backend**: Node 20.x, Express 4, Mongoose 8, Jest 30, SuperTest 7, mongodb-memory-server for isolated DB.
- **Frontend**: Angular 18 (standalone APIs), Cypress 15 (Edge headless), Karma 6 + Jasmine 5, Typescript 5.5.
- **QA Tooling**: junit-viewer for HTML export, jest-html-reporters, k6 CLI, OWASP ZAP 2.16.1.
- **Environment variables**: `backend/.env` requires `MONGO_URI`, `PORT`, `CORS_ORIGINS`, `JWT_SECRET`; Cypress expects frontend dev server on `http://localhost:4300`.

## 4. Artifact Traceability
- Automation outputs (`QA_Bundle/05_Reports/automation-reports`) are referenced from: 
  - `03_EXÉCUTION_TESTS/03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.pdf`
  - `05_CLÔTURE_ET_DÉCISION/05.1_RAPPORT_CLÔTURE_TEST.pdf` (section 4.2 visuels)
- Manual/NFR evidence (screens, logs, video) reside under:
  - `03_EXÉCUTION_TESTS/03.4_SCREENSHOTS_EXÉCUTION_DES-TESTS/`
  - root `06_full_user_journey_live.mp4` for live E2E demo.

This document should be kept in sync whenever the automation structure or reporting pipeline changes.
