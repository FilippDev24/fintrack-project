// backend/models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  data: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
