// models/Balance.js
const mongoose = require('mongoose');

const BalanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Balance', BalanceSchema);
