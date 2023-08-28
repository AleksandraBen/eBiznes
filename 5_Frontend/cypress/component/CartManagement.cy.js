import React from 'react';
import App from '../../src/App';

describe('Cart', () => {
  beforeEach(() => {
    cy.mount(<App />);
  });

  it('should add a product to the cart', () => {
    // Navigate to the Products section
    cy.get('a[href="/products"]').click();

    // Get the details of the first product
    let productName, productDescription, productPrice;

    cy.get('h3').first().invoke('text').then(text => {
      productName = text;
    });

    cy.get('p').contains('Opis:').first().invoke('text').then(text => {
      productDescription = text;
    });

    cy.get('p').contains('Cena:').first().invoke('text').then(text => {
      productPrice = text;
    }).then(() => {
      // Click the "Dodaj do koszyka" button for the first product
      cy.get('button').contains('Dodaj do koszyka').first().click();

      // Navigate to the Cart section
      cy.get('a[href="/cart/1"]').click();

      // Check if the added product is in the cart
      cy.contains('Nazwa produktu: ' + productName).should('exist');
      cy.contains(productDescription).should('exist');
      cy.contains(productPrice).should('exist');
    });
  });

  it('should delete a product from the cart', () => {
    // Navigate to the Cart section
    cy.get('a[href="/cart/1"]').click();

    // Get the details of the first product in the cart
    let productName, productDescription, productPrice;

    cy.contains('Nazwa produktu:').first().invoke('text').then(text => {
      productName = text;
    });

    cy.contains('Opis:').first().invoke('text').then(text => {
      productDescription = text;
    });

    cy.contains('Cena:').first().invoke('text').then(text => {
      productPrice = text;
    }).then(() => {
      // Click the "Usuń" button for the first product in the cart
      cy.get('button').contains('Usuń').first().click();

      // Check if the deleted product is no longer in the cart
      cy.contains(productName).should('not.exist');
      cy.contains(productDescription).should('not.exist');
      cy.contains(productPrice).should('not.exist');
    });
  });
});
