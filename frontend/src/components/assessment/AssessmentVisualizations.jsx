import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { assessmentAPI } from '../services/api';

// Rejestracja komponentów Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AssessmentVisualizations = ({ assessmentId }) => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!assessmentId) return;
      
      try {
        setLoading(true);
        const data = await assessmentAPI.getById(assessmentId);
        setAssessmentData(data);
        setError(null);
      } catch (err) {
        console.error('Błąd podczas pobierania danych oceny:', err);
        setError('Nie udało się pobrać danych oceny. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [assessmentId]);

  // Jeśli trwa ładowanie, wyświetl komunikat
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </div>
        <p className="mt-3">Ładowanie wizualizacji oceny...</p>
      </div>
    );
  }

  // Jeśli wystąpił błąd, wyświetl komunikat
  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  // Jeśli nie ma danych, wyświetl komunikat
  if (!assessmentData) {
    return (
      <div className="alert alert-info">
        Brak danych do wyświetlenia. Wybierz ocenę, aby zobaczyć wizualizacje.
      </div>
    );
  }

  // Przygotowanie danych dla wykresu kołowego
  const doughnutData = {
    labels: ['Pozytywne', 'Zastrzeżenia', 'Negatywne'],
    datasets: [
      {
        data: [
          assessmentData.positiveAreas || 0,
          assessmentData.warningAreas || 0,
          assessmentData.negativeAreas || 0
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)'
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Przygotowanie danych dla wykresu słupkowego
  const barData = {
    labels: assessmentData.chapters?.map(chapter => chapter.name) || [],
    datasets: [
      {
        label: 'Poziom zgodności (%)',
        data: assessmentData.chapters?.map(chapter => {
          // Obliczanie średniego poziomu zgodności dla rozdziału
          if (!chapter.areas || chapter.areas.length === 0) return 0;
          
          const totalScore = chapter.areas.reduce((sum, area) => {
            // Konwersja statusu na wartość liczbową
            let score = 0;
            if (area.score === 'POZYTYWNA') score = 100;
            else if (area.score === 'ZASTRZEŻENIA') score = 50;
            else if (area.score === 'NEGATYWNA') score = 0;
            
            return sum + score;
          }, 0);
          
          return Math.round(totalScore / chapter.areas.length);
        }) || [],
        backgroundColor: 'rgba(63, 81, 181, 0.7)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opcje dla wykresów
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Poziom zgodności w rozdziałach',
        font: {
          size: 14
        }
      }
    }
  };

  // Obliczanie ogólnego poziomu zgodności
  const totalAreas = (assessmentData.positiveAreas || 0) + 
                     (assessmentData.warningAreas || 0) + 
                     (assessmentData.negativeAreas || 0);
  
  const compliancePercentage = totalAreas > 0 
    ? Math.round(((assessmentData.positiveAreas || 0) + (assessmentData.warningAreas || 0) * 0.5) / totalAreas * 100) 
    : 0;

  return (
    <Row>
      <Col md={6} className="mb-4">
        <Card className="h-100">
          <Card.Header>
            <h5 className="mb-0">Podsumowanie obszarów</h5>
          </Card.Header>
          <Card.Body>
            <div style={{ height: '250px' }} className="d-flex justify-content-center">
              <Doughnut data={doughnutData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  title: {
                    display: true,
                    text: 'Rozkład ocen obszarów',
                    font: {
                      size: 14
                    }
                  }
                }
              }} />
            </div>
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <Badge bg="success" className="me-1">Pozytywne</Badge>
                  <span>{assessmentData.positiveAreas || 0}</span>
                </div>
                <div>
                  <Badge bg="warning" className="me-1">Zastrzeżenia</Badge>
                  <span>{assessmentData.warningAreas || 0}</span>
                </div>
                <div>
                  <Badge bg="danger" className="me-1">Negatywne</Badge>
                  <span>{assessmentData.negativeAreas || 0}</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Ogólny poziom zgodności:</span>
                  <span className="fw-bold">{compliancePercentage}%</span>
                </div>
                <ProgressBar>
                  <ProgressBar variant="success" now={(assessmentData.positiveAreas || 0) / totalAreas * 100} key={1} />
                  <ProgressBar variant="warning" now={(assessmentData.warningAreas || 0) / totalAreas * 100} key={2} />
                  <ProgressBar variant="danger" now={(assessmentData.negativeAreas || 0) / totalAreas * 100} key={3} />
                </ProgressBar>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} className="mb-4">
        <Card className="h-100">
          <Card.Header>
            <h5 className="mb-0">Zgodność w rozdziałach</h5>
          </Card.Header>
          <Card.Body>
            <div style={{ height: '250px' }}>
              <Bar data={barData} options={chartOptions} />
            </div>
            <div className="mt-3">
              <h6>Najwyższy poziom zgodności:</h6>
              {assessmentData.chapters && assessmentData.chapters.length > 0 ? (
                <ul className="list-unstyled">
                  {assessmentData.chapters
                    .map(chapter => {
                      // Obliczanie średniego poziomu zgodności dla rozdziału
                      if (!chapter.areas || chapter.areas.length === 0) return { name: chapter.name, score: 0 };
                      
                      const totalScore = chapter.areas.reduce((sum, area) => {
                        // Konwersja statusu na wartość liczbową
                        let score = 0;
                        if (area.score === 'POZYTYWNA') score = 100;
                        else if (area.score === 'ZASTRZEŻENIA') score = 50;
                        else if (area.score === 'NEGATYWNA') score = 0;
                        
                        return sum + score;
                      }, 0);
                      
                      return { name: chapter.name, score: Math.round(totalScore / chapter.areas.length) };
                    })
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((chapter, index) => (
                      <li key={index} className="mb-1">
                        <div className="d-flex justify-content-between">
                          <span>{chapter.name}</span>
                          <span className="fw-bold">{chapter.score}%</span>
                        </div>
                        <ProgressBar 
                          now={chapter.score} 
                          variant={
                            chapter.score >= 75 ? 'success' : 
                            chapter.score >= 50 ? 'warning' : 'danger'
                          }
                          style={{ height: '8px' }}
                        />
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <p className="text-muted">Brak danych o rozdziałach</p>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AssessmentVisualizations;
