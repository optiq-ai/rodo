import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faCode } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-3" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-light)' }}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
              <span>Panel Oceny RODO &copy; {currentYear}</span>
            </div>
          </Col>
          <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-end">
              <FontAwesomeIcon icon={faCode} className="me-2" />
              <span>Wersja 1.0.0</span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
