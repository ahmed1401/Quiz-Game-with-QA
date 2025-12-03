// Exemple de spec Cypress pour le parcours principal Quiz Game

describe('Quiz Game - Parcours complet', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.alpha.email, users.alpha.password);
    });
  });

  it('permet de lancer un quiz, répondre et voir le leaderboard', () => {
    // Sélection catégorie
    cy.contains('Computer Science').click();
    cy.contains('Start Quiz').should('not.be.disabled').click();

    // Boucle sur les questions
    cy.get('[data-testid="question-card"]').should('have.length', 1);
    cy.get('[data-testid^="answer-"]').first().click();
    cy.contains('Next question').click();

    // Fin du quiz
    cy.contains('Congratulations').should('be.visible');
    cy.contains('Back to the menu').click();
    cy.url().should('include', '/welcome');

    // Leaderboard
    cy.contains('Leaderboard').click();
    cy.get('table').within(() => {
      cy.contains('th', 'Total Score').should('exist');
    });
  });
});
