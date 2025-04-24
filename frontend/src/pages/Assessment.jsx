import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RadioButtonAssessmentForm from '../components/assessment/RadioButtonAssessmentForm';
import { assessmentAPI } from '../services/api';

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
          // Pobieranie istniejącej oceny z API
          const data = await assessmentAPI.getById(id);
          setAssessment(data);
        } else {
          // Pobieranie szablonu oceny z API
          const template = await assessmentAPI.getTemplate();
          setAssessment({
            id: 'new',
            name: '',
            description: '',
            status: 'DRAFT',
            chapters: template.chapters || []
          });
        }
      } catch (err) {
        setError('Nie udało się pobrać danych oceny: ' + (err.response?.data?.message || err.message));
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
      setLoading(true);
      const blob = await assessmentAPI.exportAssessment(assessment.id);
      
      // Tworzenie URL dla pobranego pliku
      const url = URL.createObjectURL(blob);
      
      // Tworzenie linku do pobrania pliku
      const a = document.createElement('a');
      a.href = url;
      a.download = `ocena-rodo-${assessment.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Nie udało się wyeksportować oceny: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      let response;
      if (assessment.id === 'new') {
        // Tworzenie nowej oceny
        response = await assessmentAPI.create(assessment);
        // Aktualizacja ID oceny po utworzeniu
        if (response.id) {
          setAssessment(prev => ({
            ...prev,
            id: response.id
          }));
          // Przekierowanie do edycji nowo utworzonej oceny
          navigate(`/assessment/${response.id}`);
        }
      } else {
        // Aktualizacja istniejącej oceny
        response = await assessmentAPI.update(assessment.id, assessment);
      }
      
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Nie udało się zapisać oceny: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Ładowanie...</span>
          </div>
          <p className="mt-3">Ładowanie formularza oceny...</p>
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
