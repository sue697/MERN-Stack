
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AddCourse from './components/student/AddCourse';
import UpdateCourse from './components/student/UpdateCourse';
import DropCourse from './components/student/DropCourse';
import CourseList from './components/student/CourseList';
import AddStudent from './components/admin/AddStudent';
import StudentList from './components/admin/StudentList';
import AllCourses from './components/admin/AllCourses';
import CourseStudents from './components/admin/CourseStudents';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Private route component to handle authentication
const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = React.useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navigation />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
            <Route path="/student/add-course" element={<PrivateRoute role="student"><AddCourse /></PrivateRoute>} />
            <Route path="/student/update-course" element={<PrivateRoute role="student"><UpdateCourse /></PrivateRoute>} />
            <Route path="/student/drop-course" element={<PrivateRoute role="student"><DropCourse /></PrivateRoute>} />
            <Route path="/student/courses" element={<PrivateRoute role="student"><CourseList /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/add-student" element={<PrivateRoute role="admin"><AddStudent /></PrivateRoute>} />
            <Route path="/admin/students" element={<PrivateRoute role="admin"><StudentList /></PrivateRoute>} />
            <Route path="/admin/courses" element={<PrivateRoute role="admin"><AllCourses /></PrivateRoute>} />
            <Route path="/admin/course-students/:courseId" element={<PrivateRoute role="admin"><CourseStudents /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
