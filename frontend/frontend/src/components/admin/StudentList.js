
import React, { useState, useEffect } from 'react';
import { Table, Alert, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await adminAPI.getAllStudents();
        setStudents(response.data);
        setFilteredStudents(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search term
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = students.filter(student => 
        student.studentNumber.toLowerCase().includes(term) ||
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.program.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  if (loading) {
    return <div className="text-center">Loading students...</div>;
  }

  return (
    <div>
      <h2>All Students</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <InputGroup className="mb-3 mt-3">
        <Form.Control
          placeholder="Search by name, email, student number, or program"
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
      
      {filteredStudents.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text>
              {searchTerm ? 'No students match your search criteria.' : 'No students are registered in the system.'}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Program</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student._id}>
                <td>{student.studentNumber}</td>
                <td>{student.firstName} {student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.program}</td>
                <td>{student.city}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <div className="mt-3">
        <p>Total Students: {students.length}</p>
        {searchTerm && (
          <p>Filtered Results: {filteredStudents.length}</p>
        )}
      </div>
    </div>
  );
};

export default StudentList;
