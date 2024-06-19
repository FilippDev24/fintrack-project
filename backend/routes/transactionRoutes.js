const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth'); // Подключение middleware auth

router.get('/', auth, transactionController.getTransactions); // Получение всех транзакций
router.post('/', auth, transactionController.createTransaction); // Создание новой транзакции
router.get('/:id', auth, transactionController.getTransactionById); // Получение транзакции по ID
router.put('/:id', auth, transactionController.updateTransaction); // Обновление транзакции
router.delete('/:id', auth, transactionController.deleteTransaction); // Удаление транзакции

module.exports = router;
