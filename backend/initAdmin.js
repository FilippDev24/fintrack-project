// backend/initAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = 'dev@dev.ru';
  const password = '1234';
  const name = 'Admin';

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Admin user already exists');
      return;
    }

    user = new User({ name, email, password, role: 'admin' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    console.log('Admin user created successfully');
  } catch (err) {
    console.error(err.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
