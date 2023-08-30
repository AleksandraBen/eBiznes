const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

// Simulated user database
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Simulate generating a session token
    const token = 'example-token';
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Simulate creating a new user in the database
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  // Respond with a success message or user data
  res.status(201).json({ message: 'User registered successfully' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
