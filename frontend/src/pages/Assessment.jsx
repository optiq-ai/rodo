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
          
          // Sprawdź, czy dane zawierają rozdziały, jeśli nie, użyj danych mockowych
          if (!data.chapters || data.chapters.length === 0) {
            console.warn('API zwróciło ocenę bez rozdziałów, używam danych mockowych');
            
            // Mockowe dane dla rozdziałów
            const mockChapters = getMockChapters();
            
            setAssessment({
              ...data,
              chapters: mockChapters
            });
          } else {
            // Upewnij się, że wszystkie wymagania mają zarówno pole value jak i status
            const processedData = processAssessmentData(data);
            setAssessment(processedData);
          }
          
          // Oblicz postęp po załadowaniu danych
          setTimeout(() => {
            calculateAndUpdateProgress();
          }, 500);
        } else {
          // Pobieranie szablonu oceny z API
          const template = await assessmentAPI.getTemplate();
          
          // Jeśli API nie zwraca rozdziałów, użyj danych mockowych
          if (!template.chapters || template.chapters.length === 0) {
            console.warn('API nie zwróciło rozdziałów, używam danych mockowych');
            
            // Mockowe dane dla rozdziałów
            const mockChapters = getMockChapters();
            
            setAssessment({
              id: 'new',
              name: '',
              description: '',
              status: 'DRAFT',
              chapters: mockChapters
            });
          } else {
            // Użyj danych z API
            setAssessment({
              id: 'new',
              name: '',
              description: '',
              status: 'DRAFT',
              chapters: template.chapters
            });
          }
        }
      } catch (err) {
        console.error('Błąd podczas pobierania danych oceny:', err);
        setError('Nie udało się pobrać danych oceny: ' + (err.response?.data?.message || err.message));
        
        // W przypadku błędu, użyj danych mockowych
        const mockChapters = getMockChapters();
        
        setAssessment({
          id: id === 'new' ? 'new' : id,
          name: '',
          description: '',
          status: 'DRAFT',
          chapters: mockChapters
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Funkcja do przetwarzania danych oceny, aby zapewnić spójność pól value i status
  const processAssessmentData = (data) => {
    if (!data.chapters) return data;
    
    const processedData = { ...data };
    
    processedData.chapters.forEach(chapter => {
      if (chapter.areas) {
        chapter.areas.forEach(area => {
          if (area.requirements) {
            area.requirements.forEach(req => {
              // Jeśli wymaganie ma wartość, ale nie ma statusu, dodaj status
              if (req.value && !req.status) {
                req.status = req.value === 'yes' ? 'COMPLETED' : 
                             req.value === 'no' ? 'NOT_APPLICABLE' : 
                             req.value === 'partial' ? 'IN_PROGRESS' : 'NOT_STARTED';
              }
              // Jeśli wymaganie ma status, ale nie ma wartości, dodaj wartość
              if (req.status && !req.value) {
                req.value = req.status === 'COMPLETED' ? 'yes' : 
                           req.status === 'NOT_APPLICABLE' ? 'no' : 
                           req.status === 'IN_PROGRESS' ? 'partial' : '';
              }
            });
          }
        });
      }
    });
    
    return processedData;
  };

  // Funkcja zwracająca mockowe dane rozdziałów
  const getMockChapters = () => {
    return [
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
                status: 'NOT_STARTED',
                comment: ''
              },
              {
                id: 2,
                text: 'Czy polityka ochrony danych osobowych jest aktualna i zgodna z RODO?',
                value: '',
                status: 'NOT_STARTED',
                comment: ''
              },
              {
                id: 3,
                text: 'Czy pracownicy zostali zapoznani z polityką ochrony danych osobowych?',
                value: '',
                status: 'NOT_STARTED',
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
                status: 'NOT_STARTED',
                comment: ''
              },
              {
                id: 5,
                text: 'Czy zakres zadań ADO został jasno określony?',
                value: '',
                status: 'NOT_STARTED',
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
                status: 'NOT_STARTED',
                comment: ''
              }
            ]
          }
        ]
      }
    ];
  };

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
    
    // Jeśli zmieniamy wartość (value), zaktualizuj również status
    if (field === 'value') {
      const status = value === 'yes' ? 'COMPLETED' : 
                    value === 'no' ? 'NOT_APPLICABLE' : 
                    value === 'partial' ? 'IN_PROGRESS' : 'NOT_STARTED';
      updatedChapters[chapterIndex].areas[areaIndex].requirements[requirementIndex].status = status;
    }
    
    // Jeśli zmieniamy status, zaktualizuj również wartość
    if (field === 'status') {
      const valueFromStatus = value === 'COMPLETED' ? 'yes' : 
                             value === 'NOT_APPLICABLE' ? 'no' : 
                             value === 'IN_PROGRESS' ? 'partial' : '';
      updatedChapters[chapterIndex].areas[areaIndex].requirements[requirementIndex].value = valueFromStatus;
    }
    
    setAssessment(prev => ({
      ...prev,
      chapters: updatedChapters
    }));
    
    // Aktualizuj postęp po zmianie wartości wymagania
    calculateAndUpdateProgress();
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
    calculateAndUpdateProgress();
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
    calculateAndUpdateProgress();
  };

  // Funkcja do obliczania ogólnego postępu
  const calculateAndUpdateProgress = () => {
    let totalRequirements = 0;
    let answeredRequirements = 0;

    assessment.chapters.forEach(chapter => {
      if (chapter.areas) {
        chapter.areas.forEach(area => {
          if (area.requirements) {
            area.requirements.forEach(req => {
              totalRequirements++;
              // Sprawdź zarówno pole value jak i status
              if ((req.value && req.value !== '') || 
                  (req.status && req.status !== 'NOT_STARTED')) {
                answeredRequirements++;
              }
            });
          }
        });
      }
    });

    const progress = totalRequirements > 0 ? Math.round((answeredRequirements / totalRequirements) * 100) : 0;
    setOverallProgress(progress);
    
    // Aktualizuj również status oceny w zależności od postępu
    let newStatus = assessment.status;
    if (progress === 100) {
      newStatus = 'ZAKOŃCZONA';
    } else if (progress > 0) {
      newStatus = 'W TRAKCIE';
    } else {
      newStatus = 'DRAFT';
    }
    
    if (newStatus !== assessment.status) {
      setAssessment(prev => ({
        ...prev,
        status: newStatus
      }));
    }
    
    return progress;
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
      
      // Oblicz aktualny postęp przed zapisem
      const currentProgress = calculateAndUpdateProgress();
      
      // Przygotuj dane do zapisu z aktualnym postępem
      const assessmentToSave = {
        ...assessment,
        progress: currentProgress
      };
      
      console.log('Zapisywanie oceny:', JSON.stringify(assessmentToSave, null, 2));
      
      let response;
      if (assessment.id === 'new') {
        // Tworzenie nowej oceny
        response = await assessmentAPI.create(assessmentToSave);
        // Aktualizacja ID oceny po utworzeniu
        if (response.id) {
          // Zamiast przekierowywać, pobierz pełne dane oceny
          const savedAssessment = await assessmentAPI.getById(response.id);
          
          // Jeśli API nie zwraca rozdziałów, zachowaj obecne rozdziały
          if (!savedAssessment.chapters || savedAssessment.chapters.length === 0) {
            savedAssessment.chapters = assessment.chapters;
          } else {
            // Przetwórz dane, aby zapewnić spójność pól value i status
            const processedData = processAssessmentData(savedAssessment);
            savedAssessment.chapters = processedData.chapters;
          }
          
          setAssessment(savedAssessment);
          
          // Aktualizuj URL bez przeładowania strony
          window.history.pushState({}, '', `/assessment/${response.id}`);
        }
      } else {
        // Aktualizacja istniejącej oceny
        response = await assessmentAPI.update(assessment.id, assessmentToSave);
        
        // Pobierz zaktualizowane dane, ale zachowaj rozdziały jeśli API ich nie zwraca
        if (response.success) {
          const updatedAssessment = await assessmentAPI.getById(assessment.id);
          
          // Jeśli API nie zwraca rozdziałów, zachowaj obecne rozdziały
          if (!updatedAssessment.chapters || updatedAssessment.chapters.length === 0) {
            updatedAssessment.chapters = assessment.chapters;
          } else {
            // Przetwórz dane, aby zapewnić spójność pól value i status
            const processedData = processAssessmentData(updatedAssessment);
            updatedAssessment.chapters = processedData.chapters;
          }
          
          setAssessment(updatedAssessment);
        }
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

  // Sprawdź, czy mamy rozdziały i obszary
  const hasChaptersAndAreas = assessment.chapters && 
                             assessment.chapters.length > 0 && 
                             assessment.chapters[0].areas && 
                             assessment.chapters[0].areas.length > 0;

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
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={handleSave}>
                    Zapisz ocenę
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {hasChaptersAndAreas ? (
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
      ) : (
        <Row>
          <Col>
            <Alert variant="info">
              Brak rozdziałów lub obszarów do wyświetlenia. Zapisz podstawowe informacje o ocenie, aby kontynuować.
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Assessment;
