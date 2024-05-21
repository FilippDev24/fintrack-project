const Balance = require('../models/Balance');

exports.getBalance = async (req, res) => {
  try {
    const balance = await Balance.find().sort({ date: -1 }).limit(1);
    res.json(balance);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateBalance = async (req, res) => {
  const { date, amount } = req.body;
  
  try {
    let balance = await Balance.findOne({ date });

    if (balance) {
      balance.amount = amount;
    } else {
      balance = new Balance({
        date,
        amount
      });
    }

    await balance.save();
    res.json(balance);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
