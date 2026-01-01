const jwt = require('jsonwebtoken');

// 1. Verify Token (Authentication)
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided. Access denied.' });
  }

  // Handle "Bearer <token>" format safely
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id: 1, role: 'super_admin' }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// 2. Helper for Role Checking (Authorization)
// This checks if the user's role is inside the list of allowed roles
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Requires one of: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};

// 3. Export Hierarchical Permissions

// Level 1: Super Admin (Highest)
exports.isSuperAdmin = checkRole(['super_admin']);
exports.isAdmin = checkRole(['super_admin', 'admin']);
exports.isManager = checkRole(['super_admin', 'admin', 'manager']);
exports.isLead = checkRole(['super_admin', 'admin', 'manager', 'team_lead']);
exports.isStaff = checkRole(['super_admin', 'admin', 'manager', 'team_lead', 'staff']);