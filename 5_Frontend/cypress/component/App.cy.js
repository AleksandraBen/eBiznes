import React from 'react'
import App from '../../src/App'

describe('<App />', () => {
  it('renders', () => {
    cy.mount(<App />)
  })
})

it("renders correctly the landing page", () => {
  cy.mount(<App />);
  cy.get("h1").should("have.text", "Witamy w sklepie online!");
});

// Test inaccessible CRUD for Product
describe('Create Product API', () => {
  it('should create a new product', () => {
    const productData = {
      Name: 'Sample Product',
      Description: 'This is a sample product description.',
      Price: 19.99,
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8888/products',
      body: productData,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      expect(response.status).to.eq(201); // Expect a successful creation response
      expect(response.body).to.have.property('ID'); // Expect the response to have an ID property
      expect(response.body.Name).to.eq(productData.Name);
      expect(response.body.Description).to.eq(productData.Description);
      expect(response.body.Price).to.eq(productData.Price);
    });
  });
});

describe('Get Product API', () => {
  beforeEach(() => {
    // Create a product with the desired properties
    cy.request({
      method: 'POST',
      url: 'http://localhost:8888/products',
      body: {
        Name: 'Test Product',
        Description: 'This is a test product.',
        Price: 19.99,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should retrieve a product by ID', () => {
    // Get the ID of the created product
    cy.request('http://localhost:8888/products').then(response => {
      const productId = response.body[0].ID;

    cy.request(`http://localhost:8888/products/${productId}`).then(response => {
      expect(response.status).to.eq(200); // Expect a successful retrieval response
      expect(response.body).to.have.property('ID', productId); // Expect the response to have the correct ID
    });
  });
});
});

describe('Update Product API', () => {
  beforeEach(() => {
    // Create a product with the desired properties
    cy.request({
      method: 'POST',
      url: 'http://localhost:8888/products',
      body: {
        Name: 'Test Product',
        Description: 'This is a test product.',
        Price: 19.99,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
  it('should update a product by ID', () => {
  // Get the ID of the created product
  cy.request('http://localhost:8888/products').then(response => {
    const productId = response.body[0].ID;

    const updatedProductData = {
      Name: 'Updated Product',
      Description: 'This is an updated product description.',
      Price: 29.99,
    };

    cy.request({
      method: 'PUT',
      url: `http://localhost:8888/products/${productId}`,
      body: updatedProductData,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      expect(response.status).to.eq(200); // Expect a successful update response
      expect(response.body).to.have.property('ID', productId); // Expect the response to have the correct ID
      expect(response.body.Name).to.eq(updatedProductData.Name);
      expect(response.body.Description).to.eq(updatedProductData.Description);
      expect(response.body.Price).to.eq(updatedProductData.Price);
    });
  });
});
});

describe('Delete Product API', () => {
  beforeEach(() => {
    // Create a product with the desired properties
    cy.request({
      method: 'POST',
      url: 'http://localhost:8888/products',
      body: {
        Name: 'Test Product',
        Description: 'This is a test product.',
        Price: 19.99,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should delete a product by ID', () => {
    // Get the ID of the created product
    cy.request('http://localhost:8888/products').then(response => {
      const productId = response.body[0].ID;

      // Delete the product by its ID
      cy.request({
        method: 'DELETE',
        url: `http://localhost:8888/products/${productId}`,
      }).then(response => {
        expect(response.status).to.eq(204); // Expect a successful delete response with no content
      });
    });
  });
});

// Test inaccessible CRUD for Cart
describe('Get Cart API', () => {
  let productId; // To store the product ID
  let cartId = 1; // To store the cart ID
  beforeEach(() => {
    // Create a product with the desired properties
    cy.request({
      method: 'POST',
      url: 'http://localhost:8888/products',
      body: {
        Name: 'Test Product',
        Description: 'This is a test product.',
        Price: 19.99,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      // Store the created product ID
      productId = response.body.ID;

      // Add the product to the cart
      cy.request({
        method: 'POST',
        url: `http://localhost:8888/cart/1/items`,
        body: {
          product_id: productId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('should retrieve cart items by cart ID', () => {
    cy.request(`http://localhost:8888/cart/${cartId}`).then(response => {
      expect(response.status).to.eq(200); // Expect a successful retrieval response
      expect(response.body).to.be.an('array'); // Expect the response to be an array

      const cartItems = response.body;
      expect(cartItems.length).to.be.at.least(1); // Expect at least one cart item in the response

      // Check properties of the first cart item
      expect(cartItems[0].CartID).to.eq(1);
    });
  });
});

// Test inaccessible CRUD for Payment
describe('Payment API', () => {
  let paymentId; // To store the payment ID

  beforeEach(() => {
    // Create a payment with the desired properties
    cy.request({
      method: 'POST',
      url: 'http://localhost:8888/payments',
      body: {
        Name: 'John',
        Surname: 'Doe',
        AccountNumber: '123456789',
        PhoneNumber: '1234567890',
        Email: 'john.doe@example.com',
        Description: 'Payment for a product',
        Price: 50,
        Currency: 'USD',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      // Store the created payment ID
      paymentId = response.body.ID;
    });
  });

  it('should retrieve a payment by ID', () => {
    cy.request(`http://localhost:8888/payments/${paymentId}`).then(response => {
      expect(response.status).to.eq(200); // Expect a successful retrieval response
      expect(response.body).to.have.property('ID', paymentId); // Expect the response to have the correct ID
      expect(response.body.Name).to.eq('John');
      expect(response.body.Surname).to.eq('Doe');
      expect(response.body.AccountNumber).to.eq('123456789');
      expect(response.body.PhoneNumber).to.eq('1234567890');
      expect(response.body.Email).to.eq('john.doe@example.com');
      expect(response.body.Description).to.eq('Payment for a product');
      expect(response.body.Price).to.eq(50);
      expect(response.body.Currency).to.eq('USD');
    });
  });

  it('should retrieve all payments', () => {
    cy.request('http://localhost:8888/payments').then(response => {
      expect(response.status).to.eq(200); // Expect a successful retrieval response
      expect(response.body).to.be.an('array'); // Expect the response to be an array
    });
  });
});
