describe('Card', () => {
    it('go to my fleet page', () => {
        cy.visit('http://apache/my-fleet');
    });
    it('get some card', () => {
        cy.get('.card').get('img')
        cy.get('.card').get('header')
    });
    it('get edit shipt and fleet button', () => {
        cy.get('button').contains('Edit ships and fleet')
    });
});
