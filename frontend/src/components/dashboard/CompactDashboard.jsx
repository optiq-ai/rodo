import React from 'react';
import { Row, Col, Card, Button, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { AnimatedProgressBar, AnimatedPercentageIndicator } from '../common/AnimatedElements';
import { useState } from 'react';

const CompactDashboard = ({ assessments, loading, onDeleteAssessment }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);

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

  const handleDeleteClick = (assessment) => {
    setAssessmentToDelete(assessment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (assessmentToDelete && onDeleteAssessment) {
      onDeleteAssessment(assessmentToDelete.id);
    }
    setShowDeleteModal(false);
    setAssessmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAssessmentToDelete(null);
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
                            title="Edytuj ocenę"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button 
                            as={Link} 
                            to={`/results/${assessment.id}`} 
                            variant="outline-info" 
                            size="sm"
                            className="me-1 btn-sm"
                            title="Zobacz wyniki"
                          >
                            <FontAwesomeIcon icon={faChartBar} />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            className="btn-sm"
                            onClick={() => handleDeleteClick(assessment)}
                            title="Usuń ocenę"
                          >
                            <FontAwesomeIcon icon={faTrash} />
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
                    <AnimatedProgressBar 
                      value={positivePercentage} 
                      label="Obszary z oceną pozytywną" 
                      color="positive" 
                      animated={true}
                    />
                    
                    <AnimatedProgressBar 
                      value={warningPercentage} 
                      label="Obszary z zastrzeżeniami" 
                      color="warning" 
                      animated={true}
                    />
                    
                    <AnimatedProgressBar 
                      value={negativePercentage} 
                      label="Obszary z oceną negatywną" 
                      color="negative" 
                      animated={true}
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-center justify-content-center">
                    <AnimatedPercentageIndicator
                      value={positivePercentage}
                      label="Zgodność z RODO"
                      color="#28a745"
                      size="large"
                      animated={true}
                    />
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

      {/* Modal potwierdzenia usunięcia */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered animation className="fade-in">
        <Modal.Header closeButton>
          <Modal.Title>Potwierdź usunięcie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Czy na pewno chcesz usunąć ocenę <strong>{assessmentToDelete?.name}</strong>?
          <div className="alert alert-warning mt-2">
            <small>Ta operacja jest nieodwracalna. Wszystkie dane związane z tą oceną zostaną trwale usunięte.</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Usuń
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompactDashboard;
