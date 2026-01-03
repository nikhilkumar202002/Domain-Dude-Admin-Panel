const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); // <--- Import path module
const fs = require('fs');

require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const staffRoutes = require('./routes/staffRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();

// --- SECURITY MIDDLEWARE ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/staff', staffRoutes); 
app.use('/api/clients', clientRoutes);

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running securely on port ${PORT}`);
});