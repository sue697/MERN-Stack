
import React, { useState, useEffect } from 'react';
import { Table, Alert, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const CourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseStudents = async () => {
      try {
        // Get course details and students in this course
        const [courseResponse, studentsResponse] = await Promise.all([
          adminAPI.getAllCourses(),
          adminAPI.getCourseStudents(courseId)
        ]);
        
        const courseDetails = courseResponse.data.find(c => c._id === courseId);
        
        if (!courseDetails) {
          setError('Course not found');
        } else {
          setCourse(courseDetails);
          setStudents(studentsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching course students:', err);
        setError('Failed to load students for this course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseStudents();
    } else {
      setError('Invalid course ID');
      setLoading(false);
    }
  }, [courseId]);

  if (loading) {
    return <div className="text-center">Loading course details...</div>;
  }

  if (error || !course) {
    return (
      <div>
        <Alert variant="danger">{error || 'Course not found'}</Alert>
        <Button variant="primary" onClick={() => navigate('/admin/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Students in Course</h2>
        <Button variant="secondary" onClick={() => navigate('/admin/courses')}>
          Back to Courses
        </Button>
      </div>
      
      <Card className="mt-3 mb-4">
        <Card.Body>
          <h4>{course.courseCode}: {course.courseName}</h4>
          <p className="mb-1">Section: {course.section}</p>
          <p className="mb-0">Semester: {course.semester}</p>
        </Card.Body>
      </Card>
      
      {students.length === 0 ? (
        <Card>
          <Card.Body>
            <Card.Text>No students are enrolled in this course.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <>
          <p>Total Enrolled: {students.length} students</p>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Program</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.studentNumber}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.program}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default CourseStudents;
