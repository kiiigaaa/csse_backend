const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

// Register a new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the username already exists
    User.findOne({ username }).then((user) => {
      if (user) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      const newUser = new User({
        username,
        password,
      });
  
      // Hash the password (you should use bcrypt for a secure hash)
      newUser.password = password;
  
      newUser
        .save()
        .then(() => res.json({ message: 'User registered successfully' }))
        .catch((err) => console.log(err));
    });
  });
  
  // Login
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user by username
    User.findOne({ username }).then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check the password (you should use bcrypt for secure password comparison)
      if (password === user.password) {
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, 'your-secret-key');
        res.json({ success: true, token: `Bearer ${token}` });
      } else {
        res.status(400).json({ error: 'Password is incorrect' });
      }
    });
  });
  
module.exports = router;
