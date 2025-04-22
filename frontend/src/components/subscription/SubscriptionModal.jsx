import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const SubscriptionModal = ({ show, onHide, planType, planPrice }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Polska'
  });
  
  const [validated, setValidated] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setProcessing(true);
    setError('');
    
    // Symulacja przetwarzania płatności
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Zamknij modal po 2 sekundach od sukcesu
      setTimeout(() => {
        onHide(true); // Przekazujemy true, aby wskazać, że operacja zakończyła się sukcesem
      }, 2000);
    }, 1500);
  };
  
  const formatCardNumber = (value) => {
    // Usuń wszystkie znaki niebędące cyframi
    const v = value.replace(/\D/g, '');
    
    // Dodaj spacje co 4 cyfry
    const matches = v.match(/\d{1,4}/g);
    const match = matches && matches.join(' ');
    
    return match || '';
  };
  
  const formatExpiryDate = (value) => {
    // Usuń wszystkie znaki niebędące cyframi
    const v = value.replace(/\D/g, '');
    
    // Dodaj ukośnik po 2 cyfrach (MM/YY)
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    
    return v;
  };
  
  return (
    <Modal 
      show={show} 
      onHide={() => onHide(false)} 
      centered
      backdrop="static"
      size="lg"
      className="subscription-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Wybór planu {planType === 'premium' ? 'Premium' : 'Basic'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <Alert variant="success" className="text-center py-4">
            <h4>Płatność zaakceptowana!</h4>
            <p>Twój plan {planType === 'premium' ? 'Premium' : 'Basic'} został aktywowany.</p>
            <p>Za chwilę nastąpi przekierowanie...</p>
          </Alert>
        ) : (
          <>
            <div className="mb-4 text-center">
              <h5>Podsumowanie zamówienia</h5>
              <p className="mb-1">Plan: <strong>{planType === 'premium' ? 'Premium' : 'Basic'}</strong></p>
              <p className="mb-1">Cena: <strong>{planPrice} PLN / miesiąc</strong></p>
              <p className="text-muted small">Płatność będzie odnawiana automatycznie co miesiąc</p>
            </div>
            
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <h5 className="mb-3">Dane karty płatniczej</h5>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Numer karty</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={formatCardNumber(paymentData.cardNumber)}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Wprowadź poprawny numer karty
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Imię i nazwisko na karcie</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handleChange}
                      placeholder="Jan Kowalski"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Wprowadź imię i nazwisko
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data ważności</Form.Label>
                    <Form.Control
                      type="text"
                      name="expiryDate"
                      value={formatExpiryDate(paymentData.expiryDate)}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Wprowadź datę ważności
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Kod CVV</Form.Label>
                    <Form.Control
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Wprowadź kod CVV
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <h5 className="mb-3">Adres rozliczeniowy</h5>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Adres</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={paymentData.address}
                      onChange={handleChange}
                      placeholder="ul. Przykładowa 123"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Wprowadź adres
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Miasto</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={paymentData.city}
                      onChange={handleChange}
                      placeholder="Warszawa"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Wprowadź miasto
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Kod pocztowy</Form.Label>
                    <Form.Control
                      type="text"
                      name="postalCode"
                      value={paymentData.postalCode}
                      onChange={handleChange}
                      placeholder="00-000"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Wprowadź kod pocztowy
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Kraj</Form.Label>
                    <Form.Control
                      as="select"
                      name="country"
                      value={paymentData.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="Polska">Polska</option>
                      <option value="Niemcy">Niemcy</option>
                      <option value="Czechy">Czechy</option>
                      <option value="Słowacja">Słowacja</option>
                      <option value="Ukraina">Ukraina</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg" 
                  disabled={processing}
                >
                  {processing ? 'Przetwarzanie...' : 'Potwierdź i zapłać'}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => onHide(false)} 
                  disabled={processing}
                >
                  Anuluj
                </Button>
              </div>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  Twoje dane płatnicze są bezpieczne i szyfrowane. Nie przechowujemy pełnych danych karty.
                </small>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SubscriptionModal;
