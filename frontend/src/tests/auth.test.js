import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginForm from '../components/LoginPageComponents/LoginPage/LoginCard/LoginForm/LoginForm';
import Register from '../pages/Register';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Wrapper component for testing
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Authentication Components', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Clear all mocks
    jest.clearAllMocks();
  });
  
  describe('LoginForm Component', () => {
    test('renders login form correctly', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /zaloguj/i })).toBeInTheDocument();
    });
    
    test('handles login submission correctly', async () => {
      // Mock the login function in AuthContext
      const mockLogin = jest.fn().mockResolvedValue({ success: true });
      jest.mock('../hooks/useAuth', () => ({
        useAuth: () => ({
          login: mockLogin
        })
      }));
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );
      
      // Fill in the form
      fireEvent.change(screen.getByLabelText(/login/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'password123' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /zaloguj/i }));
      
      // Verify that login was called with correct parameters
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          userName: 'testuser',
          password: 'password123'
        });
      });
    });
    
    test('displays error message on login failure', async () => {
      // Mock the login function in AuthContext to return an error
      const mockLogin = jest.fn().mockResolvedValue({ 
        success: false, 
        error: 'Nieprawidłowa nazwa użytkownika lub hasło' 
      });
      jest.mock('../hooks/useAuth', () => ({
        useAuth: () => ({
          login: mockLogin
        })
      }));
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );
      
      // Fill in the form
      fireEvent.change(screen.getByLabelText(/login/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'wrongpassword' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /zaloguj/i }));
      
      // Verify that error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Nieprawidłowa nazwa użytkownika lub hasło')).toBeInTheDocument();
      });
    });
  });
  
  describe('Register Component', () => {
    test('renders registration form correctly', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText(/nazwa użytkownika/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/imię/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nazwisko/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^hasło$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/potwierdź hasło/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /zarejestruj/i })).toBeInTheDocument();
    });
    
    test('validates form fields correctly', async () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );
      
      // Submit the form without filling in any fields
      fireEvent.click(screen.getByRole('button', { name: /zarejestruj/i }));
      
      // Verify that validation errors are displayed
      await waitFor(() => {
        expect(screen.getByText(/nazwa użytkownika jest wymagana/i)).toBeInTheDocument();
        expect(screen.getByText(/hasło jest wymagane/i)).toBeInTheDocument();
        expect(screen.getByText(/imię jest wymagane/i)).toBeInTheDocument();
        expect(screen.getByText(/nazwisko jest wymagane/i)).toBeInTheDocument();
        expect(screen.getByText(/email jest wymagany/i)).toBeInTheDocument();
      });
    });
    
    test('handles registration submission correctly', async () => {
      // Mock the register function in AuthContext
      const mockRegister = jest.fn().mockResolvedValue({ success: true });
      jest.mock('../hooks/useAuth', () => ({
        useAuth: () => ({
          register: mockRegister
        })
      }));
      
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );
      
      // Fill in the form with valid data
      fireEvent.change(screen.getByLabelText(/nazwa użytkownika/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/imię/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/nazwisko/i), { target: { value: 'User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^hasło$/i), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByLabelText(/potwierdź hasło/i), { target: { value: 'Password123!' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /zarejestruj/i }));
      
      // Verify that register was called with correct parameters
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          userName: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'Password123!'
        });
      });
    });
  });
});
