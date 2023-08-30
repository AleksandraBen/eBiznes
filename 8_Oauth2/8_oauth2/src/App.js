import React from 'react';
import './App.css';
import Login from './Login';
import Registration from './Registration';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login />
        <Registration />
      </header>
    </div>
  );
}

export default App;
