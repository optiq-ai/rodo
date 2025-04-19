import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faBuilding, faCreditCard, faSave, faUndo, faToggleOn, faToggleOff, faCog } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';

const UserSettings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  
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
  
  // Dane do zmiany hasła
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Dane firmy
  const [companyData, setCompanyData] = React.useState({
    name: '',
    taxId: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Polska',
    phone: '',
    email: '',
    website: ''
  });
  
  // Dane subskrypcji
  const [subscriptionData, setSubscriptionData] = React.useState({
    plan: 'free',
    expiryDate: '',
    autoRenew: true,
    paymentMethod: '',
    assessmentsLimit: 1,
    assessmentsUsed: 0
  });

  // Konfiguracja widgetów
  const [widgetsConfig, setWidgetsConfig] = React.useState({
    recentAssessments: true,
    statistics: true,
    riskOverview: true,
    subscriptionInfo: true,
    quickActions: true,
    comparisonChart: false,
    remedialActions: false
  });

  // Pobieranie danych użytkownika
  React.useEffect(() => {
    // Symulacja pobierania danych z API
    const fetchUserData = async () => {
      try {
        // W rzeczywistości będzie to wywołanie do backendu
        // const response = await userService.getUserData();
        
        // Tymczasowe dane dla szkieletu
        const mockUserData = {
          username: currentUser?.username || 'user123',
          email: 'user@example.com',
          firstName: 'Jan',
          lastName: 'Kowalski',
          phone: '+48 123 456 789',
          position: 'Administrator RODO',
          notifications: true
        };
        
        setUserData(mockUserData);
        
        // Tymczasowe dane firmy
        const mockCompanyData = {
          name: 'Przykładowa Firma Sp. z o.o.',
          taxId: 'PL1234567890',
          address: 'ul. Przykładowa 123',
          city: 'Warszawa',
          postalCode: '00-001',
          country: 'Polska',
          phone: '+48 22 123 45 67',
          email: 'kontakt@przykladowafirma.pl',
          website: 'www.przykladowafirma.pl'
        };
        
        setCompanyData(mockCompanyData);
        
        // Tymczasowe dane subskrypcji
        const mockSubscriptionData = {
          plan: 'free',
          expiryDate: 'Bezterminowo',
          autoRenew: true,
          paymentMethod: 'Brak',
          assessmentsLimit: 1,
          assessmentsUsed: 0
        };
        
        setSubscriptionData(mockSubscriptionData);

        // Tymczasowe dane konfiguracji widgetów
        const mockWidgetsConfig = {
          recentAssessments: true,
          statistics: true,
          riskOverview: true,
          subscriptionInfo: true,
          quickActions: true,
          comparisonChart: false,
          remedialActions: false
        };

        setWidgetsConfig(mockWidgetsConfig);
        
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        setSaveError('Nie udało się pobrać danych użytkownika');
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Obsługa zmiany danych użytkownika
  const handleUserDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Obsługa zmiany danych hasła
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Obsługa zmiany danych firmy
  const handleCompanyDataChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Obsługa zmiany danych subskrypcji
  const handleSubscriptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubscriptionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Obsługa zmiany konfiguracji widgetów
  const handleWidgetsConfigChange = (name, checked) => {
    setWidgetsConfig(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Zapisywanie danych użytkownika
  const handleSaveUserData = async (e) => {
    e.preventDefault();
    try {
      // W rzeczywistości będzie to wywołanie do backendu
      // await userService.updateUserData(userData);
      
      // Symulacja zapisywania
      setTimeout(() => {
        setSaveSuccess(true);
        setSaveError('');
        // Ukryj komunikat o sukcesie po 3 sekundach
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('Błąd podczas zapisywania danych użytkownika:', error);
      setSaveError('Nie udało się zapisać danych użytkownika');
    }
  };
  
  // Zmiana hasła
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Walidacja
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveError('Nowe hasło i potwierdzenie hasła nie są zgodne');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSaveError('Nowe hasło musi mieć co najmniej 8 znaków');
      return;
    }
    
    try {
      // W rzeczywistości będzie to wywołanie do backendu
      // await userService.changePassword(passwordData);
      
      // Symulacja zmiany hasła
      setTimeout(() => {
        setSaveSuccess(true);
        setSaveError('');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Ukryj komunikat o sukcesie po 3 sekundach
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('Błąd podczas zmiany hasła:', error);
      setSaveError('Nie udało się zmienić hasła');
    }
  };
  
  // Zapisywanie danych firmy
  const handleSaveCompanyData = async (e) => {
    e.preventDefault();
    try {
      // W rzeczywistości będzie to wywołanie do backendu
      // await companyService.updateCompanyData(companyData);
      
      // Symulacja zapisywania
      setTimeout(() => {
        setSaveSuccess(true);
        setSaveError('');
        // Ukryj komunikat o sukcesie po 3 sekundach
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('Błąd podczas zapisywania danych firmy:', error);
      setSaveError('Nie udało się zapisać danych firmy');
    }
  };
  
  // Zmiana planu subskrypcji
  const handleChangePlan = async (plan) => {
    try {
      // W rzeczywistości będzie to wywołanie do backendu
      // await subscriptionService.changePlan(plan);
      
      // Symulacja zmiany planu
      setTimeout(() => {
        setSubscriptionData(prev => ({
          ...prev,
          plan: plan,
          assessmentsLimit: plan === 'free' ? 1 : 'Bez limitu',
          expiryDate: plan === 'free' ? 'Bezterminowo' : '2026-04-18'
        }));
        setSaveSuccess(true);
        setSaveError('');
        // Ukryj komunikat o sukcesie po 3 sekundach
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('Błąd podczas zmiany planu subskrypcji:', error);
      setSaveError('Nie udało się zmienić planu subskrypcji');
    }
  };

  // Zapisywanie konfiguracji widgetów
  const handleSaveWidgetsConfig = async (e) => {
    e.preventDefault();
    try {
      // W rzeczywistości będzie to wywołanie do backendu
      // await userService.updateWidgetsConfig(widgetsConfig);
      
      // Symulacja zapisywania
      setTimeout(() => {
        setSaveSuccess(true);
        setSaveError('');
        // Ukryj komunikat o sukcesie po 3 sekundach
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('Błąd podczas zapisywania konfiguracji widgetów:', error);
      setSaveError('Nie udało się zapisać konfiguracji widgetów');
    }
  };

  // Funkcja pomocnicza do tłumaczenia nazw widgetów
  const widgetNameTranslation = (key) => {
    const translations = {
      recentAssessments: 'Ostatnie oceny RODO',
      statistics: 'Statystyki',
      riskOverview: 'Przegląd ryzyka',
      subscriptionInfo: 'Informacje o subskrypcji',
      quickActions: 'Szybkie akcje',
      comparisonChart: 'Porównanie ocen',
      remedialActions: 'Działania naprawcze'
    };
    return translations[key] || key;
  };

  return (
    <Container className="main-container">
      <Row className="mb-4">
        <Col>
          <h1 className="app-title">Ustawienia</h1>
          {saveSuccess && <Alert variant="success" className="fade-in">Zmiany zostały pomyślnie zapisane!</Alert>}
          {saveError && <Alert variant="danger" className="fade-in">{saveError}</Alert>}
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="widget-card">
            <Card.Header className="widget-header">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="border-bottom-0"
              >
                <Tab 
                  eventKey="profile" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profil
                    </span>
                  }
                />
                <Tab 
                  eventKey="password" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faKey} className="me-2" />
                      Zmiana hasła
                    </span>
                  }
                />
                <Tab 
                  eventKey="company" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faBuilding} className="me-2" />
                      Dane firmy
                    </span>
                  }
                />
                <Tab 
                  eventKey="subscription" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                      Subskrypcja
                    </span>
                  }
                />
                <Tab 
                  eventKey="widgets" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faCog} className="me-2" />
                      Widgety
                    </span>
                  }
                />
              </Tabs>
            </Card.Header>
            <Card.Body>
              {/* Profil użytkownika */}
              {activeTab === 'profile' && (
                <Form onSubmit={handleSaveUserData}>
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
                          Nazwa użytkownika nie może być zmieniona.
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
                          required
                        />
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
                          required
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
                          required
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
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={() => window.location.reload()}>
                      <FontAwesomeIcon icon={faUndo} className="me-2" />
                      Anuluj
                    </Button>
                    <Button variant="primary" type="submit">
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Zapisz zmiany
                    </Button>
                  </div>
                </Form>
              )}

              {/* Zmiana hasła */}
              {activeTab === 'password' && (
                <Form onSubmit={handleChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Aktualne hasło</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nowe hasło</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                    />
                    <Form.Text className="text-muted">
                      Hasło musi mieć co najmniej 8 znaków.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Potwierdź nowe hasło</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={() => setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })}>
                      <FontAwesomeIcon icon={faUndo} className="me-2" />
                      Anuluj
                    </Button>
                    <Button variant="primary" type="submit">
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Zmień hasło
                    </Button>
                  </div>
                </Form>
              )}

              {/* Dane firmy */}
              {activeTab === 'company' && (
                <Form onSubmit={handleSaveCompanyData}>
                  <Row>
                    <Col md={8}>
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
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>NIP</Form.Label>
                        <Form.Control
                          type="text"
                          name="taxId"
                          value={companyData.taxId}
                          onChange={handleCompanyDataChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Adres</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={companyData.address}
                      onChange={handleCompanyDataChange}
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Miasto</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={companyData.city}
                          onChange={handleCompanyDataChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Kod pocztowy</Form.Label>
                        <Form.Control
                          type="text"
                          name="postalCode"
                          value={companyData.postalCode}
                          onChange={handleCompanyDataChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Kraj</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={companyData.country}
                          onChange={handleCompanyDataChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Telefon</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={companyData.phone}
                          onChange={handleCompanyDataChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={companyData.email}
                          onChange={handleCompanyDataChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Strona www</Form.Label>
                        <Form.Control
                          type="text"
                          name="website"
                          value={companyData.website}
                          onChange={handleCompanyDataChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={() => window.location.reload()}>
                      <FontAwesomeIcon icon={faUndo} className="me-2" />
                      Anuluj
                    </Button>
                    <Button variant="primary" type="submit">
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Zapisz zmiany
                    </Button>
                  </div>
                </Form>
              )}

              {/* Subskrypcja */}
              {activeTab === 'subscription' && (
                <div>
                  <Row className="mb-4">
                    <Col md={6}>
                      <h5>Aktualny plan</h5>
                      <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Plan:</span>
                          <Badge bg={subscriptionData.plan === 'free' ? 'secondary' : 'primary'}>
                            {subscriptionData.plan === 'free' ? 'Darmowy' : 'Roczny'}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Limit ocen:</span>
                          <span>{subscriptionData.assessmentsLimit}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Wykorzystane oceny:</span>
                          <span>{subscriptionData.assessmentsUsed}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Data wygaśnięcia:</span>
                          <span>{subscriptionData.expiryDate}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Automatyczne odnawianie:</span>
                          <Form.Check
                            type="switch"
                            name="autoRenew"
                            checked={subscriptionData.autoRenew}
                            onChange={handleSubscriptionChange}
                            disabled={subscriptionData.plan === 'free'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5>Metoda płatności</h5>
                      {subscriptionData.plan === 'free' ? (
                        <Alert variant="info">
                          Brak metody płatności dla planu darmowego.
                        </Alert>
                      ) : (
                        <div>
                          <p>Karta: **** **** **** 1234</p>
                          <p>Ważna do: 12/26</p>
                          <Button variant="outline-primary" size="sm">
                            Zmień metodę płatności
                          </Button>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <h5 className="mb-3">Dostępne plany</h5>
                  <Row>
                    <Col md={6}>
                      <Card className={`mb-3 ${subscriptionData.plan === 'free' ? 'border-primary' : ''}`}>
                        <Card.Header className={subscriptionData.plan === 'free' ? 'bg-primary text-white' : ''}>
                          <h5 className="mb-0">Plan Darmowy</h5>
                        </Card.Header>
                        <Card.Body>
                          <h3 className="mb-3">0 zł</h3>
                          <ul className="list-unstyled">
                            <li className="mb-2">✓ 1 ocena RODO</li>
                            <li className="mb-2">✓ Podstawowe funkcje</li>
                            <li className="mb-2">✓ Brak limitu czasowego</li>
                            <li className="mb-2">✗ Brak eksportu do PDF</li>
                            <li className="mb-2">✗ Brak zaawansowanych analiz</li>
                          </ul>
                          <Button 
                            variant={subscriptionData.plan === 'free' ? 'secondary' : 'primary'} 
                            className="w-100"
                            onClick={() => handleChangePlan('free')}
                            disabled={subscriptionData.plan === 'free'}
                          >
                            {subscriptionData.plan === 'free' ? 'Aktualny plan' : 'Wybierz plan'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className={`mb-3 ${subscriptionData.plan === 'paid' ? 'border-primary' : ''}`}>
                        <Card.Header className={subscriptionData.plan === 'paid' ? 'bg-primary text-white' : ''}>
                          <h5 className="mb-0">Plan Roczny</h5>
                        </Card.Header>
                        <Card.Body>
                          <h3 className="mb-3">100 zł / rok</h3>
                          <ul className="list-unstyled">
                            <li className="mb-2">✓ Nieograniczona liczba ocen</li>
                            <li className="mb-2">✓ Wszystkie funkcje</li>
                            <li className="mb-2">✓ Eksport do PDF i CSV</li>
                            <li className="mb-2">✓ Zaawansowane analizy i raporty</li>
                            <li className="mb-2">✓ Priorytetowe wsparcie</li>
                          </ul>
                          <Button 
                            variant={subscriptionData.plan === 'paid' ? 'secondary' : 'primary'} 
                            className="w-100"
                            onClick={() => handleChangePlan('paid')}
                            disabled={subscriptionData.plan === 'paid'}
                          >
                            {subscriptionData.plan === 'paid' ? 'Aktualny plan' : 'Wybierz plan'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Konfiguracja widgetów */}
              {activeTab === 'widgets' && (
                <Form onSubmit={handleSaveWidgetsConfig}>
                  <h5 className="mb-4">Konfiguracja widgetów na dashboardzie</h5>
                  <p className="text-muted mb-4">
                    Wybierz, które widgety mają być widoczne na Twoim dashboardzie. Możesz włączyć lub wyłączyć poszczególne elementy, aby dostosować interfejs do swoich potrzeb.
                  </p>

                  <Row>
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">Widgety na dashboardzie</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex flex-column gap-3">
                            {Object.entries(widgetsConfig)
                              .filter(([key]) => ['recentAssessments', 'statistics', 'subscriptionInfo', 'quickActions'].includes(key))
                              .map(([key, value]) => (
                                <div key={key} className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <FontAwesomeIcon 
                                      icon={value ? faToggleOn : faToggleOff} 
                                      className={value ? 'text-success me-2' : 'text-secondary me-2'} 
                                    />
                                    <span>{widgetNameTranslation(key)}</span>
                                  </div>
                                  <Form.Check
                                    type="switch"
                                    id={`widget-${key}`}
                                    checked={value}
                                    onChange={(e) => handleWidgetsConfigChange(key, e.target.checked)}
                                  />
                                </div>
                              ))}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">Widgety w szczegółach oceny</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex flex-column gap-3">
                            {Object.entries(widgetsConfig)
                              .filter(([key]) => ['comparisonChart', 'remedialActions', 'riskOverview'].includes(key))
                              .map(([key, value]) => (
                                <div key={key} className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <FontAwesomeIcon 
                                      icon={value ? faToggleOn : faToggleOff} 
                                      className={value ? 'text-success me-2' : 'text-secondary me-2'} 
                                    />
                                    <span>{widgetNameTranslation(key)}</span>
                                  </div>
                                  <Form.Check
                                    type="switch"
                                    id={`widget-${key}`}
                                    checked={value}
                                    onChange={(e) => handleWidgetsConfigChange(key, e.target.checked)}
                                  />
                                </div>
                              ))}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={() => window.location.reload()}>
                      <FontAwesomeIcon icon={faUndo} className="me-2" />
                      Anuluj
                    </Button>
                    <Button variant="primary" type="submit">
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Zapisz konfigurację
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserSettings;
