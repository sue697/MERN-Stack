
import axios from 'axios';

// Create an instance of axios with default config
export const api = axios.create({
  baseURL: '/api', // This would be your actual API URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock responses for demonstration
// In a real application, these would be actual API calls

// Student API endpoints
export const studentAPI = {
  // Get courses for the current student
  getMyCourses: () => {
    return Promise.resolve({
      data: [
        { id: '1', code: 'CS101', name: 'Introduction to Programming', section: 'A', semester: 'Fall 2023' },
        { id: '2', code: 'CS201', name: 'Data Structures', section: 'B', semester: 'Fall 2023' },
        { id: '3', code: 'MATH101', name: 'Calculus I', section: 'C', semester: 'Fall 2023' },
      ]
    });
  },
  
  // Get available courses for enrollment
  getAvailableCourses: () => {
    return Promise.resolve({
      data: [
        { id: '4', code: 'CS301', name: 'Algorithms', section: 'A', semester: 'Winter 2023' },
        { id: '5', code: 'CS401', name: 'Operating Systems', section: 'B', semester: 'Winter 2023' },
        { id: '6', code: 'MATH201', name: 'Calculus II', section: 'C', semester: 'Winter 2023' },
      ]
    });
  },
  
  // Add a course
  addCourse: (courseId) => {
    return Promise.resolve({ 
      data: { success: true, message: "Course added successfully" } 
    });
  },
  
  // Update a course section
  updateCourse: (courseId, newSection) => {
    return Promise.resolve({ 
      data: { success: true, message: "Course updated successfully" } 
    });
  },
  
  // Drop a course
  dropCourse: (courseId) => {
    return Promise.resolve({ 
      data: { success: true, message: "Course dropped successfully" } 
    });
  }
};

// Admin API endpoints
export const adminAPI = {
  // Get all students
  getAllStudents: () => {
    return Promise.resolve({
      data: [
        { id: '1', studentNumber: 'S12345', firstName: 'John', lastName: 'Doe', email: 'john@example.com', program: 'Computer Science', address: '123 Main St', city: 'Toronto', phone: '555-123-4567' },
        { id: '2', studentNumber: 'S23456', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', program: 'Mathematics', address: '456 Oak Ave', city: 'Vancouver', phone: '555-234-5678' },
        { id: '3', studentNumber: 'S34567', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', program: 'Engineering', address: '789 Pine Rd', city: 'Montreal', phone: '555-345-6789' },
      ]
    });
  },
  
  // Get all courses
  getAllCourses: () => {
    return Promise.resolve({
      data: [
        { id: '1', code: 'CS101', name: 'Introduction to Programming', section: 'A', semester: 'Fall 2023', studentCount: 25 },
        { id: '2', code: 'CS201', name: 'Data Structures', section: 'B', semester: 'Fall 2023', studentCount: 18 },
        { id: '3', code: 'MATH101', name: 'Calculus I', section: 'C', semester: 'Fall 2023', studentCount: 30 },
        { id: '4', code: 'CS301', name: 'Algorithms', section: 'A', semester: 'Winter 2023', studentCount: 15 },
      ]
    });
  },
  
  // Get students in a specific course
  getCourseStudents: (courseId) => {
    return Promise.resolve({
      data: {
        course: { id: courseId, code: 'CS101', name: 'Introduction to Programming' },
        students: [
          { id: '1', studentNumber: 'S12345', firstName: 'John', lastName: 'Doe', email: 'john@example.com', program: 'Computer Science' },
          { id: '2', studentNumber: 'S23456', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', program: 'Mathematics' },
        ]
      }
    });
  },
  
  // Add a new student
  addStudent: (studentData) => {
    return Promise.resolve({ 
      data: { success: true, message: "Student added successfully" } 
    });
  }
};

// Auth API endpoints
export const authAPI = {
  login: (credentials) => {
    // Mock authentication
    if (credentials.username === 'student' && credentials.password === 'password') {
      return Promise.resolve({ 
        data: { 
          token: 'mock-jwt-token', 
          user: { 
            id: '1', 
            studentNumber: 'S12345', 
            firstName: 'John', 
            lastName: 'Doe',
            role: 'student' 
          } 
        }
      });
    } else if (credentials.username === 'admin' && credentials.password === 'admin123') {
      return Promise.resolve({ 
        data: { 
          token: 'mock-jwt-token-admin', 
          user: { 
            id: 'admin1', 
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin' 
          } 
        }
      });
    } else {
      return Promise.reject({ 
        response: { data: { message: 'Invalid credentials' } } 
      });
    }
  }
};
