# Plan de test — Quiz Game (30/11/2025)

> **Document**: Plan de Test — Quiz Game 2025  
> **Référence**: QA-PLN-2025-11  
> **Version**: 1.4  
> **Date**: 30/11/2025  
> **Auteur**: QA Lead (A. Karim)  
> **Validateur**: Delivery Manager (S. Rahman)  
> **Statut**: Diffusé

## 0. Identification
| Élément | Détail |
|---------|--------|
| Domaine produit | Quiz Game Web + API |
| Périmètre release | Release 2025.11 (Freeze 29/11) |
| Diffusion | Bulle `QA_Bundle/06_FinalReports` + dossier AHMED |
| Parties prenantes | Sponsor Produit, Delivery, QA, Développement |

## Historique des versions
| Version | Date | Auteur | Description |
|---------|------|--------|-------------|
| 1.2 | 24/11/2025 | QA Lead | Ajout RUN-FT-005 et risques API |
| 1.3 | 29/11/2025 | QA Lead | Intégration RUN-NFR-001 |
| **1.4** | **30/11/2025** | **QA Lead** | Formalisation finale + RACI |

## RACI synthèse
| Activité | PO | QA Lead | Dev Lead | Sponsor |
|----------|----|---------|----------|---------|
| Validation périmètre | **A** | C | C | **R** |
| Préparation environnement | C | **R** | **A** | I |
| Exécution campagnes | I | **R/A** | C | I |
| Analyse défauts | C | **R** | **A** | I |
| Décision GO | **R** | C | C | **A** |

## 1. Objet
Ce document résume la stratégie de test retenue pour la livraison Quiz Game. Il complète `04_TestPlans/MasterTestPlan.md` et sert d'extrait exécutif pour les revues GO/NO-GO.

## 2. Portée
- **Modules inclus** : Authentification, parcours Quiz, sauvegarde des scores, leaderboard, APIs `questions` et `users`, exigences NFR (perf, charge, sécurité passive).
- **Hors portée** : fonctionnalités sociales, accessibilité AAA, apps mobiles natives, tests de stress prolongés.

## 3. Stratégie et niveaux de test
| Niveau | Approche | Outils |
|--------|----------|--------|
| Unitaires | Couvrir services Angular & contrôleurs Express | Jasmine/Jest |
| Intégration API | Vérifier `/api/users/*`, `/api/questions` | SuperTest/Postman |
| Système/E2E | Parcours bout en bout Login → Quiz → Leaderboard | Cypress 13 |
| Non-fonctionnels | Lighthouse, k6, OWASP ZAP | k6, Lighthouse CI, ZAP 2.16 |

## 4. Priorisation & jalons
| Jalons | Date | Critère |
|--------|------|---------|
| Préparation environnement | 18/11 | Backend/Frontend démarrables, seed Mongo OK |
| RUN-FT-001 → RUN-FT-005 | 19-24/11 | 100% cas critiques exécutés |
| RUN-NFR-001 | 29/11 | Perf (Lighthouse), charge API (k6), sécurité (ZAP) |
| Packaging final (`06_FinalReports/`) | 29/11 | Rapports synthèses livrés |

## 5. Environnements
| Type | Stack | Note |
|------|-------|------|
| DEV local | Node 20, Angular CLI 18.2, MongoDB locale | Pour debug rapide |
| TEST partagé | Backend Node + Mongo Atlas, build Angular prod | Campagne QA |
| PERF/SÉCU | Instance isolée avec outils k6/ZAP | RUN-NFR-001 |

## 6. Entrées & sorties
- **Critères d'entrée** : user stories validées, seed données appliqué, pipelines verts.
- **Critères de sortie** : 100% cas critiques PASS, aucun défaut bloquant/majeur ouvert, alertes NFR traitées ou planifiées.

## 7. Risques & mitigations
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Absence d'aléatoire des réponses | Altère expérience quiz | Implémenter Fisher-Yates + tests unitaires |
| Validation `categoryIndex` manquante | Scores corrompus | Garde 0-3 côté API + tests SuperTest |
| Headers de sécurité manquants | Alertes ZAP | Mettre en place CSP/XFO/XCTO + rerun ZAP |
| LCP > 3 s | Expérience mobile dégradée | Optimiser assets & lazy-load |

## 8. Livrables
- `MasterTestPlan.md` (détail complet)
- `Plan_de_Test.md` (présent document)
- Suites `QA_TestSuites/`
- Rapports d'exécution (`ExecutionDailyLog.md`, `ExecutionFinalSummary.md`)
- Rapports NFR (`PerfSecurityReport.md`, `zap-*.html`, `k6-result.json`)

**Responsable QA** : QA Lead — 30/11/2025
