const db = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.createProject = async (req, res) => {
  const { title, start_date, end_date, website_link, description, technology } = req.body;
  
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [projectResult] = await connection.query(
      `INSERT INTO projects (title, start_date, end_date, website_link, description, technology) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, start_date, end_date, website_link, description, technology]
    );
    
    const projectId = projectResult.insertId;
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map((file, index) => {
        const isFeatured = index === 0 ? 1 : 0; 
        const imagePath = 'uploads/' + file.filename;
        return [projectId, imagePath, isFeatured];
      });
      await connection.query(
        'INSERT INTO project_images (project_id, image_path, is_featured) VALUES ?',
        [imageValues]
      );
    }
    await connection.commit();
    res.status(201).json({ message: 'Project created successfully', projectId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT('id', pi.id, 'path', pi.image_path, 'featured', pi.is_featured)
          ), 
          JSON_ARRAY()
        ) as images
      FROM projects p
      LEFT JOIN project_images pi ON p.id = pi.project_id
      GROUP BY p.id
      ORDER BY p.start_date DESC
    `;
    const [projects] = await db.query(query);
    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};