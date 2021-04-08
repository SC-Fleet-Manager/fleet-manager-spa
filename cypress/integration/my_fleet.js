describe('MyFleet', () => {
    it('should display ship of logged user', () => {
        // cy.setCookie('auth0.is.authenticated', 'true');
        // cy.intercept('POST', 'https://fleet-manager.eu.auth0.com/authorize', { fixture: 'token.json' }).as('token');
        cy.intercept('GET', '/api/my-fleet', { fixture: 'my-fleet.json' }).as('myFleet');

        cy.visit('/my-fleet');

        cy.wait('@myFleet');



    });
});
