const CATEGORY_SEQUENCE = ['Computer Science', 'Maths', 'General Knowledge', 'Sports'];
const fixtureKeyMap = {
  'Computer Science': 'ComputerScience',
  Maths: 'Maths',
  'General Knowledge': 'GeneralKnowledge',
  Sports: 'Sports',
};

describe('Parcours utilisateur complet', () => {
  beforeEach(() => {
    cy.fixture('users').as('users');
    cy.fixture('questions').as('questions');
    cy.fixture('leaderboard').as('leaderboard');
  });

  it('couvre toutes les catégories avec vérification du leaderboard', function () {
    const email = 'new.user@example.com';
    const password = 'Password!123';
    const username = 'New User';
    const userScores = [0, 0, 0, 0];
    const leaderboardFixture = this.leaderboard;

    cy.intercept('POST', '**/api/users/register', {
      statusCode: 201,
      body: { message: 'Registered' },
    }).as('register');

    cy.intercept('POST', '**/api/users/login', {
      statusCode: 200,
      body: {
        user: {
          _id: 'user-journey',
          username,
          email,
          scores: [...userScores],
        },
      },
    }).as('login');

    cy.intercept('PATCH', '**/api/users/score/*', (req) => {
      const { categoryIndex, score } = req.body;
      if (typeof categoryIndex === 'number') {
        userScores[categoryIndex] = Math.max(userScores[categoryIndex], score);
      }
      req.reply({ scores: [...userScores] });
    }).as('saveScore');

    cy.intercept('GET', '**/api/users/leaderboard', (req) => {
      req.reply([
        {
          _id: 'user-journey',
          username,
          scores: [...userScores],
        },
        ...leaderboardFixture,
      ]);
    }).as('loadLeaderboard');

    cy.visit('/register');
    cy.window().then((win) => cy.stub(win, 'alert').as('alert'));
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password, { log: false });
    cy.get('input[name="confirmPassword"]').type(password, { log: false });
    cy.contains('button', 'Register').click();
    cy.wait('@register');
    cy.get('@alert').should('have.been.calledWith', 'Registration successful! Please login.');
    cy.url().should('include', '/login');

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password, { log: false });
    cy.contains('button', 'Login').click();
    cy.wait('@login');
    cy.url().should('include', '/welcome');

    CATEGORY_SEQUENCE.forEach((category) => {
      const fixtureKey = fixtureKeyMap[category];
      const questionSet = this.questions[fixtureKey];
      const encodedCategory = encodeURIComponent(category);
      const alias = `loadQuestions-${fixtureKey}`;

      cy.intercept('GET', `**/api/questions?category=${encodedCategory}`, {
        statusCode: 200,
        body: questionSet,
      }).as(alias);

      cy.contains('.category-card', category).scrollIntoView().click();
      cy.contains('button', 'Start Quiz').should('not.be.disabled').click();
      cy.wait(`@${alias}`);
      cy.url().should('include', '/quiz');

      questionSet.forEach((question) => {
        cy.contains('.question', question.question).should('be.visible');
        cy.contains('.answer', question.correctAnswer, { timeout: 10000 }).click();
        cy.contains('.next-button', 'Next question', { timeout: 10000 }).click();
      });

      cy.wait('@saveScore');
      cy.contains('Congratulations').should('be.visible');
      cy.contains('button', 'Back to the menu').click();
      cy.url().should('include', '/welcome');

      cy.contains('button', /^Leaderboard/).click();
      cy.wait('@loadLeaderboard');
      cy.url().should('include', '/leaderboard');
      cy.contains('td', username).should('exist');
      cy.contains('button', 'Back to Menu').click();
      cy.url().should('include', '/welcome');
    });
  });
});
