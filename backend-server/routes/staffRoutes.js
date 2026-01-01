const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const staffController = require('../controllers/staffController');

// --- FIX: Added 'isAdmin' to the imports ---
const { verifyToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- Validation Rules ---
const validateStaff = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role_id').notEmpty().withMessage('Role is required').isInt(),
  
  body('first_name').notEmpty().withMessage('First Name is required'),
  body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('joining_date').isISO8601().withMessage('Date must be YYYY-MM-DD')
];

const validateUpdate = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('role_id').notEmpty().withMessage('Role is required').isInt(),
  
  // Password is OPTIONAL here
  body('password')
    .optional({ checkFalsy: true }) 
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('first_name').notEmpty().withMessage('First Name is required'),
  body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('joining_date').isISO8601().withMessage('Date must be YYYY-MM-DD')
];

// --- ROUTES ---

// 1. Create Staff (Admins & Super Admins)
router.post(
  '/', 
  verifyToken, 
  isAdmin, // <--- This now works because we imported it
  upload.single('profile_image'), 
  validateStaff, 
  staffController.createStaff
);

// 2. Get All Staff (Admins & Super Admins)
router.get('/', verifyToken, isAdmin, staffController.getAllStaff);

// 3. Update Staff (Admins & Super Admins)
router.put(
  '/:id', 
  verifyToken, 
  isAdmin, 
  upload.single('profile_image'), 
  validateUpdate,
  staffController.updateStaff
);

// 4. Delete Staff (Super Admin Only)
router.delete('/:id', verifyToken, isSuperAdmin, staffController.deleteStaff);

module.exports = router;