const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const initDb = require('./initDb'); // Подключаем initDb

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected');
  await initDb();
}).catch(err => {
  console.log(err);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
