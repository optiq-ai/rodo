import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const AnimatedAssessmentForm = ({ 
  area, 
  chapterIndex, 
  areaIndex, 
  handleRequirementChange, 
  handleAreaScoreChange, 
  handleAreaCommentChange 
}) => {
  return (
    <div className="area-section fade-in">
      <h4 className="area-title">{area.name}</h4>
      <p>{area.description}</p>
      
      {area.requirements.map((requirement, requirementIndex) => (
        <div 
          key={requirement.id} 
          className="requirement-item" 
          style={{animationDelay: `${requirementIndex * 0.1}s`}}
        >
          <p>{requirement.text}</p>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ocena</Form.Label>
                <Form.Select
                  value={requirement.value}
                  onChange={(e) => handleRequirementChange(chapterIndex, areaIndex, requirementIndex, 'value', e.target.value)}
                  className={requirement.value ? `selected-option status-${requirement.value === 'TAK' ? 'positive' : requirement.value === 'NIE' ? 'negative' : requirement.value === 'W REALIZACJI' ? 'in-progress' : 'not-applicable'}` : ''}
                >
                  <option value="">Wybierz ocenę</option>
                  <option value="TAK">TAK</option>
                  <option value="NIE">NIE</option>
                  <option value="ND">NIE DOTYCZY</option>
                  <option value="W REALIZACJI">W REALIZACJI</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Komentarz</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={requirement.comment}
                  onChange={(e) => handleRequirementChange(chapterIndex, areaIndex, requirementIndex, 'comment', e.target.value)}
                  placeholder="Dodaj komentarz (opcjonalnie)"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      ))}
      
      <div className="mt-4 p-3 bg-light">
        <h5>Ocena obszaru</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ocena</Form.Label>
              <Form.Select
                value={area.score}
                onChange={(e) => handleAreaScoreChange(chapterIndex, areaIndex, e.target.value)}
                className={area.score ? `status-${area.score === 'POZYTYWNA' ? 'positive' : area.score === 'ZASTRZEŻENIA' ? 'warning' : area.score === 'NEGATYWNA' ? 'negative' : area.score === 'W REALIZACJI' ? 'in-progress' : 'not-applicable'}` : ''}
              >
                <option value="">Wybierz ocenę</option>
                <option value="POZYTYWNA">POZYTYWNA</option>
                <option value="ZASTRZEŻENIA">ZASTRZEŻENIA</option>
                <option value="NEGATYWNA">NEGATYWNA</option>
                <option value="W REALIZACJI">W REALIZACJI</option>
                <option value="NIE DOTYCZY">NIE DOTYCZY</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Komentarz</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={area.comment}
                onChange={(e) => handleAreaCommentChange(chapterIndex, areaIndex, e.target.value)}
                placeholder="Dodaj komentarz (opcjonalnie)"
              />
            </Form.Group>
          </Col>
        </Row>
        
        {area.score && (
          <div className="mt-3">
            <div className="d-flex align-items-center">
              <div className="status-badge me-2 status-${area.score === 'POZYTYWNA' ? 'positive' : area.score === 'ZASTRZEŻENIA' ? 'warning' : area.score === 'NEGATYWNA' ? 'negative' : area.score === 'W REALIZACJI' ? 'in-progress' : 'not-applicable'}">
                {area.score}
              </div>
              <div className="progress flex-grow-1">
                <div 
                  className={`progress-bar ${area.score === 'POZYTYWNA' ? 'progress-bar-success' : area.score === 'ZASTRZEŻENIA' ? 'progress-bar-warning' : 'progress-bar-danger'}`}
                  role="progressbar" 
                  style={{ 
                    width: `${area.score === 'POZYTYWNA' ? '100' : area.score === 'ZASTRZEŻENIA' ? '50' : area.score === 'NEGATYWNA' ? '25' : area.score === 'W REALIZACJI' ? '75' : '0'}%` 
                  }}
                  aria-valuenow={area.score === 'POZYTYWNA' ? 100 : area.score === 'ZASTRZEŻENIA' ? 50 : area.score === 'NEGATYWNA' ? 25 : area.score === 'W REALIZACJI' ? 75 : 0} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {area.score === 'POZYTYWNA' ? '100%' : area.score === 'ZASTRZEŻENIA' ? '50%' : area.score === 'NEGATYWNA' ? '25%' : area.score === 'W REALIZACJI' ? '75%' : '0%'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedAssessmentForm;
