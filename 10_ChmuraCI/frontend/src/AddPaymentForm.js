import React, { useState } from 'react';
import axios from 'axios';

const AddPaymentForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSurnameChange = (e) => {
    setSurname(e.target.value);
  };

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const paymentData = {
      name: name,
      surname: surname,
      accountNumber: accountNumber,
      phoneNumber: phoneNumber,
      email: email,
      description: description,
      price: parseFloat(price),
      currency: currency
    };

    axios.post('https://ebiznesab-backend.azurewebsites.net/payments', paymentData)
      .then(response => {
        console.log('Payment added successfully');
      })
      .catch(error => {
        console.error('Error adding payment:', error);
      });
  };

  return (
    <div>
      <h2>Dodaj nową płatność</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Imię:</label>
          <input type="text" name="name" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Nazwisko:</label>
          <input type="text" name="surname" value={surname} onChange={handleSurnameChange} />
        </div>
        <div>
          <label>Numer konta:</label>
          <input type="text" name="accountNumber" value={accountNumber} onChange={handleAccountNumberChange} />
        </div>
        <div>
          <label>Numer telefonu:</label>
          <input type="text" name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="text" name="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>Opis:</label>
          <input type="text" name="description" value={description} onChange={handleDescriptionChange} />
        </div>
        <div>
          <label>Kwota:</label>
          <input type="text" name="price" value={price} onChange={handlePriceChange} />
        </div>
        <div>
          <label>Waluta:</label>
          <input type="text" name="currency" value={currency} onChange={handleCurrencyChange} />
        </div>
        <button type="submit">Dodaj płatność</button>
      </form>
    </div>
  );
};

export default AddPaymentForm;
