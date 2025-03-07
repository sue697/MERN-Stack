
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Modal } from 'react-bootstrap';
import { studentAPI } from '../../services/api';

const DropCourse = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }
    
    // Show confirmation modal instead of immediately dropping
    setShowConfirmModal(true);
  };

  const confirmDrop = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    setShowConfirmModal(false);
    
    try {
      await studentAPI.dropCourse(selectedCourse);
      setSuccess('Course dropped successfully!');
      
      // Refresh course list
      const response = await studentAPI.getCourses();
      setMyCourses(response.data);
      setSelectedCourse('');
    } catch (err) {
      console.error('Error dropping course:', err);
      setError(err.response?.data?.message || 'Failed to drop course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading your courses...</div>;
  }

  const selectedCourseDetails = myCourses.find(course => course._id === selectedCourse);

  return (
    <div>
      <h2>Drop Course</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {myCourses.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text>You are not enrolled in any courses to drop.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Select Course to Drop</Form.Label>
            <Form.Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Choose a course...</option>
              {myCourses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseCode} - {course.courseName} (Section: {course.section})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Button 
            type="submit" 
            variant="danger"
            disabled={submitting || !selectedCourse}
          >
            {submitting ? 'Dropping...' : 'Drop Course'}
          </Button>
        </Form>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Course Drop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to drop this course?
          {selectedCourseDetails && (
            <p className="mt-2">
              <strong>{selectedCourseDetails.courseCode}</strong> - {selectedCourseDetails.courseName}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDrop}>
            Drop Course
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DropCourse;
