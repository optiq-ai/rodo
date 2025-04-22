import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Nav, Tab, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faSave, faFilePdf, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RodoAssessmentForm = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [activeSection, setActiveSection] = useState('section1');
  const [validated, setValidated] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ show: false, message: '', variant: 'success' });
  const [progress, setProgress] = useState(0);
  
  const navigate = useNavigate();
  
  // Define the form sections based on the Excel structure
  const sections = [
    { id: 'section1', title: 'I. ORGANIZACJA SYSTEMU OCHRONY DANYCH OSOBOWYCH' },
    { id: 'section2', title: 'II. PRAWO DO PRZETWARZANIA DANYCH OSOBOWYCH' },
    { id: 'section3', title: 'III. REALIZACJA PRAW OSOBY, KTÓREJ DANE DOTYCZĄ' },
    { id: 'section4', title: 'IV. INSPEKTOR OCHRONY DANYCH' },
    { id: 'section5', title: 'V. REJESTROWANIE CZYNNOŚCI PRZETWARZANIA DANYCH OSOBOWYCH' },
    { id: 'section6', title: 'VI. OCENA SKUTKÓW PRZETWARZANIA DANYCH OSOBOWYCH' },
    { id: 'section7', title: 'VII. NARUSZENIE OCHRONY DANYCH OSOBOWYCH' },
    { id: 'section8', title: 'OGÓLNA OCENA SPEŁNIANIA OBOWIĄZKÓW W ZAKRESIE DANYCH OSOBOWYCH' }
  ];
  
  // Define assessment options with colors
  const assessmentOptions = [
    { value: 'compliant', label: 'Zgodny', color: '#28a745' },
    { value: 'partially_compliant', label: 'Częściowo zgodny', color: '#ffc107' },
    { value: 'non_compliant', label: 'Niezgodny', color: '#dc3545' },
    { value: 'not_applicable', label: 'Nie dotyczy', color: '#6c757d' }
  ];
  
  // Calculate progress based on filled fields
  useEffect(() => {
    const calculateProgress = () => {
      let totalFields = 0;
      let filledFields = 0;
      
      // Count fields in each section
      Object.keys(formData).forEach(section => {
        Object.keys(formData[section] || {}).forEach(question => {
          if (formData[section][question].assessment) {
            filledFields++;
          }
          totalFields++;
        });
      });
      
      const calculatedProgress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
      setProgress(calculatedProgress);
    };
    
    calculateProgress();
  }, [formData]);
  
  // Handle form field changes
  const handleChange = (section, question, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [question]: {
          ...(prevData[section]?.[question] || {}),
          [field]: value
        }
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Call the onSave function with the form data
    if (onSave) {
      onSave(formData);
      setSaveStatus({
        show: true,
        message: 'Formularz został pomyślnie zapisany',
        variant: 'success'
      });
      
      // Hide the alert after 3 seconds
      setTimeout(() => {
        setSaveStatus({ ...saveStatus, show: false });
      }, 3000);
    }
  };
  
  // Navigation between sections
  const goToNextSection = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousSection = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  // Export to PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Ocena RODO', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add progress
    doc.text(`Postęp oceny: ${progress}%`, 14, 38);
    
    let yPos = 50;
    
    // Add each section
    sections.forEach(section => {
      // Add section title
      doc.setFontSize(14);
      doc.text(section.title, 14, yPos);
      yPos += 10;
      
      // Add section data
      if (formData[section.id]) {
        const sectionData = formData[section.id];
        Object.keys(sectionData).forEach(question => {
          const questionData = sectionData[question];
          
          // Skip if no assessment
          if (!questionData.assessment) return;
          
          // Get question text based on question id
          let questionText = '';
          switch (question) {
            case 'q1_1':
              questionText = 'Czy określono i udokumentowano role i odpowiedzialności w zakresie ochrony danych osobowych?';
              break;
            case 'q1_2':
              questionText = 'Czy ADO wdrożył odpowiednie środki techniczne i organizacyjne, aby przetwarzanie odbywało się zgodnie z RODO?';
              break;
            case 'q2_1':
              questionText = 'Czy w przypadku współadministrowania, cele i sposoby przetwarzania zostały określone wspólnie przez wszystkich współadministratorów?';
              break;
            // Add more cases as needed
            default:
              questionText = question;
          }
          
          // Add question text
          doc.setFontSize(12);
          
          // Split long text to fit in page width
          const splitText = doc.splitTextToSize(questionText, 180);
          doc.text(splitText, 14, yPos);
          yPos += splitText.length * 7;
          
          // Add assessment
          const assessmentOption = assessmentOptions.find(option => option.value === questionData.assessment);
          doc.text(`Ocena: ${assessmentOption ? assessmentOption.label : questionData.assessment}`, 14, yPos);
          yPos += 7;
          
          // Add justification if exists
          if (questionData.justification) {
            const justificationText = `Uzasadnienie: ${questionData.justification}`;
            const splitJustification = doc.splitTextToSize(justificationText, 180);
            doc.text(splitJustification, 14, yPos);
            yPos += splitJustification.length * 7;
          }
          
          yPos += 5;
          
          // Add new page if needed
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
      
      yPos += 10;
      
      // Add new page if needed
      if (yPos > 270 && section.id !== sections[sections.length - 1].id) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Save the PDF
    doc.save('ocena-rodo.pdf');
    
    setSaveStatus({
      show: true,
      message: 'Formularz został wyeksportowany do PDF',
      variant: 'success'
    });
    
    // Hide the alert after 3 seconds
    setTimeout(() => {
      setSaveStatus({ ...saveStatus, show: false });
    }, 3000);
  };
  
  // Custom Radio Button component with colors
  const ColoredRadioButton = ({ id, label, value, checked, onChange, color }) => {
    return (
      <div className="colored-radio-container">
        <input
          id={id}
          type="radio"
          className="colored-radio"
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <label
          htmlFor={id}
          className={`colored-radio-label ${checked ? 'checked' : ''}`}
          style={{
            backgroundColor: checked ? color : '#f8f9fa',
            borderColor: color,
            color: checked ? '#fff' : '#212529'
          }}
        >
          {label}
          {checked && <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />}
        </label>
      </div>
    );
  };
  
  // Generate form fields for Section 1
  const renderSection1 = () => (
    <>
      <h3 className="mb-4">I. ORGANIZACJA SYSTEMU OCHRONY DANYCH OSOBOWYCH</h3>
      
      {/* I.1 Subsection */}
      <Card className="mb-4">
        <Card.Header>
          <h5>I.1 Administrator Danych Osobowych (ADO)</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy określono i udokumentowano role i odpowiedzialności w zakresie ochrony danych osobowych?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section1-q1_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section1?.q1_1?.assessment === option.value}
                  onChange={() => handleChange('section1', 'q1_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section1?.q1_1?.justification || ''}
              onChange={(e) => handleChange('section1', 'q1_1', 'justification', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Czy ADO wdrożył odpowiednie środki techniczne i organizacyjne, aby przetwarzanie odbywało się zgodnie z RODO?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section1-q1_2-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section1?.q1_2?.assessment === option.value}
                  onChange={() => handleChange('section1', 'q1_2', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section1?.q1_2?.justification || ''}
              onChange={(e) => handleChange('section1', 'q1_2', 'justification', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
        </Card.Body>
      </Card>
      
      {/* I.2 Subsection */}
      <Card className="mb-4">
        <Card.Header>
          <h5>I.2 Współadministrowanie danymi</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy w przypadku współadministrowania, cele i sposoby przetwarzania zostały określone wspólnie przez wszystkich współadministratorów?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section1-q2_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section1?.q2_1?.assessment === option.value}
                  onChange={() => handleChange('section1', 'q2_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section1?.q2_1?.justification || ''}
              onChange={(e) => handleChange('section1', 'q2_1', 'justification', e.target.value)}
              className="mt-2"
            />
            <Form.Text className="text-muted">
              Podstawa prawna: art. 26 ust. 1 RODO; mot. 79 preambuły.
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  // Generate form fields for Section 2
  const renderSection2 = () => (
    <>
      <h3 className="mb-4">II. PRAWO DO PRZETWARZANIA DANYCH OSOBOWYCH</h3>
      
      {/* II.1 Subsection */}
      <Card className="mb-4">
        <Card.Header>
          <h5>II.1 Podstawa prawna przetwarzania DO</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy dla wszystkich zbiorów danych/procesów przetwarzania danych zidentyfikowano podstawę prawną (warunki przetwarzania)? Czy zostało to udokumentowane w rejestrze czynności przetwarzania DO?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section2-q1_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section2?.q1_1?.assessment === option.value}
                  onChange={() => handleChange('section2', 'q1_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section2?.q1_1?.justification || ''}
              onChange={(e) => handleChange('section2', 'q1_1', 'justification', e.target.value)}
              className="mt-2"
            />
            <Form.Text className="text-muted">
              Podstawa prawna: Warunki przetwarzania (art. 6 RODO), szczegółowe i dodatkowe warunki przetwarzania DO (art. 8-10 RODO mot. 40-57 preambuły).
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  // Generate form fields for Section 3
  const renderSection3 = () => (
    <>
      <h3 className="mb-4">III. REALIZACJA PRAW OSOBY, KTÓREJ DANE DOTYCZĄ</h3>
      
      {/* III.1 Subsection */}
      <Card className="mb-4">
        <Card.Header>
          <h5>III.1 Obowiązki informacyjne</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy opracowano treść klauzuli informacyjnej dla osób, od których DO będą pozyskiwane oraz czy jej treść spełnia wymogi RODO?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section3-q1_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section3?.q1_1?.assessment === option.value}
                  onChange={() => handleChange('section3', 'q1_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section3?.q1_1?.justification || ''}
              onChange={(e) => handleChange('section3', 'q1_1', 'justification', e.target.value)}
              className="mt-2"
            />
            <Form.Text className="text-muted">
              Podstawa prawna: art. 13 RODO; mot. 39, 58-63 preambuły
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  // Generate form fields for remaining sections
  const renderSection4 = () => (
    <>
      <h3 className="mb-4">IV. INSPEKTOR OCHRONY DANYCH</h3>
      <Card className="mb-4">
        <Card.Header>
          <h5>IV.1 Wyznaczenie IOD</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy wyznaczono Inspektora Ochrony Danych?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section4-q1_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section4?.q1_1?.assessment === option.value}
                  onChange={() => handleChange('section4', 'q1_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section4?.q1_1?.justification || ''}
              onChange={(e) => handleChange('section4', 'q1_1', 'justification', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  const renderSection5 = () => (
    <>
      <h3 className="mb-4">V. REJESTROWANIE CZYNNOŚCI PRZETWARZANIA DANYCH OSOBOWYCH</h3>
      <Card className="mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy prowadzony jest rejestr czynności przetwarzania danych osobowych?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section5-q1_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section5?.q1_1?.assessment === option.value}
                  onChange={() => handleChange('section5', 'q1_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section5?.q1_1?.justification || ''}
              onChange={(e) => handleChange('section5', 'q1_1', 'justification', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  const renderSection6 = () => (
    <>
      <h3 className="mb-4">VI. OCENA SKUTKÓW PRZETWARZANIA DANYCH OSOBOWYCH</h3>
      <Card className="mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy przeprowadzono ocenę skutków dla ochrony danych dla procesów wysokiego ryzyka?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section6-q1_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section6?.q1_1?.assessment === option.value}
                  onChange={() => handleChange('section6', 'q1_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section6?.q1_1?.justification || ''}
              onChange={(e) => handleChange('section6', 'q1_1', 'justification', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  const renderSection7 = () => (
    <>
      <h3 className="mb-4">VII. NARUSZENIE OCHRONY DANYCH OSOBOWYCH</h3>
      <Card className="mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Czy wdrożono procedury zgłaszania naruszeń ochrony danych osobowych?</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section7-q1_1-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section7?.q1_1?.assessment === option.value}
                  onChange={() => handleChange('section7', 'q1_1', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Uzasadnienie oceny"
              value={formData?.section7?.q1_1?.justification || ''}
              onChange={(e) => handleChange('section7', 'q1_1', 'justification', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  const renderSection8 = () => (
    <>
      <h3 className="mb-4">OGÓLNA OCENA SPEŁNIANIA OBOWIĄZKÓW W ZAKRESIE DANYCH OSOBOWYCH</h3>
      <Card className="mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Ogólna ocena zgodności z RODO</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {assessmentOptions.map(option => (
                <ColoredRadioButton
                  key={option.value}
                  id={`section8-overall-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={formData?.section8?.overall?.assessment === option.value}
                  onChange={() => handleChange('section8', 'overall', 'assessment', option.value)}
                  color={option.color}
                />
              ))}
            </div>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Uzasadnienie ogólnej oceny"
              value={formData?.section8?.overall?.justification || ''}
              onChange={(e) => handleChange('section8', 'overall', 'justification', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Rekomendacje i działania naprawcze</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Wprowadź rekomendacje i działania naprawcze"
              value={formData?.section8?.recommendations || ''}
              onChange={(e) => handleChange('section8', 'recommendations', '', e.target.value)}
              className="mt-2"
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
  
  // Render the active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'section1':
        return renderSection1();
      case 'section2':
        return renderSection2();
      case 'section3':
        return renderSection3();
      case 'section4':
        return renderSection4();
      case 'section5':
        return renderSection5();
      case 'section6':
        return renderSection6();
      case 'section7':
        return renderSection7();
      case 'section8':
        return renderSection8();
      default:
        return null;
    }
  };
  
  return (
    <Container>
      {saveStatus.show && (
        <Alert variant={saveStatus.variant} className="mt-3">
          {saveStatus.message}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Postęp oceny</h5>
            <span>{progress}%</span>
          </div>
          <ProgressBar 
            now={progress} 
            variant={progress < 30 ? 'danger' : progress < 70 ? 'warning' : 'success'} 
            className="mb-3" 
          />
          
          <div className="d-flex flex-wrap gap-2">
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className="mb-2"
              >
                {index + 1}. {section.title.split('.')[0]}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {renderActiveSection()}
        
        <div className="d-flex justify-content-between mb-5">
          <Button 
            variant="outline-secondary" 
            onClick={goToPreviousSection}
            disabled={activeSection === 'section1'}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Poprzedni
          </Button>
          
          <div className="d-flex gap-2">
            <Button variant="success" type="submit">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Zapisz
            </Button>
            <Button variant="info" onClick={exportToPdf}>
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />
              Eksportuj do PDF
            </Button>
          </div>
          
          <Button 
            variant="outline-primary" 
            onClick={goToNextSection}
            disabled={activeSection === 'section8'}
          >
            Następny
            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default RodoAssessmentForm;
