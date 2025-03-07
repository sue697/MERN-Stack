
import React, { useState, useEffect } from 'react';
import { Table, Alert, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await adminAPI.getAllCourses();
        setCourses(response.data);
        setFilteredCourses(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search term
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = courses.filter(course => 
        course.courseCode.toLowerCase().includes(term) ||
        course.courseName.toLowerCase().includes(term) ||
        course.section.toString().includes(term) ||
        course.semester.toLowerCase().includes(term)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  if (loading) {
    return <div className="text-center">Loading courses...</div>;
  }

  return (
    <div>
      <h2>All Courses</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <InputGroup className="mb-3 mt-3">
        <Form.Control
          placeholder="Search by course code, name, section, or semester"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button 
            variant="outline-secondary" 
            onClick={() => setSearchTerm('')}
          >
            Clear
          </Button>
        )}
      </InputGroup>
      
      {filteredCourses.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text>
              {searchTerm ? 'No courses match your search criteria.' : 'No courses are available in the system.'}
            </Card.Text>
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
              <th>Enrolled Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course._id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.section}</td>
                <td>{course.semester}</td>
                <td>{course.students?.length || 0}</td>
                <td>
                  <Link 
                    to={`/admin/course-students/${course._id}`} 
                    className="btn btn-sm btn-primary"
                  >
                    View Students
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <div className="mt-3">
        <p>Total Courses: {courses.length}</p>
        {searchTerm && (
          <p>Filtered Results: {filteredCourses.length}</p>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
