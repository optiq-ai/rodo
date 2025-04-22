import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import SubscriptionModal from '../components/subscription/SubscriptionModal';

const UserSettings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  
  // Modal state
  const [showModal, setShowModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState('');
  const [selectedPrice, setSelectedPrice] = React.useState('');
  
  // Dane użytkownika
  const [userData, setUserData] = React.useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    position: '',
    notifications: true
  });
  
  // Dane firmy
  const [companyData, setCompanyData] = React.useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    nip: '',
    regon: '',
    industry: ''
  });
  
  // Dane subskrypcji
  const [subscriptionData, setSubscriptionData] = React.useState({
    plan: 'basic',
    status: 'active',
    nextBillingDate: '2025-05-15',
    paymentMethod: 'card'
  });
  
  // Dane zmiany hasła
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Symulacja ładowania danych
  React.useEffect(() => {
    // Tutaj byłoby faktyczne pobieranie danych z API
    setTimeout(() => {
      setUserData({
        username: currentUser?.username || 'user123',
        email: currentUser?.email || 'user@example.com',
        firstName: 'Jan',
        lastName: 'Kowalski',
        phone: '+48 123 456 789',
        position: 'Administrator RODO',
        notifications: true
      });
      
      setCompanyData({
        name: 'Firma Example Sp. z o.o.',
        address: 'ul. Przykładowa 123',
        city: 'Warszawa',
        postalCode: '00-001',
        nip: '1234567890',
        regon: '123456789',
        industry: 'IT'
      });
    }, 500);
  }, [currentUser]);
  
  const handleUserDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleCompanyDataChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value
    });
  };
  
  const handlePasswordDataChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Tutaj byłoby faktyczne zapisywanie danych do API
    setSaveSuccess(true);
    setSaveError('');
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleSavePassword = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveError('Nowe hasło i potwierdzenie nie są identyczne');
      setSaveSuccess(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSaveError('Nowe hasło musi mieć co najmniej 8 znaków');
      setSaveSuccess(false);
      return;
    }
    
    // Tutaj byłoby faktyczne zapisywanie hasła do API
    setSaveSuccess(true);
    setSaveError('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleSaveCompany = (e) => {
    e.preventDefault();
    // Tutaj byłoby faktyczne zapisywanie danych firmy do API
    setSaveSuccess(true);
    setSaveError('');
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleCancelSubscription = () => {
    if (window.confirm('Czy na pewno chcesz anulować subskrypcję? Ta operacja spowoduje utratę dostępu do zaawansowanych funkcji po zakończeniu bieżącego okresu rozliczeniowego.')) {
      // Tutaj byłoby faktyczne anulowanie subskrypcji w API
      setSubscriptionData({
        ...subscriptionData,
        status: 'canceled'
      });
      setSaveSuccess(true);
      setSaveError('');
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  const handleUpgradeSubscription = (plan, price) => {
    // Otwórz modal z wyborem planu
    setSelectedPlan(plan);
    setSelectedPrice(price);
    setShowModal(true);
  };
  
  const handleModalClose = (success) => {
    setShowModal(false);
    
    // Jeśli operacja zakończyła się sukcesem, zaktualizuj dane subskrypcji
    if (success) {
      setSubscriptionData({
        ...subscriptionData,
        plan: selectedPlan,
        status: 'active',
        nextBillingDate: '2025-05-15', // Przykładowa data
        paymentMethod: 'card'
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  const renderProfileTab = () => (
    <Form onSubmit={handleSaveProfile}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nazwa użytkownika</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={userData.username}
              onChange={handleUserDataChange}
              disabled
            />
            <Form.Text className="text-muted">
              Nazwa użytkownika nie może być zmieniona
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleUserDataChange}
              disabled
            />
            <Form.Text className="text-muted">
              Adres email nie może być zmieniony
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Imię</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleUserDataChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nazwisko</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleUserDataChange}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Telefon</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleUserDataChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Stanowisko</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={userData.position}
              onChange={handleUserDataChange}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="notifications"
          label="Otrzymuj powiadomienia email o zmianach w ocenach RODO"
          checked={userData.notifications}
          onChange={handleUserDataChange}
        />
      </Form.Group>
      
      <div className="d-flex justify-content-between">
        <Button variant="primary" type="submit">
          Zapisz zmiany
        </Button>
        <Button variant="outline-secondary" type="reset">
          Anuluj zmiany
        </Button>
      </div>
    </Form>
  );
  
  const renderPasswordTab = () => (
    <Form onSubmit={handleSavePassword}>
      <Form.Group className="mb-3">
        <Form.Label>Aktualne hasło</Form.Label>
        <Form.Control
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordDataChange}
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Nowe hasło</Form.Label>
        <Form.Control
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordDataChange}
          required
        />
        <Form.Text className="text-muted">
          Hasło musi mieć co najmniej 8 znaków
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Potwierdź nowe hasło</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordDataChange}
          required
        />
      </Form.Group>
      
      <div className="d-flex justify-content-between">
        <Button variant="primary" type="submit">
          Zmień hasło
        </Button>
        <Button variant="outline-secondary" type="reset">
          Anuluj
        </Button>
      </div>
    </Form>
  );
  
  const renderCompanyTab = () => (
    <Form onSubmit={handleSaveCompany}>
      <Form.Group className="mb-3">
        <Form.Label>Nazwa firmy</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={companyData.name}
          onChange={handleCompanyDataChange}
          required
        />
      </Form.Group>
      
      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Adres</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={companyData.address}
              onChange={handleCompanyDataChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Kod pocztowy</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              value={companyData.postalCode}
              onChange={handleCompanyDataChange}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Miasto</Form.Label>
        <Form.Control
          type="text"
          name="city"
          value={companyData.city}
          onChange={handleCompanyDataChange}
        />
      </Form.Group>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>NIP</Form.Label>
            <Form.Control
              type="text"
              name="nip"
              value={companyData.nip}
              onChange={handleCompanyDataChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>REGON</Form.Label>
            <Form.Control
              type="text"
              name="regon"
              value={companyData.regon}
              onChange={handleCompanyDataChange}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Branża</Form.Label>
        <Form.Select
          name="industry"
          value={companyData.industry}
          onChange={handleCompanyDataChange}
        >
          <option value="IT">IT</option>
          <option value="Finanse">Finanse</option>
          <option value="Handel">Handel</option>
          <option value="Produkcja">Produkcja</option>
          <option value="Usługi">Usługi</option>
          <option value="Edukacja">Edukacja</option>
          <option value="Zdrowie">Zdrowie</option>
          <option value="Inne">Inne</option>
        </Form.Select>
      </Form.Group>
      
      <div className="d-flex justify-content-between">
        <Button variant="primary" type="submit">
          Zapisz dane firmy
        </Button>
        <Button variant="outline-secondary" type="reset">
          Anuluj zmiany
        </Button>
      </div>
    </Form>
  );
  
  const renderSubscriptionTab = () => (
    <>
      <div className="mb-4">
        <h5>Aktualny plan</h5>
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <Badge bg={subscriptionData.plan === 'premium' ? 'warning' : 'primary'} className="p-2">
              {subscriptionData.plan === 'premium' ? 'Premium' : 'Basic'}
            </Badge>
          </div>
          <div>
            <Badge bg={subscriptionData.status === 'active' ? 'success' : 'danger'} className="p-2">
              {subscriptionData.status === 'active' ? 'Aktywna' : 'Anulowana'}
            </Badge>
          </div>
        </div>
        
        <p>
          <strong>Następne odnowienie:</strong> {subscriptionData.nextBillingDate}
        </p>
        
        <p>
          <strong>Metoda płatności:</strong> {subscriptionData.paymentMethod === 'card' ? 'Karta kredytowa' : 'Przelew bankowy'}
        </p>
      </div>
      
      <div className="mb-4">
        <h5>Dostępne plany</h5>
        
        <Row className="mt-3">
          <Col md={6}>
            <Card className={subscriptionData.plan === 'basic' ? 'border-primary' : ''}>
              <Card.Header as="h5">Basic</Card.Header>
              <Card.Body>
                <Card.Title className="mb-3">99 PLN / miesiąc</Card.Title>
                <ul className="list-unstyled">
                  <li className="mb-2">✓ Do 5 ocen RODO</li>
                  <li className="mb-2">✓ Podstawowe raporty</li>
                  <li className="mb-2">✓ Email support</li>
                  <li className="mb-2">✗ Zaawansowana analiza ryzyka</li>
                  <li className="mb-2">✗ Eksport do PDF</li>
                </ul>
                {subscriptionData.plan === 'basic' ? (
                  <Button variant="outline-primary" disabled>Aktualny plan</Button>
                ) : (
                  <Button variant="primary" onClick={() => handleUpgradeSubscription('basic', '99')}>Wybierz plan</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className={subscriptionData.plan === 'premium' ? 'border-primary' : ''}>
              <Card.Header as="h5">Premium</Card.Header>
              <Card.Body>
                <Card.Title className="mb-3">199 PLN / miesiąc</Card.Title>
                <ul className="list-unstyled">
                  <li className="mb-2">✓ Nieograniczona liczba ocen</li>
                  <li className="mb-2">✓ Zaawansowane raporty</li>
                  <li className="mb-2">✓ Priorytetowy support</li>
                  <li className="mb-2">✓ Zaawansowana analiza ryzyka</li>
                  <li className="mb-2">✓ Eksport do PDF</li>
                </ul>
                {subscriptionData.plan === 'premium' ? (
                  <Button variant="outline-primary" disabled>Aktualny plan</Button>
                ) : (
                  <Button variant="primary" onClick={() => handleUpgradeSubscription('premium', '199')}>Ulepsz plan</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      {subscriptionData.status === 'active' && (
        <div className="text-center mt-4">
          <Button variant="outline-danger" onClick={handleCancelSubscription}>
            Anuluj subskrypcję
          </Button>
          <p className="text-muted mt-2">
            <small>Anulowanie subskrypcji spowoduje utratę dostępu do zaawansowanych funkcji po zakończeniu bieżącego okresu rozliczeniowego.</small>
          </p>
        </div>
      )}
    </>
  );
  
  return (
    <Container className="py-4 fade-in">
      <Row className="mb-4">
        <Col>
          <h2>Ustawienia użytkownika</h2>
          <p className="text-muted">Zarządzaj swoim kontem, danymi firmy i subskrypcją</p>
        </Col>
      </Row>
      
      {saveSuccess && (
        <Alert variant="success" className="mb-4">
          Zmiany zostały pomyślnie zapisane!
        </Alert>
      )}
      
      {saveError && (
        <Alert variant="danger" className="mb-4">
          {saveError}
        </Alert>
      )}
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab 
                  eventKey="profile" 
                  title={
                    <span>
                      Profil
                    </span>
                  }
                >
                  {renderProfileTab()}
                </Tab>
                <Tab 
                  eventKey="password" 
                  title={
                    <span>
                      Hasło
                    </span>
                  }
                >
                  {renderPasswordTab()}
                </Tab>
                <Tab 
                  eventKey="company" 
                  title={
                    <span>
                      Dane firmy
                    </span>
                  }
                >
                  {renderCompanyTab()}
                </Tab>
                <Tab 
                  eventKey="subscription" 
                  title={
                    <span>
                      Subskrypcja
                    </span>
                  }
                >
                  {renderSubscriptionTab()}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Modal do wyboru planu subskrypcji */}
      <SubscriptionModal 
        show={showModal}
        onHide={handleModalClose}
        planType={selectedPlan}
        planPrice={selectedPrice}
      />
    </Container>
  );
};

export default UserSettings;
