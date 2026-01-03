const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// 1. Create New Client
exports.createClient = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Client name is required' });
  }

  // Handle Multiple Images
  // Note: req.files is used here because we are uploading multiple files
  let clientImagePath = null;
  let logoColorPath = null;

  if (req.files) {
    // Check if 'client_image' was uploaded
    if (req.files.client_image) {
      clientImagePath = 'uploads/' + req.files.client_image[0].filename;
    }
    // Check if 'logo_color' was uploaded
    if (req.files.logo_color) {
      logoColorPath = 'uploads/' + req.files.logo_color[0].filename;
    }
  }

  try {
    // Updated Query to include logo_color_url
    const [result] = await db.query(
      'INSERT INTO clients (name, client_image, logo_color_url) VALUES (?, ?, ?)',
      [name, clientImagePath, logoColorPath]
    );

    res.status(201).json({ 
      message: 'Client added successfully', 
      clientId: result.insertId,
      clientImage: clientImagePath,
      logoColor: logoColorPath
    });

  } catch (error) {
    console.error(error); // Helpful for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Get All Clients
exports.getAllClients = async (req, res) => {
  try {
    const [clients] = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. Delete Client
exports.deleteClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    // A. Get Image Paths first (Select BOTH columns)
    const [client] = await db.query('SELECT client_image, logo_color_url FROM clients WHERE id = ?', [clientId]);
    
    if (client.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const imagePath = client[0].client_image;
    const colorLogoPath = client[0].logo_color_url;

    // B. Helper function to delete file safely
    const deleteFile = (filePath) => {
      if (filePath) {
        const absolutePath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      }
    };

    // Delete both files
    deleteFile(imagePath);
    deleteFile(colorLogoPath);

    // C. Delete from Database
    await db.query('DELETE FROM clients WHERE id = ?', [clientId]);

    res.json({ message: 'Client deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};