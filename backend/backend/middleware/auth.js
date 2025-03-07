
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.student.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
