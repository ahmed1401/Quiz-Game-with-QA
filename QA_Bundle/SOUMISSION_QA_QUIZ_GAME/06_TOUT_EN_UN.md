# 06_TOUT_EN_UN REPORT — QUIZ GAME QA DELIVERY

## 1. Identité du projet
- **Application** : Quiz Game (Angular 18 SPA + Node/Express API + MongoDB persistence)  
- **Cycle QA** : 17/11/2025 → 30/11/2025 (RUN-FT-001 … RUN-REG-006)  
- **Responsables QA** : Ahmed Hajjej & Skander Hakouna  
- **Livraison** : `QA_Bundle/SOUMISSION_QA_QUIZ_GAME` (structure 01→06) + ce rapport `06_TOUT_EN_UN.md`

### 1.1 Description applicative
Quiz Game est une plateforme pédagogique permettant à un étudiant de :
- Créer un compte (`/register`) puis s’authentifier (`/login`).
- Lancer une session de quiz (`/quiz`) multi-questions avec chronométrage, réponses radio et feedback immédiat.
- Consulter un leaderboard en temps réel (`/leaderboard`) et un écran d’accueil gamifié (`/welcome`).
Le backend expose les ressources `/api/questions` (filtrage par catégorie/difficulté) et `/api/users` (auth, scores). CORS et JWT sont gérés côté Express. MongoDB stocke questions et résultats.

### 1.2 Cartographie documentaire
| Livrable | Localisation | Contenu |
|----------|--------------|---------|
| Plan de test principal | `01_PLANIFICATION/01.1_PLAN_DE_TEST_PRINCIPAL.md` | Cadre Certilog, planning cycles FT/REG, responsabilités. |
| Stratégie & exigences | `01_PLANIFICATION/01.2_STRATÉGIE_DE_TEST.md` + `01.3/01.4` | Approche outillage, exigences fonctionnelles, périmètre. |
| Jeux de tests détaillés | `02_CONCEPTION_TESTS/02.1_CAS_DE_TEST.md` | TC-AUTH, TC-QUIZ, TC-LEAD, TC-DATA, TC-NFR. |
| Dossier QA complet | `02_CONCEPTION_TESTS/02.2_DOSSIER_QA_COMPLET.md` | Traçabilité, matrices, RACI récapitulatives. |
| Rapports d'exécution | `03_EXÉCUTION_TESTS/03.*` | Journaux quotidiens, synthèse finale, défauts. |
| Performance & sécurité | `04_PERFORMANCE_SÉCURITÉ/04.*` | Rapport consolidé, k6-result, ZAP HTML. |
| Rapports exécutifs | `05_CLÔTURE_ET_DÉCISION/05.*` | PV de recette, note GO/NO-GO, synthèse exécutive. |

## 2. Architecture & environnements
| Côté | Techno | Scripts clés | Notes |
|------|--------|--------------|-------|
| Backend API | Node 20, Express, Mongo/Mongoose | `npm start`, `npm test` (Jest/SuperTest via MongoMemoryServer) | JWT auth, bcrypt, REST endpoints `/api/questions`, `/api/users`. |
| Frontend | Angular 18, SSR-ready | `npm start`, `npm test`, `npm run test:e2e`, `npm run lh:audit:auth` | Routes principales: `/login`, `/register`, `/quiz`, `/leaderboard`, `/welcome`. |
| Tooling | Cypress 15 (Edge headless), Lighthouse 13 + Puppeteer, OWASP ZAP 2.16.1, k6 0.49 | Scripts/commandes capturés ci-dessous | Couverture unit + integration + E2E + NFR.

**Environnements utilisés**  
- DEV local (Node 20, Angular 18, MongoMemoryServer) — principal pour automatisation.  
- TEST partagé (backend VM + Mongo Atlas) — validation finale RUN-FT-005.  
- Outillage additionnel : Edge, Chrome Headless, Java 17+, PowerShell 5.1.

## 3. Chronologie détaillée
| Date | ID | Description | Résultat | Artefacts |
|------|----|-------------|----------|-----------|
| 17/11 | RUN-FT-001 | Seed DB (`node addQuestions.js`), smoke backend `node app.js`. | Partiel (Mongo URI manquante). | 03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.md
| 18/11 | RUN-FT-002 | Auth + Quiz tests (TC-AUTH-001→TC-QUIZ-004). | 6 PASS, 1 FAIL (shuffle). | 03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.md, 03.3_RAPPORT_DÉFAUTS.md
| 18/11 PM | RUN-FT-003 | Leaderboard + Scores (TC-LEAD/TCDATA). | 5 PASS, 1 BLOCK (categoryIndex). | 03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.md
| 19/11 | RUN-FT-004 | Re-tests + NFR (Lighthouse v1). | 4 PASS, 1 WARN (LCP 3.2 s). | 04.1_RAPPORT_PERFORMANCE_SÉCURITÉ.md
| 19/11 PM | RUN-FT-005 | TEST env final + dossier QA. | 100% MUST PASS. | 03.2_SYNTHÈSE_EXÉCUTION.md v1
| 30/11 | RUN-REG-006 | Full regression: backend Jest, frontend Karma, Cypress Edge, Lighthouse authenticated sweep, ZAP backend/frontend quick scans, k6 evidence refresh. | PASS (Live spec rerun after backend start). | 03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.md (30/11), 03.2_SYNTHÈSE_EXÉCUTION.md §7, 04.1_RAPPORT_PERFORMANCE_SÉCURITÉ.md (30/11), ZAP HTML, Lighthouse folder, 04.2_RÉSULTATS_BRUTS_K6.json.

## 4. Testware complet
### 4.1 Couverture fonctionnelle (`02_CONCEPTION_TESTS/02.1_CAS_DE_TEST.md`)
- **Authentification (TC-AUTH-001→006)** : formulaires, validations, tokens, gestion d’erreur.
- **Quiz (TC-QUIZ-001→006)** : navigation questions, scoring, timer, mélange réponses (défaut ouvert TC-QUIZ-003).
- **Leaderboard (TC-LEAD-001→003)** : tri décroissant, égalités, pagination simple.
- **Données & Scores (TC-DATA-001→004)** : persistance des index, scores max/min, injection contrôlée (TC-DATA-004 ouvert).
- **Welcome/UX (TC-WEL-001→002)** : message gamifié, liens CTA.

### 4.2 Non-fonctionnel (TC-NFR-001→006)
- NFR-001 : temps de réponse API (k6).  
- NFR-002 : LCP/TTI < 3 s (Lighthouse).  
- NFR-003 : Accessibilité AA (≥88).  
- NFR-004 : OWASP ZAP Medium = 0.  
- NFR-005 : Résilience 50 VUs (k6).  
- NFR-006 : Rejouabilité pipeline.

### 4.3 Plans/stratégie (`01_PLANIFICATION/01.*`)
- **01.1_PLAN_DE_TEST_PRINCIPAL** : cycles FT-001→006, rôle Ahmed (fonctionnel) & Skander (NFR).  
- **01.2_STRATÉGIE_DE_TEST** : outillage (k6, Lighthouse, ZAP), critères PASS/WARN/FAIL.  
- **01.3_EXIGENCES_FONCTIONNELLES / 01.4_PÉRIMÈTRE_DE_TEST** : matrice d'exigences et cadrage E2E, dépendances serveurs.

### 4.4 Suites automatisées & commandes
| Suite | Outil | Commande | Détails |
|-------|-------|----------|---------|
| Backend unit/API | Jest + SuperTest | `cd backend && npm install && npm test` | MongoMemoryServer; 13 specs PASS. |
| Frontend unit/regression | Karma + Jasmine | `cd frontend && npm install && npm test -- --watch=false --browsers=ChromeHeadless` | Chrome Headless 115+. |
| Cypress E2E | Cypress Edge headless | `cd frontend && npm run test:e2e` (ou orchestration manuelle). | Live spec nécessite backend `npm start`. |
| Lighthouse auth audit | Puppeteer + Lighthouse | `cd frontend && npm run lh:audit:auth` | Rapports dans `frontend/lighthouse-reports/*auth`. |
| OWASP ZAP backend | ZAP CLI | `java -Xmx512m -jar tools/zap-2.16.1/zap-2.16.1.jar -cmd -quickurl http://localhost:5000/... -quickout QA_Bundle/SOUMISSION_QA_QUIZ_GAME/04_PERFORMANCE_SÉCURITÉ/04.3_SCAN_SÉCURITÉ_ZAP_BACKEND.html` | Medium: CSP manquante, CORS permissif. |
| OWASP ZAP frontend | ZAP CLI | `... -quickurl http://localhost:4300 -quickout QA_Bundle/SOUMISSION_QA_QUIZ_GAME/04_PERFORMANCE_SÉCURITÉ/04.4_SCAN_SÉCURITÉ_ZAP_FRONTEND.html` | Medium: CSP, X-Frame-Options, fichiers exposés. |
| k6 load test | k6 CLI | `.\tools\k6\k6.exe run QA_TestSuites/04_NonFunctional/k6_scenario.js` | 50 VUs, p95 14 ms, 0% erreurs. |

## 5. Synthèse fonctionnelle & défauts
- **User stories couvertes** : 11/11.
- **Cas exécutés** : 30 (24 fonctionnels, 6 NFR).
- **MUST HAVE** : 18 PASS / 18.
- **Défauts ouverts** : 2 (shuffle, validation index) — `03_EXÉCUTION_TESTS/03.3_RAPPORT_DÉFAUTS.md`.
- **Défauts fermés** : 3 ; taux de réouverture : 0%.

## 6. Performance & sécurité (30/11)
### Lighthouse (auth routes)
| Page | Perf | Accessibilité | Best Practices | SEO |
|------|------|---------------|----------------|-----|
| /login | 81 | 88 | 100 | 90 |
| /register | 81 | 88 | 100 | 90 |
| /quiz | 87 | 94 | 100 | 90 |
| /leaderboard | 81 | 100 | 100 | 90 |
| /welcome | 82 | 100 | 100 | 90 |
- **Constat** : Performance <90 (WARN) malgré LCP ≤2.3 s → actions: lazy-load assets, compression gzip/brotli, CSS critique.  
- **Référence** : `04_PERFORMANCE_SÉCURITÉ/04.1_RAPPORT_PERFORMANCE_SÉCURITÉ.md`.

### k6
- p50 6.9 ms / p95 14 ms / p99 23.5 ms, 0% erreurs, 39.6 req/s.  
- Rapport JSON : `04_PERFORMANCE_SÉCURITÉ/04.2_RÉSULTATS_BRUTS_K6.json`.

### OWASP ZAP
- Backend: Medium (CSP missing, Cross-Domain misconfiguration); Low (X-Powered-By leak, X-Content-Type-Options missing).
- Frontend: Medium (CSP, X-Frame-Options, CORS, robots exposure); Low (JS tiers, X-Content-Type-Options).
- Actions : renforcer en-têtes + rerun baseline.

## 7. Documentation livrée
- `01_PLANIFICATION/01.*` — Master Test Plan, stratégie, exigences, périmètre.
- `02_CONCEPTION_TESTS/02.1_CAS_DE_TEST.md` — référentiel TC avec statuts PASS/FAIL.
- `02_CONCEPTION_TESTS/02.2_DOSSIER_QA_COMPLET.md` — trace complète et matrices.
- `03_EXÉCUTION_TESTS/03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.md` — journal par jour (incl. RUN-REG-006).
- `03_EXÉCUTION_TESTS/03.2_SYNTHÈSE_EXÉCUTION.md` — synthèse cycle 30/11 + activités RUN-REG-006.
- `04_PERFORMANCE_SÉCURITÉ/04.1_RAPPORT_PERFORMANCE_SÉCURITÉ.md` — Lighthouse, k6, ZAP.
- `03_EXÉCUTION_TESTS/03.3_RAPPORT_DÉFAUTS.md` — incidents ouverts/fermés.
- `04_PERFORMANCE_SÉCURITÉ/04.3_SCAN_SÉCURITÉ_ZAP_BACKEND.html`, `04_PERFORMANCE_SÉCURITÉ/04.4_SCAN_SÉCURITÉ_ZAP_FRONTEND.html` + `04.2_RÉSULTATS_BRUTS_K6.json` — preuves brutes.
- `05_CLÔTURE_ET_DÉCISION/05.1_RAPPORT_CLÔTURE_TEST.md`, `05.2_NOTE_DÉCISION_CLÔTURE.md`, `05.3_SYNTHÈSE_RÉSULTATS.md` — PV, note GO/NO-GO, synthèse exécutive.
- `00_LISEZ_MOI_ET_CONTEXTE.md` — mode d’emploi + contexte.
- `06_TOUT_EN_UN.md` — rapport consolidé actuel.
- `07_TESTSUITES_IDEES/` — recap des intentions de test (manuel, UI, API, NFR) issues de `QA_TestSuites`.
- `03_EXÉCUTION_TESTS/03.1_JOURNAL_EXÉCUTION_QUOTIDIEN.md` — journal par jour (incl. RUN-REG-006).
- `03_EXÉCUTION_TESTS/03.2_SYNTHÈSE_EXÉCUTION.md` — synthèse cycle 30/11 + activités RUN-REG-006.
- `04_PERFORMANCE_SÉCURITÉ/04.1_RAPPORT_PERFORMANCE_SÉCURITÉ.md` — Lighthouse, k6, ZAP.
- `03_EXÉCUTION_TESTS/03.3_RAPPORT_DÉFAUTS.md` — incidents ouverts/fermés.
- `04_PERFORMANCE_SÉCURITÉ/04.3_SCAN_SÉCURITÉ_ZAP_BACKEND.html`, `04_PERFORMANCE_SÉCURITÉ/04.4_SCAN_SÉCURITÉ_ZAP_FRONTEND.html` + `04.2_RÉSULTATS_BRUTS_K6.json` — preuves brutes.
- `05_CLÔTURE_ET_DÉCISION/05.1_...`, `05.2_...`, `05.3_...` — PV, note GO/NO-GO, synthèse exécutive.
- `00_LISEZ_MOI_ET_CONTEXTE.md` — mode d’emploi + contexte.
- `06_TOUT_EN_UN.md` — rapport consolidé actuel.

## 8. Rejouer l’ensemble des tests
1. **Préparation** : Node 20+, npm 10+, Edge, Chrome/Chromium headless, Java 17+, PowerShell, ports 4300/5000 libres.  
2. **Backend** : `cd backend && npm install && npm test`.  
3. **Frontend unit** : `cd frontend && npm install && npm test -- --watch=false --browsers=ChromeHeadless`.  
4. **Cypress** : `cd frontend && npm run test:e2e` (ou mode manuel multi-terminaux).  
5. **Lighthouse** : `cd frontend && npm run lh:audit:auth`.  
6. **ZAP** : lancer les serveurs puis exécuter les commandes §4.4.  
7. **k6** : `.\tools\k6\k6.exe run QA_TestSuites/04_NonFunctional/k6_scenario.js`.  
8. **Archive** : copier les artefacts dans `QA_Bundle/SOUMISSION_QA_QUIZ_GAME` & compresser.

## 9. Prochaines actions (post-30/11)
1. **Performance uplift** : lazy-load, compression, CSS critique, rerun Lighthouse pour viser ≥90.
2. **Security headers** : CSP stricte, CORS allowlist, retirer `X-Powered-By`, ajouter `X-Frame-Options` & `X-Content-Type-Options`, rerun ZAP.
3. **Défauts ouverts** : corriger shuffle (TC-QUIZ-003) + validation index (TC-DATA-004) puis RUN-FT-007 ciblé.
4. **Release readiness** : mettre à jour docs avec nouvelles preuves et obtenir GO final.

## 10. Contact
- **Ahmed Hajjej** — QA Lead 
- **Skander Hakouna** — QA Lead  


_Fin du rapport 06_TOUT_EN_UN._

