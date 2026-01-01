const db = require('../config/db');

// 1. Create a New Role
exports.createRole = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Role name is required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO roles (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({ message: 'Role created successfully', roleId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Role already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Get All Roles
exports.getAllRoles = async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};