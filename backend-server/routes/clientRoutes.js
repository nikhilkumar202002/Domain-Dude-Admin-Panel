const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

// 1. POST: Create Client (Accepts 'client_image' AND 'logo_color')
router.post(
  '/', 
  verifyToken, 
  isAdmin, 
  // CHANGE: Use .fields() to allow multiple specific files
  upload.fields([
    { name: 'client_image', maxCount: 1 }, 
    { name: 'logo_color', maxCount: 1 }
  ]), 
  clientController.createClient
);

router.get('/', verifyToken, isAdmin, clientController.getAllClients);
router.delete('/:id', verifyToken, isAdmin, clientController.deleteClient);

module.exports = router;