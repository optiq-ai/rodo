import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form, Table, Badge, Alert, OverlayTrigger, Tooltip, Tabs, Tab, Dropdown, ButtonGroup, Modal, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faExclamationTriangle, faInfoCircle, faDownload, faFilter, faSearch, faSortAmountDown, faSortAmountUp, faFileAlt, faPaperclip, faCalendarAlt, faCheck, faTimes, faEdit, faTrash, faPlus, faFileExport, faListAlt, faTable, faChartBar, faEye, faHistory } from '@fortawesome/free-solid-svg-icons';
// Komentujemy import bibliotek PDF i CSV do czasu rozwiązania problemu z zależnościami
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { CSVLink } from 'react-csv';

/**
 * Komponent działań naprawczych dla oceny RODO
 * 
 * Funkcjonalności:
 * - Lista działań naprawczych z filtrowaniem i sortowaniem
 * - Szczegóły działań naprawczych
 * - Zarządzanie statusem działań
 * - Eksport listy działań do PDF/CSV
 * - Śledzenie historii zmian statusów
 * - Zarządzanie załącznikami
 * - Powiązanie działań z artykułami RODO
 * - Powiadomienia o terminach
 */
const RemedialActionsSection = ({ assessmentData, onActionStatusChange }) => {
  // Mockowe dane dla działań naprawczych
  const initialActions = [
    {
      id: 1,
      title: 'Aktualizacja polityki prywatności',
      description: 'Aktualizacja polityki prywatności zgodnie z wymogami RODO, w szczególności w zakresie informacji o prawach podmiotów danych.',
      priority: 'Wysoki',
      status: 'W trakcie',
      dueDate: '2025-05-15',
      assignedTo: 'Jan Kowalski',
      createdAt: '2025-04-01',
      updatedAt: '2025-04-10',
      area: 'Prawa podmiotów',
      riskLevel: 'Wysoki',
      gdprArticles: ['12', '13', '14'],
      attachments: [
        { id: 1, name: 'polityka_prywatnosci_draft.docx', type: 'document', uploadedAt: '2025-04-05' }
      ],
      statusHistory: [
        { status: 'Nowe', date: '2025-04-01', user: 'System' },
        { status: 'W trakcie', date: '2025-04-10', user: 'Jan Kowalski' }
      ],
      comments: [
        { id: 1, text: 'Rozpoczęto prace nad aktualizacją polityki', date: '2025-04-10', user: 'Jan Kowalski' }
      ]
    },
    {
      id: 2,
      title: 'Wdrożenie mechanizmu zgód marketingowych',
      description: 'Implementacja mechanizmu zbierania i zarządzania zgodami na działania marketingowe zgodnie z wymogami RODO.',
      priority: 'Średni',
      status: 'Nowe',
      dueDate: '2025-06-01',
      assignedTo: 'Anna Nowak',
      createdAt: '2025-04-05',
      updatedAt: '2025-04-05',
      area: 'Zgody i podstawy prawne',
      riskLevel: 'Średni',
      gdprArticles: ['6', '7'],
      attachments: [],
      statusHistory: [
        { status: 'Nowe', date: '2025-04-05', user: 'System' }
      ],
      comments: []
    },
    {
      id: 3,
      title: 'Audyt bezpieczeństwa systemów IT',
      description: 'Przeprowadzenie kompleksowego audytu bezpieczeństwa systemów IT przetwarzających dane osobowe.',
      priority: 'Wysoki',
      status: 'Zakończone',
      dueDate: '2025-04-30',
      assignedTo: 'Piotr Wiśniewski',
      createdAt: '2025-03-15',
      updatedAt: '2025-04-12',
      area: 'Bezpieczeństwo danych',
      riskLevel: 'Wysoki',
      gdprArticles: ['32'],
      attachments: [
        { id: 2, name: 'raport_audytu_it.pdf', type: 'document', uploadedAt: '2025-04-12' }
      ],
      statusHistory: [
        { status: 'Nowe', date: '2025-03-15', user: 'System' },
        { status: 'W trakcie', date: '2025-03-20', user: 'Piotr Wiśniewski' },
        { status: 'Zakończone', date: '2025-04-12', user: 'Piotr Wiśniewski' }
      ],
      comments: [
        { id: 2, text: 'Rozpoczęto audyt systemów', date: '2025-03-20', user: 'Piotr Wiśniewski' },
        { id: 3, text: 'Audyt zakończony, raport załączony', date: '2025-04-12', user: 'Piotr Wiśniewski' }
      ]
    }
  ];

  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAction, setSelectedAction] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newAttachment, setNewAttachment] = useState({ name: '', type: 'document' });
  // Dodanie flagi, aby zapobiec nieskończonej pętli
  const [isInitialized, setIsInitialized] = useState(false);

  // Efekt do inicjalizacji danych
  useEffect(() => {
    if (assessmentData && assessmentData.remedialActions && !isInitialized) {
      setActions(assessmentData.remedialActions);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Używamy danych mockowych tylko jeśli nie otrzymaliśmy danych z props
      setActions(initialActions);
      setIsInitialized(true);
    }
    setLoading(false);
  }, [assessmentData, isInitialized, initialActions]);

  // Memoizacja funkcji powiadamiającej rodzica o zmianach
  const notifyParent = useCallback(() => {
    if (onActionStatusChange && isInitialized) {
      onActionStatusChange(actions);
    }
  }, [onActionStatusChange, actions, isInitialized]);

  // Efekt do powiadamiania rodzica o zmianach w statusie działań
  useEffect(() => {
    if (isInitialized) {
      notifyParent();
    }
  }, [notifyParent, isInitialized]);

  // Filtrowanie działań
  const filteredActions = actions.filter(action => {
    const matchesStatus = filterStatus === 'all' || action.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || action.priority === filterPriority;
    const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          action.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Sortowanie działań
  const sortedActions = [...filteredActions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const priorityOrder = { 'Wysoki': 1, 'Średni': 2, 'Niski': 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        const statusOrder = { 'Nowe': 1, 'W trakcie': 2, 'Zakończone': 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
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
      setSortDirection('asc');
    }
  };

  // Obsługa zmiany statusu działania
  const handleStatusChange = (actionId, newStatus) => {
    const updatedActions = actions.map(action => {
      if (action.id === actionId) {
        const now = new Date().toISOString().split('T')[0];
        const newStatusHistory = [
          ...action.statusHistory,
          { status: newStatus, date: now, user: 'Aktualny użytkownik' }
        ];
        
        return {
          ...action,
          status: newStatus,
          updatedAt: now,
          statusHistory: newStatusHistory
        };
      }
      return action;
    });
    
    setActions(updatedActions);
    
    // Jeśli zmieniono status wybranego działania, zaktualizuj je
    if (selectedAction && selectedAction.id === actionId) {
      const updatedAction = updatedActions.find(a => a.id === actionId);
      setSelectedAction(updatedAction);
    }
  };

  // Obsługa dodawania komentarza
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedAction) return;
    
    const now = new Date().toISOString().split('T')[0];
    const newCommentObj = {
      id: selectedAction.comments.length + 1,
      text: newComment,
      date: now,
      user: 'Aktualny użytkownik'
    };
    
    const updatedAction = {
      ...selectedAction,
      comments: [...selectedAction.comments, newCommentObj],
      updatedAt: now
    };
    
    const updatedActions = actions.map(action => 
      action.id === selectedAction.id ? updatedAction : action
    );
    
    setActions(updatedActions);
    setSelectedAction(updatedAction);
    setNewComment('');
    setShowCommentModal(false);
  };

  // Obsługa dodawania załącznika
  const handleAddAttachment = () => {
    if (!newAttachment.name.trim() || !selectedAction) return;
    
    const now = new Date().toISOString().split('T')[0];
    const newAttachmentObj = {
      id: selectedAction.attachments.length + 1,
      name: newAttachment.name,
      type: newAttachment.type,
      uploadedAt: now
    };
    
    const updatedAction = {
      ...selectedAction,
      attachments: [...selectedAction.attachments, newAttachmentObj],
      updatedAt: now
    };
    
    const updatedActions = actions.map(action => 
      action.id === selectedAction.id ? updatedAction : action
    );
    
    setActions(updatedActions);
    setSelectedAction(updatedAction);
    setNewAttachment({ name: '', type: 'document' });
    setShowAttachmentModal(false);
  };

  // Eksport do PDF
  const exportToPDF = () => {
    // Funkcjonalność eksportu do PDF zostanie zaimplementowana po rozwiązaniu problemu z zależnościami
    console.log('Eksport do PDF: działania naprawcze');
    alert('Funkcja eksportu do PDF zostanie dostępna po rozwiązaniu problemu z zależnościami.');
    
    // Kod do odkomentowania po rozwiązaniu problemu z zależnościami
    /*
    const doc = new jsPDF();
    
    // Tytuł
    doc.setFontSize(18);
    doc.text('Lista działań naprawczych RODO', 14, 22);
    
    // Data wygenerowania
    doc.setFontSize(10);
    doc.text(`Wygenerowano: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Tabela z działaniami
    const tableColumn = ["Tytuł", "Priorytet", "Status", "Termin", "Przypisane do"];
    const tableRows = [];
    
    sortedActions.forEach(action => {
      const actionData = [
        action.title,
        action.priority,
        action.status,
        new Date(action.dueDate).toLocaleDateString(),
        action.assignedTo
      ];
      tableRows.push(actionData);
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
    doc.save('dzialania-naprawcze-rodo.pdf');
    */
  };

  // Eksport do CSV
  const exportToCSV = () => {
    // Funkcjonalność eksportu do CSV zostanie zaimplementowana po rozwiązaniu problemu z zależnościami
    console.log('Eksport do CSV: działania naprawcze');
    alert('Funkcja eksportu do CSV zostanie dostępna po rozwiązaniu problemu z zależnościami.');
    
    // Kod do odkomentowania po rozwiązaniu problemu z zależnościami
    /*
    // Dane są już przygotowane w sortedActions
    // CSVLink z react-csv obsłuży eksport
    */
  };

  // Funkcja zwracająca kolor na podstawie priorytetu
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Wysoki': return 'danger';
      case 'Średni': return 'warning';
      case 'Niski': return 'success';
      default: return 'secondary';
    }
  };

  // Funkcja zwracająca kolor na podstawie statusu
  const getStatusColor = (status) => {
    switch (status) {
      case 'Nowe': return 'primary';
      case 'W trakcie': return 'warning';
      case 'Zakończone': return 'success';
      default: return 'secondary';
    }
  };

  // Funkcja sprawdzająca, czy termin jest przekroczony
  const isOverdue = (dueDate, status) => {
    return status !== 'Zakończone' && new Date(dueDate) < new Date();
  };

  // Funkcja sprawdzająca, czy termin zbliża się
  const isApproaching = (dueDate, status) => {
    if (status === 'Zakończone') return false;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
          Działania naprawcze
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
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Wyszukaj działania..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <ButtonGroup className="me-2">
              <Button 
                variant={filterStatus === 'all' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilterStatus('all')}
              >
                Wszystkie
              </Button>
              <Button 
                variant={filterStatus === 'Nowe' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilterStatus('Nowe')}
              >
                Nowe
              </Button>
              <Button 
                variant={filterStatus === 'W trakcie' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilterStatus('W trakcie')}
              >
                W trakcie
              </Button>
              <Button 
                variant={filterStatus === 'Zakończone' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilterStatus('Zakończone')}
              >
                Zakończone
              </Button>
            </ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-priority">
                <FontAwesomeIcon icon={faFilter} className="me-1" />
                Priorytet
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item 
                  active={filterPriority === 'all'} 
                  onClick={() => setFilterPriority('all')}
                >
                  Wszystkie
                </Dropdown.Item>
                <Dropdown.Item 
                  active={filterPriority === 'Wysoki'} 
                  onClick={() => setFilterPriority('Wysoki')}
                >
                  Wysoki
                </Dropdown.Item>
                <Dropdown.Item 
                  active={filterPriority === 'Średni'} 
                  onClick={() => setFilterPriority('Średni')}
                >
                  Średni
                </Dropdown.Item>
                <Dropdown.Item 
                  active={filterPriority === 'Niski'} 
                  onClick={() => setFilterPriority('Niski')}
                >
                  Niski
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        
        {loading ? (
          <div className="text-center p-5">
            <p>Ładowanie działań naprawczych...</p>
          </div>
        ) : sortedActions.length > 0 ? (
          <Table responsive hover className="actions-table">
            <thead>
              <tr>
                <th 
                  className="sortable-header"
                  onClick={() => handleSortChange('title')}
                >
                  Tytuł
                  {sortField === 'title' && (
                    <FontAwesomeIcon 
                      icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                      className="ms-2"
                    />
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSortChange('priority')}
                >
                  Priorytet
                  {sortField === 'priority' && (
                    <FontAwesomeIcon 
                      icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                      className="ms-2"
                    />
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSortChange('status')}
                >
                  Status
                  {sortField === 'status' && (
                    <FontAwesomeIcon 
                      icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                      className="ms-2"
                    />
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSortChange('dueDate')}
                >
                  Termin
                  {sortField === 'dueDate' && (
                    <FontAwesomeIcon 
                      icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                      className="ms-2"
                    />
                  )}
                </th>
                <th>Przypisane do</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {sortedActions.map(action => (
                <tr key={action.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <span className="action-title">{action.title}</span>
                        <div className="small text-muted text-truncate" style={{ maxWidth: '300px' }}>
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getPriorityColor(action.priority)}>
                      {action.priority}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusColor(action.status)}>
                      {action.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      <span className={isOverdue(action.dueDate, action.status) ? 'text-danger fw-bold' : ''}>
                        {new Date(action.dueDate).toLocaleDateString()}
                      </span>
                      {isOverdue(action.dueDate, action.status) && (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Termin przekroczony!</Tooltip>}
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 text-danger" />
                        </OverlayTrigger>
                      )}
                      {isApproaching(action.dueDate, action.status) && !isOverdue(action.dueDate, action.status) && (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Termin zbliża się!</Tooltip>}
                        >
                          <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-warning" />
                        </OverlayTrigger>
                      )}
                    </div>
                  </td>
                  <td>{action.assignedTo}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        setSelectedAction(action);
                        setShowActionModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      Szczegóły
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">
            Brak działań naprawczych spełniających kryteria wyszukiwania.
          </Alert>
        )}
        
        {/* Modal ze szczegółami działania */}
        <Modal 
          show={showActionModal} 
          onHide={() => setShowActionModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedAction?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAction && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <p><strong>Priorytet:</strong> <Badge bg={getPriorityColor(selectedAction.priority)}>{selectedAction.priority}</Badge></p>
                    <p><strong>Status:</strong> <Badge bg={getStatusColor(selectedAction.status)}>{selectedAction.status}</Badge></p>
                    <p><strong>Termin:</strong> {new Date(selectedAction.dueDate).toLocaleDateString()}</p>
                    <p><strong>Przypisane do:</strong> {selectedAction.assignedTo}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Utworzono:</strong> {new Date(selectedAction.createdAt).toLocaleDateString()}</p>
                    <p><strong>Ostatnia aktualizacja:</strong> {new Date(selectedAction.updatedAt).toLocaleDateString()}</p>
                    <p><strong>Obszar:</strong> {selectedAction.area}</p>
                    <p><strong>Poziom ryzyka:</strong> <Badge bg={getPriorityColor(selectedAction.riskLevel)}>{selectedAction.riskLevel}</Badge></p>
                  </Col>
                </Row>
                
                <div className="mb-3">
                  <h6>Opis</h6>
                  <p>{selectedAction.description}</p>
                </div>
                
                <div className="mb-3">
                  <h6>Artykuły RODO</h6>
                  <div>
                    {selectedAction.gdprArticles.map(article => (
                      <Badge key={article} bg="secondary" className="me-2">
                        Art. {article}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Tabs defaultActiveKey="status" className="mb-3">
                  <Tab eventKey="status" title="Zmiana statusu">
                    <div className="mb-3">
                      <h6>Zmień status</h6>
                      <ButtonGroup>
                        <Button 
                          variant={selectedAction.status === 'Nowe' ? 'primary' : 'outline-primary'} 
                          onClick={() => handleStatusChange(selectedAction.id, 'Nowe')}
                          disabled={selectedAction.status === 'Nowe'}
                        >
                          Nowe
                        </Button>
                        <Button 
                          variant={selectedAction.status === 'W trakcie' ? 'primary' : 'outline-primary'} 
                          onClick={() => handleStatusChange(selectedAction.id, 'W trakcie')}
                          disabled={selectedAction.status === 'W trakcie'}
                        >
                          W trakcie
                        </Button>
                        <Button 
                          variant={selectedAction.status === 'Zakończone' ? 'primary' : 'outline-primary'} 
                          onClick={() => handleStatusChange(selectedAction.id, 'Zakończone')}
                          disabled={selectedAction.status === 'Zakończone'}
                        >
                          Zakończone
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Tab>
                  <Tab eventKey="history" title="Historia zmian">
                    <div className="mb-3">
                      <h6>Historia zmian statusu</h6>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Użytkownik</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAction.statusHistory.map((history, index) => (
                            <tr key={index}>
                              <td>{new Date(history.date).toLocaleDateString()}</td>
                              <td><Badge bg={getStatusColor(history.status)}>{history.status}</Badge></td>
                              <td>{history.user}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                  <Tab eventKey="attachments" title="Załączniki">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Załączniki</h6>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setShowAttachmentModal(true)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-1" />
                          Dodaj załącznik
                        </Button>
                      </div>
                      {selectedAction.attachments.length > 0 ? (
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Nazwa</th>
                              <th>Typ</th>
                              <th>Data dodania</th>
                              <th>Akcje</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAction.attachments.map(attachment => (
                              <tr key={attachment.id}>
                                <td>{attachment.name}</td>
                                <td>{attachment.type}</td>
                                <td>{new Date(attachment.uploadedAt).toLocaleDateString()}</td>
                                <td>
                                  <Button variant="outline-primary" size="sm">
                                    <FontAwesomeIcon icon={faDownload} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <Alert variant="info">
                          Brak załączników dla tego działania.
                        </Alert>
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="comments" title="Komentarze">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Komentarze</h6>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setShowCommentModal(true)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-1" />
                          Dodaj komentarz
                        </Button>
                      </div>
                      {selectedAction.comments.length > 0 ? (
                        <div>
                          {selectedAction.comments.map(comment => (
                            <Card key={comment.id} className="mb-2">
                              <Card.Body>
                                <div className="d-flex justify-content-between">
                                  <small className="text-muted">{comment.user} - {new Date(comment.date).toLocaleDateString()}</small>
                                </div>
                                <p className="mb-0 mt-2">{comment.text}</p>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Alert variant="info">
                          Brak komentarzy dla tego działania.
                        </Alert>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowActionModal(false)}>
              Zamknij
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Modal dodawania komentarza */}
        <Modal 
          show={showCommentModal} 
          onHide={() => setShowCommentModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Dodaj komentarz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Treść komentarza</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
              Anuluj
            </Button>
            <Button variant="primary" onClick={handleAddComment}>
              Dodaj komentarz
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Modal dodawania załącznika */}
        <Modal 
          show={showAttachmentModal} 
          onHide={() => setShowAttachmentModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Dodaj załącznik</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nazwa załącznika</Form.Label>
              <Form.Control 
                type="text"
                value={newAttachment.name}
                onChange={(e) => setNewAttachment({...newAttachment, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Typ załącznika</Form.Label>
              <Form.Select
                value={newAttachment.type}
                onChange={(e) => setNewAttachment({...newAttachment, type: e.target.value})}
              >
                <option value="document">Dokument</option>
                <option value="image">Obraz</option>
                <option value="spreadsheet">Arkusz kalkulacyjny</option>
                <option value="presentation">Prezentacja</option>
                <option value="other">Inny</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAttachmentModal(false)}>
              Anuluj
            </Button>
            <Button variant="primary" onClick={handleAddAttachment}>
              Dodaj załącznik
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default RemedialActionsSection;
