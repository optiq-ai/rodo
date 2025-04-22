import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Assessment from '../pages/Assessment';
import RiskScoringSystem from '../components/assessment/RiskScoringSystem';
import AssessmentVisualizations from '../components/assessment/AssessmentVisualizations';
import RemedialActionsSection from '../components/assessment/RemedialActionsSection';
import ChangeHistoryFeature from '../components/assessment/ChangeHistoryFeature';

/**
 * Test file dla komponentów oceny RODO
 * 
 * Testy sprawdzają:
 * - Poprawne renderowanie komponentów
 * - Integrację komponentów ze stroną Assessment
 * - Działanie z danymi mockowymi
 */

// Mock dla react-chartjs-2, aby uniknąć błędów z Canvas podczas testów
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart">Mock Line Chart</div>,
  Bar: () => <div data-testid="mock-bar-chart">Mock Bar Chart</div>,
  Radar: () => <div data-testid="mock-radar-chart">Mock Radar Chart</div>,
  Pie: () => <div data-testid="mock-pie-chart">Mock Pie Chart</div>,
  Polar: () => <div data-testid="mock-polar-chart">Mock Polar Chart</div>,
}));

// Mock dla jspdf i jspdf-autotable
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    setFontSize: jest.fn(),
    autoTable: jest.fn(),
    save: jest.fn(),
  }));
});

// Wrapper dla komponentów używających React Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('RODO Assessment Components', () => {
  // Test dla RiskScoringSystem
  test('RiskScoringSystem renders correctly', () => {
    render(<RiskScoringSystem assessmentId={1} />);
    expect(screen.getByText(/System oceny ryzyka/i)).toBeInTheDocument();
  });

  // Test dla AssessmentVisualizations
  test('AssessmentVisualizations renders correctly', () => {
    render(<AssessmentVisualizations assessmentData={{ id: 1, sections: [] }} />);
    expect(screen.getByText(/Wizualizacje oceny/i)).toBeInTheDocument();
  });

  // Test dla RemedialActionsSection
  test('RemedialActionsSection renders correctly', () => {
    render(<RemedialActionsSection assessmentId={1} />);
    expect(screen.getByText(/Działania naprawcze/i)).toBeInTheDocument();
  });

  // Test dla ChangeHistoryFeature
  test('ChangeHistoryFeature renders correctly', () => {
    render(<ChangeHistoryFeature assessmentId={1} />);
    expect(screen.getByText(/Historia zmian/i)).toBeInTheDocument();
  });

  // Test integracji komponentów ze stroną Assessment
  test('Assessment page integrates all components correctly', () => {
    renderWithRouter(<Assessment />);
    
    // Sprawdź, czy strona Assessment zawiera wszystkie komponenty
    expect(screen.getByText(/Ocena RODO/i)).toBeInTheDocument();
    
    // Sprawdź, czy zakładki są dostępne
    expect(screen.getByText(/Formularz oceny/i)).toBeInTheDocument();
    expect(screen.getByText(/Ocena ryzyka/i)).toBeInTheDocument();
    expect(screen.getByText(/Wizualizacje/i)).toBeInTheDocument();
    expect(screen.getByText(/Działania naprawcze/i)).toBeInTheDocument();
    expect(screen.getByText(/Historia zmian/i)).toBeInTheDocument();
  });
});
