import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, ProgressBar, Card } from 'react-bootstrap';

const RadioButtonAssessmentForm = ({ 
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
  
  // Oblicz liczbę odpowiedzianych pytań przy inicjalizacji i aktualizacji komponentu
  useEffect(() => {
    let answeredCount = 0;
    area.requirements.forEach((req) => {
      if (req.value && req.value !== '') {
        answeredCount++;
      }
    });
    setAnswered(answeredCount);
  }, [area.requirements]);
  
  const progressPercentage = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;
  
  const handleRadioChange = (requirementIndex, value) => {
    // Mapowanie wartości z interfejsu użytkownika na wartości używane w API
    const apiValue = mapUIValueToAPIValue(value);
    
    // Aktualizacja wartości wymagania
    handleRequirementChange(chapterIndex, areaIndex, requirementIndex, 'value', apiValue);
    
    // Aktualizacja liczby odpowiedzianych pytań
    let answeredCount = 0;
    area.requirements.forEach((req, idx) => {
      if (idx === requirementIndex) {
        if (apiValue) answeredCount++;
      } else if (req.value) {
        answeredCount++;
      }
    });
    setAnswered(answeredCount);
  };
  
  // Funkcja mapująca wartości z interfejsu użytkownika na wartości używane w API
  const mapUIValueToAPIValue = (uiValue) => {
    switch(uiValue) {
      case 'TAK': return 'yes';
      case 'NIE': return 'no';
      case 'W REALIZACJI': return 'partial';
      case 'ND': return 'na';
      default: return '';
    }
  };
  
  // Funkcja mapująca wartości z API na wartości używane w interfejsie użytkownika
  const mapAPIValueToUIValue = (apiValue) => {
    switch(apiValue) {
      case 'yes': return 'TAK';
      case 'no': return 'NIE';
      case 'partial': return 'W REALIZACJI';
      case 'na': return 'ND';
      default: return '';
    }
  };

  const getStatusIcon = (value) => {
    switch(value) {
      case 'TAK':
        return '✓';
      case 'NIE':
        return '✗';
      case 'W REALIZACJI':
        return '⟳';
      case 'ND':
        return '⚠';
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
      <Card.Header className="bg-primary text-white">
        <h4 className="area-title mb-0">{area.name}</h4>
      </Card.Header>
      
      <Card.Body>
        <p className="text-muted mb-3">{area.description}</p>
        
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Postęp wypełnienia sekcji:</span>
            <span className="badge bg-primary">{progressPercentage}%</span>
          </div>
          <ProgressBar 
            now={progressPercentage} 
            variant={getProgressVariant()} 
            animated 
            style={{height: '10px'}}
          />
          <div className="d-flex justify-content-between mt-1">
            <small className="text-muted">Wypełniono {answered} z {totalQuestions} pytań</small>
            <small className="text-muted">Sekcja {currentAreaIndex + 1} z {totalAreas}</small>
          </div>
        </div>
        
        {area.requirements.map((requirement, requirementIndex) => {
          // Mapuj wartość z API na wartość UI dla wyświetlenia
          const uiValue = mapAPIValueToUIValue(requirement.value);
          
          return (
            <div 
              key={requirement.id} 
              className="requirement-item p-3 mb-4 border-left" 
              style={{
                borderLeft: '4px solid #4a8eff',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                animationDelay: `${requirementIndex * 0.1}s`,
                transition: 'all 0.3s ease'
              }}
            >
              <p className="mb-3 fw-bold">{requirement.text}</p>
              
              <Row className="mb-3">
                <Col>
                  <div className="d-flex flex-wrap gap-3">
                    <Form.Check
                      type="radio"
                      id={`req-${requirement.id}-yes`}
                      name={`requirement-${requirement.id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-success me-2">TAK</span> Zgodne</span>}
                      checked={uiValue === 'TAK'}
                      onChange={() => handleRadioChange(requirementIndex, 'TAK')}
                      className="radio-animated"
                    />
                    
                    <Form.Check
                      type="radio"
                      id={`req-${requirement.id}-no`}
                      name={`requirement-${requirement.id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-danger me-2">NIE</span> Niezgodne</span>}
                      checked={uiValue === 'NIE'}
                      onChange={() => handleRadioChange(requirementIndex, 'NIE')}
                      className="radio-animated"
                    />
                    
                    <Form.Check
                      type="radio"
                      id={`req-${requirement.id}-progress`}
                      name={`requirement-${requirement.id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-info me-2">W REALIZACJI</span> W trakcie</span>}
                      checked={uiValue === 'W REALIZACJI'}
                      onChange={() => handleRadioChange(requirementIndex, 'W REALIZACJI')}
                      className="radio-animated"
                    />
                    
                    <Form.Check
                      type="radio"
                      id={`req-${requirement.id}-na`}
                      name={`requirement-${requirement.id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-secondary me-2">ND</span> Nie dotyczy</span>}
                      checked={uiValue === 'ND'}
                      onChange={() => handleRadioChange(requirementIndex, 'ND')}
                      className="radio-animated"
                    />
                  </div>
                </Col>
              </Row>
              
              <Row>
                <Col>
                  <Form.Group className="mb-0">
                    <Form.Label>Komentarz</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={requirement.comment || ''}
                      onChange={(e) => handleRequirementChange(chapterIndex, areaIndex, requirementIndex, 'comment', e.target.value)}
                      placeholder="Dodaj komentarz (opcjonalnie)"
                      className="comment-animated"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {uiValue && (
                <div className="mt-2 text-end">
                  <span className="text-muted">
                    Status: {getStatusIcon(uiValue)} {uiValue}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-4 p-4 bg-light rounded">
          <h5 className="mb-3">Ocena obszaru</h5>
          <Row>
            <Col md={12} className="mb-3">
              <div className="d-flex flex-wrap gap-3">
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-positive`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-success me-2">POZYTYWNA</span></span>}
                  checked={area.score === 'POZYTYWNA'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'POZYTYWNA')}
                  className="radio-animated"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-warning`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-warning text-dark me-2">ZASTRZEŻENIA</span></span>}
                  checked={area.score === 'ZASTRZEŻENIA'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'ZASTRZEŻENIA')}
                  className="radio-animated"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-negative`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-danger me-2">NEGATYWNA</span></span>}
                  checked={area.score === 'NEGATYWNA'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'NEGATYWNA')}
                  className="radio-animated"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-progress`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-info me-2">W REALIZACJI</span></span>}
                  checked={area.score === 'W REALIZACJI'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'W REALIZACJI')}
                  className="radio-animated"
                />
                
                <Form.Check
                  type="radio"
                  id={`area-${area.id}-na`}
                  name={`area-score-${area.id}`}
                  label={<span className="d-flex align-items-center"><span className="badge bg-secondary me-2">NIE DOTYCZY</span></span>}
                  checked={area.score === 'NIE DOTYCZY'}
                  onChange={() => handleAreaScoreChange(chapterIndex, areaIndex, 'NIE DOTYCZY')}
                  className="radio-animated"
                />
              </div>
            </Col>
            
            <Col md={12}>
              <Form.Group className="mb-0">
                <Form.Label>Komentarz do oceny obszaru</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={area.comment || ''}
                  onChange={(e) => handleAreaCommentChange(chapterIndex, areaIndex, e.target.value)}
                  placeholder="Dodaj komentarz do oceny obszaru (opcjonalnie)"
                  className="comment-animated"
                />
              </Form.Group>
            </Col>
          </Row>
          
          {area.score && (
            <div className="mt-3">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {area.score}
                </div>
                <div className="progress flex-grow-1" style={{height: '10px'}}>
                  <div 
                    className={`progress-bar bg-${area.score === 'POZYTYWNA' ? 'success' : area.score === 'ZASTRZEŻENIA' ? 'warning' : area.score === 'NEGATYWNA' ? 'danger' : area.score === 'W REALIZACJI' ? 'info' : 'secondary'}`}
                    role="progressbar" 
                    style={{ 
                      width: `${area.score === 'POZYTYWNA' ? '100' : area.score === 'ZASTRZEŻENIA' ? '50' : area.score === 'NEGATYWNA' ? '25' : area.score === 'W REALIZACJI' ? '75' : '0'}%` 
                    }}
                    aria-valuenow={area.score === 'POZYTYWNA' ? 100 : area.score === 'ZASTRZEŻENIA' ? 50 : area.score === 'NEGATYWNA' ? 25 : area.score === 'W REALIZACJI' ? 75 : 0} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
      
      <Card.Footer className="d-flex justify-content-between">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={onPrevArea} 
            disabled={currentAreaIndex === 0}
            className="me-2"
          >
            ← Poprzednia sekcja
          </Button>
        </div>
        
        <div>
          <Button 
            variant="outline-primary" 
            onClick={onSave} 
            className="me-2"
          >
            💾 Zapisz zmiany
          </Button>
          
          <Button 
            variant="outline-success" 
            onClick={onExport}
            className="me-2"
          >
            📤 Eksportuj
          </Button>
          
          <Button 
            variant="primary" 
            onClick={onNextArea} 
            disabled={currentAreaIndex === totalAreas - 1}
          >
            Następna sekcja →
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default RadioButtonAssessmentForm;
