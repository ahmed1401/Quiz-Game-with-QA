describe('Welcome dashboard', () => {
  beforeEach(() => {
    cy.fixture('questions').as('questions');
  });

  it('enforces category selection before starting the quiz', function () {
    cy.intercept('GET', '**/api/questions*', {
      statusCode: 200,
      body: this.questions.ComputerScience,
    }).as('fetchQuestions');

    cy.authenticatedVisit('/welcome');

    cy.contains('button', 'Start Quiz').should('be.disabled');
    cy.contains('.category-card', 'Computer Science').click().should('have.class', 'selected');
    cy.contains('button', 'Start Quiz').click();

    cy.wait('@fetchQuestions');
    cy.url().should('include', '/quiz');
    cy.window().its('localStorage.quizCategory').should('eq', 'Computer Science');
  });

  it('navigates to the leaderboard from the dashboard', () => {
    cy.authenticatedVisit('/welcome');
    cy.contains('button', /^Leaderboard/).click();
    cy.url().should('include', '/leaderboard');
  });
});
