const db = require('../config/db');

// Get all categories (for dropdowns)
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT id, name FROM project_categories ORDER BY name ASC');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    await db.query('INSERT INTO project_categories (name) VALUES (?)', [name]);
    
    res.status(201).json({ message: 'Category created successfully' });
  } catch (error) {
    // Handle duplicate names
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};