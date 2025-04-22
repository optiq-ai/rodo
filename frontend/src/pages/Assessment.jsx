import React from 'react';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faChartBar, faClipboardCheck, faHistory, faFileAlt, faPlus, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import RiskScoringSystem from '../components/assessment/RiskScoringSystem';
import AssessmentVisualizations from '../components/assessment/AssessmentVisualizations';
import RemedialActionsSection from '../components/assessment/RemedialActionsSection';
import ChangeHistoryFeature from '../components/assessment/ChangeHistoryFeature';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Assessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewAssessment = id === 'new' || !id;
  
  // Stan dla danych oceny
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Pobieranie danych oceny
  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        
        // Symulacja pobierania danych z API
        // W rzeczywistości będzie to wywołanie do backendu
        // const response = await assessmentService.getAssessment(id);
        
        // Tymczasowe dane dla szkieletu
        if (isNewAssessment) {
          // Nowa ocena
          const mockNewAssessment = {
            id: 'new',
            name: 'Nowa ocena RODO',
            createdAt: new Date().toISOString(),
            status: 'W TRAKCIE',
            progress: 0,
            // Pozostałe dane będą inicjalizowane przez komponenty
          };
          
          setAssessmentData(mockNewAssessment);
        } else {
          // Istniejąca ocena
          const mockAssessment = {
            id: id || '1',
            name: 'Ocena RODO - Dział IT',
            createdAt: '2025-04-15',
            status: 'W TRAKCIE',
            progress: 45,
            // Dane dla komponentów są inicjalizowane wewnątrz nich
          };
          
          setAssessmentData(mockAssessment);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Błąd podczas pobierania danych oceny:', error);
        setError('Nie udało się pobrać danych oceny. Spróbuj ponownie później.');
        setLoading(false);
      }
    };
    
    fetchAssessmentData();
  }, [id, isNewAssessment]);
  
  // Obsługa zmiany oceny ryzyka
  const handleRiskScoreChange = (riskData) => {
    if (!assessmentData) return;
    
    setAssessmentData(prev => ({
      ...prev,
      riskData: riskData
    }));
  };
  
  // Obsługa zmiany statusu działań naprawczych
  const handleActionStatusChange = (actions) => {
    if (!assessmentData) return;
    
    setAssessmentData(prev => ({
      ...prev,
      remedialActions: actions
    }));
  };
  
  // Obsługa wyboru historii
  const handleHistorySelect = (version) => {
    console.log('Wybrano wersję historyczną:', version);
    // W pełnej implementacji tutaj byłoby ładowanie danych historycznych
  };
  
  // Zapisywanie oceny
  const handleSaveAssessment = async () => {
    try {
      // Symulacja zapisywania do API
      // W rzeczywistości będzie to wywołanie do backendu
      // await assessmentService.saveAssessment(assessmentData);
      
      console.log('Zapisywanie oceny:', assessmentData);
      
      // Symulacja opóźnienia
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Jeśli to nowa ocena, przekieruj do edycji z nowym ID
      if (isNewAssessment) {
        const newId = Math.floor(Math.random() * 1000) + 10; // Symulacja generowania ID
        navigate(`/assessment/${newId}`, { replace: true });
      }
      
      setSaveSuccess(true);
      
      // Ukryj komunikat o sukcesie po 3 sekundach
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Błąd podczas zapisywania oceny:', error);
      setError('Nie udało się zapisać oceny. Spróbuj ponownie później.');
    }
  };

  return (
    <Container className="main-container">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="app-title">
              {isNewAssessment ? 'Nowa ocena RODO' : assessmentData?.name || 'Ocena RODO'}
            </h1>
            <div>
              <Button 
                variant="primary" 
                onClick={handleSaveAssessment}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                Zapisz ocenę
              </Button>
            </div>
          </div>
          
          {saveSuccess && (
            <Alert variant="success" className="mt-3 fade-in">
              Ocena została pomyślnie zapisana!
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" className="mt-3 fade-in">
              {error}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center p-5">
              <p>Ładowanie danych oceny...</p>
            </div>
          ) : (
            <>
              <div className="assessment-info mb-4">
                <Row>
                  <Col md={6}>
                    <Card className="widget-card">
                      <Card.Body>
                        <h5 className="mb-3">Informacje o ocenie</h5>
                        <p><strong>Identyfikator:</strong> {isNewAssessment ? 'Nowa ocena' : assessmentData?.id}</p>
                        <p><strong>Data utworzenia:</strong> {new Date(assessmentData?.createdAt).toLocaleDateString()}</p>
                        <p>
                          <strong>Status:</strong> 
                          <span className={`badge bg-${assessmentData?.status === 'ZAKOŃCZONA' ? 'success' : 'warning'} ms-2`}>
                            {assessmentData?.status}
                          </span>
                        </p>
                        <p><strong>Postęp:</strong> {assessmentData?.progress}%</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="widget-card">
                      <Card.Body>
                        <h5 className="mb-3">Szybkie akcje</h5>
                        <div className="d-flex flex-column gap-2">
                          <Button variant="outline-primary" size="sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Dodaj działanie naprawcze
                          </Button>
                          <Button variant="outline-primary" size="sm">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                            Eksportuj raport
                          </Button>
                          <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('history')}>
                            <FontAwesomeIcon icon={faHistory} className="me-2" />
                            Pokaż historię zmian
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
              
              <Card className="mb-4">
                <Card.Header>
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="border-bottom-0"
                  >
                    <Tab 
                      eventKey="overview" 
                      title={
                        <span>
                          <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                          Przegląd
                        </span>
                      }
                    />
                    <Tab 
                      eventKey="risk" 
                      title={
                        <span>
                          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                          Ocena ryzyka
                        </span>
                      }
                    />
                    <Tab 
                      eventKey="remedial" 
                      title={
                        <span>
                          <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
                          Działania naprawcze
                        </span>
                      }
                    />
                    <Tab 
                      eventKey="history" 
                      title={
                        <span>
                          <FontAwesomeIcon icon={faHistory} className="me-2" />
                          Historia zmian
                        </span>
                      }
                    />
                  </Tabs>
                </Card.Header>
                <Card.Body>
                  {/* Przegląd */}
                  {activeTab === 'overview' && (
                    <div>
                      <h4 className="mb-4">Przegląd oceny RODO</h4>
                      <AssessmentVisualizations 
                        assessmentData={assessmentData} 
                      />
                    </div>
                  )}
                  
                  {/* Ocena ryzyka */}
                  {activeTab === 'risk' && (
                    <div>
                      <h4 className="mb-4">Ocena ryzyka</h4>
                      <RiskScoringSystem 
                        assessmentData={assessmentData} 
                        onRiskScoreChange={handleRiskScoreChange} 
                      />
                    </div>
                  )}
                  
                  {/* Działania naprawcze */}
                  {activeTab === 'remedial' && (
                    <div>
                      <h4 className="mb-4">Działania naprawcze</h4>
                      <RemedialActionsSection 
                        assessmentData={assessmentData} 
                        onActionStatusChange={handleActionStatusChange} 
                      />
                    </div>
                  )}
                  
                  {/* Historia zmian */}
                  {activeTab === 'history' && (
                    <div>
                      <h4 className="mb-4">Historia zmian</h4>
                      <ChangeHistoryFeature 
                        assessmentData={assessmentData} 
                        onHistorySelect={handleHistorySelect} 
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Assessment;
