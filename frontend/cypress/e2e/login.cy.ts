describe('Login page', () => {
  beforeEach(() => {
    cy.fixture('users').as('users');
  });

  it('shows a validation error when fields are missing', function () {
    cy.visit('/login');
    cy.get('form').invoke('attr', 'novalidate', 'novalidate');
    cy.get('input[name="email"]').type(this.users.alpha.email);
    cy.get('input[name="password"]').clear();
    cy.contains('button', 'Login').click();
    cy.contains('Please enter both email and password!').should('be.visible');
  });

  it('displays backend errors when authentication fails', function () {
    const errorMessage = 'Invalid credentials';
    cy.intercept('POST', '**/api/users/login', {
      statusCode: 401,
      body: { message: errorMessage },
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('input[name="email"]').type(this.users.alpha.email);
    cy.get('input[name="password"]').type(this.users.alpha.password, {
      log: false,
    });
    cy.contains('button', 'Login').click();
    cy.wait('@loginRequest');
    cy.contains(errorMessage).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('stores the authenticated user and redirects to welcome', function () {
    const mockUser = {
      _id: 'user-123',
      username: 'Alpha Tester',
      email: this.users.alpha.email,
      scores: [1, 2, 3, 4],
    };

    cy.intercept('POST', '**/api/users/login', {
      statusCode: 200,
      body: { user: mockUser },
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('input[name="email"]').type(this.users.alpha.email);
    cy.get('input[name="password"]').type(this.users.alpha.password, {
      log: false,
    });
    cy.contains('button', 'Login').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/welcome');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.eq(JSON.stringify(mockUser));
      expect(win.localStorage.getItem('userId')).to.eq(mockUser._id);
    });
  });
});
