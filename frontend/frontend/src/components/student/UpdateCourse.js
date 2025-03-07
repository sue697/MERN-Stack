
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { studentAPI } from '../../services/api';

const UpdateCourse = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [availableSections, setAvailableSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await studentAPI.getCourses();
        setMyCourses(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSection('');
    
    if (!courseId) {
      setAvailableSections([]);
      return;
    }
    
    try {
      // Fetch available sections for the selected course
      const response = await studentAPI.getAvailableCourses();
      const courseSections = response.data
        .filter(course => course.courseCode === myCourses.find(c => c._id === courseId).courseCode)
        .map(course => ({
          _id: course._id,
          section: course.section
        }));
      
      setAvailableSections(courseSections);
    } catch (err) {
      console.error('Error fetching course sections:', err);
      setError('Failed to load available sections. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse || !selectedSection) {
      setError('Please select a course and a section');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await studentAPI.updateCourse(selectedCourse, { newCourseId: selectedSection });
      setSuccess('Course section updated successfully!');
      setSelectedCourse('');
      setSelectedSection('');
      
      // Refresh course list
      const response = await studentAPI.getCourses();
      setMyCourses(response.data);
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err.response?.data?.message || 'Failed to update course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading your courses...</div>;
  }

  return (
    <div>
      <h2>Update Course</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {myCourses.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text>You are not enrolled in any courses to update.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Select Course to Update</Form.Label>
            <Form.Select
              value={selectedCourse}
              onChange={(e) => handleCourseSelect(e.target.value)}
              required
            >
              <option value="">Choose a course...</option>
              {myCourses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseCode} - {course.courseName} (Current Section: {course.section})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          {selectedCourse && (
            <Form.Group className="mb-3">
              <Form.Label>Select New Section</Form.Label>
              <Form.Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                required
                disabled={availableSections.length === 0}
              >
                <option value="">Choose a section...</option>
                {availableSections.map(section => (
                  <option key={section._id} value={section._id}>
                    Section {section.section}
                  </option>
                ))}
              </Form.Select>
              {availableSections.length === 0 && selectedCourse && (
                <Form.Text className="text-muted">
                  No other sections available for this course.
                </Form.Text>
              )}
            </Form.Group>
          )}
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={submitting || !selectedCourse || !selectedSection}
          >
            {submitting ? 'Updating...' : 'Update Course'}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default UpdateCourse;
