const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const path = require('path');
const multer = require('multer');

// --- Multer Config (Same as before) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.array('project_images', 10), projectController.createProject);
router.get('/', projectController.getAllProjects);

module.exports = router;