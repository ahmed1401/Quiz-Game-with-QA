describe('Quiz gameplay', () => {
  beforeEach(() => {
    cy.fixture('questions').as('questions');
  });

  it('loads questions, records answers, and saves the score', function () {
    const questionSet = this.questions.ComputerScience;

    const encodedCategory = encodeURIComponent('Computer Science');

    cy.intercept('GET', `**/api/questions?category=${encodedCategory}`, {
      statusCode: 200,
      body: questionSet,
    }).as('fetchQuestions');

    cy.intercept('PATCH', '**/api/users/score/*', {
      statusCode: 200,
      body: { success: true },
    }).as('saveScore');

    cy.authenticatedVisit('/quiz', { category: 'Computer Science' });
    cy.wait('@fetchQuestions');

    cy.contains('Question 1/2').should('be.visible');
    cy.contains('.answer', questionSet[0].correctAnswer).click();
    cy.contains('.next-button', 'Next question').click();

    const wrongAnswer = questionSet[1].incorrectAnswers[0];
    cy.contains('Question 2/2').should('be.visible');
    cy.contains('.answer', wrongAnswer).click();
    cy.contains('.next-button', 'Next question').click();

    cy.wait('@saveScore');
    cy.contains('Congratulations').should('be.visible');
    cy.contains("You've got").should('contain', 'out of');
    cy.contains('button', 'Back to the menu').should('be.visible');
  });
});
