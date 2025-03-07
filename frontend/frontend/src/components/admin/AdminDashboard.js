
import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsResponse, coursesResponse] = await Promise.all([
          adminAPI.getAllStudents(),
          adminAPI.getAllCourses()
        ]);
        
        setStudentCount(studentsResponse.data.length);
        setCourseCount(coursesResponse.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p className="lead">Welcome, {user?.firstName} {user?.lastName}</p>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <Card.Text>
                {loading ? 'Loading...' : `${studentCount} students registered in the system.`}
              </Card.Text>
              <Link to="/admin/students" className="btn btn-primary">View Students</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Courses</Card.Title>
              <Card.Text>
                {loading ? 'Loading...' : `${courseCount} courses available in the system.`}
              </Card.Text>
              <Link to="/admin/courses" className="btn btn-info">View Courses</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Add Student</Card.Title>
              <Card.Text>
                Register a new student in the system.
              </Card.Text>
              <Link to="/admin/add-student" className="btn btn-success">Add Student</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
