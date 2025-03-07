
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/', studentController.createStudent); // For student registration

// Protected routes
router.get('/', authenticate, adminOnly, studentController.getAllStudents);
router.get('/:id', authenticate, studentController.getStudentById);
router.put('/:id', authenticate, studentController.updateStudent);
router.delete('/:id', authenticate, adminOnly, studentController.deleteStudent);

module.exports = router;
