
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, adminOnly } = require('../middleware/auth');

// Course CRUD routes
router.get('/', authenticate, courseController.getAllCourses);
router.get('/:id', authenticate, courseController.getCourseById);
router.post('/', authenticate, adminOnly, courseController.createCourse);
router.put('/:id', authenticate, adminOnly, courseController.updateCourse);
router.delete('/:id', authenticate, adminOnly, courseController.deleteCourse);

// Student-course relationship routes
router.post('/:courseId/students', authenticate, courseController.addStudentToCourse);
router.delete('/:courseId/students', authenticate, courseController.removeStudentFromCourse);
router.get('/:courseId/students', authenticate, courseController.getStudentsInCourse);
router.get('/student/:studentId?', authenticate, courseController.getCoursesForStudent);

module.exports = router;
