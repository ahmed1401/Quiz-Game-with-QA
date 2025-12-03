# Tests Non Fonctionnels — Quiz Game

## 1. Performance UI (Lighthouse)
- **But** : LCP < 3 s, TTI < 3 s, Performance score > 85 sur mobile 4G.
- **Procédure** : `npm run build && npm run preview`, lancer Lighthouse (CLI ou DevTools) sur `http://localhost:4173`.
- **Livrables** : Rapport HTML + JSON archivés dans `artifacts/perf/ui/`.
- **Actions si échec** : analyser bundle, activer lazy loading, optimiser images.

## 2. Charge API (k6)
- **But** : p95 < 500 ms, taux d'erreur < 1% sur `GET /api/questions`.
- **Script** : `k6 run k6_scenario.js` (cf. fichier joint).
- **Profil** : 50 VUs, palier 0 → 50 sur 30 s, maintien 90 s, descente 30 s.

## 3. Sécurité passive (OWASP ZAP)
- **But** : Aucun medium/critical, headers de sécurité présents.
- **Procédure** : ZAP Baseline scan `zap-baseline.py -t http://localhost:5000 -r zap_report.html`.
- **Vérifications** : CSP, X-Content-Type-Options, Strict-Transport-Security, cookies Secure/SameSite.

## 4. Accessibilité (Pa11y / Axe)
- **But** : Zero erreurs WCAG 2.1 AA sur login/register/quiz.
- **Commande** : `pa11y http://localhost:4200/login --standard WCAG2AA` etc.

## 5. Résilience / Recovery
- **Test** : stopper MongoDB pendant un quiz -> l'application doit afficher un message d'erreur non bloquant et logger côté serveur.

## 6. Reporting
- Consolidation des métriques dans `PerfSecurityReport.md` et scoreboard ci-dessous :

| Domaine | KPI | Seuil | Statut |
|---------|-----|-------|--------|
| UI Perf | LCP | < 3 s | TBD |
| API Perf | p95 | < 500 ms | TBD |
| Sécurité | Alertes Medium/Critical | 0 | TBD |
| Accessibilité | Erreurs WCAG AA | 0 | TBD |
