const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

function tokenFor(user) {
  const payload = { sub: user._id, username: user.username, email: user.email };
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign(payload, secret, { expiresIn: '12h' });
}

// POST /api/v1/user/signup  (201)
async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: errors.array()[0].msg });
    }

    const { username, email, password } = req.body;

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(409).json({ status: false, message: 'Username or email already exists.' });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: 'User created successfully.',
      user_id: user._id.toString()
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/user/login  (200)  email OR username + password
async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // For invalid creds, assignment wants this shape
      return res.status(400).json({ status: false, message: errors.array()[0].msg });
    }

    const { email, username, password } = req.body;

    let user = null;
    if (email) user = await User.findOne({ email });
    if (!user && username) user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid Username and password' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ status: false, message: 'Invalid Username and password' });
    }

    const jwt_token = tokenFor(user);

    return res.status(200).json({
      message: 'Login successful.',
      jwt_token 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
