# Quiz Game — Full Stack & QA Bundle

Full-stack quiz application featuring an Angular 18 SPA, a Node/Express REST API backed by MongoDB, and a complete QA delivery (manual suites, automation, non-functional evidence, final reports).

## 1. Architecture at a Glance
- **Frontend**: Angular 18, standalone components, guards, SSR-ready (`frontend/`).
- **Backend**: Express 4 API (`/api/users`, `/api/questions`) with MongoDB persistence and JWT-ready hooks (`backend/`).
- **QA Assets**: Regression evidence, plans, reports, and tooling scripts (`QA_Bundle/`, `QA_TestSuites/`).

```
Browser ⇄ Angular SPA (port 4200/4300)
           │ REST
           ▼
      Express API (port 5000)
           │ Mongoose
           ▼
        MongoDB Atlas/local
```

## 2. Repository Layout
| Path | Description |
|------|-------------|
| `frontend/` | Angular app, Cypress tests, Lighthouse runners. |
| `backend/` | Express API, Jest/SuperTest suites. |
| `QA_TestSuites/` | Working files for manual, UI, API, and non-functional suites. |
| `QA_Bundle/SOUMISSION_QA_QUIZ_GAME/` | Final QA submission (plans, reports, evidence, test-suite digest). |
| `tools/` | Helper binaries (k6, OWASP ZAP, etc.). |

## 3. Prerequisites
- Node.js 20.x and npm 10.x
- MongoDB instance (local or Atlas URI)
- Microsoft Edge or Chrome for Cypress/Karma
- Java 17+ (for OWASP ZAP CLI) — optional but required for security scans
- k6 CLI (already included under `tools/k6`)

### Environment Variables
Create `backend/.env` (or export vars) with:
```
MONGO_URI=mongodb://localhost:27017/quiz-game
PORT=5000
CORS_ORIGINS=http://localhost:4300
JWT_SECRET=replace-me
```
> Update `MONGO_URI` to your Atlas connection string in production.

## 4. Install Dependencies
```powershell
# From repo root
cd backend
npm install
cd ..\frontend
npm install
```

## 5. Running the Application
### Backend API
```powershell
cd backend
npm start   # serves on http://localhost:5000
```

### Frontend SPA
```powershell
cd frontend
npm start   # serves on http://localhost:4200
```
> Use `npm run start:test` to force port 4300 (used by Cypress and QA scripts).

### Local Development Flow
1. Seed sample questions (optional): `cd backend && node addQuestions.js`.
2. Start the API (`npm start`).
3. Start the Angular dev server (`npm start` or `npm run start:test`).
4. Browse to `http://localhost:4200` (or `4300`).

## 6. Test Strategy & Commands
### Backend unit/integration (Jest + SuperTest)
```powershell
cd backend
npm test
```
- Uses `mongodb-memory-server`; no running MongoDB required.

### Frontend unit/integration (Karma + Jasmine)
```powershell
cd frontend
$env:CHROME_BIN="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
npm test -- --watch=false --browsers=ChromeHeadless
```

### End-to-End UI (Cypress Edge)
```powershell
cd frontend
npm run test:e2e   # starts dev server on :4300 and runs Cypress headless
```
- Screenshots/videos land in `frontend/cypress/screenshots|videos`.

### Lighthouse Authenticated Sweep
```powershell
cd frontend
npm run lh:audit:auth   # outputs reports to frontend/lighthouse-reports/<timestamp>
```

### Performance & Security (optional but included in QA bundle)
- **k6 load test**: `./tools/k6/k6.exe run QA_TestSuites/04_NonFunctional/k6_scenario.js`
- **OWASP ZAP backend scan**:
  ```powershell
  java -Xmx512m -jar tools/zap/ZAP_2.16.1/zap-2.16.1.jar -cmd `
    -quickurl http://localhost:5000/api/questions `
    -quickout QA_Bundle/SOUMISSION_QA_QUIZ_GAME/04_PERFORMANCE_SÉCURITÉ/04.3_SCAN_SÉCURITÉ_ZAP_BACKEND.html
  ```
- **OWASP ZAP frontend scan**: same command pointing to `http://localhost:4300` and output `04.4_SCAN_SÉCURITÉ_ZAP_FRONTEND.html`.

## 7. QA Documentation & Evidence
- Navigate to `QA_Bundle/SOUMISSION_QA_QUIZ_GAME/00_LISEZ_MOI_ET_CONTEXTE.md` for the official submission index.
- `06_TOUT_EN_UN.md` is the consolidated “Everything” report.
- `07_TESTSUITES_IDEES/` restates the manual/UI/API/NFR suites derived from `QA_TestSuites/`.

## 8. Troubleshooting
| Issue | Fix |
|-------|-----|
| `MongoDB connection string is not defined` | Ensure `backend/.env` defines `MONGO_URI` or pass it via environment. |
| CORS error when calling API | Update `CORS_ORIGINS` to include the frontend origin. |
| Cypress can’t reach app | Use `npm run start:test` (port 4300) and rerun `npm run test:e2e`. |
| ZAP scan fails | Confirm Java 17+ installed and target servers running. |

## 9. Contributing / Next Steps
- Address open defects listed in `03_EXÉCUTION_TESTS/03.3_RAPPORT_DÉFAUTS.md` (shuffle + category index validation).
- Improve Lighthouse Performance score (>90) via asset optimization.
- Harden security headers and rerun ZAP for zero warnings.

Happy testing! 🚀
