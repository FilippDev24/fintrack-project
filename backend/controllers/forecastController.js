const Forecast = require('../models/Forecast');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { handleError } = require('../utils/errorUtils');

const getForecasts = async (req, res) => {
    try {
        const forecasts = await Forecast.find();
        res.json(forecasts);
    } catch (error) {
        handleError(res, error);
    }
};

const getForecastById = async (req, res) => {
    try {
        const forecast = await Forecast.findById(req.params.id);
        if (!forecast) {
            return res.status(404).json({ message: 'Forecast not found' });
        }
        res.json(forecast);
    } catch (error) {
        handleError(res, error);
    }
};

const createForecast = async (req, res) => {
    const { date, amount, category, description, type } = req.body;

    try {
        console.log('Creating forecast:', req.body); // Добавлено логирование
        let defaultCategory = null;
        if (!category) {
            defaultCategory = await Category.findOne({ isSystem: true, defaultFor: 'forecast' });
        }

        const forecast = new Forecast({
            date,
            amount,
            category: category || (defaultCategory ? defaultCategory._id : null),
            description: description || '',
            type,
            status: 'pending' // Установка статуса
        });

        const newForecast = await forecast.save();
        res.status(201).json(newForecast);
    } catch (error) {
        handleError(res, error);
    }
};

const updateForecast = async (req, res) => {
    try {
        const { date, amount, category, description, type } = req.body;
        
        let defaultCategory = null;
        if (!category) {
            defaultCategory = await Category.findOne({ isSystem: true, defaultFor: 'forecast' });
        }

        const updatedForecast = await Forecast.findByIdAndUpdate(
            req.params.id,
            { date, amount, category: category || (defaultCategory ? defaultCategory._id : null), description: description || '', type },
            { new: true }
        );
        res.json(updatedForecast);
    } catch (error) {
        handleError(res, error);
    }
};

const deleteForecast = async (req, res) => {
    try {
        await Forecast.findByIdAndDelete(req.params.id);
        res.json({ message: 'Forecast deleted' });
    } catch (error) {
        handleError(res, error);
    }
};

const acceptForecast = async (req, res) => {
    try {
        const forecast = await Forecast.findById(req.params.id);
        if (!forecast) {
            return res.status(404).json({ message: 'Forecast not found' });
        }

        const forecastDate = new Date(forecast.date);
        const currentDate = new Date();
        forecastDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (forecastDate > currentDate) {
            return res.status(400).json({ message: 'Cannot accept forecast for a future date.' });
        }

        forecast.status = 'accepted';
        await forecast.save();
        const transaction = new Transaction({
            date: forecast.date,
            amount: forecast.amount,
            category: forecast.category,
            description: forecast.description,
            type: forecast.type
        });
        await transaction.save();
        res.json({ message: 'Forecast accepted and converted to transaction' });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getForecasts,
    getForecastById,
    createForecast,
    updateForecast,
    deleteForecast,
    acceptForecast,
};
