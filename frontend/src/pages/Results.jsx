import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [summary, setSummary] = useState({
    positiveAreas: 0,
    warningAreas: 0,
    negativeAreas: 0,
    inProgressAreas: 0,
    notApplicableAreas: 0,
    totalAreas: 0,
    positiveRequirements: 0,
    negativeRequirements: 0,
    inProgressRequirements: 0,
    notApplicableRequirements: 0,
    totalRequirements: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError('Nie znaleziono identyfikatora oceny');
          return;
        }
        
        // W rzeczywistości będzie to wywołanie do backendu
        // const response = await assessmentService.getAssessment(id);
        
        // Tymczasowe dane dla szkieletu
        const mockChapters = [
          {
            id: 1,
            name: 'I. Organizacja systemu ochrony DO',
            description: 'Planowanie i organizacja systemu ochrony danych osobowych',
            areas: [
              {
                id: 1,
                name: 'I.1 Polityka w zakresie ochrony DO',
                description: 'Polityka i procedury przetwarzania danych osobowych',
                score: 'POZYTYWNA',
                comment: '',
                requirements: [
                  {
                    id: 1,
                    text: 'Czy opracowano i wdrożono politykę ochrony danych osobowych?',
                    value: 'TAK',
                    comment: ''
                  },
                  {
                    id: 2,
                    text: 'Czy polityka ochrony danych osobowych jest aktualna i zgodna z RODO?',
                    value: 'TAK',
                    comment: ''
                  },
                  {
                    id: 3,
                    text: 'Czy pracownicy zostali zapoznani z polityką ochrony danych osobowych?',
                    value: 'TAK',
                    comment: ''
                  }
                ]
              },
              {
                id: 2,
                name: 'I.2 Wyznaczenie ADO',
                description: 'Wyznaczenie Administratora Danych Osobowych',
                score: 'ZASTRZEŻENIA',
                comment: 'Należy zaktualizować dokumentację',
                requirements: [
                  {
                    id: 4,
                    text: 'Czy w jednostce nastąpiło powierzenie zadań ADO wyznaczonym podmiotom?',
                    value: 'TAK',
                    comment: ''
                  },
                  {
                    id: 5,
                    text: 'Czy zakres zadań ADO został jasno określony?',
                    value: 'NIE',
                    comment: 'Brak formalnego dokumentu określającego zakres zadań'
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            name: 'II. Prawo do przetwarzania DO',
            description: 'Zapewnienie poprawności procesów przetwarzania danych osobowych',
            areas: [
              {
                id: 3,
                name: 'II.1 Podstawy prawne przetwarzania DO',
                description: 'Podstawy prawne przetwarzania danych osobowych',
                score: 'W REALIZACJI',
                comment: 'Trwa weryfikacja podstaw prawnych',
                requirements: [
                  {
                    id: 6,
                    text: 'Czy zidentyfikowano podstawy prawne przetwarzania danych osobowych?',
                    value: 'W REALIZACJI',
                    comment: 'Trwa proces identyfikacji'
                  }
                ]
              }
            ]
          }
        ];
        
        const mockAssessment = {
          id: id,
          name: 'Ocena RODO - Dział IT',
          description: 'Ocena zgodności z RODO dla działu IT',
          status: 'W TRAKCIE',
          createdAt: '2025-04-15',
          updatedAt: '2025-04-17',
          chapters: mockChapters
        };
        
        setAssessment(mockAssessment);
        
        // Obliczanie podsumowania
        let positiveAreas = 0;
        let warningAreas = 0;
        let negativeAreas = 0;
        let inProgressAreas = 0;
        let notApplicableAreas = 0;
        let totalAreas = 0;
        
        let positiveRequirements = 0;
        let negativeRequirements = 0;
        let inProgressRequirements = 0;
        let notApplicableRequirements = 0;
        let totalRequirements = 0;
        
        mockChapters.forEach(chapter => {
          chapter.areas.forEach(area => {
            totalAreas++;
            
            switch(area.score) {
              case 'POZYTYWNA':
                positiveAreas++;
                break;
              case 'ZASTRZEŻENIA':
                warningAreas++;
                break;
              case 'NEGATYWNA':
                negativeAreas++;
                break;
              case 'W REALIZACJI':
                inProgressAreas++;
                break;
              case 'NIE DOTYCZY':
                notApplicableAreas++;
                break;
              default:
                break;
            }
            
            area.requirements.forEach(req => {
              totalRequirements++;
              
              switch(req.value) {
                case 'TAK':
                  positiveRequirements++;
                  break;
                case 'NIE':
                  negativeRequirements++;
                  break;
                case 'W REALIZACJI':
                  inProgressRequirements++;
                  break;
                case 'ND':
                  notApplicableRequirements++;
                  break;
                default:
                  break;
              }
            });
          });
        });
        
        setSummary({
          positiveAreas,
          warningAreas,
          negativeAreas,
          inProgressAreas,
          notApplicableAreas,
          totalAreas,
          positiveRequirements,
          negativeRequirements,
          inProgressRequirements,
          notApplicableRequirements,
          totalRequirements
        });
        
      } catch (err) {
        setError('Nie udało się pobrać wyników oceny');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getScoreClass = (score) => {
    switch(score) {
      case 'POZYTYWNA':
        return 'score-positive';
      case 'ZASTRZEŻENIA':
        return 'score-warning';
      case 'NEGATYWNA':
        return 'score-negative';
      case 'W REALIZACJI':
        return 'score-neutral';
      case 'NIE DOTYCZY':
        return 'score-neutral';
      default:
        return '';
    }
  };

  const getValueClass = (value) => {
    switch(value) {
      case 'TAK':
        return 'score-positive';
      case 'NIE':
        return 'score-negative';
      case 'W REALIZACJI':
        return 'score-neutral';
      case 'ND':
        return 'score-neutral';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center">
          <p>Ładowanie wyników oceny...</p>
        </div>
      </Container>
    );
  }

  if (error || !assessment) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          {error || 'Nie znaleziono oceny'}
        </Alert>
        <Button as={Link} to="/dashboard" variant="primary">
          Powrót do dashboardu
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>Wyniki oceny RODO</h1>
          <p className="lead">{assessment.name}</p>
          <p>{assessment.description}</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Podsumowanie oceny</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Informacje ogólne</h6>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <th>Status oceny</th>
                        <td>{assessment.status}</td>
                      </tr>
                      <tr>
                        <th>Data utworzenia</th>
                        <td>{assessment.createdAt}</td>
                      </tr>
                      <tr>
                        <th>Ostatnia aktualizacja</th>
                        <td>{assessment.updatedAt}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h6>Statystyki oceny</h6>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <th>Liczba rozdziałów</th>
                        <td>{assessment.chapters.length}</td>
                      </tr>
                      <tr>
                        <th>Liczba obszarów</th>
                        <td>{summary.totalAreas}</td>
                      </tr>
                      <tr>
                        <th>Liczba wymogów</th>
                        <td>{summary.totalRequirements}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col md={6}>
                  <h6>Ocena obszarów</h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Ocena pozytywna</span>
                      <span className="score-positive">{summary.positiveAreas} ({Math.round(summary.positiveAreas / summary.totalAreas * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${summary.positiveAreas / summary.totalAreas * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Zastrzeżenia</span>
                      <span className="score-warning">{summary.warningAreas} ({Math.round(summary.warningAreas / summary.totalAreas * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-warning" 
                        role="progressbar" 
                        style={{ width: `${summary.warningAreas / summary.totalAreas * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Ocena negatywna</span>
                      <span className="score-negative">{summary.negativeAreas} ({Math.round(summary.negativeAreas / summary.totalAreas * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-danger" 
                        role="progressbar" 
                        style={{ width: `${summary.negativeAreas / summary.totalAreas * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>W realizacji</span>
                      <span>{summary.inProgressAreas} ({Math.round(summary.inProgressAreas / summary.totalAreas * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-info" 
                        role="progressbar" 
                        style={{ width: `${summary.inProgressAreas / summary.totalAreas * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Ocena wymogów</h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>TAK</span>
                      <span className="score-positive">{summary.positiveRequirements} ({Math.round(summary.positiveRequirements / summary.totalRequirements * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${summary.positiveRequirements / summary.totalRequirements * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>NIE</span>
                      <span className="score-negative">{summary.negativeRequirements} ({Math.round(summary.negativeRequirements / summary.totalRequirements * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-danger" 
                        role="progressbar" 
                        style={{ width: `${summary.negativeRequirements / summary.totalRequirements * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>W REALIZACJI</span>
                      <span>{summary.inProgressRequirements} ({Math.round(summary.inProgressRequirements / summary.totalRequirements * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-info" 
                        role="progressbar" 
                        style={{ width: `${summary.inProgressRequirements / summary.totalRequirements * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>NIE DOTYCZY</span>
                      <span>{summary.notApplicableRequirements} ({Math.round(summary.notApplicableRequirements / summary.totalRequirements * 100)}%)</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-secondary" 
                        role="progressbar" 
                        style={{ width: `${summary.notApplicableRequirements / summary.totalRequirements * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="results-container">
            <Card.Header>
              <h5 className="mb-0">Szczegółowe wyniki oceny</h5>
            </Card.Header>
            <Card.Body>
              {assessment.chapters.map((chapter) => (
                <div key={chapter.id} className="mb-4">
                  <h3 className="chapter-title">{chapter.name}</h3>
                  <p>{chapter.description}</p>
                  
                  {chapter.areas.map((area) => (
                    <div key={area.id} className="area-section mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="area-title">{area.name}</h4>
                        <span className={`badge ${getScoreClass(area.score)}`}>
                          {area.score || 'BRAK OCENY'}
                        </span>
                      </div>
                      <p>{area.description}</p>
                      {area.comment && (
                        <div className="alert alert-info">
                          <strong>Komentarz:</strong> {area.comment}
                        </div>
                      )}
                      
                      <Table bordered hover responsive className="mt-3">
                        <thead>
                          <tr>
                            <th>Wymóg</th>
                            <th width="100">Ocena</th>
                            <th>Komentarz</th>
                          </tr>
                        </thead>
                        <tbody>
                          {area.requirements.map((req) => (
                            <tr key={req.id}>
                              <td>{req.text}</td>
                              <td className={getValueClass(req.value)}>
                                {req.value || 'BRAK'}
                              </td>
                              <td>{req.comment || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ))}
                </div>
              ))}
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  Powrót do dashboardu
                </Button>
                <Button variant="primary" onClick={() => navigate(`/assessment/${id}`)}>
                  Edytuj ocenę
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Results;
