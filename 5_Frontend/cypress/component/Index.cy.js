import React from 'react';
import App from '../../src/App';

describe('App', () => {
  beforeEach(() => {
    cy.mount(<App />);
  });

  it('should display the header correctly', () => {
    cy.get('header').should('contain', 'Witamy w sklepie online!');
    cy.get('header').should('contain', 'Zapraszamy do zakupów:');
  });

  it('should have working navigation links', () => {
    cy.get('a[href="/products"]').should('exist').click();
    cy.url().should('include', '/products');

    cy.get('a[href="/payments"]').should('exist').click();
    cy.url().should('include', '/payments');

    cy.get('a[href="/cart/1"]').should('exist').click();
    cy.url().should('include', '/cart/1');
  });
});
