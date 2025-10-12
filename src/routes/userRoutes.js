const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/userController');

const router = express.Router();

// POST /api/v1/user/signup (201)
router.post(
  '/signup',
  [
    body('username').trim().notEmpty().withMessage('username is required'),
    body('email').trim().isEmail().withMessage('valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('password must be at least 6 chars')
  ],
  signup
);

// POST /api/v1/user/login (200) - email OR username + password
router.post(
  '/login',
  [
    body('password').notEmpty().withMessage('password is required'),
    body().custom((value) => {
      const hasEmail = typeof value.email === 'string' && value.email.length > 0;
      const hasUsername = typeof value.username === 'string' && value.username.length > 0;
      if (!hasEmail && !hasUsername) {
        throw new Error('email or username is required');
      }
      return true;
    }),
    body('email').optional().isEmail().withMessage('invalid email')
  ],
  login
);

module.exports = router;
