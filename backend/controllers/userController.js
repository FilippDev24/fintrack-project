const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, hashPassword, comparePasswords } = require('../utils/authUtils');
const { handleError } = require('../utils/errorUtils');

exports.register = async (req, res) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ user, token });
    } catch (error) {
        handleError(res, error);
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !await comparePasswords(req.body.password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// Добавление новых функций
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        handleError(res, error);
    }
};

exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !await comparePasswords(req.body.password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        handleError(res, error);
    }
};
