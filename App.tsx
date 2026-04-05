import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Role } from './types';
console.log('Role:', Role);
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PublicProfile from './pages/PublicProfile';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import DocumentVerification from './pages/admin/DocumentVerification';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';

// Student Pages
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentDocuments from './pages/student/Documents';
import StudentEducation from './pages/student/Education';
import StudentPlacements from './pages/student/Placements';
import StudentAnalytics from './pages/student/Analytics';

import { AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode; allowedRoles: Role[] }) => {
  const { user } = React.useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!user.isActive) {
    return <Navigate to="/login" replace />;
  }
  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    // Prevent infinite redirect loops by sending invalid users straight to login or logging them out visually
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('profilehub_session');
    if (session && session !== 'undefined') {
      try {
        const parsedSession = JSON.parse(session);
        // Ensure the session is actually valid and has a role
        if (parsedSession && parsedSession.role) {
          setUser(parsedSession);
        } else {
          localStorage.removeItem('profilehub_session');
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        localStorage.removeItem('profilehub_session');
      }
    }
    setLoading(false);

    // Listen for unauthorized events (401)
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (newUser: User) => {
    if (!newUser) {
      console.error('Attempted to login with invalid user data');
      return;
    }
    setUser(newUser);
    localStorage.setItem('profilehub_session', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('profilehub_session');
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center text-blue-800 font-bold dark:bg-slate-950 dark:text-blue-400">Loading ProfileHub...</div>;

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ user, login, logout }}>
        <HashRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/p/:username" element={<PublicProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <AdminLayout />
              </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="documents" element={<DocumentVerification />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
              <ProtectedRoute allowedRoles={[Role.STUDENT]}>
                <StudentLayout />
              </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="placements" element={<StudentPlacements />} />
            <Route path="analytics" element={<StudentAnalytics />} />
            <Route path="documents" element={<StudentDocuments />} />
            <Route path="education" element={<StudentEducation />} />
          </Route>

          <Route path="/" element={<Navigate to={user && user.role ? (user.role === Role.ADMIN ? '/admin' : '/student/dashboard') : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;