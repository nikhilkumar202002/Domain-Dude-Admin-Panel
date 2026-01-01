const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Route: GET /api/roles (Anyone logged in can see roles)
router.get('/', verifyToken, roleController.getAllRoles);

// Route: POST /api/roles (Only ADMINS can create roles)
router.post('/', verifyToken, isAdmin, roleController.createRole);

module.exports = router;