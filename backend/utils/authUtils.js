const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.generateToken = (user) => {
    return jwt.sign({ user: { id: user._id, role: user.role } }, secret, { expiresIn: '1h' });
};   

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

exports.comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
