import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AgyaChatbot from './components/chat/AgyaChatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import { Privacy, Terms } from './pages/Privacy';

// Route Guard
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gov-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/farmer/dashboard'} replace />;
  }

  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected Dashboards */}
                  <Route
                    path="/farmer/dashboard"
                    element={
                      <ProtectedRoute requiredRole="FARMER">
                        <FarmerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Informational Pages */}
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Floating 24x7 Agya AI Assistant */}
              <AgyaChatbot />

              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
