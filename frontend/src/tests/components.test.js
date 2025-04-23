import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';

/**
 * Testy integracyjne dla komponentów z nowym systemem obsługi błędów
 * 
 * Ten plik zawiera testy jednostkowe, które można uruchomić za pomocą
 * narzędzia do testowania (np. Jest) w celu sprawdzenia, czy komponenty
 * poprawnie integrują się z nowym systemem obsługi błędów.
 */

// Mock dla fetch API
global.fetch = jest.fn();

// Przygotowanie mocków dla odpowiedzi API
const mockSuccessResponse = (data) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
    status: 200
  });
};

const mockUnauthorizedResponse = () => {
  return Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ message: 'Nieautoryzowany dostęp' }),
    status: 401
  });
};

const mockErrorResponse = (status = 500, message = 'Wystąpił błąd') => {
  return Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ message }),
    status
  });
};

// Resetowanie mocków przed każdym testem
beforeEach(() => {
  global.fetch.mockClear();
  localStorage.clear();
});

describe('Testy integracji komponentów z API', () => {
  test('Przekierowanie do logowania gdy token nie istnieje', async () => {
    // Przygotowanie
    localStorage.removeItem('token');
    
    // Renderowanie komponentu
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Oczekiwanie na przekierowanie do strony logowania
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });
  
  test('Przekierowanie do logowania gdy token jest nieprawidłowy', async () => {
    // Przygotowanie
    localStorage.setItem('token', 'invalid_token');
    global.fetch.mockImplementationOnce(mockUnauthorizedResponse);
    
    // Renderowanie komponentu
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Oczekiwanie na wywołanie API weryfikacji tokenu
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/verify-token',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer invalid_token'
          })
        })
      );
    });
    
    // Oczekiwanie na przekierowanie do strony logowania
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });
  
  test('Wyświetlenie komunikatu błędu przy nieudanym logowaniu', async () => {
    // Przygotowanie
    global.fetch.mockImplementationOnce(mockUnauthorizedResponse);
    
    // Renderowanie komponentu logowania
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Symulacja wprowadzenia danych logowania
    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: 'testuser' }
    });
    
    fireEvent.change(screen.getByLabelText(/hasło/i), {
      target: { value: 'password123' }
    });
    
    // Symulacja kliknięcia przycisku logowania
    fireEvent.click(screen.getByText(/zaloguj/i));
    
    // Oczekiwanie na wywołanie API logowania
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userName: 'testuser',
            password: 'password123'
          })
        })
      );
    });
    
    // Oczekiwanie na wyświetlenie komunikatu błędu
    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowa nazwa użytkownika lub hasło/i)).toBeInTheDocument();
    });
  });
  
  test('Pomyślne logowanie i przekierowanie do dashboardu', async () => {
    // Przygotowanie
    global.fetch.mockImplementationOnce(mockSuccessResponse({
      token: 'valid_token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      }
    }));
    
    // Renderowanie komponentu logowania
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Symulacja wprowadzenia danych logowania
    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: 'testuser' }
    });
    
    fireEvent.change(screen.getByLabelText(/hasło/i), {
      target: { value: 'password123' }
    });
    
    // Symulacja kliknięcia przycisku logowania
    fireEvent.click(screen.getByText(/zaloguj/i));
    
    // Oczekiwanie na wywołanie API logowania
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userName: 'testuser',
            password: 'password123'
          })
        })
      );
    });
    
    // Sprawdzenie, czy token został zapisany w localStorage
    expect(localStorage.getItem('token')).toBe('valid_token');
    
    // Oczekiwanie na przekierowanie do dashboardu
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});

// Eksport testów do uruchomienia przez narzędzie testujące
export default {
  testRedirectToLoginWhenTokenDoesNotExist: () => {
    localStorage.removeItem('token');
    window.location.href = '/dashboard';
  },
  
  testRedirectToLoginWhenTokenIsInvalid: () => {
    localStorage.setItem('token', 'invalid_token');
    window.location.href = '/dashboard';
  },
  
  testDisplayErrorMessageOnFailedLogin: () => {
    window.location.href = '/login';
  },
  
  testSuccessfulLoginAndRedirectToDashboard: () => {
    window.location.href = '/login';
  }
};
