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
import NotFound from './pages/NotFound';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';
import './animations.css';
import './assessment-animations.css';

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
