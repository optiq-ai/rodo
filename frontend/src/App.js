import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import NotFound from './pages/NotFound';
import UserSettings from './pages/UserSettings';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import './new-theme.css';
import './animations.css';
import './assessment-animations.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container d-flex flex-column min-vh-100">
        <Header />
        <Container className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/assessment/:id?" element={
              <PrivateRoute>
                <Assessment />
              </PrivateRoute>
            } />
            <Route path="/results/:id" element={
              <PrivateRoute>
                <Results />
              </PrivateRoute>
            } />
            <Route path="/settings/*" element={
              <PrivateRoute>
                <UserSettings />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
