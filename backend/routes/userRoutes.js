const express = require('express');
const router = express.Router();
const { loginUser, register, getProfile, getUsers, createUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Route for user login
router.post('/auth/login', loginUser);

// Route for user registration
router.post('/auth/register', register);

// Protected route to get user profile
router.get('/profile', auth, getProfile);

// Protected and admin route to get all users
router.get('/', auth, admin, getUsers);

// Protected and admin route to create a new user
router.post('/', auth, admin, createUser);

module.exports = router;
