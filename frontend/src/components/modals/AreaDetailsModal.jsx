import React from 'react';
import { Modal, Button, Row, Col, Table, Badge, ProgressBar, ListGroup, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { reportAPI } from '../services/api';
import { useState, useEffect } from 'react';

/**
 * Modal wyświetlający szczegółowe informacje o wybranym obszarze RODO
 */
const AreaDetailsModal = ({ show, onHide, area }) => {
  // Jeśli nie ma danych obszaru, nie renderuj nic
  if (!area) return null;

  const [areaDetails, setAreaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie szczegółowych danych obszaru z API
  useEffect(() => {
    const fetchAreaDetails = async () => {
      if (!area.id) return;
      
      try {
        setLoading(true);
        const data = await reportAPI.getAreaById(area.id);
        setAreaDetails(data);
        setError(null);
      } catch (err) {
        console.error('Błąd podczas pobierania szczegółów obszaru:', err);
        setError('Nie udało się pobrać szczegółów obszaru. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchAreaDetails();
  }, [area.id]);

  // Dane dla wykresu postępu w czasie
  const progressChartData = {
    labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze'],
    datasets: [
      {
        label: 'Poziom zgodności (%)',
        data: areaDetails?.progressHistory?.map(item => item.score) || 
              area.progressHistory || 
              [45, 48, 52, 58, 65, area.score],
        fill: false,
        backgroundColor: 'rgba(63, 81, 181, 0.8)',
        borderColor: 'rgba(63, 81, 181, 1)',
        tension: 0.4
      }
    ]
  };

  // Opcje dla wykresu
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Postęp zgodności w czasie',
        font: {
          size: 14
        }
      }
    }
  };

  // Funkcja zwracająca kolor dla statusu zgodności
  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'zgodny': return 'success';
      case 'częściowo zgodny': return 'warning';
      case 'niezgodny': return 'danger';
      default: return 'secondary';
    }
  };

  // Jeśli trwa ładowanie, wyświetl komunikat
  if (loading && !areaDetails) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Szczegóły obszaru: {area.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Ładowanie...</span>
          </div>
          <p className="mt-3">Ładowanie szczegółów obszaru...</p>
        </Modal.Body>
      </Modal>
    );
  }

  // Jeśli wystąpił błąd, wyświetl komunikat
  if (error) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Szczegóły obszaru: {area.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <div className="alert alert-danger">
            {error}
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  // Używamy danych z API jeśli są dostępne, w przeciwnym razie używamy danych przekazanych przez props
  const displayData = areaDetails || area;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Szczegóły obszaru: {displayData.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col>
            <h5 className="border-bottom pb-2">Informacje ogólne</h5>
            <Row>
              <Col md={6}>
                <p><strong>Poziom zgodności:</strong> {displayData.score}%</p>
                <p>
                  <strong>Poziom ryzyka:</strong>{' '}
                  <Badge bg={
                    displayData.risk === 'high' ? 'danger' : 
                    displayData.risk === 'medium' ? 'warning' : 'success'
                  }>
                    {displayData.risk === 'high' ? 'Wysokie' : 
                     displayData.risk === 'medium' ? 'Średnie' : 'Niskie'}
                  </Badge>
                </p>
                <p><strong>Ostatnia aktualizacja:</strong> {displayData.lastUpdated || '15.04.2025'}</p>
              </Col>
              <Col md={6}>
                <div className="mb-2">Status zgodności:</div>
                <ProgressBar 
                  now={displayData.score} 
                  variant={
                    displayData.score >= 75 ? 'success' : 
                    displayData.score >= 50 ? 'warning' : 'danger'
                  }
                  label={`${displayData.score}%`}
                  style={{ height: '24px' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5 className="border-bottom pb-2">Opis obszaru</h5>
            <p>{displayData.description || `Ten obszar dotyczy zgodności z wymogami RODO w zakresie ${displayData.name.toLowerCase()}. Obejmuje procedury, dokumentację i praktyki związane z przetwarzaniem danych osobowych w organizacji.`}</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5 className="border-bottom pb-2">Wymagania i status zgodności</h5>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Wymaganie</th>
                  <th>Status</th>
                  <th>Komentarz</th>
                </tr>
              </thead>
              <tbody>
                {(displayData.requirements || [
                  { id: 1, name: `Dokumentacja ${displayData.name.toLowerCase()}`, status: 'zgodny', comment: 'Dokumentacja kompletna i aktualna' },
                  { id: 2, name: `Procedury ${displayData.name.toLowerCase()}`, status: 'częściowo zgodny', comment: 'Procedury wymagają aktualizacji' },
                  { id: 3, name: `Szkolenia z zakresu ${displayData.name.toLowerCase()}`, status: displayData.score > 70 ? 'zgodny' : 'niezgodny', comment: displayData.score > 70 ? 'Szkolenia przeprowadzone' : 'Brak szkoleń' },
                  { id: 4, name: `Monitorowanie ${displayData.name.toLowerCase()}`, status: displayData.score > 60 ? 'częściowo zgodny' : 'niezgodny', comment: displayData.score > 60 ? 'Częściowe monitorowanie' : 'Brak monitorowania' },
                ]).map(req => (
                  <tr key={req.id}>
                    <td>{req.name}</td>
                    <td>
                      <Badge bg={getComplianceStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </td>
                    <td>{req.comment}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5 className="border-bottom pb-2">Postęp zgodności w czasie</h5>
            <div style={{ height: '250px' }}>
              <Line data={progressChartData} options={chartOptions} />
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <h5 className="border-bottom pb-2">Rekomendacje</h5>
            <ListGroup>
              {(displayData.recommendations || [
                { id: 1, text: `Zaktualizować dokumentację ${displayData.name.toLowerCase()}`, priority: displayData.score < 50 ? 'high' : 'medium' },
                { id: 2, text: `Przeprowadzić szkolenie z zakresu ${displayData.name.toLowerCase()}`, priority: displayData.score < 60 ? 'high' : 'low' },
                { id: 3, text: `Wdrożyć procedury monitorowania ${displayData.name.toLowerCase()}`, priority: displayData.score < 70 ? 'medium' : 'low' },
              ]).map(rec => (
                <ListGroup.Item key={rec.id} className="d-flex justify-content-between align-items-center">
                  {rec.text}
                  <Badge bg={
                    rec.priority === 'high' ? 'danger' : 
                    rec.priority === 'medium' ? 'warning' : 'info'
                  } pill>
                    {rec.priority === 'high' ? 'Wysoki' : 
                     rec.priority === 'medium' ? 'Średni' : 'Niski'} priorytet
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Zamknij
        </Button>
        <Button variant="primary">
          Generuj raport PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AreaDetailsModal;
