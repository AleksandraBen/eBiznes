import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

import AddPaymentForm from './AddPaymentForm';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://ebiznesab-backend.azurewebsites.net/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const addToCart = (productId) => {
    const cartId = 1;

    const requestData = {
      product_id: productId,
    };

    axios.post(`https://ebiznesab-backend.azurewebsites.net/cart/${cartId}/items`, requestData)
      .then(response => {
        console.log('Item added to cart:', response.data);
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
      });
  };

  return (
    <div>
      <h1>Produkty</h1>
      {products.map(product => (
        <div key={product.ID}>
          <h3>{product.Name}</h3>
          <p>Opis: {product.Description}</p>
          <p>Cena: {product.Price}</p>
          <button onClick={() => addToCart(product.ID)}>Dodaj do koszyka</button>
        </div>
      ))}
    </div>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('https://ebiznesab-backend.azurewebsites.net/payments')
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <AddPaymentForm />
      <h1>Dodane Płatności</h1>
      {payments.map(payment => (
        <div key={payment.ID}>
          <p>Imię: {payment.Name}</p>
          <p>Nazwisko: {payment.Surname}</p>
          <p>Adres: {payment.AccountNumber}</p>
          <p>Numer telefonu: {payment.PhoneNumber}</p>
          <p>Email: {payment.Email}</p>
          <p>Opis: {payment.Description}</p>
          <p>Kwota: {payment.Amount}</p>
          <p>Waluta: {payment.Currency}</p>
        </div>
      ))}
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    axios.get('https://ebiznesab-backend.azurewebsites.net/cart/1/items')
      .then(response => {
        setCartItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
  };

  const deleteFromCart = (itemId) => {
    const cartId = 1;

    axios.delete(`https://ebiznesab-backend.azurewebsites.net/cart/${cartId}/items/${itemId}`)
      .then(response => {
        console.log('Item deleted from cart:', response.data);
        fetchCartItems();
      })
      .catch(error => {
        console.error('Error deleting item from cart:', error);
      });
  };

  return (
    <div>
      <h1>Koszyk</h1>
      {cartItems.map(item => (
        <div key={item.ID}>
          <p>Nazwa produktu: {item.Name}</p>
          <p>Opis: {item.Description}</p>
          <p>Cena: {item.Price}</p>
          <button onClick={() => deleteFromCart(item.ID)}>Usuń</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <header>
          <h1>Witamy w sklepie online!</h1>
          <p>Zapraszamy do zakupów:</p>
        </header>
      </div>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/products">Produkty</Link>
            </li>
            <li>
              <Link to="/payments">Płatności</Link>
            </li>
            <li>
              <Link to="/cart/1">Koszyk</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/payments" element={<Payments />} />
          <Route path="/cart/1" element={<Cart />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
