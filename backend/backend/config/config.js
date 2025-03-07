
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/student_course_system',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  PORT: process.env.PORT || 8080
};
