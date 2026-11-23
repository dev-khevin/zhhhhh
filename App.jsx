import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { getStudent, getToken } from './api/client';
import { getAdminDepartment, getAdminToken } from './api/admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Ballot from './pages/Ballot';
import Done from './pages/Done';
import Results from './pages/Results';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import VoterList from './pages/admin/VoterList';
import Candidates from './pages/admin/Candidates';
import ChangeLog from './pages/admin/ChangeLog';
import PrivacyNotice from './pages/PrivacyNotice';
import PostedList from './pages/PostedList';
import ResultsReport from './pages/admin/ResultsReport';
import DepartmentVoteSelector from './components/DepartmentVoteSelector';

function DepartmentTheme({ department, children }) {
  return (
    <div data-department={department || 'LEGACY'}>
      {children}
    </div>
  );
}

function ProtectedRoute({ children }) {
  return getToken() ? (
    <DepartmentTheme department={getStudent()?.departmentId}>
      {children}
    </DepartmentTheme>
  ) : (
    <Navigate to="/login" replace />
  );
}

function AdminRoute({ children, showDepartmentLogout = true }) {
  return getAdminToken() ? (
    <DepartmentTheme department={getAdminDepartment()}>
      <DepartmentVoteSelector showLogout={showDepartmentLogout} />
      {children}
    </DepartmentTheme>
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

function ResultsRoute() {
  if (getAdminToken()) {
    return (
      <DepartmentTheme department={getAdminDepartment()}>
        <DepartmentVoteSelector />
        <Results />
      </DepartmentTheme>
    );
  }
  if (getToken()) {
    return (
      <DepartmentTheme department={getStudent()?.departmentId}>
        <Results />
      </DepartmentTheme>
    );
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posted-list" element={<PostedList />} />
        <Route
          path="/privacy"
          element={
            <main className="auth-page student-auth-page">
              <div className="student-auth-layout single">
                <section className="auth-card student-auth-card privacy-card">
                  <div className="public-page-brand">
                    <span className="public-page-brand-mark" aria-hidden="true">
                      <svg viewBox="0 0 44 44" role="presentation">
                        <path d="M8 20h28v17H8zM13 20v-7h18v7M16 30l4 4 8-9" />
                      </svg>
                    </span>
                    <strong>VOTOPIA</strong>
                  </div>
                  <PrivacyNotice />
                  <Link
                    className="auth-button-link"
                    to="/login"
                  >
                    Back to login
                  </Link>
                </section>
              </div>
            </main>
          }
        />
        <Route path="/done" element={<Done />} />
        <Route path="/results" element={<ResultsRoute />} />
        <Route
          path="/ballot"
          element={
            <ProtectedRoute>
              <Ballot />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute showDepartmentLogout={false}>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/voter-list"
          element={
            <AdminRoute>
              <VoterList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <AdminRoute>
              <Candidates />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/change-log"
          element={
            <AdminRoute>
              <ChangeLog />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/results-report"
          element={
            <AdminRoute>
              <ResultsReport />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}