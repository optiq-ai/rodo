import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Tabs, Tab, Alert } from 'react-bootstrap';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Radar, Bar, Line } from 'react-chartjs-2';
import AreaDetailsModal from '../components/modals/AreaDetailsModal';
import { reportAPI } from '../services/api';

// Rejestracja komponentów Chart.js
ChartJS.register(
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DetailedReports = () => {
  // Stan dla filtrów
  const [filters, setFilters] = useState({
    dateRange: 'all',
    riskCategory: 'all',
    riskLevel: 'all',
    sortBy: 'date'
  });

  // Stan dla danych
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [alertMessage, setAlertMessage] = useState(null);
  
  // Stan dla modala szczegółów obszaru
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  // Pobieranie danych z API
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Przygotowanie parametrów filtrowania dla API
        const apiFilters = {};
        if (filters.dateRange !== 'all') apiFilters.dateRange = filters.dateRange;
        if (filters.riskCategory !== 'all') apiFilters.riskCategory = filters.riskCategory;
        if (filters.riskLevel !== 'all') apiFilters.riskLevel = filters.riskLevel;
        if (filters.sortBy !== 'date') apiFilters.sortBy = filters.sortBy;
        
        // Pobieranie danych raportu z API
        const data = await reportAPI.getAll(apiFilters);
        setReportData(data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych raportu:', error);
        setAlertMessage({
          type: 'danger',
          text: 'Wystąpił błąd podczas pobierania danych raportu. Spróbuj ponownie później.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [filters]);

  // Obsługa zmiany filtrów
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Obsługa eksportu
  const handleExport = async () => {
    try {
      const result = await reportAPI.exportReport(exportFormat);
      
      setAlertMessage({
        type: 'success',
        text: result.message || `Raport został wyeksportowany do formatu ${exportFormat.toUpperCase()}`
      });
    } catch (error) {
      console.error('Błąd podczas eksportu raportu:', error);
      setAlertMessage({
        type: 'danger',
        text: 'Wystąpił błąd podczas eksportu raportu. Spróbuj ponownie później.'
      });
    }
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Obsługa udostępniania
  const handleShare = () => {
    setAlertMessage({
      type: 'success',
      text: 'Link do raportu został skopiowany do schowka'
    });
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Dane dla wykresu radarowego
  const radarData = {
    labels: reportData?.complianceAreas?.map(area => area.name) || [],
    datasets: [
      {
        label: 'Poziom zgodności (%)',
        data: reportData?.complianceAreas?.map(area => area.score) || [],
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(63, 81, 181, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(63, 81, 181, 1)'
      }
    ]
  };

  // Dane dla wykresu słupkowego
  const barData = {
    labels: reportData?.complianceAreas?.map(area => area.name) || [],
    datasets: [
      {
        label: 'Przed wdrożeniem środków',
        data: reportData?.riskAssessment?.beforeMitigation || [],
        backgroundColor: 'rgba(220, 53, 69, 0.6)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1
      },
      {
        label: 'Po wdrożeniu środków',
        data: reportData?.riskAssessment?.afterMitigation || [],
        backgroundColor: 'rgba(40, 167, 69, 0.6)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1
      }
    ]
  };

  // Dane dla wykresu liniowego
  const lineData = {
    labels: reportData?.trends?.labels || [],
    datasets: [
      {
        label: 'Trend zgodności z RODO (%)',
        data: reportData?.trends?.data || [],
        fill: false,
        backgroundColor: 'rgba(63, 81, 181, 0.8)',
        borderColor: 'rgba(63, 81, 181, 1)',
        tension: 0.4
      }
    ]
  };

  // Opcje dla wykresów
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Porównanie ocen ryzyka',
        font: {
          size: 16
        }
      }
    }
  };

  // Renderowanie komponentu ładowania
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </div>
        <p className="mt-3">Ładowanie danych raportu...</p>
      </Container>
    );
  }

  // Renderowanie zakładki przeglądu
  const renderOverviewTab = () => (
    <>
      <Row className="mb-4">
        <Col lg={6}>
          <Card className="h-100 fade-in" style={{animationDelay: '0.1s'}}>
            <Card.Header>
              <h5 className="mb-0">Poziom zgodności z RODO w obszarach</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '350px' }}>
                <Radar data={radarData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100 fade-in" style={{animationDelay: '0.2s'}}>
            <Card.Header>
              <h5 className="mb-0">Porównanie ocen ryzyka</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '350px' }}>
                <Bar data={barData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="fade-in" style={{animationDelay: '0.3s'}}>
            <Card.Header>
              <h5 className="mb-0">Trend zgodności z RODO</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '250px' }}>
                <Line data={lineData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="fade-in" style={{animationDelay: '0.4s'}}>
            <Card.Header>
              <h5 className="mb-0">Porównanie z branżą</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="d-flex flex-column align-items-center mb-3">
                <h6>Twój wynik</h6>
                <div className="display-4 fw-bold text-primary">{reportData?.benchmarks?.yourScore || 0}%</div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <small className="d-block text-muted">Średnia branżowa</small>
                  <div className="fw-bold">{reportData?.benchmarks?.industry || 0}%</div>
                </div>
                <div>
                  <small className="d-block text-muted">Najlepszy wynik</small>
                  <div className="fw-bold">{reportData?.benchmarks?.topPerformer || 0}%</div>
                </div>
              </div>
              <div className="progress mt-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{width: `${reportData?.benchmarks?.yourScore || 0}%`}}
                  aria-valuenow={reportData?.benchmarks?.yourScore || 0} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Renderowanie zakładki rekomendacji
  const renderRecommendationsTab = () => (
    <Card className="fade-in" style={{animationDelay: '0.1s'}}>
      <Card.Header>
        <h5 className="mb-0">Rekomendowane działania</h5>
      </Card.Header>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Obszar</th>
              <th>Rekomendowane działanie</th>
              <th>Priorytet</th>
              <th>Szacowany czas</th>
              <th>Szacowany koszt</th>
            </tr>
          </thead>
          <tbody>
            {(reportData?.recommendations || []).map(rec => (
              <tr key={rec.id}>
                <td>{rec.area}</td>
                <td>{rec.action}</td>
                <td>
                  <Badge bg={
                    rec.priority === 'high' ? 'danger' : 
                    rec.priority === 'medium' ? 'warning' : 'info'
                  }>
                    {rec.priority === 'high' ? 'Wysoki' : 
                     rec.priority === 'medium' ? 'Średni' : 'Niski'}
                  </Badge>
                </td>
                <td>{rec.estimatedTime}</td>
                <td>{rec.estimatedCost}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  // Renderowanie zakładki szczegółów
  const renderDetailsTab = () => (
    <>
      <Card className="mb-4 fade-in" style={{animationDelay: '0.1s'}}>
        <Card.Header>
          <h5 className="mb-0">Szczegółowa ocena obszarów</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Obszar</th>
                <th>Poziom zgodności</th>
                <th>Poziom ryzyka</th>
                <th>Szczegóły</th>
              </tr>
            </thead>
            <tbody>
              {(reportData?.complianceAreas || []).map(area => (
                <tr key={area.id}>
                  <td>{area.name}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1 me-2" style={{height: '10px'}}>
                        <div 
                          className={`progress-bar ${
                            area.score >= 75 ? 'bg-success' : 
                            area.score >= 50 ? 'bg-warning' : 'bg-danger'
                          }`}
                          role="progressbar" 
                          style={{width: `${area.score}%`}}
                          aria-valuenow={area.score} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        />
                      </div>
                      <span>{area.score}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge bg={
                      area.risk === 'high' ? 'danger' : 
                      area.risk === 'medium' ? 'warning' : 'success'
                    }>
                      {area.risk === 'high' ? 'Wysokie' : 
                       area.risk === 'medium' ? 'Średnie' : 'Niskie'}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        setSelectedArea(area);
                        setShowDetailsModal(true);
                      }}
                    >
                      Szczegóły
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Card className="fade-in" style={{animationDelay: '0.2s'}}>
        <Card.Header>
          <h5 className="mb-0">Nadchodzące terminy</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Zadanie</th>
                <th>Termin</th>
                <th>Pozostało dni</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(reportData?.upcomingDeadlines || []).map(deadline => (
                <tr key={deadline.id}>
                  <td>{deadline.task}</td>
                  <td>{deadline.deadline}</td>
                  <td>{deadline.daysLeft}</td>
                  <td>
                    <Badge bg={
                      deadline.daysLeft <= 7 ? 'danger' : 
                      deadline.daysLeft <= 30 ? 'warning' : 'info'
                    }>
                      {deadline.daysLeft <= 7 ? 'Pilne' : 
                       deadline.daysLeft <= 30 ? 'Zbliża się' : 'Planowane'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );

  return (
    <Container className="py-4 fade-in detailed-reports-container">
      {alertMessage && (
        <Alert variant={alertMessage.type} className="fade-in" onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage.text}
        </Alert>
      )}
      
      {/* Modal szczegółów obszaru */}
      <AreaDetailsModal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)} 
        area={selectedArea} 
      />
      
      <Row className="mb-4">
        <Col>
          <h2>Szczegółowe raporty RODO</h2>
          <p className="text-muted">Kompleksowa analiza zgodności z RODO, ocena ryzyka i rekomendacje</p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card className="fade-in" style={{animationDelay: '0.05s'}}>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3 mb-md-0">
                    <Form.Label>Zakres dat</Form.Label>
                    <Form.Select 
                      name="dateRange" 
                      value={filters.dateRange}
                      onChange={handleFilterChange}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="last30">Ostatnie 30 dni</option>
                      <option value="last90">Ostatnie 90 dni</option>
                      <option value="last180">Ostatnie 6 miesięcy</option>
                      <option value="last365">Ostatni rok</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3 mb-md-0">
                    <Form.Label>Kategoria ryzyka</Form.Label>
                    <Form.Select 
                      name="riskCategory" 
                      value={filters.riskCategory}
                      onChange={handleFilterChange}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="personal_data">Dane osobowe</option>
                      <option value="sensitive_data">Dane wrażliwe</option>
                      <option value="children_data">Dane dzieci</option>
                      <option value="profiling">Profilowanie</option>
                      <option value="marketing">Marketing</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3 mb-md-0">
                    <Form.Label>Poziom ryzyka</Form.Label>
                    <Form.Select 
                      name="riskLevel" 
                      value={filters.riskLevel}
                      onChange={handleFilterChange}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="high">Wysokie</option>
                      <option value="medium">Średnie</option>
                      <option value="low">Niskie</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3 mb-md-0">
                    <Form.Label>Sortuj według</Form.Label>
                    <Form.Select 
                      name="sortBy" 
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                    >
                      <option value="date">Data</option>
                      <option value="score">Poziom zgodności</option>
                      <option value="risk">Poziom ryzyka</option>
                      <option value="name">Nazwa</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card className="fade-in" style={{animationDelay: '0.1s'}}>
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-0 nav-tabs-custom"
                fill
              >
                <Tab eventKey="overview" title="Przegląd">
                  <div className="p-4">
                    {renderOverviewTab()}
                  </div>
                </Tab>
                <Tab eventKey="recommendations" title="Rekomendacje">
                  <div className="p-4">
                    {renderRecommendationsTab()}
                  </div>
                </Tab>
                <Tab eventKey="details" title="Szczegóły">
                  <div className="p-4">
                    {renderDetailsTab()}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col className="text-end">
          <Form.Group className="d-inline-block me-2">
            <Form.Select 
              size="sm"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              style={{width: '100px'}}
            >
              <option value="pdf">PDF</option>
              <option value="xlsx">Excel</option>
              <option value="docx">Word</option>
            </Form.Select>
          </Form.Group>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleExport}
            className="me-2"
          >
            Eksportuj raport
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={handleShare}
          >
            Udostępnij raport
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailedReports;
