describe('Edit fleet and ship', () => {
    it('go to my fleet page', () => {
        cy.visit('http://apache/edit-ships-and-fleet');
    });
    it('get list of ship', () => {
        cy.get('.list-group-item').each(($el) => {
            $el.get('input')
            $el.get('.btn-actions')
        })
    });
});
