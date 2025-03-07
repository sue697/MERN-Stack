
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Course = require('../models/Course');
const connectDB = require('../utils/db');

// Sample data
const students = [
  {
    studentNumber: 'S001',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'Toronto',
    phoneNumber: '123-456-7890',
    email: 'john.doe@example.com',
    program: 'Computer Science',
    favoriteTopic: 'Web Development',
    technicalSkill: 'JavaScript',
    isAdmin: true
  },
  {
    studentNumber: 'S002',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    address: '456 Elm St',
    city: 'Vancouver',
    phoneNumber: '987-654-3210',
    email: 'jane.smith@example.com',
    program: 'Software Engineering',
    favoriteTopic: 'Data Structures',
    technicalSkill: 'Python',
    isAdmin: false
  }
];

const courses = [
  {
    courseCode: 'CS101',
    courseName: 'Introduction to Programming',
    section: 'A',
    semester: 'Fall 2023'
  },
  {
    courseCode: 'CS201',
    courseName: 'Data Structures and Algorithms',
    section: 'B',
    semester: 'Winter 2024'
  },
  {
    courseCode: 'CS301',
    courseName: 'Web Development',
    section: 'C',
    semester: 'Spring 2024'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Student.deleteMany();
    await Course.deleteMany();
    
    // Insert students
    const createdStudents = await Student.create(students);
    console.log(`${createdStudents.length} students created`);
    
    // Insert courses
    const createdCourses = await Course.create(courses);
    console.log(`${createdCourses.length} courses created`);
    
    // Add students to courses
    const course1 = createdCourses[0];
    const course2 = createdCourses[1];
    
    course1.students = [createdStudents[0]._id, createdStudents[1]._id];
    course2.students = [createdStudents[0]._id];
    
    await course1.save();
    await course2.save();
    
    console.log('Students added to courses');
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
