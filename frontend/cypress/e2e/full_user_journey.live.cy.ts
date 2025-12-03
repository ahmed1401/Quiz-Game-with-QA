const API_URL = Cypress.env('API_URL') || 'http://localhost:5000';
const CATEGORY_SEQUENCE = ['Computer Science', 'Maths', 'General Knowledge', 'Sports'];
const runLiveSuiteEnv = Cypress.env('RUN_LIVE_E2E');
const runLiveSuite =
  runLiveSuiteEnv === undefined
    ? true
    : typeof runLiveSuiteEnv === 'string'
    ? runLiveSuiteEnv.toLowerCase() === 'true'
    : Boolean(runLiveSuiteEnv);
const describeLive = runLiveSuite ? describe : describe.skip;
const categorySeeds = {
  'Computer Science': [
    {
      question: 'What does CPU stand for?',
      incorrectAnswers: ['Central Process Utility', 'Computer Personal Unit', 'Control Processing Unit'],
      correctAnswer: 'Central Processing Unit',
      category: 'Computer Science',
    },
    {
      question: 'Which programming language runs natively in the browser?',
      incorrectAnswers: ['Python', 'C++', 'Java'],
      correctAnswer: 'JavaScript',
      category: 'Computer Science',
    },
  ],
  Maths: [
    {
      question: 'What is the derivative of x^2?',
      incorrectAnswers: ['2x^2', 'x', 'x^3'],
      correctAnswer: '2x',
      category: 'Maths',
    },
    {
      question: 'What is the value of π rounded to two decimals?',
      incorrectAnswers: ['3.10', '3.50', '2.14'],
      correctAnswer: '3.14',
      category: 'Maths',
    },
  ],
  'General Knowledge': [
    {
      question: 'Which continent is the Sahara Desert located in?',
      incorrectAnswers: ['Asia', 'Australia', 'South America'],
      correctAnswer: 'Africa',
      category: 'General Knowledge',
    },
    {
      question: "Who wrote '1984'?",
      incorrectAnswers: ['Aldous Huxley', 'J.K. Rowling', 'Mark Twain'],
      correctAnswer: 'George Orwell',
      category: 'General Knowledge',
    },
  ],
  Sports: [
    {
      question: 'How many players are on a soccer team on the field?',
      incorrectAnswers: ['9', '12', '8'],
      correctAnswer: '11',
      category: 'Sports',
    },
    {
      question: 'Which country hosts the Wimbledon tournament?',
      incorrectAnswers: ['France', 'United States', 'Spain'],
      correctAnswer: 'United Kingdom',
      category: 'Sports',
    },
  ],
};

describeLive('Parcours utilisateur complet (backend réel)', () => {
  before(() => {
    Object.values(categorySeeds).forEach((questions) => {
      questions.forEach((payload) => {
        cy.request('POST', `${API_URL}/api/questions`, payload);
      });
    });
  });

  it('enregistre un utilisateur, parcourt toutes les catégories et vérifie le leaderboard', () => {
    const uniqueSuffix = Date.now();
    const email = `qa_${uniqueSuffix}@example.com`;
    const password = 'Password!123';
    const username = `QA User ${uniqueSuffix}`;

    cy.on('window:alert', cy.stub().as('alert'));

    cy.intercept('PATCH', '**/api/users/score/*').as('saveScore');

    cy.visit('/register');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password, { log: false });
    cy.get('input[name="confirmPassword"]').type(password, { log: false });
    cy.contains('button', 'Register').click();
    cy.get('@alert').should('have.been.calledWith', 'Registration successful! Please login.');
    cy.url().should('include', '/login');

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password, { log: false });
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/welcome');

    cy.wrap(CATEGORY_SEQUENCE).each((category) => {
      const aliasSuffix = category.replace(/\s+/g, '-');
      const encodedCategory = encodeURIComponent(category);
      const alias = `loadQuestions-${aliasSuffix}`;

      cy.intercept('GET', `**/api/questions?category=${encodedCategory}`).as(alias);

      cy.contains('.category-card', category).scrollIntoView().click();
      cy.contains('button', 'Start Quiz').should('not.be.disabled').click();

      cy.wait(`@${alias}`).then(({ response }) => {
        const questions = response.body;
        expect(questions.length).to.be.greaterThan(0);
        cy.wrap(questions).as('currentQuestions');
      });

      cy.location('pathname', { timeout: 10000 }).should('include', '/quiz');

      cy.get('@currentQuestions').then((questions) => {
        questions.forEach((question) => {
          cy.get('.question', { timeout: 10000 }).should('contain', question.question);
          cy.contains('.answer', question.correctAnswer, { timeout: 10000 }).click();
          cy.contains('.next-button', 'Next question', { timeout: 10000 }).click();
        });
      });

      cy.wait('@saveScore');
      cy.contains('Congratulations', { timeout: 10000 }).should('be.visible');
      cy.contains('button', 'Back to the menu').click();
      cy.location('pathname', { timeout: 10000 }).should('include', '/welcome');

      cy.contains('button', /^Leaderboard/).click();
      cy.location('pathname', { timeout: 10000 }).should('include', '/leaderboard');
      cy.contains('td', username, { timeout: 10000 }).should('exist');
      cy.contains('button', 'Back to Menu').click();
      cy.location('pathname', { timeout: 10000 }).should('include', '/welcome');
    });
  });
});
