const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const auth = require('../middleware/auth'); // Подключение middleware auth

// Маршруты, требующие авторизации
router.get('/', auth, forecastController.getForecasts); // Получение всех прогнозов
router.post('/', auth, forecastController.createForecast); // Создание нового прогноза
router.get('/:id', auth, forecastController.getForecastById); // Получение прогноза по ID
router.put('/:id', auth, forecastController.updateForecast); // Обновление прогноза
router.delete('/:id', auth, forecastController.deleteForecast); // Удаление прогноза
router.put('/:id/accept', auth, forecastController.acceptForecast); // Принятие прогноза

module.exports = router;
