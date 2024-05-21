const express = require('express');
const router = express.Router();
const { getForecasts, createForecast, updateForecast, deleteForecast, acceptForecast } = require('../controllers/forecastController');

router.get('/', getForecasts);
router.post('/', createForecast);
router.put('/:id', updateForecast);
router.delete('/:id', deleteForecast);
router.post('/:id/accept', acceptForecast);

module.exports = router;
