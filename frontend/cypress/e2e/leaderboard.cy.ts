describe('Leaderboard page', () => {
  beforeEach(() => {
    cy.fixture('leaderboard').as('leaderboardData');
  });

  it('renders ranked users with their scores', function () {
    cy.intercept('GET', '**/api/users/leaderboard', {
      statusCode: 200,
      body: this.leaderboardData,
    }).as('loadLeaderboard');

    cy.authenticatedVisit('/leaderboard');
    cy.wait('@loadLeaderboard');

    cy.get('tbody tr').should('have.length', this.leaderboardData.length);
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(1).should('contain', 'Alice');
      cy.get('td.total-score').should('contain', '26');
    });

    cy.contains('button', 'Back to Menu').click();
    cy.url().should('include', '/welcome');
  });
});
