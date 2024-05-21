const express = require('express');
const router = express.Router();
const { getBalance, updateBalance } = require('../controllers/balanceController');
const auth = require('../middleware/auth');

router.get('/', auth, getBalance);
router.post('/', auth, updateBalance);

module.exports = router;
