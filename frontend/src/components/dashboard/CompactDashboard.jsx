import React from 'react';
import { Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CompactDashboard = ({ assessments, loading }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ZAKOŃCZONA':
        return 'status-badge status-positive';
      case 'W TRAKCIE':
        return 'status-badge status-in-progress';
      default:
        return 'status-badge status-not-applicable';
    }
  };

  const totalAreas = assessments.reduce((sum, a) => sum + a.positiveAreas + a.warningAreas + a.negativeAreas, 0);
  const positivePercentage = totalAreas ? (assessments.reduce((sum, a) => sum + a.positiveAreas, 0) / totalAreas * 100).toFixed(0) : 0;
  const warningPercentage = totalAreas ? (assessments.reduce((sum, a) => sum + a.warningAreas, 0) / totalAreas * 100).toFixed(0) : 0;
  const negativePercentage = totalAreas ? (assessments.reduce((sum, a) => sum + a.negativeAreas, 0) / totalAreas * 100).toFixed(0) : 0;

  return (
    <>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <div className="text-center me-4 fade-in" style={{animationDelay: '0.1s'}}>
                <h3 className="mb-0">{assessments.length}</h3>
                <small>Wszystkie oceny</small>
              </div>
              <div className="text-center me-4 fade-in" style={{animationDelay: '0.2s'}}>
                <h3 className="mb-0">{assessments.filter(a => a.status === 'W TRAKCIE').length}</h3>
                <small>Oceny w trakcie</small>
              </div>
              <div className="text-center fade-in" style={{animationDelay: '0.3s'}}>
                <h3 className="mb-0">{assessments.filter(a => a.status === 'ZAKOŃCZONA').length}</h3>
                <small>Zakończone oceny</small>
              </div>
            </div>
            <Button as={Link} to="/assessment" variant="primary" className="fade-in" style={{animationDelay: '0.4s'}}>
              Nowa ocena
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="fade-in" style={{animationDelay: '0.5s'}}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Twoje oceny</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <p className="text-center p-3">Ładowanie ocen...</p>
              ) : assessments.length > 0 ? (
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Nazwa</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Postęp</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment, index) => (
                      <tr key={assessment.id} className="fade-in" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                        <td>{assessment.name}</td>
                        <td>{assessment.createdAt}</td>
                        <td>
                          <span className={getStatusBadgeClass(assessment.status)}>
                            {assessment.status}
                          </span>
                        </td>
                        <td>
                          <div className="progress" style={{height: '8px'}}>
                            <div 
                              className={`progress-bar ${assessment.status === 'ZAKOŃCZONA' ? 'progress-bar-success' : 'progress-bar-in-progress'}`}
                              role="progressbar" 
                              style={{ width: `${assessment.progress}%` }}
                              aria-valuenow={assessment.progress} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            />
                          </div>
                          <small className="d-block text-center mt-1">{assessment.progress}%</small>
                        </td>
                        <td>
                          <Button 
                            as={Link} 
                            to={`/assessment/${assessment.id}`} 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-1 btn-sm"
                          >
                            Edytuj
                          </Button>
                          <Button 
                            as={Link} 
                            to={`/results/${assessment.id}`} 
                            variant="outline-info" 
                            size="sm"
                            className="btn-sm"
                          >
                            Wyniki
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center p-3">Brak ocen. Kliknij "Nowa ocena", aby rozpocząć.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {assessments.length > 0 && (
        <Row>
          <Col>
            <Card className="fade-in" style={{animationDelay: '0.8s'}}>
              <Card.Header>
                <h5 className="mb-0">Podsumowanie wyników</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <div className="mb-3 fade-in" style={{animationDelay: '0.9s'}}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Obszary z oceną pozytywną</span>
                        <span className="status-badge status-positive">{positivePercentage}%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div 
                          className="progress-bar progress-bar-success" 
                          role="progressbar" 
                          style={{ width: `${positivePercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3 fade-in" style={{animationDelay: '1s'}}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Obszary z zastrzeżeniami</span>
                        <span className="status-badge status-warning">{warningPercentage}%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div 
                          className="progress-bar progress-bar-warning" 
                          role="progressbar" 
                          style={{ width: `${warningPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3 fade-in" style={{animationDelay: '1.1s'}}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Obszary z oceną negatywną</span>
                        <span className="status-badge status-negative">{negativePercentage}%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div 
                          className="progress-bar progress-bar-danger" 
                          role="progressbar" 
                          style={{ width: `${negativePercentage}%` }}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center justify-content-center fade-in" style={{animationDelay: '1.2s'}}>
                    <div className="text-center">
                      <div className="mb-2">
                        <span className="h4">{totalAreas}</span>
                        <p className="mb-0">Łączna liczba ocenionych obszarów</p>
                      </div>
                      <Button as={Link} to="/results" variant="outline-primary" size="sm">
                        Zobacz szczegółowe raporty
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CompactDashboard;
