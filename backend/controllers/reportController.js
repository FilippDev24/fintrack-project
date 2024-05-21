// backend/controllers/reportController.js
const Transaction = require('../models/Transaction');
const Forecast = require('../models/Forecast');

const generateReport = async (req, res) => {
  try {
    // Пример отчета по транзакциям
    const transactions = await Transaction.find();
    const forecasts = await Forecast.find();

    // Сгенерировать данные для отчета
    const reportData = {
      transactions,
      forecasts,
      totalIncome: transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
      totalExpense: transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
      totalForecastedIncome: forecasts.filter(f => f.type === 'income').reduce((acc, f) => acc + f.amount, 0),
      totalForecastedExpense: forecasts.filter(f => f.type === 'expense').reduce((acc, f) => acc + f.amount, 0),
    };

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport };
