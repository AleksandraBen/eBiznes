import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

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

  return (
    <div>
      <h1>Produkty</h1>
      {products.map(product => (
        <div key={product.ID}>
          <h3>{product.Name}</h3>
          <p>{product.Description}</p>
          <p>Cena: {product.Price}</p>
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
      <h1>Płatności</h1>
      {payments.map(payment => (
        <div key={payment.ID}>
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
    // Implement fetching cart items from the server
  }, []);

  return (
    <div>
      <h1>Koszyk</h1>
      {/* Display cart items */}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Produkty</Link>
            </li>
            <li>
              <Link to="/payments">Płatności</Link>
            </li>
            <li>
              <Link to="/cart">Koszyk</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/payments">
            <Payments />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/">
            <Products />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
