
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { JWT_SECRET } = require('../config/config');

// Login controller
exports.login = async (req, res) => {
  const { studentNumber, password } = req.body;

  try {
    // Find student by student number
    const student = await Student.findOne({ studentNumber });
    
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: student._id, 
        studentNumber: student.studentNumber,
        isAdmin: student.isAdmin 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict'
    });

    // Send student data (excluding password)
    const studentData = {
      _id: student._id,
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      isAdmin: student.isAdmin
    };

    res.status(200).json({ student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout controller
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
