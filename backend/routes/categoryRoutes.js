const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth'); // Подключение middleware auth

router.get('/', auth, categoryController.getAllCategories); // Получение всех категорий
router.post('/', auth, categoryController.createCategory); // Создание новой категории
router.get('/:id', auth, categoryController.getCategoryById); // Получение категории по ID
router.put('/:id', auth, categoryController.updateCategory); // Обновление категории
router.delete('/:id', auth, categoryController.deleteCategory); // Удаление категории

module.exports = router;
