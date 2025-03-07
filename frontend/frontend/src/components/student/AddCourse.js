
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { studentAPI } from '../../services/api';

const AddCourse = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await studentAPI.getAvailableCourses();
        setAvailableCourses(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching available courses:', err);
        setError('Failed to load available courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.addCourse(selectedCourse);
      setSuccess('Course added successfully!');
      setSelectedCourse('');
    } catch (err) {
      console.error('Error adding course:', err);
      setError(err.response?.data?.message || 'Failed to add course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading available courses...</div>;
  }

  return (
    <div>
      <h2>Add Course</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {availableCourses.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text>No courses are available for registration at this time.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Select Course</Form.Label>
            <Form.Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Choose a course...</option>
              {availableCourses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseCode} - {course.courseName} (Section: {course.section}, Semester: {course.semester})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={submitting || !selectedCourse}
          >
            {submitting ? 'Adding...' : 'Add Course'}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AddCourse;
