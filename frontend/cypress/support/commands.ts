type MockUser = {
  _id: string;
  username: string;
  email: string;
  scores: number[];
};

type LoginOptions = {
  email?: string;
  password?: string;
  userOverrides?: Partial<MockUser>;
};

type AuthenticatedVisitOptions = Partial<MockUser> & {
  category?: string;
};

const DEFAULT_USER: MockUser = {
  _id: 'user-e2e',
  username: 'QA Player',
  email: 'qa.player@example.com',
  scores: [0, 0, 0, 0],
};

const API_BASE_URL = 'http://localhost:5000';

declare global {
  namespace Cypress {
    interface Chainable {
      login(options?: LoginOptions): Chainable<MockUser>;
      authenticatedVisit(path: string, options?: AuthenticatedVisitOptions): Chainable<MockUser>;
    }
  }
}

Cypress.Commands.add('login', (options: LoginOptions = {}) => {
  const credentials = {
    email: options.email ?? 'user_alpha@example.com',
    password: options.password ?? 'Password!123',
  };

  const mockUser: MockUser = {
    ...DEFAULT_USER,
    email: credentials.email,
    ...options.userOverrides,
  };

  cy.intercept('POST', `${API_BASE_URL}/api/users/login`, {
    statusCode: 200,
    body: { user: mockUser },
  }).as('loginRequest');

  cy.visit('/login');
  cy.get('form').invoke('attr', 'novalidate', 'novalidate');
  cy.get('input[name="email"]').clear().type(credentials.email);
  cy.get('input[name="password"]').clear().type(credentials.password, { log: false });
  cy.contains('button', 'Login').click();
  cy.wait('@loginRequest');
  cy.url().should('include', '/welcome');
  cy.window().then((win) => {
    win.localStorage.setItem('user', JSON.stringify(mockUser));
    win.localStorage.setItem('userId', mockUser._id);
  });

  return cy.wrap(mockUser);
});

Cypress.Commands.add('authenticatedVisit', (path: string, options: AuthenticatedVisitOptions = {}) => {
  const { category, ...userOverrides } = options;

  const mockUser: MockUser = {
    ...DEFAULT_USER,
    ...userOverrides,
  };

  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('user', JSON.stringify(mockUser));
      win.localStorage.setItem('userId', mockUser._id);
      if (category) {
        win.localStorage.setItem('quizCategory', category);
      }
    },
  });

  return cy.wrap(mockUser);
});

export {};
