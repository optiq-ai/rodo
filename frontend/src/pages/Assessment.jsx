import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AnimatedAssessmentForm from '../components/assessment/AnimatedAssessmentForm';

const Assessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState({
    id: id || 'new',
    name: '',
    description: '',
    status: 'DRAFT',
    chapters: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (id && id !== 'new') {
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
          
          setAssessment({
            id: id,
            name: 'Ocena RODO - Dział IT',
            description: 'Ocena zgodności z RODO dla działu IT',
            status: 'W TRAKCIE',
            chapters: mockChapters
          });
        } else {
          // Pobieranie struktury formularza dla nowej oceny
          // W rzeczywistości będzie to wywołanie do backendu
          // const response = await assessmentService.getAssessmentTemplate();
          
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
                  score: '',
                  comment: '',
                  requirements: [
                    {
                      id: 1,
                      text: 'Czy opracowano i wdrożono politykę ochrony danych osobowych?',
                      value: '',
                      comment: ''
                    },
                    {
                      id: 2,
                      text: 'Czy polityka ochrony danych osobowych jest aktualna i zgodna z RODO?',
                      value: '',
                      comment: ''
                    },
                    {
                      id: 3,
                      text: 'Czy pracownicy zostali zapoznani z polityką ochrony danych osobowych?',
                      value: '',
                      comment: ''
                    }
                  ]
                },
                {
                  id: 2,
                  name: 'I.2 Wyznaczenie ADO',
                  description: 'Wyznaczenie Administratora Danych Osobowych',
                  score: '',
                  comment: '',
                  requirements: [
                    {
                      id: 4,
                      text: 'Czy w jednostce nastąpiło powierzenie zadań ADO wyznaczonym podmiotom?',
                      value: '',
                      comment: ''
                    },
                    {
                      id: 5,
                      text: 'Czy zakres zadań ADO został jasno określony?',
                      value: '',
                      comment: ''
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
                  score: '',
                  comment: '',
                  requirements: [
                    {
                      id: 6,
                      text: 'Czy zidentyfikowano podstawy prawne przetwarzania danych osobowych?',
                      value: '',
                      comment: ''
                    }
                  ]
                }
              ]
            }
          ];
          
          setAssessment({
            id: 'new',
            name: '',
            description: '',
            status: 'DRAFT',
            chapters: mockChapters
          });
        }
      } catch (err) {
        setError('Nie udało się pobrać danych oceny');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssessment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (chapterIndex, areaIndex, requirementIndex, field, value) => {
    const updatedChapters = [...assessment.chapters];
    updatedChapters[chapterIndex].areas[areaIndex].requirements[requirementIndex][field] = value;
    setAssessment(prev => ({
      ...prev,
      chapters: updatedChapters
    }));
  };

  const handleAreaScoreChange = (chapterIndex, areaIndex, value) => {
    const updatedChapters = [...assessment.chapters];
    updatedChapters[chapterIndex].areas[areaIndex].score = value;
    setAssessment(prev => ({
      ...prev,
      chapters: updatedChapters
    }));
  };

  const handleAreaCommentChange = (chapterIndex, areaIndex, value) => {
    const updatedChapters = [...assessment.chapters];
    updatedChapters[chapterIndex].areas[areaIndex].comment = value;
    setAssessment(prev => ({
      ...prev,
      chapters: updatedChapters
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // W rzeczywistości będzie to wywołanie do backendu
      // const response = await assessmentService.saveAssessment(assessment);
      
      // Symulacja zapisywania
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Nie udało się zapisać oceny');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center">
          <p>Ładowanie formularza oceny...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>{id === 'new' ? 'Nowa ocena RODO' : 'Edycja oceny RODO'}</h1>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nazwa oceny</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={assessment.name}
                    onChange={handleInputChange}
                    placeholder="Wprowadź nazwę oceny"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Opis</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={assessment.description}
                    onChange={handleInputChange}
                    placeholder="Wprowadź opis oceny"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="assessment-form">
            <Card.Body>
              <Tab.Container id="assessment-tabs" defaultActiveKey="chapter-0">
                <Row>
                  <Col md={3}>
                    <Nav variant="pills" className="flex-column">
                      {assessment.chapters.map((chapter, chapterIndex) => (
                        <Nav.Item key={chapter.id}>
                          <Nav.Link eventKey={`chapter-${chapterIndex}`}>
                            {chapter.name}
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </Col>
                  <Col md={9}>
                    <Tab.Content>
                      {assessment.chapters.map((chapter, chapterIndex) => (
                        <Tab.Pane key={chapter.id} eventKey={`chapter-${chapterIndex}`}>
                          <div className="chapter-section">
                            <h3 className="chapter-title">{chapter.name}</h3>
                            <p>{chapter.description}</p>
                            
                            {chapter.areas.map((area, areaIndex) => (
                              <AnimatedAssessmentForm
                                key={area.id}
                                area={area}
                                chapterIndex={chapterIndex}
                                areaIndex={areaIndex}
                                handleRequirementChange={handleRequirementChange}
                                handleAreaScoreChange={handleAreaScoreChange}
                                handleAreaCommentChange={handleAreaCommentChange}
                              />
                            ))}
                          </div>
                        </Tab.Pane>
                      ))}
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Anuluj
              </Button>
              <div>
                <Button variant="primary" onClick={handleSave} disabled={loading}>
                  {loading ? 'Zapisywanie...' : 'Zapisz'}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Assessment;
