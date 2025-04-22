import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form, Table, Badge, Alert, OverlayTrigger, Tooltip, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartPie, faChartLine, faInfoCircle, faDownload, faExchangeAlt, faHistory, faTable } from '@fortawesome/free-solid-svg-icons';
// Komentujemy import bibliotek wykresów i PDF do czasu rozwiązania problemu z zależnościami
// import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale } from 'chart.js';
// import { Pie, Bar, Line, PolarArea } from 'react-chartjs-2';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

/**
 * Komponent wizualizacji oceny RODO
 * 
 * Funkcjonalności:
 * - Różne typy wykresów (kołowy, słupkowy, liniowy, polarny)
 * - Porównanie z poprzednimi ocenami
 * - Analiza trendów w czasie
 * - Eksport wizualizacji do PNG/PDF
 * - Interaktywne elementy wykresów
 */
const AssessmentVisualizations = ({ assessmentData }) => {
  // Rejestracja komponentów ChartJS - zakomentowane do czasu rozwiązania problemu z zależnościami
  // ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale);
  
  // Mockowe dane dla wizualizacji
  const initialVisualizationData = {
    lastUpdated: '2025-04-15',
    areas: [
      { id: 1, name: 'Zasady przetwarzania', score: 70, weight: 1.5, maxScore: 100 },
      { id: 2, name: 'Prawa podmiotów', score: 60, weight: 1.2, maxScore: 100 },
      { id: 3, name: 'Obowiązki administratora', score: 75, weight: 1.3, maxScore: 100 },
      { id: 4, name: 'Bezpieczeństwo danych', score: 50, weight: 1.8, maxScore: 100 },
      { id: 5, name: 'Przekazywanie danych', score: 60, weight: 1.0, maxScore: 100 },
      { id: 6, name: 'Dokumentacja', score: 80, weight: 1.2, maxScore: 100 }
    ],
    previousAssessments: [
      { 
        date: '2025-03-01', 
        areas: [
          { id: 1, name: 'Zasady przetwarzania', score: 65 },
          { id: 2, name: 'Prawa podmiotów', score: 55 },
          { id: 3, name: 'Obowiązki administratora', score: 70 },
          { id: 4, name: 'Bezpieczeństwo danych', score: 60 },
          { id: 5, name: 'Przekazywanie danych', score: 70 },
          { id: 6, name: 'Dokumentacja', score: 75 }
        ]
      },
      { 
        date: '2025-01-15', 
        areas: [
          { id: 1, name: 'Zasady przetwarzania', score: 60 },
          { id: 2, name: 'Prawa podmiotów', score: 50 },
          { id: 3, name: 'Obowiązki administratora', score: 65 },
          { id: 4, name: 'Bezpieczeństwo danych', score: 70 },
          { id: 5, name: 'Przekazywanie danych', score: 80 },
          { id: 6, name: 'Dokumentacja', score: 70 }
        ]
      }
    ],
    complianceByCategory: {
      labels: ['Dane osobowe zwykłe', 'Dane wrażliwe', 'Dane dzieci', 'Profilowanie', 'Marketing', 'Monitoring'],
      datasets: [
        {
          label: 'Poziom zgodności (%)',
          data: [85, 70, 60, 75, 80, 65],
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    riskTrends: {
      labels: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień'],
      datasets: [
        {
          label: 'Ogólny poziom ryzyka',
          data: [85, 80, 75, 65],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        },
        {
          label: 'Bezpieczeństwo danych',
          data: [70, 65, 60, 50],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        }
      ]
    }
  };

  const [visualizationData, setVisualizationData] = useState(initialVisualizationData);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChart, setSelectedChart] = useState('pie');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedPreviousAssessment, setSelectedPreviousAssessment] = useState(null);
  // Dodanie flagi, aby zapobiec nieskończonej pętli
  const [isInitialized, setIsInitialized] = useState(false);

  // Efekt do aktualizacji danych wizualizacji na podstawie danych z formularza
  // Uruchamiany tylko przy pierwszym renderowaniu lub gdy zmienią się dane wejściowe
  useEffect(() => {
    if (assessmentData && !isInitialized) {
      // Aktualizacja danych tylko jeśli są dostępne i nie zostały jeszcze zainicjalizowane
      if (assessmentData.visualizationData) {
        setVisualizationData(assessmentData.visualizationData);
      }
      setIsInitialized(true);
    }
  }, [assessmentData, isInitialized]);

  // Funkcja do eksportu wizualizacji do PNG
  const exportToPNG = () => {
    // Funkcjonalność eksportu do PNG zostanie zaimplementowana po rozwiązaniu problemu z zależnościami
    console.log('Eksport do PNG: wizualizacja oceny');
    alert('Funkcja eksportu do PNG zostanie dostępna po rozwiązaniu problemu z zależnościami.');
    
    // Kod do odkomentowania po rozwiązaniu problemu z zależnościami
    /*
    const chartElement = document.getElementById('chart-container');
    
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const link = document.createElement('a');
        link.download = `ocena-rodo-wizualizacja-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
    */
  };

  // Funkcja do eksportu wizualizacji do PDF
  const exportToPDF = () => {
    // Funkcjonalność eksportu do PDF zostanie zaimplementowana po rozwiązaniu problemu z zależnościami
    console.log('Eksport do PDF: wizualizacja oceny');
    alert('Funkcja eksportu do PDF zostanie dostępna po rozwiązaniu problemu z zależnościami.');
    
    // Kod do odkomentowania po rozwiązaniu problemu z zależnościami
    /*
    const chartElement = document.getElementById('chart-container');
    
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ocena-rodo-wizualizacja-${new Date().toISOString().slice(0, 10)}.pdf`);
      });
    }
    */
  };

  // Funkcja zwracająca kolor na podstawie oceny
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  // Renderowanie tabeli z danymi zamiast wykresów (tymczasowo)
  const renderDataTable = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Obszar</th>
            <th>Ocena</th>
            <th>Poziom ryzyka</th>
          </tr>
        </thead>
        <tbody>
          {visualizationData.areas.map(area => (
            <tr key={area.id}>
              <td>{area.name}</td>
              <td>
                <Badge bg={getScoreColor(area.score)} className="p-2">
                  {area.score}%
                </Badge>
              </td>
              <td>
                <Badge bg={getScoreColor(area.score)}>
                  {area.score >= 80 ? 'Niski' : area.score >= 60 ? 'Średni' : 'Wysoki'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  // Renderowanie tabeli porównawczej (tymczasowo)
  const renderComparisonTable = () => {
    if (!selectedPreviousAssessment) return null;
    
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Obszar</th>
            <th>Aktualna ocena</th>
            <th>Poprzednia ocena ({new Date(selectedPreviousAssessment.date).toLocaleDateString()})</th>
            <th>Zmiana</th>
          </tr>
        </thead>
        <tbody>
          {visualizationData.areas.map(currentArea => {
            const previousArea = selectedPreviousAssessment.areas.find(a => a.id === currentArea.id);
            if (!previousArea) return null;
            
            const change = currentArea.score - previousArea.score;
            const changeDirection = change > 0 ? 'success' : change < 0 ? 'danger' : 'secondary';
            
            return (
              <tr key={currentArea.id}>
                <td>{currentArea.name}</td>
                <td>
                  <Badge bg={getScoreColor(currentArea.score)} className="p-2">
                    {currentArea.score}%
                  </Badge>
                </td>
                <td>
                  <Badge bg={getScoreColor(previousArea.score)} className="p-2">
                    {previousArea.score}%
                  </Badge>
                </td>
                <td>
                  <Badge bg={changeDirection}>
                    {change > 0 ? '+' : ''}{change}%
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  // Renderowanie tabeli trendów (tymczasowo)
  const renderTrendsTable = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Miesiąc</th>
            {visualizationData.riskTrends.datasets.map((dataset, index) => (
              <th key={index}>{dataset.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visualizationData.riskTrends.labels.map((month, monthIndex) => (
            <tr key={monthIndex}>
              <td>{month}</td>
              {visualizationData.riskTrends.datasets.map((dataset, datasetIndex) => (
                <td key={datasetIndex}>
                  <Badge bg={getScoreColor(dataset.data[monthIndex])} className="p-2">
                    {dataset.data[monthIndex]}%
                  </Badge>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          Wizualizacje oceny
        </h5>
        <div>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setComparisonMode(!comparisonMode)}
            className="me-2"
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="me-1" />
            {comparisonMode ? 'Wyłącz tryb porównawczy' : 'Włącz tryb porównawczy'}
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={exportToPNG}
            className="me-2"
          >
            <FontAwesomeIcon icon={faDownload} className="me-1" />
            Eksportuj do PNG
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={exportToPDF}
          >
            <FontAwesomeIcon icon={faDownload} className="me-1" />
            Eksportuj do PDF
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab 
            eventKey="overview" 
            title={
              <span>
                <FontAwesomeIcon icon={faChartPie} className="me-2" />
                Przegląd
              </span>
            }
          />
          <Tab 
            eventKey="trends" 
            title={
              <span>
                <FontAwesomeIcon icon={faChartLine} className="me-2" />
                Trendy
              </span>
            }
          />
          <Tab 
            eventKey="history" 
            title={
              <span>
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Historia
              </span>
            }
          />
          <Tab 
            eventKey="data" 
            title={
              <span>
                <FontAwesomeIcon icon={faTable} className="me-2" />
                Dane
              </span>
            }
          />
        </Tabs>

        {comparisonMode && activeTab !== 'trends' && activeTab !== 'history' && (
          <div className="mb-4">
            <Form.Group>
              <Form.Label>Wybierz ocenę do porównania:</Form.Label>
              <Form.Select 
                value={selectedPreviousAssessment ? visualizationData.previousAssessments.findIndex(a => a.date === selectedPreviousAssessment.date) : ''}
                onChange={(e) => {
                  const index = parseInt(e.target.value);
                  setSelectedPreviousAssessment(index >= 0 ? visualizationData.previousAssessments[index] : null);
                }}
              >
                <option value="">Wybierz ocenę...</option>
                {visualizationData.previousAssessments.map((assessment, index) => (
                  <option key={index} value={index}>
                    {new Date(assessment.date).toLocaleDateString()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        )}

        <div id="chart-container" className="p-3 bg-light rounded">
          {activeTab === 'overview' && (
            <div>
              <h6 className="mb-3">Przegląd oceny RODO</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-center mb-3">
                  <div className="btn-group">
                    <Button 
                      variant={selectedChart === 'pie' ? 'primary' : 'outline-primary'} 
                      onClick={() => setSelectedChart('pie')}
                    >
                      Wykres kołowy
                    </Button>
                    <Button 
                      variant={selectedChart === 'bar' ? 'primary' : 'outline-primary'} 
                      onClick={() => setSelectedChart('bar')}
                    >
                      Wykres słupkowy
                    </Button>
                    <Button 
                      variant={selectedChart === 'radar' ? 'primary' : 'outline-primary'} 
                      onClick={() => setSelectedChart('radar')}
                    >
                      Wykres radarowy
                    </Button>
                  </div>
                </div>
                
                <Alert variant="info" className="text-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Wykresy będą dostępne po rozwiązaniu problemu z zależnościami. Poniżej przedstawiono dane w formie tabeli.
                </Alert>
                
                {comparisonMode && selectedPreviousAssessment ? (
                  renderComparisonTable()
                ) : (
                  renderDataTable()
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'trends' && (
            <div>
              <h6 className="mb-3">Trendy w czasie</h6>
              <Alert variant="info" className="text-center">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Wykresy trendów będą dostępne po rozwiązaniu problemu z zależnościami. Poniżej przedstawiono dane w formie tabeli.
              </Alert>
              {renderTrendsTable()}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <h6 className="mb-3">Historia ocen</h6>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{new Date(visualizationData.lastUpdated).toLocaleDateString()} (Aktualna)</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setComparisonMode(false);
                          setActiveTab('overview');
                        }}
                      >
                        Pokaż szczegóły
                      </Button>
                    </td>
                  </tr>
                  {visualizationData.previousAssessments.map((assessment, index) => (
                    <tr key={index}>
                      <td>{new Date(assessment.date).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            setSelectedPreviousAssessment(assessment);
                            setComparisonMode(true);
                            setActiveTab('overview');
                          }}
                          className="me-2"
                        >
                          Porównaj z aktualną
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div>
              <h6 className="mb-3">Dane oceny</h6>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Obszar</th>
                    <th>Ocena</th>
                    <th>Waga</th>
                    <th>Ważona ocena</th>
                  </tr>
                </thead>
                <tbody>
                  {visualizationData.areas.map(area => (
                    <tr key={area.id}>
                      <td>{area.name}</td>
                      <td>{area.score}%</td>
                      <td>{area.weight}</td>
                      <td>{Math.round(area.score * area.weight)}%</td>
                    </tr>
                  ))}
                  <tr className="table-active">
                    <td colSpan={3}><strong>Średnia ważona:</strong></td>
                    <td>
                      <strong>
                        {Math.round(
                          visualizationData.areas.reduce((sum, area) => sum + (area.score * area.weight), 0) /
                          visualizationData.areas.reduce((sum, area) => sum + area.weight, 0)
                        )}%
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AssessmentVisualizations;
