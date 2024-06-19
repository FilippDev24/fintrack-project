module.exports = function (req, res, next) {
  console.log('User in admin middleware:', req.user); // Логирование пользователя
  if (req.user && req.user.user && req.user.user.role === 'admin') {
      next();
  } else {
      console.log('Access denied:', req.user); // Логирование причины отказа
      res.status(403).json({ msg: 'Access denied, admin only' });
  }
};
