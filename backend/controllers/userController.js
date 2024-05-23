const User = require('../models/User');
const { generateToken, hashPassword, comparePasswords } = require('../utils/authUtils');
const { handleError } = require('../utils/errorUtils');

exports.loginUser = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).select('+password');
      if (!user || !await comparePasswords(req.body.password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = generateToken(user);
      res.status(200).json({ user: { ...user._doc, password: undefined }, token });
    } catch (error) {
      handleError(res, error);
    }
  };  

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

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

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
