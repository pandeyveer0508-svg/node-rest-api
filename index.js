// const express = require('express');
// const users=require('./MOCK_DATA.json')
// const app = express();
// const port = 3000;

// app.get('/users', (req, res) => {
//   return res.json(users);
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

// Read users from file
const getUsers = () => {
  const data = fs.readFileSync('./MOCK_DATA.json', 'utf-8');
  return JSON.parse(data);
};

// Save users to file
const saveUsers = (data) => {
  fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(data, null, 2));
};



// 🔹 GET all users
app.get('/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});


// 🔹 GET single user
app.get('/users/:id', (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id == req.params.id);

  if (!user) return res.status(404).send("User not found");
  res.json(user);
});


// 🔹 POST (Add user)
app.post('/users', (req, res) => {
  const users = getUsers();

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...req.body
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json(newUser);
});


// 🔹 PUT (Update user)
app.put('/users/:id', (req, res) => {
  let users = getUsers();
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1) return res.status(404).send("User not found");

  users[index] = { ...users[index], ...req.body };
  saveUsers(users);

  res.json(users[index]);
});


// 🔹 DELETE user
app.delete('/users/:id', (req, res) => {
  let users = getUsers();
  const newUsers = users.filter(u => u.id != req.params.id);

  if (users.length === newUsers.length)
    return res.status(404).send("User not found");

  saveUsers(newUsers);
  res.send("User deleted");
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});