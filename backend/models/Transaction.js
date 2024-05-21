// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
