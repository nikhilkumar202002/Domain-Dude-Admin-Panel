const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // <--- 1. Import UUID

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ... (Keep your existing user fetch logic here) ...
    const query = `
      SELECT users.*, roles.name as role_name 
      FROM users 
      JOIN roles ON users.role_id = roles.id 
      WHERE users.email = ?
    `;
    const [users] = await db.query(query, [email]);

    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = users[0];

    // ... (Keep your existing password check here) ...
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // --- NEW TOKEN GENERATION LOGIC ---
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role_name,
        jti: uuidv4() // <--- 2. Adds a unique random ID to every token
      }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token, // This string is now mathematically unique every time
      user: { id: user.id, username: user.username, role: user.role_name }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};