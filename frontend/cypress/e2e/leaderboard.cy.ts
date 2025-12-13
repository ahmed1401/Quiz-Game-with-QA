describe('Leaderboard page', () => {
  it('renders ranked users with their scores', () => {
    cy.authenticatedVisit('/leaderboard');

    cy.get('tbody tr', { timeout: 10000 }).its('length').should('be.gte', 1);
    cy.get('tbody tr').then(($rows) => {
      const totals = Array.from($rows).map((row) => {
        const totalCell = row.querySelector('td.total-score');
        const value = totalCell?.textContent?.trim() ?? '0';
        return Number.parseInt(value, 10) || 0;
      });

      const sortedTotals = [...totals].sort((a, b) => b - a);
      expect(totals).to.deep.equal(sortedTotals);
    });

    cy.contains('button', 'Back to Menu').click();
    cy.url().should('include', '/welcome');
  });
});
