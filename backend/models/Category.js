// backend/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isSystem: {
    type: Boolean,
    default: false,
  },
  defaultFor: {
    type: String,
    enum: ['transaction', 'forecast', 'none'],
    default: 'none',
  },
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
