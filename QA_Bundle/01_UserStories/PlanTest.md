# USER STORIES - QUIZ GAME APPLICATION

## Projet: Application de Quiz Interactif
**Date d'analyse:** 19 Novembre 2025  
**Analyste QA:** Senior QA Manager  
**Version du document:** 1.0

---

## TABLE DES MATIÈRES

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [User Stories - Module d'Authentification](#user-stories---module-dauthentification)
4. [User Stories - Module de Quiz](#user-stories---module-de-quiz)
5. [User Stories - Module Leaderboard](#user-stories---module-leaderboard)
6. [User Stories - Gestion des Catégories et Scores](#user-stories---gestion-des-catégories-et-scores)
7. [User Stories Non-Fonctionnelles](#user-stories-non-fonctionnelles)
8. [Matrice de Traçabilité](#matrice-de-traçabilité)
9. [Récapitulatif des User Stories](#9-récapitulatif-des-user-stories)
10. [Annexes](#10-annexes)

---

## 1. VUE D'ENSEMBLE DU PROJET

### 1.1 Description du Projet

**Quiz Game** est une application web full-stack permettant aux utilisateurs de participer à des quiz interactifs dans quatre catégories distinctes : Computer Science, Mathematics, General Knowledge et Sports. L'application offre un système d'authentification sécurisé, un suivi des scores par catégorie, et un tableau de classement compétitif.

### 1.2 Objectifs Métier

- Fournir une plateforme d'évaluation des connaissances interactive et engageante
- Permettre le suivi personnalisé des performances par utilisateur et par catégorie
- Encourager la compétition saine via un système de classement
- Offrir une expérience utilisateur fluide et responsive

### 1.3 Parties Prenantes

- **Utilisateurs finaux:** Personnes souhaitant tester leurs connaissances
- **Administrateurs système:** Gestion de la base de données et des questions
- **Développeurs:** Équipe de maintenance et d'évolution
- **Product Owner:** Définition des fonctionnalités et priorités

---

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Stack Technologique

**Frontend:**
- Framework: Angular 18.2.0
- Language: TypeScript
- State Management: Angular Signals
- Routing: Angular Router avec guards d'authentification
- HTTP Client: Angular HttpClient
- Storage: LocalStorage pour la persistance client

**Backend:**
- Runtime: Node.js avec Express.js 4.21.2
- Base de données: MongoDB avec Mongoose 8.9.4
- Sécurité: bcrypt 5.1.1 pour le hashing des mots de passe
- Middleware: CORS, body-parser
- Environnement: dotenv pour la configuration

**Architecture:**
- Pattern: MVC (Model-View-Controller)
- Communication: API RESTful
- Déploiement: Frontend (port 4200), Backend (port 5000)

### 2.2 Modèles de Données

**User Schema:**
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  scores: [Number] (4 catégories: [CS, Maths, GK, Sports])
}
```

**Question Schema:**
```javascript
{
  question: String (required),
  incorrectAnswers: [String] (3 réponses),
  correctAnswer: String (required),
  category: Enum ['Computer Science', 'Maths', 'General Knowledge', 'Sports']
}
```

### 2.3 Points d'API Identifiés

**User Management:**
- POST `/api/users/register` - Création de compte
- POST `/api/users/login` - Authentification
- GET `/api/users` - Liste des utilisateurs
- GET `/api/users/leaderboard` - Classement
- PATCH `/api/users/score/:userId` - Mise à jour des scores

**Question Management:**
- GET `/api/questions?category={category}` - Récupération des questions
- POST `/api/questions` - Création de question (admin)

---

## 3. USER STORIES - MODULE D'AUTHENTIFICATION

### US-AUTH-001: Gestion de l'Authentification Utilisateur

**En tant qu'** utilisateur  
**Je veux** pouvoir m'inscrire, me connecter et me déconnecter de l'application  
**Afin de** gérer mon accès personnel à l'application de quiz et sécuriser mes données

**Critères d'acceptation:**

**Inscription:**
1. **AC1.1** - Je peux créer un compte avec email, username, password et confirmation de password
2. **AC1.2** - L'email et le username doivent être uniques dans le système
3. **AC1.3** - Le mot de passe est validé (correspondance avec confirmation)
4. **AC1.4** - Le mot de passe est hashé avec bcrypt (salt rounds: 10) avant stockage
5. **AC1.5** - Mes scores sont initialisés à [0, 0, 0, 0] pour les 4 catégories
6. **AC1.6** - Je suis redirigé vers la page login après inscription réussie avec un message de confirmation
7. **AC1.7** - Un message d'erreur explicite s'affiche si l'email ou le username existe déjà

**Connexion:**
8. **AC1.8** - Je peux me connecter avec mon email et mot de passe
9. **AC1.9** - Mes informations utilisateur (sauf password) sont stockées en localStorage
10. **AC1.10** - Je suis automatiquement redirigé vers la page welcome après connexion réussie
11. **AC1.11** - Un message d'erreur générique "Invalid email or password" s'affiche en cas d'échec (sécurité)
12. **AC1.12** - Un indicateur de chargement s'affiche pendant la requête d'authentification
13. **AC1.13** - Ma session persiste même après fermeture/rafraîchissement du navigateur

**Déconnexion:**
14. **AC1.14** - Un bouton "Logout" est accessible sur la page welcome
15. **AC1.15** - Le clic sur "Logout" supprime toutes mes données du localStorage
16. **AC1.16** - Je suis automatiquement redirigé vers la page login après déconnexion

**Protection et Sécurité:**
17. **AC1.17** - Les routes /welcome, /quiz et /leaderboard sont protégées (AuthGuard)
18. **AC1.18** - Je suis redirigé vers /login si je tente d'accéder à une page protégée sans authentification
19. **AC1.19** - Mon mot de passe n'est jamais retourné dans les réponses API
20. **AC1.20** - Les routes /login et /register restent accessibles sans authentification

**Règles métier:**
- Email et username doivent être uniques
- Pas de stockage du mot de passe en clair
- Session gérée côté client via localStorage
- Nettoyage complet des données lors de la déconnexion

**Priorisation:** MUST HAVE  
**Points d'effort:** 13  
**Dépendances:** Base de données MongoDB opérationnelle

---

## 4. USER STORIES - MODULE DE QUIZ

### US-QUIZ-001: Gestion Complète d'un Quiz

**En tant qu'** utilisateur connecté  
**Je veux** sélectionner une catégorie, répondre aux questions et voir mes résultats  
**Afin de** tester mes connaissances et améliorer mon score

**Critères d'acceptation:**

**Sélection de Catégorie:**
1. **AC1.1** - Je vois 4 catégories disponibles : Computer Science, Maths, General Knowledge, Sports
2. **AC1.2** - Chaque catégorie est représentée par une carte avec une icône distinctive
3. **AC1.3** - Je peux sélectionner une seule catégorie à la fois (état visuel "selected")
4. **AC1.4** - Le bouton "Start Quiz" est désactivé tant qu'aucune catégorie n'est sélectionnée
5. **AC1.5** - Ma catégorie sélectionnée est sauvegardée dans localStorage

**Démarrage et Chargement:**
6. **AC1.6** - Le clic sur "Start Quiz" charge les questions de la catégorie via API GET `/api/questions?category={category}`
7. **AC1.7** - Un indicateur de chargement s'affiche pendant la récupération des questions
8. **AC1.8** - Je suis automatiquement redirigé vers la page /quiz
9. **AC1.9** - Les compteurs sont réinitialisés (index question à 0, réponses correctes à 0)

**Affichage et Réponse aux Questions:**
10. **AC1.10** - La question s'affiche clairement avec 4 réponses possibles (A, B, C, D)
11. **AC1.11** - Les réponses sont mélangées aléatoirement pour chaque question
12. **AC1.12** - Un compteur de progression "Question X/Y" s'affiche
13. **AC1.13** - Je peux cliquer sur une réponse pour la sélectionner
14. **AC1.14** - La réponse correcte s'affiche en vert après sélection
15. **AC1.15** - Ma réponse incorrecte s'affiche en rouge (si elle diffère de la correcte)
16. **AC1.16** - Toutes les réponses deviennent non-cliquables après ma sélection

**Navigation:**
17. **AC1.17** - Le bouton "Next question" apparaît après avoir sélectionné une réponse
18. **AC1.18** - Le clic sur "Next question" affiche la question suivante
19. **AC1.19** - Le bouton disparaît jusqu'à la prochaine sélection de réponse
20. **AC1.20** - Pas de retour en arrière possible (navigation linéaire)

**Affichage des Résultats:**
21. **AC1.21** - Après la dernière question, l'écran de résultats s'affiche automatiquement
22. **AC1.22** - Je vois un message de félicitations "Congratulations"
23. **AC1.23** - Mon score s'affiche au format "X out of Y right"
24. **AC1.24** - Un bouton "Back to the menu" me ramène à la page welcome
25. **AC1.25** - Mon score est automatiquement sauvegardé dans la base de données
26. **AC1.26** - Seul mon meilleur score est conservé pour cette catégorie

**Gestion des Erreurs:**
27. **AC1.27** - Un message console s'affiche si aucune question n'est trouvée pour la catégorie
28. **AC1.28** - Les erreurs de chargement sont gérées et loggées sans bloquer l'utilisateur
29. **AC1.29** - Les erreurs de sauvegarde du score sont loggées mais n'interrompent pas le flux

**Règles métier:**
- Les réponses doivent être mélangées aléatoirement (algorithme Fisher-Yates)
- Une seule réponse par question autorisée
- Pas de modification possible après sélection
- Calcul du score : nombre de réponses correctes / nombre total de questions
- Sauvegarde asynchrone du score (non bloquante)
- Conservation du meilleur score uniquement

**Priorisation:** MUST HAVE  
**Points d'effort:** 21  
**Dépendances:** US-AUTH-001, Configuration MongoDB

---

## 5. USER STORIES - MODULE LEADERBOARD

### US-LEAD-001: Consultation du Classement

**En tant qu'** utilisateur connecté  
**Je veux** consulter le classement global et par catégorie de tous les joueurs  
**Afin de** comparer mes performances avec les autres utilisateurs

**Critères d'acceptation:**

**Accès et Navigation:**
1. **AC1.1** - Un bouton "Leaderboard" avec icône trophée est disponible sur la page welcome
2. **AC1.2** - Le clic me redirige vers /leaderboard (route protégée par AuthGuard)
3. **AC1.3** - Un bouton "Back to Menu" me permet de retourner à la page welcome

**Affichage du Tableau:**
4. **AC1.4** - Le tableau affiche les colonnes : Rank, Username, Computer Science, Maths, General Knowledge, Sports, Total Score
5. **AC1.5** - Les utilisateurs sont triés automatiquement par score total décroissant
6. **AC1.6** - Le rang est calculé automatiquement (position dans le classement)
7. **AC1.7** - Les scores individuels de chaque catégorie sont affichés
8. **AC1.8** - Le score total est calculé dynamiquement (somme des 4 catégories)
9. **AC1.9** - Un message "No users found" s'affiche si aucun utilisateur n'existe

**Chargement des Données:**
10. **AC1.10** - Les données sont récupérées automatiquement au chargement via API GET `/api/users/leaderboard`
11. **AC1.11** - Les données incluent tous les utilisateurs (même score 0)
12. **AC1.12** - Seuls les champs username et scores sont retournés (pas de password)
13. **AC1.13** - Le tri est effectué côté client après réception
14. **AC1.14** - Les erreurs de chargement sont loggées dans la console

**Règles métier:**
- Tous les utilisateurs sont inclus dans le classement
- Calcul du total : scores[0] + scores[1] + scores[2] + scores[3]
- Tri décroissant par score total (le plus élevé en premier)
- Pas de rafraîchissement automatique temps réel
- Rechargement manuel via navigation

**Priorisation:** MUST HAVE  
**Points d'effort:** 8  
**Dépendances:** US-AUTH-001, US-SCORE-001

---

## 6. USER STORIES - GESTION DES CATÉGORIES ET SCORES

### US-DATA-001: Gestion des Catégories et Scores

**En tant que** système  
**Je veux** gérer les catégories de quiz et les scores associés  
**Afin de** maintenir l'intégrité des données et permettre le suivi des performances

**Critères d'acceptation:**

**Définition des Catégories:**
1. **AC1.1** - Quatre catégories fixes sont définies : 'Computer Science', 'Maths', 'General Knowledge', 'Sports'
2. **AC1.2** - Les catégories sont définies dans le schéma Question comme enum MongoDB
3. **AC1.3** - Chaque catégorie a un index correspondant : CS=0, Maths=1, GK=2, Sports=3
4. **AC1.4** - La méthode getCategoryIndex() effectue le mapping nom → index
5. **AC1.5** - Les catégories non valides retournent index -1
6. **AC1.6** - L'ordre des catégories est cohérent entre frontend et backend

**Validation des Catégories:**
7. **AC1.7** - Le champ category est obligatoire dans le schéma Question
8. **AC1.8** - MongoDB valide automatiquement via enum
9. **AC1.9** - L'insertion d'une question avec catégorie invalide est rejetée avec message d'erreur
10. **AC1.10** - La validation s'applique en création et en modification

**Initialisation des Scores:**
11. **AC1.11** - À la création d'un compte, scores est initialisé à [0, 0, 0, 0]
12. **AC1.12** - Le tableau scores contient exactement 4 éléments (un par catégorie)
13. **AC1.13** - Chaque élément correspond à une catégorie dans l'ordre défini
14. **AC1.14** - La structure du tableau est immuable (toujours 4 éléments)

**Sauvegarde et Mise à Jour des Scores:**
15. **AC1.15** - Le score est sauvegardé automatiquement à la fin de chaque quiz
16. **AC1.16** - La requête PATCH `/api/users/score/:userId` est appelée avec {categoryIndex, score}
17. **AC1.17** - Le categoryIndex doit être entre 0 et 3 (validation avec erreur 400 sinon)
18. **AC1.18** - L'utilisateur est recherché par _id MongoDB (erreur 404 si non trouvé)
19. **AC1.19** - Le score est mis à jour SEULEMENT s'il est supérieur à l'existant (high score only)
20. **AC1.20** - Les erreurs de sauvegarde sont loggées mais n'interrompent pas le flux utilisateur

**Calcul et Affichage:**
21. **AC1.21** - La méthode calculateTotalScore() additionne les 4 scores
22. **AC1.22** - Le calcul utilise : scores.reduce((sum, score) => sum + score, 0)
23. **AC1.23** - Le score total est calculé dynamiquement côté client
24. **AC1.24** - Pas de stockage du total en base de données

**Règles métier:**
- Catégories non modifiables par les utilisateurs
- Correspondance stricte des noms (sensible à la casse)
- Scores initiaux toujours à 0
- Pas de scores négatifs possibles
- Conservation du meilleur score uniquement
- Pas d'historique des scores
- Modification atomique du tableau scores

**Priorisation:** MUST HAVE  
**Points d'effort:** 13  
**Dépendances:** Conception base de données MongoDB

---

## 7. USER STORIES NON-FONCTIONNELLES

### US-NFR-001: Performance de Chargement

**En tant qu'** utilisateur  
**Je veux** que l'application se charge rapidement  
**Afin d'** avoir une expérience fluide

**Critères d'acceptation:**

1. **AC1.1** - Le temps de chargement initial < 3 secondes (connection 4G)
2. **AC1.2** - Le temps de réponse API < 500ms pour 95% des requêtes
3. **AC1.3** - Les bundles JavaScript sont optimisés (build production)
4. **AC1.4** - Les images et assets sont compressés
5. **AC1.5** - Le lazy loading est implémenté pour les composants lourds

**Priorisation:** SHOULD HAVE  
**Points d'effort:** 5

---

### US-NFR-002: Sécurité des Données

**En tant que** système  
**Je veux** protéger les données sensibles des utilisateurs  
**Afin de** garantir la confidentialité et la sécurité

**Critères d'acceptation:**

1. **AC2.1** - Les mots de passe sont hashés avec bcrypt (salt rounds ≥ 10)
2. **AC2.2** - Le mot de passe n'est jamais retourné dans les réponses API
3. **AC2.3** - Les connexions utilisent HTTPS en production
4. **AC2.4** - Le CORS est configuré pour autoriser uniquement les origines connues
5. **AC2.5** - Les injections SQL/NoSQL sont prévenues via Mongoose
6. **AC2.6** - Les tokens d'authentification devraient être implémentés (JWT)

**Priorisation:** MUST HAVE  
**Points d'effort:** 8

---

### US-NFR-003: Compatibilité Navigateurs

**En tant qu'** utilisateur  
**Je veux** utiliser l'application sur différents navigateurs  
**Afin d'** y accéder depuis mon navigateur préféré

**Critères d'acceptation:**

1. **AC3.1** - Support Chrome (dernières 2 versions)
2. **AC3.2** - Support Firefox (dernières 2 versions)
3. **AC3.3** - Support Safari (dernières 2 versions)
4. **AC3.4** - Support Edge (dernières 2 versions)
5. **AC3.5** - Le design est responsive (mobile, tablette, desktop)

**Priorisation:** SHOULD HAVE  
**Points d'effort:** 5

---

### US-NFR-004: Gestion des Erreurs

**En tant que** système  
**Je veux** gérer gracieusement les erreurs  
**Afin de** fournir un feedback approprié à l'utilisateur

**Critères d'acceptation:**

1. **AC4.1** - Les erreurs API affichent des messages utilisateur compréhensibles
2. **AC4.2** - Les erreurs techniques sont loggées côté serveur
3. **AC4.3** - Les erreurs ne révèlent pas d'informations sensibles
4. **AC4.4** - Un middleware de gestion d'erreur global est implémenté (backend)
5. **AC4.5** - Les erreurs 404, 500, 401, 400 ont des réponses cohérentes
6. **AC4.6** - Les erreurs réseau sont gérées avec retry ou message approprié

**Priorisation:** MUST HAVE  
**Points d'effort:** 5

---

### US-NFR-005: Accessibilité (A11y)

**En tant qu'** utilisateur avec handicap  
**Je veux** pouvoir utiliser l'application avec des technologies d'assistance  
**Afin d'** avoir un accès égal aux fonctionnalités

**Critères d'acceptation:**

1. **AC5.1** - Tous les éléments interactifs sont accessibles au clavier
2. **AC5.2** - Les labels de formulaire sont correctement associés
3. **AC5.3** - Les contrastes de couleur respectent WCAG 2.1 niveau AA
4. **AC5.4** - Les boutons ont des aria-labels descriptifs
5. **AC5.5** - La navigation au clavier est logique et intuitive

**Priorisation:** COULD HAVE  
**Points d'effort:** 8

---

### US-NFR-006: Scalabilité

**En tant que** système  
**Je veux** supporter un nombre croissant d'utilisateurs  
**Afin de** permettre la croissance de la plateforme

**Critères d'acceptation:**

1. **AC6.1** - La base de données supporte au moins 10,000 utilisateurs
2. **AC6.2** - Les indexes MongoDB sont optimisés (username, email)
3. **AC6.3** - L'API peut gérer 100 requêtes simultanées
4. **AC6.4** - La pagination est implémentée pour les grandes listes
5. **AC6.5** - Le système de cache est envisagé pour les questions fréquentes

**Priorisation:** SHOULD HAVE  
**Points d'effort:** 13

---

### US-NFR-007: Maintenabilité du Code

**En tant que** développeur  
**Je veux** un code propre et maintenable  
**Afin de** faciliter les évolutions futures

**Critères d'acceptation:**

1. **AC7.1** - L'architecture MVC est respectée
2. **AC7.2** - Les composants Angular sont standalone et réutilisables
3. **AC7.3** - Les services sont injectés via DI (Dependency Injection)
4. **AC7.4** - Le code suit les conventions TypeScript/JavaScript
5. **AC7.5** - Les fichiers de configuration sont externalisés (.env)
6. **AC7.6** - Les commentaires expliquent la logique complexe

**Priorisation:** SHOULD HAVE  
**Points d'effort:** Continu

---

## 8. MATRICE DE TRAÇABILITÉ

### 8.1 Mapping User Stories ↔ Composants Techniques

| User Story | Frontend Component | Backend Route | Database Model |
|------------|-------------------|---------------|----------------|
| US-AUTH-001 | LoginComponent, RegisterComponent, Welcome1Component, AuthGuard | POST /api/users/register<br>POST /api/users/login | User |
| US-QUIZ-001 | Welcome1Component, QuizComponent, QuestionComponent, AnswerComponent, QuizService | GET /api/questions?category={category} | Question |
| US-LEAD-001 | LeaderboardComponent | GET /api/users/leaderboard | User |
| US-DATA-001 | QuizService | PATCH /api/users/score/:userId | User, Question |
| US-NFR-001 | Tous les composants | Toutes les routes | - |
| US-NFR-002 | LoginComponent, RegisterComponent | POST /api/users/register<br>POST /api/users/login | User |
| US-NFR-003 | Tous les composants | - | - |
| US-NFR-004 | Tous les composants | Toutes les routes | - |
| US-NFR-005 | Tous les composants | - | - |
| US-NFR-006 | - | Toutes les routes | User, Question |
| US-NFR-007 | Tous les composants | Toutes les routes | - |

### 8.2 Dépendances entre User Stories

```
US-AUTH-001 (Authentification)
    └─> US-QUIZ-001 (Quiz)
        └─> US-DATA-001 (Catégories & Scores)
            └─> US-LEAD-001 (Leaderboard)

US-NFR-002 (Sécurité)
    └─> US-AUTH-001 (Authentification)

US-NFR-004 (Gestion erreurs)
    └─> Toutes les US fonctionnelles
```

### 8.3 Priorisation MoSCoW

**MUST HAVE (Priorité 1):**
- US-AUTH-001 (Authentification complète)
- US-QUIZ-001 (Gestion complète du quiz)
- US-LEAD-001 (Leaderboard)
- US-DATA-001 (Catégories et scores)
- US-NFR-002 (Sécurité)
- US-NFR-004 (Gestion erreurs)

**SHOULD HAVE (Priorité 2):**
- US-NFR-001 (Performance)
- US-NFR-003 (Compatibilité navigateurs)
- US-NFR-006 (Scalabilité)
- US-NFR-007 (Maintenabilité)

**COULD HAVE (Priorité 3):**
- US-NFR-005 (Accessibilité)

**WON'T HAVE (Hors scope actuel):**
- Système de badges/achievements
- Partage sur réseaux sociaux
- Mode multijoueur temps réel
- Création de quiz personnalisés
- Système de commentaires

---

## 9. RÉCAPITULATIF DES USER STORIES

### 9.1 Statistiques

- **Total User Stories:** 11
- **Fonctionnelles:** 4
- **Non-Fonctionnelles:** 7

**Par Module:**
- Authentification: 1 US (US-AUTH-001)
- Quiz: 1 US (US-QUIZ-001)
- Leaderboard: 1 US (US-LEAD-001)
- Catégories et Scores: 1 US (US-DATA-001)
- Non-fonctionnelles: 7 US (US-NFR-001 à US-NFR-007)

**Par Priorité:**
- MUST HAVE: 6 US (55%) - US-AUTH-001, US-QUIZ-001, US-LEAD-001, US-DATA-001, US-NFR-002, US-NFR-004
- SHOULD HAVE: 4 US (36%) - US-NFR-001, US-NFR-003, US-NFR-006, US-NFR-007
- COULD HAVE: 1 US (9%) - US-NFR-005

**Effort Total Estimé:** 70 points d'effort (13+21+8+13+5+8+5+5+8+13+continu)

### 9.2 Observations et Recommandations

**Points Forts Identifiés:**
1. Architecture claire et séparation des responsabilités
2. Utilisation de patterns modernes (Angular Signals, Standalone Components)
3. Sécurité de base implémentée (bcrypt)
4. Structure MVC cohérente

**Améliorations Recommandées:**
1. **Sécurité:** Implémenter JWT pour l'authentification (actuellement localStorage simple)
2. **Validation:** Ajouter des validations côté serveur plus robustes
3. **Tests:** Aucun test unitaire/e2e détecté - à implémenter
4. **Pagination:** Implémenter pour le leaderboard et les questions
5. **Cache:** Considérer un système de cache pour les questions
6. **Logs:** Améliorer le logging structuré côté serveur
7. **Documentation API:** Créer une documentation Swagger/OpenAPI
8. **Gestion d'état:** Considérer NgRx pour un état plus complexe
9. **Monitoring:** Implémenter des outils de monitoring (Sentry, New Relic)
10. **CI/CD:** Mettre en place des pipelines d'intégration continue

**Risques Identifiés:**
1. Pas de token d'authentification sécurisé (localStorage seul)
2. Pas de gestion de refresh de session
3. Dépendance MongoDB non documentée (connection string)
4. Pas de stratégie de backup documentée
5. Scalabilité limitée sans pagination
6. Pas de rate limiting sur les API

---

## 10. ANNEXES

### 10.1 ANNEXE A - GLOSSAIRE

| Terme | Définition |
|-------|------------|
| **Angular Signals** | Nouveau système de réactivité Angular (v16+) pour la gestion d'état |
| **Auth Guard** | Service Angular protégeant les routes contre les accès non autorisés |
| **bcrypt** | Algorithme de hashing cryptographique pour les mots de passe |
| **CORS** | Cross-Origin Resource Sharing - mécanisme de sécurité HTTP |
| **Dependency Injection** | Pattern de conception pour l'injection de dépendances |
| **Enum** | Type énuméré limitant les valeurs possibles d'un champ |
| **JWT** | JSON Web Token - standard pour l'authentification sécurisée |
| **localStorage** | API de stockage persistant côté navigateur |
| **Mongoose** | ODM (Object Document Mapper) pour MongoDB et Node.js |
| **MVC** | Model-View-Controller - pattern architectural |
| **RESTful API** | API respectant les principes REST (Representational State Transfer) |
| **Salt Rounds** | Nombre d'itérations pour le hashing bcrypt (sécurité) |
| **Standalone Component** | Composant Angular indépendant sans NgModule |
| **SSR** | Server-Side Rendering - rendu côté serveur |

---

### 10.2 ANNEXE B - ENDPOINTS API COMPLETS

### Authentification et Utilisateurs

```
POST   /api/users/register
POST   /api/users/login
GET    /api/users
GET    /api/users/leaderboard
PATCH  /api/users/score/:userId
GET    /api/users/test
```

### Questions

```
POST   /api/questions
GET    /api/questions?category={category}
```

---

### 10.3 ANNEXE C - STRUCTURE DES DONNÉES

### User Object (Response)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "scores": [5, 8, 7, 6]
}
```

### Question Object
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "question": "What is Angular?",
  "incorrectAnswers": ["A database", "A language", "An OS"],
  "correctAnswer": "A framework",
  "category": "Computer Science"
}
```

### Login Response
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "scores": [5, 8, 7, 6]
  }
}
```

---

**Document généré le:** 19 Novembre 2025  
**Statut:** Version complète pour revue  
**Prochaine étape:** Validation par le Product Owner et l'équipe de développement
