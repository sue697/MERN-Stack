
import React, { useState, useEffect } from 'react';
import { Table, Alert, Card } from 'react-bootstrap';
import { studentAPI } from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await studentAPI.getCourses();
        setCourses(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center">Loading courses...</div>;
  }

  return (
    <div>
      <h2>My Courses</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {courses.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text>You are not enrolled in any courses yet.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Section</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.section}</td>
                <td>{course.semester}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CourseList;
