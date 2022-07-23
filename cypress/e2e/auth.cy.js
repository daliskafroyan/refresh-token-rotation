context('Authentication', () => {
  beforeEach(() => {
    Cypress.Cookies.debug(true);

    cy.visit('http://localhost:3000/');

    // clear cookies again after visiting to remove
    // any 3rd party cookies picked up such as cloudflare
    cy.clearCookies();
  });

  it('user logging in for the first time', () => {
    // user visit for the first time
    cy.visit('http://localhost:3000/');
    cy.url().should('eq', 'http://localhost:3000/');
    cy.findByText(/Login/i).click();
    cy.window().its('localStorage.refresh_token').should('be.a', 'string');
    cy.findByText(/Logged in!/i).should('be.disabled');
  });

  it('user logging in when the refresh_token persist', () => {
    // user visit for the first time
    cy.visit('http://localhost:3000/');
    cy.url().should('eq', 'http://localhost:3000/');
    cy.findByText(/Login/i).click();
    cy.window().its('localStorage.refresh_token').should('be.a', 'string');
    cy.findByText(/Logged in!/i).should('be.disabled');

    // user visit for the second time
    cy.visit('http://localhost:3000/');
    cy.url().should('eq', 'http://localhost:3000/');
    cy.window().its('localStorage.refresh_token').should('be.a', 'string');
    cy.findByText(/Logged in!/i).should('be.disabled');
  });

  it('user have to log in again as there is no refresh_token available', () => {
    // user visit for the first time
    cy.visit('http://localhost:3000/');
    cy.url().should('eq', 'http://localhost:3000/');
    cy.findByText(/Login/i).click();
    cy.window().its('localStorage.refresh_token').should('be.a', 'string');
    cy.findByText(/Logged in!/i).should('be.disabled');

    // user visit for the second time
    cy.visit('http://localhost:3000/');
    cy.url().should('eq', 'http://localhost:3000/');
    cy.window().its('localStorage.refresh_token').should('be.a', 'string');
    cy.findByText(/Logged in!/i).should('be.disabled');

    // clearing local storage
    cy.clearLocalStorage(/refresh_token/i).then(
      (ls) => expect(ls.getItem('refresh_token')).to.be.null
    );
    cy.visit('http://localhost:3000/');
    cy.findByText(/Login/i).click();
    cy.window().its('localStorage.refresh_token').should('be.a', 'string');
    cy.findByText(/Logged in!/i).should('be.disabled');
  });
});
