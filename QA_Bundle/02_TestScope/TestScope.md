# PÉRIMÈTRE DE TEST — QUIZ GAME APPLICATION

_Source: synthèse dérivée de `PlanTest.md` (version 1.0 du 19/11/2025)_

## 1. ÉLÉMENTS À TESTER

| Élément | Description | Objectif de vérification |
|---------|-------------|--------------------------|
| **Front-end Angular** | Composants standalone (`Login`, `Register`, `Welcome1`, `Quiz`, `Leaderboard`, `AuthGuard`, services `auth.service.ts` et `quiz.service.ts`). | Garantir que l'UX décrite dans les user stories (sélection de catégorie, quiz, leaderboard) est respectée et responsive. |
| **API Express / Node.js** | Routes `/api/users/*`, `/api/questions`, middleware de sécurité, gestion des erreurs. | Assurer la conformité des réponses REST, le respect des statuts HTTP, et l'absence de fuite de données sensibles. |
| **Base MongoDB** | Schémas `User` et `Question`, validations enum, opérations de mise à jour des scores. | Vérifier l'intégrité des données, l'initialisation des scores et la conservation du meilleur score par catégorie. |
| **Flux Auth complet** | Inscription → Connexion → Navigation protégée → Déconnexion avec persistance `localStorage`. | Confirmer que les routes protégées sont réellement inaccessibles hors authentification et que la session est correctement nettoyée. |
| **Calculs Score / Classement** | Méthodes `calculateTotalScore`, tri du leaderboard, règles "high score only". | S'assurer que les scores affichés côté UI reflètent fidèlement les enregistrements MongoDB et que le tri reste cohérent. |

## 2. CARACTÉRISTIQUES À TESTER (AVEC EXPLICATION)

1. **Authentification unifiée (US-AUTH-001).** Vérifier l'unicité email/username, le hashage bcrypt (salt=10), la persistance `localStorage` et l'efficacité de l'`AuthGuard`.
2. **Parcours Quiz complet (US-QUIZ-001).** Tester la sélection des quatre catégories, le mélange aléatoire des réponses, la navigation linéaire, l'affichage des résultats et la sauvegarde automatique des scores.
3. **Leaderboard dynamique (US-LEAD-001).** Contrôler le calcul du rang, la somme des scores par catégorie, le tri décroissant et la présence d'un fallback "No users found".
4. **Gestion Catégories & Scores (US-DATA-001).** Valider la correspondance nom/index, les rejets de catégories invalides, la mise à jour conditionnelle "meilleur score uniquement" et la robustesse de l'API PATCH.
5. **Exigences non-fonctionnelles prioritaires.** a) Performance (<3s de chargement, API <500ms), b) Sécurité (HTTPS, CORS restreint, pas de password en réponse), c) Gestion des erreurs (messages UX + logs serveur). Ces caractéristiques soutiennent directement les parcours critiques et doivent être couvertes par des tests exploratoires et automatisés.

## 3. CARACTÉRISTIQUES À NE PAS TESTER (AVEC JUSTIFICATION)

1. **Fonctionnalités sociales (badges, partage, commentaires).** Explicitement hors scope dans `PlanTest` (section MoSCoW "Won't Have"). Aucune implémentation n'existe.
2. **Mode multijoueur temps réel.** Non spécifié dans les user stories présentes; l'infrastructure temps réel (WebSocket, signalR) n'est pas livrée.
3. **Création/édition de quiz personnalisés.** Seules les questions prédéfinies via `addQuestions.js` sont supportées; pas d'UI ni d'API publique pour des quiz utilisateurs.
4. **Accessibilité avancée (niveau AAA).** L'exigence US-NFR-005 vise le niveau AA basique; le niveau AAA n'est pas ciblé à ce stade et serait du gold plating.
5. **Intégration mobile native / App Store.** Le périmètre actuel couvre une SPA web responsive; aucune livraison native (iOS/Android) n'est planifiée, donc pas de tests spécifiques aux stores ou aux SDK mobiles.

## 4. STRATÉGIE DE TEST

### 4.1 Criticité des caractéristiques à tester

| Caractéristique | Référence `PlanTest.md` | Criticité | Justification |
|-----------------|-------------------------|-----------|---------------|
| Authentification unifiée | US-AUTH-001 | Haute | Blocage total si inscription/connexion échoue; impact direct sur la sécurité des données. |
| Parcours Quiz complet | US-QUIZ-001 | Haute | Cœur de valeur produit; défauts empêchant la progression rendent l'application inutilisable. |
| Leaderboard dynamique | US-LEAD-001 | Moyenne | Affecte la motivation et la comparaison des scores mais n'empêche pas de jouer. |
| Gestion Catégories & Scores | US-DATA-001 | Haute | Données incohérentes → résultats faussés et pertes de progression. |
| NFR Performance & Sécurité | US-NFR-001/002/004 | Haute | Responsable de l'expérience globale et de la conformité (temps de réponse, fuites d'information). |

### 4.2 Effort de test

- **Unitaires (backend & frontend)** : ~20 tests ciblant services Angular, contrôleurs Express et helpers de calcul (effort 3 QA-jours en coordination dev).
- **Intégration API/UI** : 15 scénarios Postman + Cypress couvrant les flux CRUD et protections d'accès (effort 4 QA-jours).
- **E2E fonctionnels** : 8 parcours clés (inscription → quiz → leaderboard par catégorie) automatisés ou semi-automatisés (effort 5 QA-jours, dépend du setup MongoDB).
- **Non-fonctionnels** : 2 QA-jours pour exécuter mesures de performance (Lighthouse, k6) et de sécurité basique (OWASP ZAP passive scan).

### 4.3 Niveaux de test

1. **Tests unitaires** (développeurs) : services Angular (`auth.service`, `quiz.service`), helpers Node (`calculateTotalScore`).
2. **Tests d'intégration** : interactions API ↔ MongoDB (via SuperTest/Postman), vérification des schémas Mongoose et de la logique "high score only".
3. **Tests système / E2E** : exécution dans un environnement miroir (Node + Angular + MongoDB) retraçant les user stories complètes.
4. **Tests d'acceptation** : sessions pilotées par le Product Owner sur scripts QA validés.

### 4.4 Techniques de test

- **Basées sur les exigences** : dérivation directe depuis les critères d'acceptation (checklists Given/When/Then).
- **Partition d'équivalence & valeurs limites** : emails valides/invalides, indexes catégories 0-3, scores négatifs à rejeter.
- **Tests exploratoires scénarisés** : navigations aléatoires, interruption réseau pendant sauvegarde des scores.
- **Analyse de risque** : focalisation sur points critiques (auth, persistance des scores) identifiés en 6.1.

### 4.5 Priorisation de l'exécution des tests

1. Authentification et protection des routes.
2. Chargement et déroulé complet d'un quiz.
3. Sauvegarde des scores et mise à jour du leaderboard.
4. Exigences non-fonctionnelles prioritaires (performance, sécurité, gestion d'erreurs).
5. Scénarios restants (compatibilité navigateurs, accessibilité AA).

### 4.6 Automatisation des tests

- **Cypress** pour les parcours E2E (login → quiz → leaderboard) avec fixtures MongoDB seedées via `addQuestions.js`.
- **Jest / Jasmine** pour les services Angular (mock HttpClient afin de vérifier la logique locale et la gestion des signaux).
- **SuperTest** pour les endpoints Express (tests de statut, payload et contrôles d'erreurs).
- Automatisation priorisée sur les flux critiques pour permettre des régressions rapides à chaque modification backend/frontend.

### 4.7 Suivi et contrôle de l'avancement du test et métriques

- **Tableau Kanban QA** : colonnes To Do / In Progress / In Review / Done pour chaque cas de test.
- **Métriques suivies** : % de cas exécutés, taux de réussite, densité de défauts (défauts / story points), temps moyen de résolution.
- **Rapport quotidien** : statut des builds (frontend/backend), disponibilité MongoDB, risques bloquants.

### 4.8 Gestion de configuration

- Environnements distincts : `dev` (poste local), `test` (serveur partagé). Chaque environnement documente versions Node, Angular CLI, MongoDB.
- Fichiers `.env` versionnés de manière sécurisée (exclusion Git + vault). Scripts `npm run seed` pour aligner les données.
- Snapshot MongoDB pris avant grandes campagnes pour restaurer un état cohérent.

### 4.9 Gestion des défauts

- **Outil** : GitHub Issues (ou Azure Boards si disponible) avec gabarit obligatoire (pas reproductible, attendu, obtenu, logs).
- **Cycle** : Open → In triage → In dev fix → Ready for retest → Closed. Priorité alignée sur criticité 6.1.
- **Critères de sortie** : aucun défaut bloquant/majeur ouvert, tous les moyens/ mineurs planifiés ou acceptés.

### 4.10 Outils de test utilisés

| Besoin | Outil | Usage |
|--------|-------|-------|
| Gestion des cas de test | Sheets structurées | Documentation des scénarios traçables vers `PlanTest.md`. |
| Automatisation E2E | Cypress 13.x | Parcours UI cross-navigateurs via Chrome/Edge. |
| Tests API | Postman + Newman | Collections réutilisables en CI pour `/api/users` et `/api/questions`. |
| Performance | Lighthouse / k6 | Mesure LCP, TTI, p95 latence API. |
| Sécurité | OWASP ZAP (passif) | Détection de headers manquants, vulnérabilités communes. |

### 4.11 Gestion de la qualité

- **Revue croisée** : chaque plan de test est revu par un pair QA et validé par le PO.
- **Definition of Done QA** : couverture des critères d'acceptation, tests automatisés verts, pas de défaut bloquant.
- **Rétrospective qualité** : analyse des incidents, ajustement de la stratégie (ex.: renforcer tests anti-régression si réouvertures élevées).
