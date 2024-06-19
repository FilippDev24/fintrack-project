const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const authHeader = req.header('Authorization');

  // Check for token in Authorization header
  if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1]; // Extract the token from the Bearer scheme
  console.log('Token:', token); // Логирование токена

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload
    req.user = decoded;
    console.log('Decoded:', decoded); // Логирование декодированного токена
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
