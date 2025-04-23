/**
 * Test integracji API z nowym systemem obsługi błędów
 * 
 * Ten plik zawiera testy, które można uruchomić ręcznie w konsoli przeglądarki
 * aby sprawdzić, czy nowy system obsługi błędów działa poprawnie.
 */

// Importy (do użycia w konsoli przeglądarki)
// import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiUtils';

/**
 * Test pobierania danych profilu użytkownika
 */
const testGetUserProfile = async () => {
  console.log('Test: Pobieranie danych profilu użytkownika');
  
  try {
    // Sprawdź, czy token istnieje
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Brak tokenu w localStorage. Zaloguj się przed uruchomieniem testu.');
      return;
    }
    
    console.log('Token znaleziony w localStorage');
    
    // Wykonaj żądanie GET do endpointu profilu użytkownika
    const response = await fetch('http://localhost:8080/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status odpowiedzi:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Dane profilu użytkownika:', data);
      console.log('Test zakończony sukcesem ✅');
    } else if (response.status === 401) {
      console.error('Błąd autoryzacji: Nieautoryzowany dostęp (401)');
      console.log('Test zakończony niepowodzeniem ❌');
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Błąd:', errorData.message || response.statusText);
      console.log('Test zakończony niepowodzeniem ❌');
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas testu:', error);
    console.log('Test zakończony niepowodzeniem ❌');
  }
};

/**
 * Test pobierania szablonu oceny
 */
const testGetAssessmentTemplate = async () => {
  console.log('Test: Pobieranie szablonu oceny');
  
  try {
    // Sprawdź, czy token istnieje
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Brak tokenu w localStorage. Zaloguj się przed uruchomieniem testu.');
      return;
    }
    
    console.log('Token znaleziony w localStorage');
    
    // Wykonaj żądanie GET do endpointu szablonu oceny
    const response = await fetch('http://localhost:8080/assessments/template', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status odpowiedzi:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Dane szablonu oceny:', data);
      console.log('Test zakończony sukcesem ✅');
    } else if (response.status === 401) {
      console.error('Błąd autoryzacji: Nieautoryzowany dostęp (401)');
      console.log('Test zakończony niepowodzeniem ❌');
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Błąd:', errorData.message || response.statusText);
      console.log('Test zakończony niepowodzeniem ❌');
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas testu:', error);
    console.log('Test zakończony niepowodzeniem ❌');
  }
};

/**
 * Test weryfikacji tokenu
 */
const testVerifyToken = async () => {
  console.log('Test: Weryfikacja tokenu');
  
  try {
    // Sprawdź, czy token istnieje
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Brak tokenu w localStorage. Zaloguj się przed uruchomieniem testu.');
      return;
    }
    
    console.log('Token znaleziony w localStorage');
    
    // Wykonaj żądanie GET do endpointu weryfikacji tokenu
    const response = await fetch('http://localhost:8080/verify-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status odpowiedzi:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Dane użytkownika z tokenu:', data);
      console.log('Test zakończony sukcesem ✅');
    } else if (response.status === 401) {
      console.error('Błąd autoryzacji: Nieautoryzowany dostęp (401)');
      console.log('Test zakończony niepowodzeniem ❌');
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Błąd:', errorData.message || response.statusText);
      console.log('Test zakończony niepowodzeniem ❌');
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas testu:', error);
    console.log('Test zakończony niepowodzeniem ❌');
  }
};

/**
 * Uruchom wszystkie testy
 */
const runAllTests = async () => {
  console.log('=== ROZPOCZĘCIE TESTÓW INTEGRACJI API ===');
  
  await testVerifyToken();
  console.log('---');
  
  await testGetUserProfile();
  console.log('---');
  
  await testGetAssessmentTemplate();
  
  console.log('=== ZAKOŃCZENIE TESTÓW INTEGRACJI API ===');
};

// Eksportuj funkcje testowe do użycia w konsoli przeglądarki
window.testVerifyToken = testVerifyToken;
window.testGetUserProfile = testGetUserProfile;
window.testGetAssessmentTemplate = testGetAssessmentTemplate;
window.runAllTests = runAllTests;

// Instrukcje dla deweloperów:
console.log(`
=== INSTRUKCJE TESTOWANIA API ===
Aby przetestować integrację API, wykonaj następujące kroki:
1. Zaloguj się do aplikacji
2. Otwórz konsolę przeglądarki (F12)
3. Uruchom jeden z poniższych testów:
   - window.testVerifyToken() - test weryfikacji tokenu
   - window.testGetUserProfile() - test pobierania danych profilu
   - window.testGetAssessmentTemplate() - test pobierania szablonu oceny
   - window.runAllTests() - uruchomienie wszystkich testów
`);
