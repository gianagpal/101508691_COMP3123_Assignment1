const express = require('express');
const { body, param, query } = require('express-validator');
const {
  listEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply optional protection to all employee endpoints
router.use(requireAuth);

// GET /api/v1/emp/employees (200)
router.get('/employees', listEmployees);

// POST /api/v1/emp/employees (201)
router.post(
  '/employees',
  [
    body('first_name').trim().notEmpty().withMessage('first_name is required'),
    body('last_name').trim().notEmpty().withMessage('last_name is required'),
    body('email').trim().isEmail().withMessage('valid email is required'),
    body('position').trim().notEmpty().withMessage('position is required'),
    body('salary').isNumeric().withMessage('salary must be a number'),
    body('date_of_joining').isISO8601().withMessage('date_of_joining must be a valid date'),
    body('department').trim().notEmpty().withMessage('department is required')
  ],
  createEmployee
);

// GET /api/v1/emp/employees/:eid (200)
router.get(
  '/employees/:eid',
  [param('eid').isMongoId().withMessage('invalid employee id')],
  getEmployee
);

// PUT /api/v1/emp/employees/:eid (200)
router.put(
  '/employees/:eid',
  [
    param('eid').isMongoId().withMessage('invalid employee id'),
    body('email').optional().isEmail().withMessage('invalid email'),
    body('salary').optional().isNumeric().withMessage('salary must be a number'),
    body('date_of_joining').optional().isISO8601().withMessage('invalid date')
  ],
  updateEmployee
);

// DELETE /api/v1/emp/employees?eid=xxx (204)
router.delete(
  '/employees',
  [query('eid').isMongoId().withMessage('invalid employee id')],
  deleteEmployee
);

module.exports = router;
