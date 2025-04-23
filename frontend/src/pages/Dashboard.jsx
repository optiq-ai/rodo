import React, { useState, useEffect } from 'react';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import CompactDashboard from '../components/dashboard/CompactDashboard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    // Pobieranie danych z API
    const fetchAssessments = async () => {
      try {
        const response = await fetch('http://localhost:8080/assessments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const assessmentsData = await response.json();
          setAssessments(assessmentsData);
        } else {
          console.error('Błąd podczas pobierania ocen:', response.statusText);
          showToastMessage('Błąd podczas pobierania ocen', 'danger');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania ocen:', error);
        showToastMessage('Błąd podczas pobierania ocen', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      const response = await fetch(`http://localhost:8080/assessments/${assessmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Usunięcie z lokalnego stanu po pomyślnym usunięciu z backendu
        const updatedAssessments = assessments.filter(assessment => assessment.id !== assessmentId);
        setAssessments(updatedAssessments);
        showToastMessage('Ocena została pomyślnie usunięta', 'success');
      } else {
        const errorData = await response.json();
        console.error('Błąd podczas usuwania oceny:', errorData);
        showToastMessage(errorData.message || 'Błąd podczas usuwania oceny', 'danger');
      }
    } catch (error) {
      console.error('Błąd podczas usuwania oceny:', error);
      showToastMessage('Błąd podczas usuwania oceny', 'danger');
    }
  };

  const showToastMessage = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  return (
    <Container className="my-3 fade-in">
      <h4 className="mb-3">Dashboard</h4>
      <p className="small mb-3">Witaj, <strong>{currentUser?.username}</strong>! Poniżej znajdziesz podsumowanie ocen RODO.</p>
      
      <CompactDashboard 
        assessments={assessments}
        loading={loading}
        onDeleteAssessment={handleDeleteAssessment}
      />

      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide
          bg={toastVariant}
          className="fade-in"
        >
          <Toast.Header>
            <strong className="me-auto">Powiadomienie</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'danger' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Dashboard;
