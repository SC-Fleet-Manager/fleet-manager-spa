describe('Homepage', () => {
    it('should see how many users registered', () => {
        cy.intercept('GET', '/api/numbers', { fixture: 'numbers.json' }).as('getNumbers');
        cy.intercept('GET', '/api/funding/ladder-alltime', { fixture: 'funding_ladder-alltime.json' }).as('getFundingLadder');

        cy.visit('http://apache');

        cy.contains('learn more').click();

        cy.wait('@getNumbers');
        cy.contains('12345');
    });
});
