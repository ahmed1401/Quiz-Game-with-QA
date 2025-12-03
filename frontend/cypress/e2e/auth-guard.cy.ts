describe('Auth guard', () => {
  it('redirects unauthenticated users to the login page', () => {
    cy.visit('/welcome', { failOnStatusCode: false });
    cy.url().should('include', '/login');
  });

  it('allows access when user data exists in localStorage', () => {
    cy.authenticatedVisit('/welcome');
    cy.contains('Welcome,').should('be.visible');
  });
});
