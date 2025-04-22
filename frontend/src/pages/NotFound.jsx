import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="my-5 text-center">
      <Alert variant="warning">
        <h2>404 - Strona nie znaleziona</h2>
        <p>Przepraszamy, ale strona której szukasz nie istnieje.</p>
      </Alert>
      <Button as={Link} to="/dashboard" variant="primary">
        Powrót do dashboardu
      </Button>
    </Container>
  );
};

export default NotFound;
