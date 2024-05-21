// backend/controllers/categoryController.js
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const Forecast = require('../models/Forecast');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  const category = new Category({
    name,
    description,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Проверка на системную категорию
    if (category.isSystem) {
      return res.status(400).json({ message: 'System categories cannot be deleted' });
    }

    const defaultTransactionCategory = await Category.findOne({ defaultFor: 'transaction' });
    const defaultForecastCategory = await Category.findOne({ defaultFor: 'forecast' });

    // Устанавливаем категорию как "Без категории" для всех связанных транзакций и прогнозов
    await Transaction.updateMany({ category: id }, { $set: { category: defaultTransactionCategory._id } });
    await Forecast.updateMany({ category: id }, { $set: { category: defaultForecastCategory._id } });

    await category.remove();
    res.json({ message: 'Category deleted and related transactions/forecasts updated to "Без категории"' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
