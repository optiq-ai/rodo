import React from 'react';
import { Modal, Button, Row, Col, Table, Badge, ProgressBar, ListGroup, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';

/**
 * Modal wyświetlający szczegółowe informacje o wybranym obszarze RODO
 */
const AreaDetailsModal = ({ show, onHide, area }) => {
  // Jeśli nie ma danych obszaru, nie renderuj nic
  if (!area) return null;

  // Dane dla wykresu postępu w czasie
  const progressChartData = {
    labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze'],
    datasets: [
      {
        label: 'Poziom zgodności (%)',
        data: area.progressHistory || [45, 48, 52, 58, 65, area.score],
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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Szczegóły obszaru: {area.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col>
            <h5 className="border-bottom pb-2">Informacje ogólne</h5>
            <Row>
              <Col md={6}>
                <p><strong>Poziom zgodności:</strong> {area.score}%</p>
                <p>
                  <strong>Poziom ryzyka:</strong>{' '}
                  <Badge bg={
                    area.risk === 'high' ? 'danger' : 
                    area.risk === 'medium' ? 'warning' : 'success'
                  }>
                    {area.risk === 'high' ? 'Wysokie' : 
                     area.risk === 'medium' ? 'Średnie' : 'Niskie'}
                  </Badge>
                </p>
                <p><strong>Ostatnia aktualizacja:</strong> {area.lastUpdated || '15.04.2025'}</p>
              </Col>
              <Col md={6}>
                <div className="mb-2">Status zgodności:</div>
                <ProgressBar 
                  now={area.score} 
                  variant={
                    area.score >= 75 ? 'success' : 
                    area.score >= 50 ? 'warning' : 'danger'
                  }
                  label={`${area.score}%`}
                  style={{ height: '24px' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5 className="border-bottom pb-2">Opis obszaru</h5>
            <p>{area.description || `Ten obszar dotyczy zgodności z wymogami RODO w zakresie ${area.name.toLowerCase()}. Obejmuje procedury, dokumentację i praktyki związane z przetwarzaniem danych osobowych w organizacji.`}</p>
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
                {(area.requirements || [
                  { id: 1, name: `Dokumentacja ${area.name.toLowerCase()}`, status: 'zgodny', comment: 'Dokumentacja kompletna i aktualna' },
                  { id: 2, name: `Procedury ${area.name.toLowerCase()}`, status: 'częściowo zgodny', comment: 'Procedury wymagają aktualizacji' },
                  { id: 3, name: `Szkolenia z zakresu ${area.name.toLowerCase()}`, status: area.score > 70 ? 'zgodny' : 'niezgodny', comment: area.score > 70 ? 'Szkolenia przeprowadzone' : 'Brak szkoleń' },
                  { id: 4, name: `Monitorowanie ${area.name.toLowerCase()}`, status: area.score > 60 ? 'częściowo zgodny' : 'niezgodny', comment: area.score > 60 ? 'Częściowe monitorowanie' : 'Brak monitorowania' },
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
              {(area.recommendations || [
                { id: 1, text: `Zaktualizować dokumentację ${area.name.toLowerCase()}`, priority: area.score < 50 ? 'high' : 'medium' },
                { id: 2, text: `Przeprowadzić szkolenie z zakresu ${area.name.toLowerCase()}`, priority: area.score < 60 ? 'high' : 'low' },
                { id: 3, text: `Wdrożyć procedury monitorowania ${area.name.toLowerCase()}`, priority: area.score < 70 ? 'medium' : 'low' },
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
