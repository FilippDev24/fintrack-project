const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
};

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

exports.comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
