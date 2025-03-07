
import React, { useContext, useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { studentAPI } from '../../services/api';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await studentAPI.getMyCourses();
        setCourses(response.data);
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
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Student Dashboard</h2>
      <Alert variant="info">
        Welcome back, {user.firstName}! You are enrolled in {courses.length} courses.
      </Alert>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <h3>{courses.length}</h3>
              <p>Enrolled Courses</p>
              <Link to="/student/courses">
                <Button variant="primary">View My Courses</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Row>
            <Col md={4}>
              <Card className="h-100">
                <Card.Body className="text-center">
                  <h5>Add Course</h5>
                  <p>Enroll in a new course for the current semester</p>
                  <Link to="/student/add-course">
                    <Button variant="outline-success">Add Course</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100">
                <Card.Body className="text-center">
                  <h5>Update Course</h5>
                  <p>Change course section or other details</p>
                  <Link to="/student/update-course">
                    <Button variant="outline-warning">Update Course</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100">
                <Card.Body className="text-center">
                  <h5>Drop Course</h5>
                  <p>Drop a course you're currently enrolled in</p>
                  <Link to="/student/drop-course">
                    <Button variant="outline-danger">Drop Course</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Card>
        <Card.Header as="h5">Recent Enrolled Courses</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {courses.length === 0 ? (
            <Alert variant="info">
              You are not enrolled in any courses. <Link to="/student/add-course">Add a course</Link> to get started.
            </Alert>
          ) : (
            <Row>
              {courses.slice(0, 3).map(course => (
                <Col md={4} key={course.id}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>{course.code}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{course.name}</Card.Subtitle>
                      <Card.Text>
                        Section: {course.section}<br />
                        Semester: {course.semester}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          {courses.length > 3 && (
            <div className="text-center mt-3">
              <Link to="/student/courses">
                <Button variant="outline-primary">View All Courses</Button>
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentDashboard;
