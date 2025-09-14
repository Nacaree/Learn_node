const express = require('express');
const app = express();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
/* 
* Before you can receive JSON data, you need to tell Express to parse it. This is done using a piece of software called middleware.
? app.use(express.json());
* This line tells your server to automatically parse incoming request bodies with JSON payloads, making them available on the req.body property.
*/
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express.js!');
});

app.get('/about', (req, res) => {
  res.send('This is the about page.');
});

// * Handling Dynamic Routes (Route Parameters)
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const userData = {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
  };
  res.json(userData);
//   res.send(`You requested data for user ID: ${userId}`);
});

/* app.post('/api/users', (req, res) => {
  const newUser = req.body;
  console.log('New user data received:', newUser);
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
}); */

app.post('/api/users', (req, res) => {
  // 1. Read the existing users from the file
  const users = JSON.parse(fs.readFileSync('db.json', 'utf8')).users;
  // 2. Create a new user object with a unique ID
  const newUser = {
    id: uuidv4(), // <-- This generates a unique ID
    ...req.body
  };
  // 3. Add the new user to the array
  users.push(newUser);
  // 4. Save the updated array back to the file
  fs.writeFileSync('db.json', JSON.stringify({ users }, null, 2), 'utf8');
  // 5. Send a response back to the client
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});