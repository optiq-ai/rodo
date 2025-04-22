import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import DetailedReports from './pages/DetailedReports';
import NotFound from './pages/NotFound';
import UserSettings from './pages/UserSettings';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';
import './animations.css';
import './assessment-animations.css';
import './detailed-reports.css';

function App() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      <Container className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<Login />} />
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
          <Route path="/results" element={
            <PrivateRoute>
              <DetailedReports />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <UserSettings />
            </PrivateRoute>
          } />
          <Route path="/settings/subscription" element={
            <PrivateRoute>
              <UserSettings />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
