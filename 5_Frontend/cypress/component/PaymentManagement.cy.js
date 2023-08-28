import React from 'react';
import App from '../../src/App';

describe('AddPaymentForm', () => {
  beforeEach(() => {
    cy.mount(<App />);
  });
  let paymentId; // To store the ID of the submitted payment

  it('should redirect to Payments page when "Payments" button is clicked', () => {
    // Find the "Payments" link by its href attribute
    cy.get('a[href="/payments"]').should('exist').click();

    // Check if the URL matches the expected Payments page URL
    cy.url().should('include', '/payments');
  });

  it('should allow the user to enter their name', () => {
    cy.get('a[href="/payments"]').should('exist').click();
    
    const name = 'John';
    cy.get('input[type="text"][name="name"]').type(name).should('have.value', name);
  });

  it('should allow the user to enter their surname', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    const surname = 'Doe';
    cy.get('input[name="surname"]').type(surname).should('have.value', surname);
  });

  it('should allow the user to enter their account number', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    const accountNumber = '123456789';
    cy.get('input[name="accountNumber"]').type(accountNumber).should('have.value', accountNumber);
  });

  it('should allow the user to enter their phone number', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    const phoneNumber = '123-456-7890';
    cy.get('input[name="phoneNumber"]').type(phoneNumber).should('have.value', phoneNumber);
  });

  it('should allow the user to enter their email', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    const email = 'john@example.com';
    cy.get('input[name="email"]').type(email).should('have.value', email);
  });

  it('should allow the user to enter the payment description', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    const description = 'Test payment';
    cy.get('input[name="description"]').type(description).should('have.value', description);
  });

  it('should allow the user to enter the payment amount', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    const price = '100';
    cy.get('input[name="price"]').type(price).should('have.value', price);
  });

  it('should allow the user to enter the payment currency', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    const currency = 'USD';
    cy.get('input[name="currency"]').type(currency).should('have.value', currency);
  });

  it('should submit the form with valid input', () => {
    cy.get('a[href="/payments"]').should('exist').click();

    // Modify the description to include a unique identifier
    const description = 'Test payment ' + Cypress._.random(0, 9999);

    // Fill out all input fields
    cy.get('input[name="name"]').type('John');
    cy.get('input[name="surname"]').type('Doe');
    cy.get('input[name="accountNumber"]').type('123456789');
    cy.get('input[name="phoneNumber"]').type('123-456-7890');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="description"]').type(description);
    cy.get('input[name="price"]').type('100');
    cy.get('input[name="currency"]').type('USD');

    // Submit the form
    cy.get('button[type="submit"]').should('exist').click();

    // Wait for the response and handle assertions
    cy.wait(1000); // Adjust the wait time as needed

    cy.request('GET', 'http://localhost:8888/payments')
      .its('body')
      .then((payments) => {
        // Find the submitted payment based on the description
        const submittedPayment = payments.find(payment => payment.Description === description);
        expect(submittedPayment).to.exist;
        paymentId = submittedPayment.ID; // Store the ID for later use

        // Retrieve the submitted payment using its ID
        cy.request(`GET`, `http://localhost:8888/payments/${paymentId}`)
          .its('body')
          .then((payment) => {
            expect(payment.Name).to.equal('John');
            expect(payment.Surname).to.equal('Doe');
            expect(payment.AccountNumber).to.equal('123456789');
            expect(payment.PhoneNumber).to.equal('123-456-7890');
            expect(payment.Email).to.equal('john@example.com');
            expect(payment.Description).to.equal(description);
            expect(payment.Price).to.equal(100);
            expect(payment.Currency).to.equal('USD');
          });
      });
  });
});