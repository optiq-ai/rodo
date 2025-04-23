// Testy dla poprawek autentykacji
// Ten plik zawiera testy, które można uruchomić w konsoli przeglądarki
// aby zweryfikować poprawność działania autentykacji

// Test logowania
async function testLogin() {
  console.log('=== Test logowania ===');
  try {
    // Pobierz kontekst autentykacji
    const authContext = document.querySelector('#root').__reactFiber$._debugOwner.stateNode.context.value;
    console.log('Kontekst autentykacji:', authContext);
    
    // Sprawdź, czy funkcja login istnieje
    if (typeof authContext.login !== 'function') {
      console.error('❌ Funkcja login nie istnieje w kontekście autentykacji');
      return;
    }
    
    console.log('✅ Funkcja login istnieje w kontekście autentykacji');
    
    // Spróbuj zalogować się z testowymi danymi
    console.log('Próba logowania z testowymi danymi...');
    const result = await authContext.login({
      userName: 'testuser',
      password: 'TestPassword123!'
    });
    
    console.log('Wynik logowania:', result);
    
    if (result.success) {
      console.log('✅ Logowanie zakończone sukcesem');
    } else {
      console.log('❌ Logowanie nie powiodło się:', result.error);
    }
  } catch (error) {
    console.error('❌ Błąd podczas testu logowania:', error);
  }
}

// Test rejestracji
async function testRegister() {
  console.log('=== Test rejestracji ===');
  try {
    // Pobierz kontekst autentykacji
    const authContext = document.querySelector('#root').__reactFiber$._debugOwner.stateNode.context.value;
    console.log('Kontekst autentykacji:', authContext);
    
    // Sprawdź, czy funkcja register istnieje
    if (typeof authContext.register !== 'function') {
      console.error('❌ Funkcja register nie istnieje w kontekście autentykacji');
      return;
    }
    
    console.log('✅ Funkcja register istnieje w kontekście autentykacji');
    
    // Wygeneruj unikalną nazwę użytkownika
    const uniqueUsername = 'testuser_' + Math.floor(Math.random() * 10000);
    
    // Spróbuj zarejestrować się z testowymi danymi
    console.log('Próba rejestracji z testowymi danymi...');
    const result = await authContext.register({
      userName: uniqueUsername,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      email: uniqueUsername + '@example.com'
    });
    
    console.log('Wynik rejestracji:', result);
    
    if (result.success) {
      console.log('✅ Rejestracja zakończona sukcesem');
    } else {
      console.log('❌ Rejestracja nie powiodła się:', result.error);
    }
  } catch (error) {
    console.error('❌ Błąd podczas testu rejestracji:', error);
  }
}

// Test weryfikacji tokenu
async function testTokenVerification() {
  console.log('=== Test weryfikacji tokenu ===');
  try {
    // Pobierz token z localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ Brak tokenu w localStorage - zaloguj się najpierw');
      return;
    }
    
    console.log('✅ Token znaleziony w localStorage');
    
    // Wykonaj żądanie do endpointu weryfikacji tokenu
    const response = await fetch('http://localhost:8080/verify-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ Weryfikacja tokenu zakończona sukcesem:', userData);
    } else {
      console.log('❌ Weryfikacja tokenu nie powiodła się:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Błąd podczas testu weryfikacji tokenu:', error);
  }
}

// Instrukcje użycia
console.log(`
=== TESTY AUTENTYKACJI ===
Aby przetestować autentykację, uruchom jedną z poniższych funkcji:

1. testLogin() - test logowania
2. testRegister() - test rejestracji
3. testTokenVerification() - test weryfikacji tokenu

Przykład: testLogin()
`);
