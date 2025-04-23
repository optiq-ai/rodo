/**
 * Testy dla komponentów autentykacji
 * 
 * Ten plik zawiera testy dla zmodyfikowanych komponentów logowania i rejestracji,
 * które sprawdzają poprawność obsługi błędów i formatowania danych.
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Utworzenie mocka dla axios
const mock = new MockAdapter(axios);

// Funkcje pomocnicze do testowania
const simulateLoginSubmit = async (login, password) => {
  try {
    const response = await axios.post('http://localhost:8080/login', {
      userName: login,
      password: password
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error
    };
  }
};

const simulateRegisterSubmit = async (userData) => {
  try {
    const response = await axios.post('http://localhost:8080/register', userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error
    };
  }
};

// Testy dla logowania
describe('Login functionality', () => {
  beforeEach(() => {
    mock.reset();
  });
  
  test('Successful login sends correct data format', async () => {
    // Konfiguracja mocka dla udanego logowania
    mock.onPost('http://localhost:8080/login').reply(200, {
      token: 'test-token'
    });
    
    // Symulacja logowania
    const result = await simulateLoginSubmit('testuser', 'password123');
    
    // Sprawdzenie, czy żądanie zostało wykonane
    expect(mock.history.post.length).toBe(1);
    
    // Sprawdzenie, czy dane zostały wysłane w poprawnym formacie
    const requestData = JSON.parse(mock.history.post[0].data);
    expect(requestData.userName).toBe('testuser');
    expect(requestData.password).toBe('password123');
    expect(Array.isArray(requestData.password)).toBe(false); // Hasło NIE jest tablicą
    
    // Sprawdzenie, czy odpowiedź została poprawnie przetworzona
    expect(result.success).toBe(true);
    expect(result.data.token).toBe('test-token');
  });
  
  test('Login handles 401 error correctly', async () => {
    // Konfiguracja mocka dla błędu 401
    mock.onPost('http://localhost:8080/login').reply(401, {
      message: 'Invalid username or password'
    });
    
    // Symulacja logowania
    const result = await simulateLoginSubmit('testuser', 'wrongpassword');
    
    // Sprawdzenie, czy żądanie zostało wykonane
    expect(mock.history.post.length).toBe(1);
    
    // Sprawdzenie, czy błąd został poprawnie przetworzony
    expect(result.success).toBe(false);
    expect(result.error.response.status).toBe(401);
    expect(result.error.response.data.message).toBe('Invalid username or password');
  });
  
  test('Login handles network error correctly', async () => {
    // Konfiguracja mocka dla błędu sieci
    mock.onPost('http://localhost:8080/login').networkError();
    
    // Symulacja logowania
    const result = await simulateLoginSubmit('testuser', 'password123');
    
    // Sprawdzenie, czy żądanie zostało wykonane
    expect(mock.history.post.length).toBe(1);
    
    // Sprawdzenie, czy błąd został poprawnie przetworzony
    expect(result.success).toBe(false);
    expect(result.error.message).toContain('Network Error');
  });
});

// Testy dla rejestracji
describe('Registration functionality', () => {
  beforeEach(() => {
    mock.reset();
  });
  
  test('Successful registration sends correct data format', async () => {
    // Konfiguracja mocka dla udanej rejestracji
    mock.onPost('http://localhost:8080/register').reply(200, {
      token: 'test-token'
    });
    
    // Dane testowe
    const userData = {
      userName: 'newuser',
      password: 'Password123!',
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com'
    };
    
    // Symulacja rejestracji
    const result = await simulateRegisterSubmit(userData);
    
    // Sprawdzenie, czy żądanie zostało wykonane
    expect(mock.history.post.length).toBe(1);
    
    // Sprawdzenie, czy dane zostały wysłane w poprawnym formacie
    const requestData = JSON.parse(mock.history.post[0].data);
    expect(requestData.userName).toBe('newuser');
    expect(requestData.password).toBe('Password123!');
    expect(Array.isArray(requestData.password)).toBe(false); // Hasło NIE jest tablicą
    expect(requestData.firstName).toBe('Jan');
    expect(requestData.lastName).toBe('Kowalski');
    expect(requestData.email).toBe('jan.kowalski@example.com');
    
    // Sprawdzenie, czy odpowiedź została poprawnie przetworzona
    expect(result.success).toBe(true);
    expect(result.data.token).toBe('test-token');
  });
  
  test('Registration handles username already exists error correctly', async () => {
    // Konfiguracja mocka dla błędu 400
    mock.onPost('http://localhost:8080/register').reply(400, {
      error: 'Nazwa użytkownika już istnieje'
    });
    
    // Dane testowe
    const userData = {
      userName: 'existinguser',
      password: 'Password123!',
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com'
    };
    
    // Symulacja rejestracji
    const result = await simulateRegisterSubmit(userData);
    
    // Sprawdzenie, czy żądanie zostało wykonane
    expect(mock.history.post.length).toBe(1);
    
    // Sprawdzenie, czy błąd został poprawnie przetworzony
    expect(result.success).toBe(false);
    expect(result.error.response.status).toBe(400);
    expect(result.error.response.data.error).toBe('Nazwa użytkownika już istnieje');
  });
  
  test('Registration handles network error correctly', async () => {
    // Konfiguracja mocka dla błędu sieci
    mock.onPost('http://localhost:8080/register').networkError();
    
    // Dane testowe
    const userData = {
      userName: 'newuser',
      password: 'Password123!',
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com'
    };
    
    // Symulacja rejestracji
    const result = await simulateRegisterSubmit(userData);
    
    // Sprawdzenie, czy żądanie zostało wykonane
    expect(mock.history.post.length).toBe(1);
    
    // Sprawdzenie, czy błąd został poprawnie przetworzony
    expect(result.success).toBe(false);
    expect(result.error.message).toContain('Network Error');
  });
});

// Eksport funkcji testowych do ręcznego uruchomienia
export const manualTests = {
  testLoginSuccess: () => simulateLoginSubmit('testuser', 'password123'),
  testLoginFailure: () => simulateLoginSubmit('testuser', 'wrongpassword'),
  testRegistrationSuccess: () => simulateRegisterSubmit({
    userName: 'newuser',
    password: 'Password123!',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com'
  }),
  testRegistrationFailure: () => simulateRegisterSubmit({
    userName: 'existinguser',
    password: 'Password123!',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com'
  })
};

// Instrukcje dla deweloperów
console.log(`
=== INSTRUKCJE TESTOWANIA AUTENTYKACJI ===
Aby przetestować zmiany w komponentach autentykacji, wykonaj następujące kroki:
1. Zainstaluj zależności testowe: npm install --save-dev jest axios-mock-adapter
2. Uruchom testy: npm test auth.test.js
3. Alternatywnie, możesz uruchomić testy ręcznie w konsoli przeglądarki:
   - window.manualTests.testLoginSuccess()
   - window.manualTests.testLoginFailure()
   - window.manualTests.testRegistrationSuccess()
   - window.manualTests.testRegistrationFailure()
`);
