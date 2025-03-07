
const Course = require('../models/Course');
const Student = require('../models/Student');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create course (admin only)
exports.createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Course with that course code already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update course (admin only)
exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete course (admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add student to course
exports.addStudentToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.student.isAdmin ? req.body.studentId : req.student.id;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if student is already in the course
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }
    
    // Add student to course
    course.students.push(studentId);
    await course.save();
    
    res.status(200).json({ message: 'Student added to course successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove student from course
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.student.isAdmin ? req.body.studentId : req.student.id;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if student is in the course
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student not enrolled in this course' });
    }
    
    // Remove student from course
    course.students = course.students.filter(id => id.toString() !== studentId);
    await course.save();
    
    res.status(200).json({ message: 'Student removed from course successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students in a course
exports.getStudentsInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('students', '-password');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course.students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses for a student
exports.getCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.student.isAdmin && req.params.studentId ? req.params.studentId : req.student.id;
    const courses = await Course.find({ students: studentId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
