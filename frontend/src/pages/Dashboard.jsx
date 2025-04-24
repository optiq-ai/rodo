import React, { useState, useEffect } from 'react';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import CompactDashboard from '../components/dashboard/CompactDashboard';
import { assessmentAPI } from '../services/api';

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
        // Pobieranie ocen z API
        const assessmentData = await assessmentAPI.getAll();
        
        // Pobieranie podsumowania ocen z API
        const summaryData = await assessmentAPI.getSummary();
        
        // Mapowanie danych z API do formatu oczekiwanego przez komponent
        const mappedAssessments = assessmentData.map(assessment => ({
          id: assessment.id,
          name: assessment.name,
          createdAt: assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'Brak daty',
          status: assessment.status || 'W TRAKCIE',
          progress: assessment.progress || calculateProgress(assessment),
          positiveAreas: assessment.positiveAreas || summaryData.positiveAreas || 0,
          warningAreas: assessment.warningAreas || summaryData.warningAreas || 0,
          negativeAreas: assessment.negativeAreas || summaryData.negativeAreas || 0
        }));
        
        setAssessments(mappedAssessments);
      } catch (error) {
        console.error('Błąd podczas pobierania ocen:', error);
        showToastMessage('Błąd podczas pobierania ocen', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Funkcja pomocnicza do obliczania procentu ukończenia oceny
  const calculateProgress = (assessment) => {
    if (!assessment || !assessment.chapters) return 0;
    
    let totalRequirements = 0;
    let completedRequirements = 0;
    
    assessment.chapters.forEach(chapter => {
      if (chapter.areas) {
        chapter.areas.forEach(area => {
          if (area.requirements) {
            totalRequirements += area.requirements.length;
            area.requirements.forEach(req => {
              if (req.status && req.status !== 'NOT_STARTED') {
                completedRequirements++;
              }
            });
          }
        });
      }
    });
    
    return totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0;
  };

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      // Wywołanie API do usunięcia oceny
      await assessmentAPI.delete(assessmentId);
      
      // Aktualizacja lokalnego stanu po usunięciu
      const updatedAssessments = assessments.filter(assessment => assessment.id !== assessmentId);
      setAssessments(updatedAssessments);
      
      showToastMessage('Ocena została pomyślnie usunięta', 'success');
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
