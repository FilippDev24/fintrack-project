const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

router.get('/', forecastController.getForecasts);
router.post('/', forecastController.createForecast);
router.get('/:id', forecastController.getForecastById);
router.put('/:id', forecastController.updateForecast);
router.delete('/:id', forecastController.deleteForecast);
router.post('/:id/accept', forecastController.acceptForecast);

module.exports = router;
