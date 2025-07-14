import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import AthletesList from './pages/AthletesList';
import CoachDetails from './pages/CoachDetails';
import NewsUpdates from './pages/NewsUpdates';
import SchoolRanking from './pages/SchoolRanking';
import FieldPerformance from './pages/FieldPerformance';
import TrackPerformance from './pages/TrackPerformance';
import PerformanceDetails from './pages/PerformanceDetails';
import Login from './components/login/Login';
import ForgotPassword from './components/login/ForgotPassword';
import CreateAdmin from './pages/CreateAdmin';

import Layout from './components/layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

//  Protected route wrapper with optional role check
const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem('role');

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireRole && role !== requireRole) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Super Admin Only */}
          <Route
            path="/admin/create"
            element={
              <ProtectedRoute requireRole="superadmin">
                <Layout>
                  <CreateAdmin />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/athletes"
            element={
              <ProtectedRoute>
                <Layout>
                  <AthletesList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance-details"
            element={
              <ProtectedRoute>
                <Layout>
                  <PerformanceDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-performance"
            element={
              <ProtectedRoute>
                <Layout>
                  <TrackPerformance />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/field-performance"
            element={
              <ProtectedRoute>
                <Layout>
                  <FieldPerformance />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-ranking"
            element={
              <ProtectedRoute>
                <Layout>
                  <SchoolRanking />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewsUpdates />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coaches"
            element={
              <ProtectedRoute>
                <Layout>
                  <CoachDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateAdmin />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
