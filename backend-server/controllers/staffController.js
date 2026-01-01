const db = require('../config/db');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const path = require('path'); 
const fs = require('fs');

exports.createStaff = async (req, res) => {
  // 1. Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    username, email, password, role_id, 
    first_name, last_name, phone, department, position, salary, joining_date 
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // A. Verify Role
    const [roles] = await connection.query('SELECT name FROM roles WHERE id = ?', [role_id]);
    if (roles.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid Role ID selected' });
    }
    const roleName = roles[0].name;

    // B. Check Email
    const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email already registered' });
    }

    // C. Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role_id]
    );
    const newUserId = userResult.insertId;

    // --- D. HANDLE IMAGE LINK ---
    // We create a relative path string: "uploads/staff-12345.png"
    // This acts as the "Link" stored in the DB
    let imageLink = null;
    if (req.file) {
      // We manually add 'uploads/' so it is ready to use in the frontend
      imageLink = 'uploads/' + req.file.filename; 
    }

    // E. Insert into Staff Table
    await connection.query(
      `INSERT INTO staff 
      (user_id, first_name, last_name, phone, department, position, salary, joining_date, profile_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUserId, first_name, last_name, phone, department, position, salary, joining_date, imageLink]
    );

    await connection.commit();
    
    // Send back the full URL for immediate verification
    const fullUrl = imageLink ? `${req.protocol}://${req.get('host')}/${imageLink}` : null;

    res.status(201).json({ 
      message: 'Staff registered successfully', 
      staffId: newUserId,
      role: roleName,
      imageUrl: fullUrl // Returns http://localhost:5000/uploads/filename.png
    });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    // We join 'staff', 'users', and 'roles' to get a complete profile
    const query = `
      SELECT 
        s.id, 
        s.first_name, 
        s.last_name, 
        s.phone, 
        s.department, 
        s.position, 
        s.joining_date, 
        s.profile_image,
        u.email, 
        u.username,
        r.name as role_name
      FROM staff s
      JOIN users u ON s.user_id = u.id
      JOIN roles r ON u.role_id = r.id
      ORDER BY s.created_at DESC
    `;

    const [staffList] = await db.query(query);
    res.json(staffList);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  const staffId = req.params.id; // The ID from the URL (e.g., /api/staff/5)
  
  // 1. Validation Check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    username, email, password, role_id, 
    first_name, last_name, phone, department, position, salary, joining_date 
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // A. Find the Staff & User ID
    // We need the user_id to update the login table, and the old image path
    const [existingStaff] = await connection.query(
      'SELECT user_id, profile_image FROM staff WHERE id = ?', 
      [staffId]
    );

    if (existingStaff.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const userId = existingStaff[0].user_id;
    const oldImagePath = existingStaff[0].profile_image;

    // B. Check Email Duplicates (Exclude current user)
    // "Find anyone having this email WHO IS NOT ME"
    const [emailCheck] = await connection.query(
      'SELECT id FROM users WHERE email = ? AND id != ?', 
      [email, userId]
    );
    if (emailCheck.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }

    // C. Prepare User Updates (Handle Optional Password)
    let userUpdateQuery = 'UPDATE users SET username = ?, email = ?, role_id = ?';
    let userParams = [username, email, role_id];

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      userUpdateQuery += ', password_hash = ?'; // Append password update
      userParams.push(hashedPassword);
    }
    
    userUpdateQuery += ' WHERE id = ?';
    userParams.push(userId);

    await connection.query(userUpdateQuery, userParams);

    // D. Handle Image Logic
    let imageLink = oldImagePath; // Default: Keep old image
    
    if (req.file) {
      // New image uploaded? Update link.
      imageLink = 'uploads/' + req.file.filename;

      // (Optional) Delete the old file to save space
      if (oldImagePath) {
        const absolutePath = path.join(__dirname, '..', oldImagePath); 
        if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
      }
    }

    // E. Update Staff Profile
    await connection.query(
      `UPDATE staff SET 
       first_name=?, last_name=?, phone=?, department=?, position=?, salary=?, joining_date=?, profile_image=?
       WHERE id=?`,
      [first_name, last_name, phone, department, position, salary, joining_date, imageLink, staffId]
    );

    await connection.commit();
    res.json({ message: 'Staff updated successfully', staffId: staffId });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};

exports.deleteStaff = async (req, res) => {
  const staffId = req.params.id;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Get User ID & Image Path (Before deleting)
    const [staff] = await connection.query(
      'SELECT user_id, profile_image FROM staff WHERE id = ?', 
      [staffId]
    );

    if (staff.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const userId = staff[0].user_id;
    const imagePath = staff[0].profile_image; // e.g., "uploads/staff-123.png"

    // 2. Delete the Image File (if it exists)
    if (imagePath) {
      // We need to resolve the full path on the hard drive
      // '..' goes up one folder from 'controllers' to root
      const absolutePath = path.join(__dirname, '..', imagePath); 
      
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath); // Deletes the file
      }
    }

    // 3. Delete the User (Database)
    // Because of 'ON DELETE CASCADE', this also deletes the staff row automatically
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);

    await connection.commit();
    res.json({ message: 'Staff member and files deleted successfully' });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};