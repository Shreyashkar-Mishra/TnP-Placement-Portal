import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { PostJob } from './pages/PostJob';
import { JobApplicants } from './pages/JobApplicants';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { AdminCompanyRegister } from './pages/AdminCompanyRegister';
import { AdminApprovals } from './pages/AdminApprovals';
import { StudentProfile } from './pages/StudentProfile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Student]} />}>
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/applications" element={<Dashboard />} />
              <Route path="/profile" element={<StudentProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Admin]} />}>
              <Route path="/admin/post-job" element={<PostJob />} />
              <Route path="/admin/jobs" element={<Dashboard />} />
              <Route path="/admin/job/:id/applicants" element={<JobApplicants />} />
              <Route path="/admin/companies" element={<AdminCompanyRegister />} />
              <Route path="/admin/approvals" element={<AdminApprovals />} />
            </Route>

            {/* Company Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Company]} />}>
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/jobs/:id/applicants" element={<JobApplicants />} />
            </Route>

            {/* Shared Authenticated Route (Dashboard handles role diff inside) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;