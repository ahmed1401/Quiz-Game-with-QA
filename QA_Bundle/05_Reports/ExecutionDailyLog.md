# Rapport d'exécution — Journal Quotidien

> **Document**: Journal d'Exécution QA — Quiz Game 2025  
> **Référence**: QA-LOG-2025-11  
> **Version**: 1.3  
> **Date**: 30/11/2025  
> **Auteur**: QA Lead (A. Karim)  
> **Diffusion**: `QA_Bundle/05_Reports` & `QA_Bundle/AHMED/05_Reports`

| Date | Build/Test ID | Environnement | Activités principales | Résultats | Risques/Bloquants |
|------|---------------|---------------|----------------------|-----------|-------------------|
| 17/11/2025 | RUN-FT-001 | DEV local (Node 20, Angular 18, Mongo local) | Seed de la base via `node addQuestions.js`, vérification smoke backend `node app.js` | Partiel — backend KO (Mongo URI manquante). Front non lancé. | Blocant: absence de connexion Mongo documentée. Action: fournir `.env`.
| 18/11/2025 | RUN-FT-002 | DEV local stabilisé | Tests manuels Auth + Quiz (TC-AUTH-001 → TC-QUIZ-004) | 6 PASS, 1 FAIL (TC-QUIZ-003 — mélange non aléatoire). | Risque moyen: logique de shuffle côté frontend à revoir.
| 18/11/2025 PM | RUN-FT-003 | DEV local | Tests Leaderboard + Scores (TC-LEAD-001 → TC-DATA-004) | 5 PASS, 1 BLOCK (TC-DATA-004 — validation index non implémentée). | Blocant mineur: ajouter contrôle 0-3 dans contrôleur score.
| 19/11/2025 | RUN-FT-004 | DEV local | Re-tests après correctifs + NFR (TC-NFR-001 → TC-NFR-005) | 4 PASS, 1 WARN (Lighthouse LCP = 3.2s). | Risque performance: optimiser bundle Angular.
| 19/11/2025 PM | RUN-FT-005 | TEST partagé (backend VM + Mongo Atlas) | Vérification finale + génération documentation QA | 100% cas critiques PASS, docs finalisés (`QA_FullDossier.md`, rapports). | Aucun blocant. Préparé pour revue PO.
| 30/11/2025 | RUN-REG-006 | DEV local (Node 20, Angular 18, MongoMemoryServer pour tests) | Rerun complet : `npm test` backend (Jest/SuperTest), `npm test -- --watch=false --browsers=ChromeHeadless` frontend, `npx cypress run --browser edge` (Edge headless, live spec relancé après démarrage backend), `npm run lh:audit:auth`, ZAP backend & frontend quick scans. | PASS — toutes suites vertes après relance Live spec; nouveaux rapports Lighthouse (5 pages) + ZAP (`zap-*.html`) générés. | Risques ouverts : Score Perf <90 (Lighthouse), en-têtes CSP/CORS/X-Frame-Options toujours absents tant que non implémentés.

**Notes supplémentaires**
- Tous les cas critiques (MUST HAVE) sont couverts au 19/11 18h.
- Les échecs résiduels (shuffle & validation index) sont suivis dans le rapport défauts.
- Les métriques d'exécution détaillées figurent dans `ExecutionFinalSummary.md`.
