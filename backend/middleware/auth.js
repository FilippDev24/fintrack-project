const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    console.log('Decoded user:', req.user); // Добавьте вывод данных пользователя
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
