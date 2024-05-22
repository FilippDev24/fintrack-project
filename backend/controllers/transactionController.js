const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  const { date, amount, category, description, type } = req.body;

  try {
    const transactionDate = new Date(date);
    const currentDate = new Date();
    transactionDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (transactionDate > currentDate) {
      return res.status(400).json({ message: 'Date cannot be in the future.' });
    }

    const transaction = new Transaction({
      date: transactionDate,
      amount,
      category,
      description: description || '',
      type,
    });

    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { date, amount, category, description, type } = req.body;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    const transactionDate = new Date(date);
    const currentDate = new Date();
    if (transactionDate > currentDate) {
      return res.status(400).json({ message: 'Date cannot be in the future.' });
    }

    transaction.date = date || transaction.date;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.type = type || transaction.type;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    await transaction.remove();
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
