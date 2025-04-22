import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import CompactDashboard from '../components/dashboard/CompactDashboard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Symulacja pobierania danych z API
    const fetchAssessments = async () => {
      try {
        // W rzeczywistości będzie to wywołanie do backendu
        // const response = await assessmentService.getAssessments();
        
        // Tymczasowe dane dla szkieletu
        const mockAssessments = [
          {
            id: 1,
            name: 'Ocena RODO - Dział IT',
            createdAt: '2025-04-15',
            status: 'W TRAKCIE',
            progress: 45,
            positiveAreas: 12,
            warningAreas: 8,
            negativeAreas: 3
          },
          {
            id: 2,
            name: 'Ocena RODO - Dział HR',
            createdAt: '2025-04-10',
            status: 'ZAKOŃCZONA',
            progress: 100,
            positiveAreas: 30,
            warningAreas: 15,
            negativeAreas: 4
          },
          {
            id: 3,
            name: 'Ocena RODO - Dział Marketingu',
            createdAt: '2025-04-05',
            status: 'W TRAKCIE',
            progress: 75,
            positiveAreas: 20,
            warningAreas: 10,
            negativeAreas: 2
          }
        ];
        
        setAssessments(mockAssessments);
      } catch (error) {
        console.error('Błąd podczas pobierania ocen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  return (
    <Container className="my-3 fade-in">
      <h4 className="mb-3">Dashboard</h4>
      <p className="small mb-3">Witaj, <strong>{currentUser?.username}</strong>! Poniżej znajdziesz podsumowanie ocen RODO.</p>
      
      <CompactDashboard 
        assessments={assessments}
        loading={loading}
      />
    </Container>
  );
};

export default Dashboard;
