const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public Route
router.post('/login', authController.login);

// Protected Route Example (Only logged in users)
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome User ${req.user.id}, your role is ${req.user.role}` });
});

// Admin Only Route Example
router.get('/admin-dashboard', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin! You have full access.' });
});

router.post('/logout', authController.logout);

module.exports = router;