/**
 * Testy manualne dla komponentów autentykacji
 * 
 * Ten plik zawiera funkcje do ręcznego testowania zmodyfikowanych komponentów 
 * logowania i rejestracji bezpośrednio w przeglądarce.
 */

// Funkcje pomocnicze do testowania w przeglądarce
const testLogin = async (login, password) => {
  console.log(`=== Test logowania dla użytkownika: ${login} ===`);
  
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: login,
        password: password
      })
    });
    
    console.log('Status odpowiedzi:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Odpowiedź serwera:', data);
      console.log('Test zakończony sukcesem ✅');
      return { success: true, data };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Błąd:', errorData.message || response.statusText);
      console.log('Test zakończony niepowodzeniem ❌');
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas testu:', error);
    console.log('Test zakończony niepowodzeniem ❌');
    return { success: false, error };
  }
};

const testRegister = async (userData) => {
  console.log(`=== Test rejestracji dla użytkownika: ${userData.userName} ===`);
  
  try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    console.log('Status odpowiedzi:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Odpowiedź serwera:', data);
      console.log('Test zakończony sukcesem ✅');
      return { success: true, data };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Błąd:', errorData.error || errorData.message || response.statusText);
      console.log('Test zakończony niepowodzeniem ❌');
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas testu:', error);
    console.log('Test zakończony niepowodzeniem ❌');
    return { success: false, error };
  }
};

// Funkcje testowe do uruchomienia w konsoli przeglądarki
const testLoginSuccess = () => {
  return testLogin('admin', 'admin123');
};

const testLoginFailure = () => {
  return testLogin('admin', 'niepoprawne_haslo');
};

const testRegisterSuccess = () => {
  const timestamp = new Date().getTime();
  return testRegister({
    userName: `testuser_${timestamp}`,
    password: 'Password123!',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: `jan.kowalski.${timestamp}@example.com`
  });
};

const testRegisterFailure = () => {
  return testRegister({
    userName: 'admin', // Istniejący użytkownik
    password: 'Password123!',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com'
  });
};

// Eksport funkcji testowych do globalnego obiektu window
window.authTests = {
  testLoginSuccess,
  testLoginFailure,
  testRegisterSuccess,
  testRegisterFailure,
  testLogin,
  testRegister
};

// Instrukcje dla deweloperów
console.log(`
=== INSTRUKCJE TESTOWANIA AUTENTYKACJI ===
Aby przetestować zmiany w komponentach autentykacji, wykonaj następujące kroki:
1. Otwórz konsolę przeglądarki (F12)
2. Uruchom jeden z poniższych testów:
   - window.authTests.testLoginSuccess() - test udanego logowania
   - window.authTests.testLoginFailure() - test nieudanego logowania
   - window.authTests.testRegisterSuccess() - test udanej rejestracji
   - window.authTests.testRegisterFailure() - test nieudanej rejestracji
3. Możesz również uruchomić własne testy:
   - window.authTests.testLogin('login', 'hasło')
   - window.authTests.testRegister({ userName: '...', password: '...', ... })
`);
