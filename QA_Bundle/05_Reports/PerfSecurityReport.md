# Rapports Performance & Sécurité — 30/11/2025

> **Document**: Rapport Performance & Sécurité — Quiz Game 2025  
> **Référence**: QA-NFR-2025-11  
> **Version**: 1.3  
> **Date**: 30/11/2025  
> **Auteur**: QA Lead (A. Karim)  
> **Diffusion**: `QA_Bundle/05_Reports` & `QA_Bundle/AHMED/05_Reports`

## 1. Performance (Lighthouse)
- **Contexte** : build Angular `ng build --configuration production`, Chrome 142 Headless, réseau simulé 4G, device Moto G4.
- **Résultats 30/11** (source : `frontend/lighthouse-reports/2025-11-30T09-12-05-375Z-auth/*.report.json`)

| Page | Performance | Accessibilité | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| /login | 81 | 88 | 100 | 90 |
| /register | 81 | 88 | 100 | 90 |
| /quiz | 87 | 94 | 100 | 90 |
| /leaderboard | 81 | 100 | 100 | 90 |
| /welcome | 82 | 100 | 100 | 90 |

- **Constats** : toutes les routes restent <90 en Performance, avec un LCP max mesuré à 2.3 s et TTI ≈2.3 s sur `/login`. Les axes Accessibilité/Best Practices/SEO demeurent ≥88/100/90.
- **Actions recommandées** : lazy-load des images/quizz JSON, mise en cache HTTP + compression gzip/brotli côté frontend server, extraction du CSS critique (objectif Performance ≥ 90).

## 2. Charge API (k6)
```
Scenario: 50 VUs, 3 stages (30s ramp-up, 90s palier, 30s ramp-down)
Endpoint: GET /api/questions?category=Computer%20Science
Date: 29/11/2025 @ 22:02 UTC
```
- **p50**: 6.9 ms
- **p90**: 11.6 ms
- **p95**: 14.0 ms
- **p99**: 23.5 ms
- **Req/s**: 39.6
- **Échecs**: 0.00%
- **Bande passante**: 45.7 KB/s entrants / 4.8 KB/s sortants
- **Statut** : PASS (p95 < 500 ms et 0 erreur)

## 3. Sécurité (OWASP ZAP – backend quick scan)
- **Scope** : `http://localhost:5000/api/questions?category=Computer%20Science` (ZAP 2.16.1 `-quickurl`, exécution 30/11 10:41 UTC, artefact `QA_Bundle/05_Reports/zap-backend.html`).
- **Résultats** :
  - Medium ×2 : `CSP: Failure to Define Directive with No Fallback`, `Cross-Domain Misconfiguration` (toujours provoqués par l’absence de CSP stricte et par CORS permissif).
  - Low ×2 : `Server Leaks Information via X-Powered-By`, `X-Content-Type-Options Header Missing`.
- **Actions recommandées** :
  - Ajouter un en-tête `Content-Security-Policy` verrouillant les sources (default-src 'self').
  - Restreindre `Access-Control-Allow-Origin` aux domaines autorisés.
  - Supprimer/masquer `X-Powered-By` et ajouter `X-Content-Type-Options: nosniff` dans Express.
  - Rejouer un scan complet (baseline + API context) une fois les en-têtes durcis.

## 3.b Sécurité (OWASP ZAP – frontend quick scan)
- **Scope** : `http://localhost:4300` (SPA Angular servie en mode dev, ZAP 2.16.1 `-quickurl`, exécution 30/11 10:47 UTC, artefact `QA_Bundle/05_Reports/zap-frontend.html`).
- **Résultats** :
  - Medium ×5 : CSP manquante (`Content Security Policy Header Not Set`, `CSP Failure to Define Directive`), CORS permissif (`Cross-Domain Misconfiguration`), fichiers d’indexation exposés (`robots.txt`, `sitemap`), header anti-clickjacking absent (`X-Frame-Options`).
  - Low ×2 : inclusion de JS tiers non contrôlé, `X-Content-Type-Options` absent.
  - Info ×3 : URLs contenant des infos sensibles (query params), commentaires, endpoints d’auth.
- **Actions recommandées** :
  - Configurer les en-têtes côté frontend server (ou reverse proxy) : `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
  - Supprimer/masquer les fichiers d’indexation en prod (`robots.txt`, `sitemap.xml`) si non requis.
  - Revoir la configuration CORS/JS externe pour limiter aux domaines approuvés.

## 4. Synthèse
| Domaine | Statut | Commentaire |
|---------|--------|-------------|
| Performance UI | WARN | Score Performance entre 81 et 87 (<90) malgré amélioration du LCP (2.3 s max).
| Performance API | PASS | p95=14 ms, aucune erreur sous charge (50 VUs).
| Sécurité passive | WARN | Backend: CSP/CORS/X-Powered-By/X-Content-Type-Options; Frontend: CSP+X-Frame-Options manquants, fichiers exposés.

**Prochaines étapes** : appliquer optimisations (headers + assets), relancer Lighthouse/k6/ZAP (RUN-NFR-002) et archiver les résultats actualisés.
