import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPageComponents/LoginPage/LoginPage';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute'; // Updated import path
import './App.css';
import './animations.css';
import './assessment-animations.css';
import './detailed-reports.css';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import DetailedReports from './pages/DetailedReports';
import NotFound from './pages/NotFound';
import UserSettings from './pages/UserSettings';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Container } from 'react-bootstrap';
import HomeRedirect from './components/common/HomeRedirect';

function App() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      <Container className="flex-grow-1 py-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute element={<Dashboard />} />
          } />
          <Route path="/assessment/:id?" element={
            <ProtectedRoute element={<Assessment />} />
          } />
          <Route path="/results/:id" element={
            <ProtectedRoute element={<Results />} />
          } />
          <Route path="/results" element={
            <ProtectedRoute element={<DetailedReports />} />
          } />
          <Route path="/settings" element={
            <ProtectedRoute element={<UserSettings />} />
          } />
          <Route path="/settings/subscription" element={
            <ProtectedRoute element={<UserSettings />} />
          } />
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}
export default App;
