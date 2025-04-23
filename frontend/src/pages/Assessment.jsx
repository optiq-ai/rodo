import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RadioButtonAssessmentForm from '../components/assessment/RadioButtonAssessmentForm';

const Assessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
          // Pobieranie istniejącej oceny
          const response = await fetch(`http://localhost:8080/assessments/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const assessmentData = await response.json();
            setAssessment(assessmentData);
          } else {
            setError('Nie udało się pobrać danych oceny');
          }
        } else {
          // Pobieranie szablonu dla nowej oceny
          const response = await fetch('http://localhost:8080/assessments/template', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const templateData = await response.json();
            setAssessment({
              id: 'new',
              name: '',
              description: '',
              status: 'DRAFT',
              chapters: templateData.chapters || []
            });
          } else {
            setError('Nie udało się pobrać szablonu oceny');
          }
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

  // Funkcje nawigacji między obszarami
  const handleNextArea = () => {
    const currentChapter = assessment.chapters[currentChapterIndex];
    if (currentAreaIndex < currentChapter.areas.length - 1) {
      // Przejście do następnego obszaru w tym samym rozdziale
      setCurrentAreaIndex(currentAreaIndex + 1);
    } else if (currentChapterIndex < assessment.chapters.length - 1) {
      // Przejście do pierwszego obszaru w następnym rozdziale
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentAreaIndex(0);
    }
    updateProgress();
  };

  const handlePrevArea = () => {
    if (currentAreaIndex > 0) {
      // Przejście do poprzedniego obszaru w tym samym rozdziale
      setCurrentAreaIndex(currentAreaIndex - 1);
    } else if (currentChapterIndex > 0) {
      // Przejście do ostatniego obszaru w poprzednim rozdziale
      setCurrentChapterIndex(currentChapterIndex - 1);
      const prevChapter = assessment.chapters[currentChapterIndex - 1];
      setCurrentAreaIndex(prevChapter.areas.length - 1);
    }
    updateProgress();
  };

  // Funkcja do obliczania ogólnego postępu
  const updateProgress = () => {
    let totalRequirements = 0;
    let answeredRequirements = 0;

    assessment.chapters.forEach(chapter => {
      chapter.areas.forEach(area => {
        area.requirements.forEach(req => {
          totalRequirements++;
          if (req.value) {
            answeredRequirements++;
          }
        });
      });
    });

    const progress = totalRequirements > 0 ? Math.round((answeredRequirements / totalRequirements) * 100) : 0;
    setOverallProgress(progress);
  };

  // Funkcja eksportu oceny
  const handleExport = async () => {
    try {
      if (assessment.id === 'new') {
        setError('Przed eksportem należy zapisać ocenę');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/assessments/${assessment.id}/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ocena-rodo-${assessment.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        setError('Nie udało się wyeksportować oceny');
      }
    } catch (err) {
      setError('Nie udało się wyeksportować oceny');
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const method = assessment.id === 'new' ? 'POST' : 'PUT';
      const url = assessment.id === 'new' 
        ? 'http://localhost:8080/assessments'
        : `http://localhost:8080/assessments/${assessment.id}`;
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(assessment)
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Jeśli to nowa ocena, zaktualizuj ID
        if (assessment.id === 'new' && result.id) {
          setAssessment(prev => ({
            ...prev,
            id: result.id
          }));
          
          // Zaktualizuj URL bez przeładowania strony
          window.history.replaceState(null, '', `/assessment/${result.id}`);
        }
        
        setSaveSuccess(true);
        // Ukryj komunikat o sukcesie po 3 sekundach
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Nie udało się zapisać oceny');
      }
    } catch (err) {
      setError('Nie udało się zapisać oceny');
      console.error(err);
    } finally {
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
          <h1 className="fade-in">{id === 'new' ? 'Nowa ocena RODO' : 'Edycja oceny RODO'}</h1>
          {error && <Alert variant="danger" className="fade-in">{error}</Alert>}
          {saveSuccess && <Alert variant="success" className="fade-in">Zmiany zostały pomyślnie zapisane!</Alert>}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="fade-in">
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
                    className="comment-animated"
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
                    className="comment-animated"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {assessment.chapters.length > 0 && (
        <>
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Ogólny postęp oceny:</h5>
                <span className="badge bg-primary">{overallProgress}%</span>
              </div>
              <ProgressBar 
                now={overallProgress} 
                variant={overallProgress < 30 ? "danger" : overallProgress < 70 ? "warning" : "success"} 
                animated 
                style={{height: '15px'}}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              {assessment.chapters[currentChapterIndex] && assessment.chapters[currentChapterIndex].areas[currentAreaIndex] && (
                <RadioButtonAssessmentForm
                  area={assessment.chapters[currentChapterIndex].areas[currentAreaIndex]}
                  chapterIndex={currentChapterIndex}
                  areaIndex={currentAreaIndex}
                  handleRequirementChange={handleRequirementChange}
                  handleAreaScoreChange={handleAreaScoreChange}
                  handleAreaCommentChange={handleAreaCommentChange}
                  totalAreas={assessment.chapters.reduce((total, chapter) => total + chapter.areas.length, 0)}
                  currentAreaIndex={assessment.chapters.slice(0, currentChapterIndex).reduce((total, chapter) => total + chapter.areas.length, 0) + currentAreaIndex}
                  onNextArea={handleNextArea}
                  onPrevArea={handlePrevArea}
                  onSave={handleSave}
                  onExport={handleExport}
                />
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Assessment;
