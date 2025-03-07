
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
