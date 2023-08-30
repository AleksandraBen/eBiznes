import React, { useState } from 'react';
import './Registration.css';

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegistration = async () => {
    try {
      // Create a payload with username and password
      const payload = { username, password };
  
      // Make a POST request to the registration endpoint
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Check if registration was successful
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data.message);
        // Reset form fields after successful registration
        setUsername('');
        setPassword('');
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div classname="registration-container">
      <h2>Registration</h2>
        <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={handleUsernameChange} 
        />
        <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={handlePasswordChange} 
        />
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
}

export default Registration;
