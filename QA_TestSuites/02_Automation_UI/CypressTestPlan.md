# Plan d'automatisation UI (Cypress)

## 1. Objectifs
- Couvrir les parcours critiques (Login → Quiz → Leaderboard) sous Angular 18.
- Fournir des scripts réutilisables dans la CI (GitHub Actions / Azure DevOps).
- Générer des artefacts (captures, vidéos) pour chaque échec.

## 2. Outils & versions
| Outil | Version cible | Usage |
|-------|---------------|-------|
| Cypress | 13.x (component + e2e) | Framework E2E.
| TypeScript | 5.x | Typage des specs.
| start-server-and-test | ^2 | Lancer backend/frontend avant tests.
| eslint-plugin-cypress | ^2 | Lint des specs.

## 3. Structure proposée
```
frontend/
├── cypress.config.ts
├── cypress/
│   ├── fixtures/
│   │   └── users.json
│   ├── support/
│   │   ├── commands.ts
│   │   └── e2e.ts
│   └── e2e/
│       ├── auth.cy.ts
│       ├── quiz.cy.ts
│       ├── leaderboard.cy.ts
│       └── regression.cy.ts
```

## 4. Suites et cas automatisés
| Spec | Cas principaux | Données |
|------|----------------|---------|
| `auth.cy.ts` | Inscription happy path, blocage doublon, login/logout, protection routes | `fixtures/users.json` pour comptes.
| `quiz.cy.ts` | Sélection catégorie, déroulé complet, validations score, restart | Utilisation API `/api/questions` mockée via intercept.
| `leaderboard.cy.ts` | Tri décroissant, message vide (mock), navigation retour | Stubs via `cy.intercept('GET', '/api/users/leaderboard', ...)`.
| `regression.cy.ts` | Chaîne E2E (signup → quiz → leaderboard) + assertions localStorage | Données générées dynamiquement.

## 5. Commandes personnalisées
Exemples dans `support/commands.ts` :
```ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(password);
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/welcome');
  });
});
```

## 6. Intégration CI
`package.json` :
```json
{
  "scripts": {
    "cy:run": "cypress run --browser chrome",
    "test:e2e": "start-server-and-test 'npm run dev' http-get://localhost:4200 cy:run"
  }
}
```

## 7. Critères de réussite
- Temps total < 5 min.
- 0 test flaky (réessai max 1).
- Artefacts archivés dans `cypress/videos` et `cypress/screenshots`.

## 8. Backlog automatisation
- Tests responsive (viewport mobile & desktop).
- Couverture accessibilité via `cypress-axe`.
- Tests visual regression (Percy ou Loki).
