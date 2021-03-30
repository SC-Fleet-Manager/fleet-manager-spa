describe('Card', () => {
    it('go to my fleet page', () => {
        cy.visit('http://apache/my-fleet');
    });
    it('get some card', () => {
        cy.get('.card-body').get('img')
        cy.get('.card-body').get('p')
    });
    it('get edit shipt and fleet button', () => {
        cy.get('button').contains('Edit ships and fleet')
    });
});
