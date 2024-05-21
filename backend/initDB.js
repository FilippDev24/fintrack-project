// backend/initDb.js
const mongoose = require('mongoose');
const Category = require('./models/Category');

const initDb = async () => {
  const categories = [
    { name: 'Без категории (Транзакции)', description: 'Категория по умолчанию для необработанных транзакций', isSystem: true, defaultFor: 'transaction' },
    { name: 'Без категории (Прогнозы)', description: 'Категория по умолчанию для необработанных прогнозов', isSystem: true, defaultFor: 'forecast' },
  ];

  for (const cat of categories) {
    const existingCategory = await Category.findOne({ name: cat.name });
    if (!existingCategory) {
      const newCategory = new Category(cat);
      await newCategory.save();
      console.log(`Категория "${cat.name}" добавлена в базу данных`);
    }
  }
};

module.exports = initDb;
