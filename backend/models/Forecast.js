// backend/models/Forecast.js
const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['income', 'expense'], required: true },
  status: { type: String, enum: ['pending', 'accepted', 'deleted'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Forecast', ForecastSchema);
