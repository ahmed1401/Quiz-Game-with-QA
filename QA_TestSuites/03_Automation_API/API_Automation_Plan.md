# Plan d'automatisation API (Jest + SuperTest)

## 1. Objectifs
- Vérifier automatiquement les endpoints REST `/api/users/*` et `/api/questions`.
- Empêcher les régressions sur l'authentification, la mise à jour des scores et la récupération des questions.
- Fournir un retour rapide dans CI via `npm test` côté backend.

## 2. Stack
| Composant | Version | Usage |
|-----------|---------|-------|
| Jest | 29.x | Runner de tests.
| SuperTest | 6.x | Client HTTP.
| mongodb-memory-server | 10.x | Mongo en mémoire pour isoler les tests.
| ts-jest / babel-jest | selon stack | Compilation TS éventuelle.

## 3. Organisation
```
backend/
├── tests/
│   ├── users.spec.ts
│   └── questions.spec.ts
├── jest.config.js
└── package.json (script "test": "jest --runInBand")
```

## 4. Scénarios automatisés
### users.spec.ts
1. `POST /api/users/register` crée un utilisateur avec hash bcrypt et scores [0,0,0,0].
2. `POST /api/users/register` retourne 400 pour email/username existant.
3. `POST /api/users/login` renvoie 200 et masque le password.
4. `PATCH /api/users/score/:id` met à jour seulement si score supérieur.
5. `PATCH /api/users/score/:id` retourne 400 si `categoryIndex` hors [0,3].
6. `GET /api/users/leaderboard` retourne liste triée décroissante.

### questions.spec.ts
1. `GET /api/questions?category=Computer%20Science` renvoie 10 items.
2. Paramètre manquant -> 400.
3. `POST /api/questions` avec catégorie invalide -> 400 (enum).

## 5. Données et fixtures
- Utiliser `mongodb-memory-server` pour injecter fixtures via Mongoose.
- Option alternative : seeder BD de test via script `addQuestions.js` sur un cluster isolé.

## 6. Extrait de configuration Jest
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

## 7. Intégration CI
- Étape "Test API" dans pipeline (après `npm install`).
- Exporter rapport JUnit via `jest-junit` si requis.

## 8. Critères de réussite
- 100% des tests PASS en < 60 s.
- Base mémoire nettoyée entre les tests.
- Couverture ciblée > 80% sur contrôleurs user/question.
