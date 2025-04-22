import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faShieldAlt, faChartBar, faCreditCard } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  return (
    <header className="app-header">
      <Container>
        <Navbar expand="lg" variant="dark" className="p-0">
          <Navbar.Brand as={Link} to={currentUser ? '/dashboard' : '/'} className="d-flex align-items-center">
            <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
            <span className="app-title">Panel Oceny RODO</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {currentUser ? (
                <>
                  <Nav.Link as={Link} to="/dashboard" className="text-light">
                    <FontAwesomeIcon icon={faChartBar} className="me-1" /> Dashboard
                  </Nav.Link>
                  <NavDropdown 
                    title={
                      <span className="text-light">
                        <FontAwesomeIcon icon={faUser} className="me-1" /> {currentUser.username}
                      </span>
                    } 
                    id="basic-nav-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/settings">
                      <FontAwesomeIcon icon={faCog} className="me-2" /> Ustawienia
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings/subscription">
                      <FontAwesomeIcon icon={faCreditCard} className="me-2" /> Subskrypcja
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Wyloguj
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="text-light">Logowanie</Nav.Link>
                  <Nav.Link as={Link} to="/register" className="text-light">Rejestracja</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
