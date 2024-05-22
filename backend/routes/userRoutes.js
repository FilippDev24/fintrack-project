const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getUsers, createUser, loginUser, register, login, getProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, admin, getUsers);
router.post('/', auth, admin, createUser);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  (req, res, next) => {
    console.log('Login route hit');
    next();
  },
  loginUser
);

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

module.exports = router;
