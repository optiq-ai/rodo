import React, { useState } from 'react';
import { Row, Col, Form, Button, ProgressBar, Card, Accordion, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faExclamationTriangle, faSpinner, faArrowRight, faArrowLeft, faSave, faFileExport } from '@fortawesome/free-solid-svg-icons';

const MoreCompactAssessmentForm = ({ 
  chapter,
  chapterIndex,
  handleRequirementChange, 
  handleAreaScoreChange, 
  handleAreaCommentChange,
  totalChapters,
  onNextChapter,
  onPrevChapter,
  onSave,
  onExport
}) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(0);
  const [answeredByArea, setAnsweredByArea] = useState(chapter.areas.map(area => 0));
  
  const handleRadioChange = (areaIndex, requirementIndex, value) => {
    handleRequirementChange(chapterIndex, areaIndex, requirementIndex, 'value', value);
    
    // Update answered count for this area
    const updatedAnsweredByArea = [...answeredByArea];
    let answeredCount = 0;
    chapter.areas[areaIndex].requirements.forEach((req, idx) => {
      if (idx === requirementIndex) {
        if (value) answeredCount++;
      } else if (req.value) {
        answeredCount++;
      }
    });
    updatedAnsweredByArea[areaIndex] = answeredCount;
    setAnsweredByArea(updatedAnsweredByArea);
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

  const getProgressVariant = (percentage) => {
    if (percentage < 30) return "danger";
    if (percentage < 70) return "warning";
    return "success";
  };

  const calculateAreaProgress = (areaIndex) => {
    const area = chapter.areas[areaIndex];
    const totalQuestions = area.requirements.length;
    return totalQuestions > 0 ? Math.round((answeredByArea[areaIndex] / totalQuestions) * 100) : 0;
  };

  const calculateChapterProgress = () => {
    let totalRequirements = 0;
    let answeredRequirements = 0;
    
    chapter.areas.forEach((area, areaIndex) => {
      totalRequirements += area.requirements.length;
      answeredRequirements += answeredByArea[areaIndex];
    });
    
    return totalRequirements > 0 ? Math.round((answeredRequirements / totalRequirements) * 100) : 0;
  };

  return (
    <Card className="chapter-section fade-in mb-4" style={{animationDelay: '0.2s'}}>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h4 className="chapter-title mb-0">{chapter.name}</h4>
        <div className="d-flex align-items-center">
          <span className="badge bg-light text-dark me-2">{calculateChapterProgress()}%</span>
          <div style={{width: '100px'}}>
            <ProgressBar 
              now={calculateChapterProgress()} 
              variant={getProgressVariant(calculateChapterProgress())} 
              animated 
              style={{height: '8px'}}
            />
          </div>
        </div>
      </Card.Header>
      
      <Card.Body className="p-2">
        <p className="text-muted mb-3">{chapter.description}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">Rozdział {chapterIndex + 1} z {totalChapters}</small>
        </div>
        
        <Row className="mb-3">
          <Col>
            <Nav variant="tabs" className="area-tabs">
              {chapter.areas.map((area, areaIndex) => (
                <Nav.Item key={area.id}>
                  <Nav.Link 
                    active={activeAreaIndex === areaIndex}
                    onClick={() => setActiveAreaIndex(areaIndex)}
                    className="py-1 px-2"
                    style={{fontSize: '0.85rem'}}
                  >
                    <div className="d-flex align-items-center">
                      {area.name.length > 20 ? area.name.substring(0, 20) + '...' : area.name}
                      <span className="ms-1 badge bg-primary">{calculateAreaProgress(areaIndex)}%</span>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
        </Row>
        
        {chapter.areas[activeAreaIndex] && (
          <div className="area-content p-2">
            <h5 className="area-title mb-2">{chapter.areas[activeAreaIndex].name}</h5>
            <p className="text-muted mb-3" style={{fontSize: '0.9rem'}}>{chapter.areas[activeAreaIndex].description}</p>
            
            {chapter.areas[activeAreaIndex].requirements.map((requirement, requirementIndex) => (
              <div 
                key={requirement.id} 
                className="requirement-item p-2 mb-2 border-left" 
                style={{
                  borderLeft: '3px solid #4a8eff',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  animationDelay: `${requirementIndex * 0.1}s`,
                  transition: 'all 0.3s ease'
                }}
              >
                <p className="mb-2 fw-bold" style={{fontSize: '0.9rem'}}>{requirement.text}</p>
                
                <Row className="mb-2">
                  <Col>
                    <div className="d-flex flex-wrap gap-2">
                      <Form.Check
                        type="radio"
                        id={`req-${requirement.id}-yes`}
                        name={`requirement-${requirement.id}`}
                        label={<span className="d-flex align-items-center"><span className="badge bg-success me-1">TAK</span></span>}
                        checked={requirement.value === 'TAK'}
                        onChange={() => handleRadioChange(activeAreaIndex, requirementIndex, 'TAK')}
                        className="radio-animated me-2"
                      />
                      
                      <Form.Check
                        type="radio"
                        id={`req-${requirement.id}-no`}
                        name={`requirement-${requirement.id}`}
                        label={<span className="d-flex align-items-center"><span className="badge bg-danger me-1">NIE</span></span>}
                        checked={requirement.value === 'NIE'}
                        onChange={() => handleRadioChange(activeAreaIndex, requirementIndex, 'NIE')}
                        className="radio-animated me-2"
                      />
                      
                      <Form.Check
                        type="radio"
                        id={`req-${requirement.id}-progress`}
                        name={`requirement-${requirement.id}`}
                        label={<span className="d-flex align-items-center"><span className="badge bg-info me-1">W REALIZACJI</span></span>}
                        checked={requirement.value === 'W REALIZACJI'}
                        onChange={() => handleRadioChange(activeAreaIndex, requirementIndex, 'W REALIZACJI')}
                        className="radio-animated me-2"
                      />
                      
                      <Form.Check
                        type="radio"
                        id={`req-${requirement.id}-na`}
                        name={`requirement-${requirement.id}`}
                        label={<span className="d-flex align-items-center"><span className="badge bg-secondary me-1">ND</span></span>}
                        checked={requirement.value === 'ND'}
                        onChange={() => handleRadioChange(activeAreaIndex, requirementIndex, 'ND')}
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
                        onChange={(e) => handleRequirementChange(chapterIndex, activeAreaIndex, requirementIndex, 'comment', e.target.value)}
                        placeholder="Dodaj komentarz (opcjonalnie)"
                        className="comment-animated"
                        style={{fontSize: '0.85rem'}}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
            
            <div className="mt-3 p-2 bg-light rounded">
              <h5 className="mb-2" style={{fontSize: '0.95rem'}}>Ocena obszaru</h5>
              <Row>
                <Col md={12} className="mb-2">
                  <div className="d-flex flex-wrap gap-2">
                    <Form.Check
                      type="radio"
                      id={`area-${chapter.areas[activeAreaIndex].id}-positive`}
                      name={`area-score-${chapter.areas[activeAreaIndex].id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-success me-1">POZYTYWNA</span></span>}
                      checked={chapter.areas[activeAreaIndex].score === 'POZYTYWNA'}
                      onChange={() => handleAreaScoreChange(chapterIndex, activeAreaIndex, 'POZYTYWNA')}
                      className="radio-animated me-2"
                    />
                    
                    <Form.Check
                      type="radio"
                      id={`area-${chapter.areas[activeAreaIndex].id}-warning`}
                      name={`area-score-${chapter.areas[activeAreaIndex].id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-warning text-dark me-1">ZASTRZEŻENIA</span></span>}
                      checked={chapter.areas[activeAreaIndex].score === 'ZASTRZEŻENIA'}
                      onChange={() => handleAreaScoreChange(chapterIndex, activeAreaIndex, 'ZASTRZEŻENIA')}
                      className="radio-animated me-2"
                    />
                    
                    <Form.Check
                      type="radio"
                      id={`area-${chapter.areas[activeAreaIndex].id}-negative`}
                      name={`area-score-${chapter.areas[activeAreaIndex].id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-danger me-1">NEGATYWNA</span></span>}
                      checked={chapter.areas[activeAreaIndex].score === 'NEGATYWNA'}
                      onChange={() => handleAreaScoreChange(chapterIndex, activeAreaIndex, 'NEGATYWNA')}
                      className="radio-animated me-2"
                    />
                    
                    <Form.Check
                      type="radio"
                      id={`area-${chapter.areas[activeAreaIndex].id}-progress`}
                      name={`area-score-${chapter.areas[activeAreaIndex].id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-info me-1">W REALIZACJI</span></span>}
                      checked={chapter.areas[activeAreaIndex].score === 'W REALIZACJI'}
                      onChange={() => handleAreaScoreChange(chapterIndex, activeAreaIndex, 'W REALIZACJI')}
                      className="radio-animated me-2"
                    />
                    
                    <Form.Check
                      type="radio"
                      id={`area-${chapter.areas[activeAreaIndex].id}-na`}
                      name={`area-score-${chapter.areas[activeAreaIndex].id}`}
                      label={<span className="d-flex align-items-center"><span className="badge bg-secondary me-1">NIE DOTYCZY</span></span>}
                      checked={chapter.areas[activeAreaIndex].score === 'NIE DOTYCZY'}
                      onChange={() => handleAreaScoreChange(chapterIndex, activeAreaIndex, 'NIE DOTYCZY')}
                      className="radio-animated me-2"
                    />
                  </div>
                </Col>
                
                <Col md={12}>
                  <Form.Group className="mb-0">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={chapter.areas[activeAreaIndex].comment}
                      onChange={(e) => handleAreaCommentChange(chapterIndex, activeAreaIndex, e.target.value)}
                      placeholder="Dodaj komentarz do oceny obszaru (opcjonalnie)"
                      className="comment-animated"
                      style={{fontSize: '0.85rem'}}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Card.Body>
      
      <Card.Footer className="d-flex justify-content-between">
        <div>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={onPrevChapter} 
            disabled={chapterIndex === 0}
            className="me-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Poprzedni rozdział
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
            onClick={onNextChapter} 
            disabled={chapterIndex === totalChapters - 1}
          >
            Następny rozdział <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default MoreCompactAssessmentForm;
