import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <div className="text-center">
            <h1>Panel Oceny RODO</h1>
            <p className="lead">
              Kompleksowe narzędzie do oceny zgodności z Rozporządzeniem o Ochronie Danych Osobowych
            </p>
          </div>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={4} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Body>
              <Card.Title>Ocena zgodności</Card.Title>
              <Card.Text>
                Przeprowadź kompleksową ocenę zgodności z RODO w oparciu o 49 obszarów badania i 111 wymogów.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/login" variant="primary">Rozpocznij ocenę</Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Body>
              <Card.Title>Raportowanie</Card.Title>
              <Card.Text>
                Generuj szczegółowe raporty z oceny zgodności z RODO i monitoruj postępy w realizacji wymogów.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/login" variant="primary">Zobacz raporty</Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Body>
              <Card.Title>Zarządzanie</Card.Title>
              <Card.Text>
                Zarządzaj ocenami, użytkownikami i uprawnieniami w jednym miejscu.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/login" variant="primary">Zaloguj się</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row className="my-5">
        <Col>
          <Card className="p-4">
            <h3>O aplikacji</h3>
            <p>
              Panel Oceny RODO to narzędzie stworzone z myślą o ułatwieniu procesu oceny zgodności z Rozporządzeniem o Ochronie Danych Osobowych (RODO). 
              Aplikacja umożliwia przeprowadzenie kompleksowej oceny w oparciu o 49 obszarów badania pogrupowanych w 7 rozdziałach, które obejmują wszystkie 
              aspekty zarządzania systemem ochrony danych osobowych.
            </p>
            <p>
              Dzięki intuicyjnemu interfejsowi, możliwości generowania raportów i śledzenia postępów, Panel Oceny RODO stanowi nieocenione wsparcie 
              dla Inspektorów Ochrony Danych, Administratorów Danych Osobowych oraz wszystkich osób odpowiedzialnych za zapewnienie zgodności z RODO.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
