import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form, Table, Badge, Alert, OverlayTrigger, Tooltip, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faInfoCircle, faDownload, faExchangeAlt, faCalendarAlt, faFilter, faSearch, faSortAmountDown, faSortAmountUp, faFileAlt, faPaperclip, faCheck, faTimes, faEdit, faTrash, faPlus, faFileExport, faListAlt, faTable, faChartBar } from '@fortawesome/free-solid-svg-icons';
// Komentujemy import bibliotek PDF i CSV do czasu rozwiązania problemu z zależnościami
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { CSVLink } from 'react-csv';

/**
 * Komponent historii zmian dla oceny RODO
 * 
 * Funkcjonalności:
 * - Śledzenie zmian w ocenie RODO
 * - Porównanie wersji oceny
 * - Filtrowanie zmian według daty, użytkownika, typu zmiany
 * - Eksport historii zmian do PDF/CSV
 * - Szczegóły zmian
 */
const ChangeHistoryFeature = ({ assessmentData, onHistorySelect }) => {
  // Mockowe dane dla historii zmian
  const initialHistoryData = {
    changes: [
      {
        id: 1,
        date: '2025-04-15',
        user: 'Jan Kowalski',
        type: 'Ocena ryzyka',
        description: 'Aktualizacja oceny ryzyka dla obszaru "Bezpieczeństwo danych"',
        details: {
          area: 'Bezpieczeństwo danych',
          oldValue: '60%',
          newValue: '50%',
          comment: 'Obniżenie oceny po audycie bezpieczeństwa'
        }
      },
      {
        id: 2,
        date: '2025-04-10',
        user: 'Anna Nowak',
        type: 'Działanie naprawcze',
        description: 'Dodanie nowego działania naprawczego: "Aktualizacja polityki prywatności"',
        details: {
          action: 'Aktualizacja polityki prywatności',
          priority: 'Wysoki',
          dueDate: '2025-05-15',
          assignedTo: 'Jan Kowalski'
        }
      },
      {
        id: 3,
        date: '2025-04-05',
        user: 'Piotr Wiśniewski',
        type: 'Ocena ryzyka',
        description: 'Aktualizacja oceny ryzyka dla obszaru "Dokumentacja"',
        details: {
          area: 'Dokumentacja',
          oldValue: '75%',
          newValue: '80%',
          comment: 'Poprawa po wdrożeniu nowych procedur'
        }
      },
      {
        id: 4,
        date: '2025-04-01',
        user: 'System',
        type: 'Utworzenie oceny',
        description: 'Utworzenie nowej oceny RODO',
        details: {
          name: 'Ocena RODO - Kwiecień 2025',
          initialRisk: '65%'
        }
      }
    ],
    versions: [
      {
        id: 1,
        date: '2025-04-15',
        user: 'Jan Kowalski',
        description: 'Wersja po aktualizacji oceny ryzyka dla obszaru "Bezpieczeństwo danych"'
      },
      {
        id: 2,
        date: '2025-04-10',
        user: 'Anna Nowak',
        description: 'Wersja po dodaniu działania naprawczego'
      },
      {
        id: 3,
        date: '2025-04-05',
        user: 'Piotr Wiśniewski',
        description: 'Wersja po aktualizacji oceny ryzyka dla obszaru "Dokumentacja"'
      },
      {
        id: 4,
        date: '2025-04-01',
        user: 'System',
        description: 'Wersja początkowa'
      }
    ]
  };

  const [historyData, setHistoryData] = useState(initialHistoryData);
  const [activeTab, setActiveTab] = useState('changes');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedChange, setSelectedChange] = useState(null);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [showComparisonView, setShowComparisonView] = useState(false);
  // Dodanie flagi, aby zapobiec nieskończonej pętli
  const [isInitialized, setIsInitialized] = useState(false);

  // Efekt do inicjalizacji danych
  useEffect(() => {
    if (assessmentData && assessmentData.historyData && !isInitialized) {
      setHistoryData(assessmentData.historyData);
      setIsInitialized(true);
    }
    // Jeśli nie ma danych z props, używamy danych mockowych (już zainicjalizowanych)
  }, [assessmentData, isInitialized]);

  // Memoizacja funkcji powiadamiającej rodzica o wyborze historii
  const notifyParent = useCallback((version) => {
    if (onHistorySelect && isInitialized) {
      onHistorySelect(version);
    }
  }, [onHistorySelect, isInitialized]);

  // Filtrowanie zmian
  const filteredChanges = historyData.changes.filter(change => {
    const matchesType = filterType === 'all' || change.type === filterType;
    const matchesUser = filterUser === 'all' || change.user === filterUser;
    const matchesSearch = change.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          change.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesUser && matchesSearch;
  });

  // Sortowanie zmian
  const sortedChanges = [...filteredChanges].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'user':
        comparison = a.user.localeCompare(b.user);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Obsługa zmiany sortowania
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Obsługa wyboru wersji do porównania
  const handleVersionSelect = (versionId) => {
    const isSelected = selectedVersions.includes(versionId);
    
    if (isSelected) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else {
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, versionId]);
      } else {
        // Jeśli już wybrano 2 wersje, zastąp najstarszą
        setSelectedVersions([selectedVersions[1], versionId]);
      }
    }
  };

  // Obsługa porównania wersji
  const handleCompareVersions = () => {
    if (selectedVersions.length === 2) {
      setShowComparisonView(true);
    }
  };

  // Eksport do PDF
  const exportToPDF = () => {
    // Funkcjonalność eksportu do PDF zostanie zaimplementowana po rozwiązaniu problemu z zależnościami
    console.log('Eksport do PDF: historia zmian');
    alert('Funkcja eksportu do PDF zostanie dostępna po rozwiązaniu problemu z zależnościami.');
    
    // Kod do odkomentowania po rozwiązaniu problemu z zależnościami
    /*
    const doc = new jsPDF();
    
    // Tytuł
    doc.setFontSize(18);
    doc.text('Historia zmian oceny RODO', 14, 22);
    
    // Data wygenerowania
    doc.setFontSize(10);
    doc.text(`Wygenerowano: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Tabela z historią zmian
    const tableColumn = ["Data", "Użytkownik", "Typ zmiany", "Opis"];
    const tableRows = [];
    
    sortedChanges.forEach(change => {
      const changeData = [
        new Date(change.date).toLocaleDateString(),
        change.user,
        change.type,
        change.description
      ];
      tableRows.push(changeData);
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 40 }
    });
    
    // Zapisz PDF
    doc.save('historia-zmian-rodo.pdf');
    */
  };

  // Eksport do CSV
  const exportToCSV = () => {
    // Funkcjonalność eksportu do CSV zostanie zaimplementowana po rozwiązaniu problemu z zależnościami
    console.log('Eksport do CSV: historia zmian');
    alert('Funkcja eksportu do CSV zostanie dostępna po rozwiązaniu problemu z zależnościami.');
    
    // Kod do odkomentowania po rozwiązaniu problemu z zależnościami
    /*
    // Dane są już przygotowane w sortedChanges
    // CSVLink z react-csv obsłuży eksport
    */
  };

  // Funkcja zwracająca kolor na podstawie typu zmiany
  const getTypeColor = (type) => {
    switch (type) {
      case 'Ocena ryzyka': return 'warning';
      case 'Działanie naprawcze': return 'info';
      case 'Utworzenie oceny': return 'success';
      default: return 'secondary';
    }
  };

  // Unikalne typy zmian
  const uniqueTypes = [...new Set(historyData.changes.map(change => change.type))];
  
  // Unikalni użytkownicy
  const uniqueUsers = [...new Set(historyData.changes.map(change => change.user))];

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faHistory} className="me-2" />
          Historia zmian
        </h5>
        <div>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={exportToPDF}
            className="me-2"
          >
            <FontAwesomeIcon icon={faFileExport} className="me-1" />
            Eksportuj do PDF
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={exportToCSV}
          >
            <FontAwesomeIcon icon={faFileExport} className="me-1" />
            Eksportuj do CSV
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
            eventKey="changes" 
            title={
              <span>
                <FontAwesomeIcon icon={faListAlt} className="me-2" />
                Lista zmian
              </span>
            }
          />
          <Tab 
            eventKey="versions" 
            title={
              <span>
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                Wersje oceny
              </span>
            }
          />
          {showComparisonView && (
            <Tab 
              eventKey="comparison" 
              title={
                <span>
                  <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
                  Porównanie wersji
                </span>
              }
            />
          )}
        </Tabs>

        {activeTab === 'changes' && (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Wyszukaj zmiany..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Wszystkie typy zmian</option>
                    {uniqueTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                  >
                    <option value="all">Wszyscy użytkownicy</option>
                    {uniqueUsers.map((user, index) => (
                      <option key={index} value={user}>{user}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{width: '15%'}}>
                    <div 
                      className="d-flex justify-content-between align-items-center cursor-pointer"
                      onClick={() => handleSortChange('date')}
                    >
                      Data
                      {sortField === 'date' && (
                        <FontAwesomeIcon 
                          icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                          size="sm"
                        />
                      )}
                    </div>
                  </th>
                  <th style={{width: '15%'}}>
                    <div 
                      className="d-flex justify-content-between align-items-center cursor-pointer"
                      onClick={() => handleSortChange('user')}
                    >
                      Użytkownik
                      {sortField === 'user' && (
                        <FontAwesomeIcon 
                          icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                          size="sm"
                        />
                      )}
                    </div>
                  </th>
                  <th style={{width: '15%'}}>
                    <div 
                      className="d-flex justify-content-between align-items-center cursor-pointer"
                      onClick={() => handleSortChange('type')}
                    >
                      Typ zmiany
                      {sortField === 'type' && (
                        <FontAwesomeIcon 
                          icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                          size="sm"
                        />
                      )}
                    </div>
                  </th>
                  <th style={{width: '45%'}}>Opis</th>
                  <th style={{width: '10%'}}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {sortedChanges.map(change => (
                  <tr key={change.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                        {new Date(change.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>{change.user}</td>
                    <td>
                      <Badge bg={getTypeColor(change.type)}>
                        {change.type}
                      </Badge>
                    </td>
                    <td>{change.description}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setSelectedChange(change)}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {selectedChange && (
              <Card className="mt-4">
                <Card.Header>
                  <h6 className="mb-0">Szczegóły zmiany</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Data:</strong> {new Date(selectedChange.date).toLocaleDateString()}</p>
                      <p><strong>Użytkownik:</strong> {selectedChange.user}</p>
                      <p>
                        <strong>Typ zmiany:</strong> 
                        <Badge bg={getTypeColor(selectedChange.type)} className="ms-2">
                          {selectedChange.type}
                        </Badge>
                      </p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Opis:</strong> {selectedChange.description}</p>
                    </Col>
                  </Row>
                  
                  <h6 className="mt-3">Szczegółowe informacje</h6>
                  <Table striped bordered>
                    <tbody>
                      {Object.entries(selectedChange.details).map(([key, value], index) => (
                        <tr key={index}>
                          <td style={{width: '30%'}}><strong>{key}</strong></td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </>
        )}

        {activeTab === 'versions' && (
          <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">Wybierz dwie wersje do porównania:</p>
              </div>
              <div>
                <Button 
                  variant="primary" 
                  disabled={selectedVersions.length !== 2}
                  onClick={handleCompareVersions}
                >
                  <FontAwesomeIcon icon={faExchangeAlt} className="me-1" />
                  Porównaj wybrane wersje
                </Button>
              </div>
            </div>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{width: '5%'}}></th>
                  <th style={{width: '15%'}}>Data</th>
                  <th style={{width: '15%'}}>Użytkownik</th>
                  <th style={{width: '55%'}}>Opis</th>
                  <th style={{width: '10%'}}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {historyData.versions.map(version => (
                  <tr key={version.id}>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        checked={selectedVersions.includes(version.id)}
                        onChange={() => handleVersionSelect(version.id)}
                        disabled={!selectedVersions.includes(version.id) && selectedVersions.length >= 2}
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                        {new Date(version.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>{version.user}</td>
                    <td>{version.description}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          notifyParent(version);
                        }}
                      >
                        <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                        Pokaż
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {activeTab === 'comparison' && showComparisonView && (
          <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h6>Porównanie wersji</h6>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setShowComparisonView(false)}
              >
                Zamknij porównanie
              </Button>
            </div>

            {selectedVersions.length === 2 && (
              <>
                <Row className="mb-4">
                  <Col md={6}>
                    <Card>
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">
                          Wersja {historyData.versions.find(v => v.id === selectedVersions[0])?.date && 
                            new Date(historyData.versions.find(v => v.id === selectedVersions[0])?.date).toLocaleDateString()}
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Użytkownik:</strong> {historyData.versions.find(v => v.id === selectedVersions[0])?.user}</p>
                        <p><strong>Opis:</strong> {historyData.versions.find(v => v.id === selectedVersions[0])?.description}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header className="bg-secondary text-white">
                        <h6 className="mb-0">
                          Wersja {historyData.versions.find(v => v.id === selectedVersions[1])?.date && 
                            new Date(historyData.versions.find(v => v.id === selectedVersions[1])?.date).toLocaleDateString()}
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Użytkownik:</strong> {historyData.versions.find(v => v.id === selectedVersions[1])?.user}</p>
                        <p><strong>Opis:</strong> {historyData.versions.find(v => v.id === selectedVersions[1])?.description}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Alert variant="info">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Funkcja szczegółowego porównania wersji będzie dostępna w pełnej wersji aplikacji.
                </Alert>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ChangeHistoryFeature;
