import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faFilter, faSortAmountDown, faChartBar, faClipboardCheck, faHistory, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Filtrowanie ocen
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Informacje o subskrypcji
  const subscriptionInfo = {
    plan: 'Darmowy',
    assessmentsLimit: 1,
    assessmentsUsed: assessments.length,
    expiryDate: 'Bezterminowo'
  };

  return (
    <Container className="main-container">
      <Row className="mb-4">
        <Col>
          <h1 className="app-title">Dashboard</h1>
          <p className="section-subtitle">
            Witaj, <strong>{currentUser?.username}</strong>! Poniżej znajdziesz podsumowanie ocen RODO i dostępne narzędzia.
          </p>
        </Col>
      </Row>

      {/* Wyeksponowany przycisk "Nowa ocena" */}
      <Row className="mb-4">
        <Col className="text-center">
          <Link to="/assessment/new">
            <Button variant="primary" size="lg" className="px-5 py-3 shadow">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Nowa ocena RODO
            </Button>
          </Link>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <div className="filter-bar">
            <span>Filtruj oceny:</span>
            <button 
              className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Wszystkie
            </button>
            <button 
              className={`filter-button ${filterStatus === 'W TRAKCIE' ? 'active' : ''}`}
              onClick={() => setFilterStatus('W TRAKCIE')}
            >
              W trakcie
            </button>
            <button 
              className={`filter-button ${filterStatus === 'ZAKOŃCZONA' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ZAKOŃCZONA')}
            >
              Zakończone
            </button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Wyszukaj oceny..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Ostatnie oceny RODO */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Ostatnie oceny RODO</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p className="text-center">Ładowanie ocen...</p>
              ) : filteredAssessments.length > 0 ? (
                <div>
                  {filteredAssessments.map(assessment => (
                    <div key={assessment.id} className="mb-3 p-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{assessment.name}</h6>
                          <p className="text-muted small mb-1">
                            Utworzono: {new Date(assessment.createdAt).toLocaleDateString()}
                          </p>
                          <div>
                            <Badge 
                              bg={assessment.status === 'ZAKOŃCZONA' ? 'success' : 'warning'}
                              className="me-2"
                            >
                              {assessment.status}
                            </Badge>
                            <Badge bg="info">
                              Postęp: {assessment.progress}%
                            </Badge>
                          </div>
                        </div>
                        <Link to={`/assessment/${assessment.id}`}>
                          <Button variant="outline-primary" size="sm">
                            Szczegóły
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p>Brak ocen spełniających kryteria wyszukiwania.</p>
                  <Link to="/assessment/new">
                    <Button variant="primary">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Nowa ocena
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Informacje o subskrypcji */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Informacje o subskrypcji</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between mb-3">
                  <span>Plan:</span>
                  <Badge bg="primary">{subscriptionInfo.plan}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Limit ocen:</span>
                  <span>{subscriptionInfo.assessmentsUsed} / {subscriptionInfo.assessmentsLimit}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Ważność:</span>
                  <span>{subscriptionInfo.expiryDate}</span>
                </div>
                <div className="text-center mt-2">
                  <Link to="/settings/subscription">
                    <Button variant="outline-primary" size="sm">
                      Zmień plan
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Szybkie akcje */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Szybkie akcje</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-2">
                <Link to="/assessment/new">
                  <Button variant="primary" className="w-100">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nowa ocena RODO
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline-primary" className="w-100">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                    Ustawienia bezpieczeństwa
                  </Button>
                </Link>
                <Link to="/settings/company">
                  <Button variant="outline-primary" className="w-100">
                    <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
                    Dane firmy
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
