# Suite de Tests Manuels — Quiz Game

## 1. Organisation
- **Méthodologie** : Given / When / Then + priorisation MoSCoW.
- **Supports** : navigateur Chrome/Edge, MongoDB seedée via `node addQuestions.js`, comptes de test listés ci-dessous.
- **Comptes** :
  - `user_alpha@example.com / Password!123`
  - `user_beta@example.com / Password!123`

## 2. Tableau des cas

### 2.1 Authentification
| ID | Scénario | Steps (Given/When/Then) | Attendu | Priorité |
|----|----------|-------------------------|---------|----------|
| MAN-AUTH-01 | Inscription succès | **Given** page `/register` et données uniques<br>**When** je saisis username/email/password/confirmation et soumets<br>**Then** réponse 201, message succès, redirection `/login`, en base scores=[0,0,0,0] hash bcrypt | PASS visuel + vérif Mongo | Must |
| MAN-AUTH-02 | Blocage doublon | Given user existant<br>When je réutilise même email<br>Then erreur 400 "User with this email or username already exists" sans création | Message + absence doc Mongo | Must |
| MAN-AUTH-03 | Connexion succès | Given utilisateur valide<br>When je saisis credentials<br>Then redirection `/welcome`, localStorage contient `user`, `userId`, `token=null` | Must |
| MAN-AUTH-04 | Connexion refusée | Given utilisateur valide<br>When mauvais mot de passe<br>Then toast "Invalid email or password" et pas de session | Must |
| MAN-AUTH-05 | Déconnexion | Given session active<br>When je clique Logout<br>Then redirection `/login` et localStorage vidé | Must |
| MAN-AUTH-06 | Routes protégées | Given aucune session<br>When j'accède `/quiz` via URL<br>Then redirection `/login` | Must |

### 2.2 Parcours Quiz
| ID | Scénario | Steps | Attendu | Priorité |
|----|----------|-------|---------|----------|
| MAN-QUIZ-01 | Sélection obligatoire | Given `/welcome`<br>When aucune carte sélectionnée<br>Then bouton Start désactivé | Must |
| MAN-QUIZ-02 | Démarrage et loader | Given carte CS sélectionnée<br>When je clique Start<br>Then spinner visible, GET `/api/questions?category=...`, navigation `/quiz` | Must |
| MAN-QUIZ-03 | Mélange réponses | Given 3 questions de suite<br>When j'observe l'ordre<br>Then chaque question présente un ordre différent (au moins 1 permutation) | Should |
| MAN-QUIZ-04 | Feedback correct/incorrect | Given question en cours<br>When je choisis option<br>Then bonne réponse surlignée en vert, mauvaise en rouge, boutons inactifs | Must |
| MAN-QUIZ-05 | Navigation linéaire | Given question n<br>When je clique Next<br>Then question n+1 affichée, pas de retour possible | Must |
| MAN-QUIZ-06 | Résultat final | When dernière question terminée<br>Then page "Congratulations", score `X out of Y right`, bouton Back to menu | Must |
| MAN-QUIZ-07 | Sauvegarde high score | Given score existant 4<br>When je termine avec 3<br>Then score resté à 4 dans DB | Must |

### 2.3 Leaderboard
| ID | Scénario | Steps | Attendu | Priorité |
|----|----------|-------|---------|----------|
| MAN-LEAD-01 | Accès protégé | When utilisateur non authentifié ouvre `/leaderboard`<br>Then redirection `/login` | Must |
| MAN-LEAD-02 | Affichage colonnes | When utilisateur connecté clique Leaderboard<br>Then tableau avec colonnes Rank, Username, CS, Maths, GK, Sports, Total | Must |
| MAN-LEAD-03 | Tri décroissant | Given plusieurs scores<br>Then colonnes triées total décroissant, rang 1..n | Must |
| MAN-LEAD-04 | Message vide | Given aucun utilisateur en DB<br>Then message "No users found" | Could |

### 2.4 Données & API
| ID | Scénario | Steps | Attendu | Priorité |
|----|----------|-------|---------|----------|
| MAN-DATA-01 | Validation enum catégorie | Via Postman POST `/api/questions` category="History" -> 400 + msg | Must |
| MAN-DATA-02 | Validation index | PATCH `/api/users/score/:id` avec index=5 -> 400 "Invalid category index" | Must |
| MAN-DATA-03 | Scores initiaux | Après création, GET `/api/users` -> scores [0,0,0,0] | Must |
| MAN-DATA-04 | Calcul total UI | Leaderboard somme scores = total affiché | Should |

### 2.5 NFR rapides
| ID | Scénario | Steps | Attendu | Priorité |
|----|----------|-------|---------|----------|
| MAN-NFR-01 | Performance visuelle | Lighthouse mode mobile -> LCP < 3s, TTI < 3s | Should |
| MAN-NFR-02 | Headers sécurité | Inspecter réponse `/api/users` -> `X-Content-Type-Options` présent | Should |
| MAN-NFR-03 | Accessibilité clavier | Navigation Tab sur formulaires -> focus visible | Could |

## 3. Procédure d'exécution
1. Seeder la base (`cd backend && node addQuestions.js`).
2. Démarrer backend (`node app.js`) + frontend (`cd frontend && npm start`).
3. Suivre l'ordre : Auth → Quiz → Scores → Leaderboard → NFR.
4. Consigner les résultats dans Sheets structurées (statut, commentaires, pièces jointes).
5. Ouvrir un ticket DEF-xxx pour toute anomalie.

## 4. Critères d'acceptation manuels
- 100% des cas Must = PASS
- Aucun défaut bloquant/majeur ouvert
- Validations Should/Could consignées mais non bloquantes.
