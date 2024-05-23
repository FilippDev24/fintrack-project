module.exports = function (req, res, next) {
    console.log('User in admin middleware:', req.user); // Добавьте вывод данных пользователя
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      console.log('Access denied:', req.user); // Добавьте логирование причины отказа
      res.status(403).json({ msg: 'Access denied, admin only' });
    }
  };
  