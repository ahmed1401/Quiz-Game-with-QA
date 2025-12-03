describe('Register page', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.get('form').invoke('attr', 'novalidate', 'novalidate');
  });

  it('keeps the submit button disabled until all fields are valid', () => {
    const submitButton = () => cy.contains('button', 'Register');

    submitButton().should('be.disabled');
    cy.get('input[name="email"]').type('new.user@example.com');
    cy.get('input[name="username"]').type('New User');
    cy.get('input[name="password"]').type('Password!123', { log: false });
    submitButton().should('be.disabled');

    cy.get('input[name="confirmPassword"]').type('Password!123', { log: false });
    submitButton().should('not.be.disabled');
  });

  it('shows a mismatch warning when the confirmation differs', () => {
    cy.get('input[name="email"]').type('new.user@example.com');
    cy.get('input[name="username"]').type('New User');
    cy.get('input[name="password"]').type('Password!123', { log: false });
    cy.get('input[name="confirmPassword"]').type('Mismatch!123', { log: false });
    cy.get('.passdontmatch').should('contain', 'Passwords do not match.');
  });

  it('submits the registration and redirects to login', () => {
    cy.intercept('POST', '**/api/users/register', {
      statusCode: 201,
      body: { message: 'Registered' },
    }).as('registerRequest');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('input[name="email"]').type('new.user@example.com');
    cy.get('input[name="username"]').type('New User');
    cy.get('input[name="password"]').type('Password!123', { log: false });
    cy.get('input[name="confirmPassword"]').type('Password!123', { log: false });
    cy.contains('button', 'Register').click();

    cy.wait('@registerRequest');
    cy.get('@alert').should('have.been.calledWith', 'Registration successful! Please login.');
    cy.url().should('include', '/login');
  });
});
