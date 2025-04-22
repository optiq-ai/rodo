import React, { useState } from 'react';
import { Row, Col, Form, Button, ProgressBar, Card, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faExclamationTriangle, faSpinner, faArrowRight, faArrowLeft, faSave, faFileExport } from '@fortawesome/free-solid-svg-icons';

const CompactAssessmentForm = ({ 
  area, 
  chapterIndex, 
  areaIndex, 
  handleRequirementChange, 
  handleAreaScoreChange, 
  handleAreaCommentChange,
  totalAreas,
  currentAreaIndex,
  onNextArea,
  onPrevArea,
  onSave,
  onExport
}) => {
  const [answered, setAnswered] = useState(0);
  const totalQuestions = area.requirements.length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;
  
  const handleRadioChange = (requirementIndex, value) => {
    handleRequirementChange(chapterIndex, areaIndex, requirementIndex, 'value', value);
    
    // Update answered count
    let answeredCount = 0;
    area.requirements.forEach((req, idx) => {
      if (idx === requirementIndex) {
        if (value) answeredCount++;
      } else if (req.value) {
        answeredCount++;
      }
    });
    setAnswered(answeredCount);
  };

  const getStatusIcon = (value) => {
    switch(value) {
      case 'TAK':
        return <FontAwesomeIcon icon={faCheck} className="text-success" />;
      case 'NIE':
        return <FontAwesomeIcon icon={faTimes} className="text-danger" />;
      case 'W REALIZACJI':
        return <FontAwesomeIcon icon={faSpinner} className="text-info fa-spin" />;
      case 'ND':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-secondary" />;
      default:
        return null;
    }
  };

  const getProgressVariant = () => {
    if (progressPercentage < 30) return "danger";
    if (progressPercentage < 70) return "warning";
    return "success";
  };

  return (
    <Card className="area-section fade-in mb-4" style={{animationDelay: '0.2s'}}>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h4 className="area-title mb-0">{area.name}</h4>
        <div className="d-flex align-items-center">
          <span className="badge bg-light text-dark me-2">{progressPercentage}%</span>
          <div style={{width: '100px'}}>
            <ProgressBar 
              now={progressPercentage} 
              variant={getProgressVariant()} 
              animated 
              style={{height: '8px'}}
            />
          </div>
        </div>
      </Card.Header>
      
      <Card.Body className="p-3">
        <p className="text-muted mb-3">{area.description}</p>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">Wypełniono {answered} z {totalQuestions} pytań</small>
            <small className="text-muted">Sekcja {currentAreaIndex + 1} z {totalAreas}</small>
          </div>
        </div>
        
        {area.requirements.map((requirement, requirementIndex) => (
          <div 
            key={requirement.id} 
            className="requirement-item p-2 mb-3 border-left" 
            style={{
              borderLeft: '3px solid #4a8eff',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              animationDelay: `${requirementIndex * 0.1}s`,
              transition: 'all 0.3s ease'
            }}
          >
            <p className="mb-2 fw-bold" style={{fontSize: '0.95rem'}}>{requirement.text}</p>
            
            <Row className="mb-2">
              <Col>
                <div className="d-flex flex-wrap gap-2">
                  <Form.Check
                    type="radio"
                    id={`req-${requirement.id}-yes`}
                    name={`requirement-${requirement.id}`}
                    label={<span className="d-flex align-items-center"><span className="badge bg-success me-1">TAK</span></span>}
                    checked={requirement.value === 'TAK'}
                    onChange={() => handleRadioChange(requirementIndex, 'TAK')}
                    className="radio-animated me-2"
                  />
                  
                  <Form.Check
                    type="radio"
                    id={`req-${requirement.id}-no`}
                    name={`requirement-${requirement.id}`}
                    label={<span className="d-flex align-items-center"><span className="badge bg-danger me-1">NIE</span></span>}
                    checked={requirement.value === 'NIE'}
                    onChange={() => handleRadioChange(requirementIndex, 'NIE')}
                    className="radio-animated me-2"
                  />
                  
                  <Form.Check
                    type="radio"
                    id={`req-${requirement.id}-progress`}
                    name={`requirement-${requirement.id}`}
                    label={<span className="d-flex align-items-center"><span className="badge bg-info me-1">W REALIZACJI</span></span>}
                    checked={requirement.value === 'W REALIZACJI'}
                    onChange={() => handleRadioChange(requirementIndex, 'W REALIZACJI')}
                    className="radio-animated me-2"
                  />
                  
                  <Form.Check
                    type="radio"
                    id={`req-${requirement.id}-na`}
                    name={`requirement-${requirement.id}`}
                    label={<span className="d-flex align-items-center"><span className="badge bg-secondary me-1">ND</span></span>}
                    checked={requirement.value === 'ND'}
                    onChange={() => handleRadioChange(requirementIndex, 'ND')}
                    className="radio-animated me-2"
                  />
                  
                  {requirement.value && (
                    <span className="ms-2 text-muted">
                      {getStatusIcon(requirement.value)}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <Form.Group className="mb-0">
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={requirement.comment}
                    onChange={(e) => handleRequirementChange(chapterIndex, areaIndex, requirementIndex, 'comment', e.target.value)}
                    placeholder="Dodaj komentarz (opcjonalnie)"
                    className="comment-animated"
                    style={{fontSize: '0.85rem'}}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}
        
        <div className="mt-3 p-3 bg-light rounded">
          <h5 className="mb-2" style={{fontSize: '1rem'}}>Ocena obszaru</h5>
          <Row>
            <Col md={12} className="mb-2">
              <div className="d-flex flex-wrap gap-2">
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-positive`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-success me-1">POZYTYWNA</span></span>}
                  checked={area.score === 'POZYTYWNA'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'POZYTYWNA')}
                  className="radio-animated me-2"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-warning`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-warning text-dark me-1">ZASTRZEŻENIA</span></span>}
                  checked={area.score === 'ZASTRZEŻENIA'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'ZASTRZEŻENIA')}
                  className="radio-animated me-2"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-negative`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-danger me-1">NEGATYWNA</span></span>}
                  checked={area.score === 'NEGATYWNA'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'NEGATYWNA')}
                  className="radio-animated me-2"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-progress`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-info me-1">W REALIZACJI</span></span>}
                  checked={area.score === 'W REALIZACJI'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'W REALIZACJI')}
                  className="radio-animated me-2"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-na`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-secondary me-1">NIE DOTYCZY</span></span>}
                  checked={area.score === 'NIE DOTYCZY'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'NIE DOTYCZY')}
                  className="radio-animated me-2"
                />
              </div>
            </Col>
            
            <Col md={12}>
              <Form.Group className="mb-0">
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={area.comment}
                  onChange={(e) => handleAreaCommentChange(chapterIndex, areaIndex, e.target.value)}
                  placeholder="Dodaj komentarz do oceny obszaru (opcjonalnie)"
                  className="comment-animated"
                  style={{fontSize: '0.85rem'}}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Card.Body>
      
      <Card.Footer className="d-flex justify-content-between">
        <div>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={onPrevArea} 
            disabled={currentAreaIndex === 0}
            className="me-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Poprzednia
          </Button>
        </div>
        
        <div>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={onSave} 
            className="me-2"
          >
            <FontAwesomeIcon icon={faSave} className="me-1" /> Zapisz
          </Button>
          
          <Button 
            variant="outline-success" 
            size="sm"
            onClick={onExport}
            className="me-2"
          >
            <FontAwesomeIcon icon={faFileExport} className="me-1" /> Eksportuj
          </Button>
          
          <Button 
            variant="primary" 
            size="sm"
            onClick={onNextArea} 
            disabled={currentAreaIndex === totalAreas - 1}
          >
            Następna <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default CompactAssessmentForm;
