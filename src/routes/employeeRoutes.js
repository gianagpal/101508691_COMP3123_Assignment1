const express = require('express');
const { body, param, query } = require('express-validator');
const {
  listEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} = require('../controllers/employeeController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// protect all employee routes
router.use(requireAuth);

// 1. LIST all employees
router.get('/employees', listEmployees);

// 2. 🔍 SEARCH must be BEFORE :eid
router.get(
  '/employees/search',
  [
    query('department').optional().trim(),
    query('position').optional().trim()
  ],
  searchEmployees
);

// 3. CREATE
router.post(
  '/employees',
  upload.single('profile_picture'),
  [
    body('first_name').notEmpty().withMessage('first_name is required'),
    body('last_name').notEmpty().withMessage('last_name is required'),
    body('email').isEmail().withMessage('valid email is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('salary').isNumeric().withMessage('salary must be a number'),
    body('date_of_joining').isISO8601().withMessage('invalid date'),
    body('department').notEmpty().withMessage('department is required')
  ],
  createEmployee
);

// 4. GET by id – AFTER search
router.get('/employees/:eid', getEmployee);

// 5. UPDATE
router.put(
  '/employees/:eid',
  upload.single('profile_picture'),
  [
    param('eid').isMongoId().withMessage('invalid employee id'),
    body('email').optional().isEmail().withMessage('invalid email'),
    body('salary').optional().isNumeric().withMessage('salary must be a number'),
    body('date_of_joining').optional().isISO8601().withMessage('invalid date')
  ],
  updateEmployee
);

// 6. DELETE
router.delete('/employees', deleteEmployee);

module.exports = router;
