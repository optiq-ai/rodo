# RODO Backend API - Dokumentacja Implementacji

## Przegląd

Backend API dla aplikacji RODO zostało zaimplementowane zgodnie z dokumentacją API. Implementacja obejmuje wszystkie wymagane endpointy do obsługi funkcjonalności aplikacji, w tym:

- Uwierzytelnianie użytkowników (rejestracja, logowanie, weryfikacja tokenu)
- Zarządzanie profilem użytkownika
- Zarządzanie danymi firmy
- Zarządzanie ocenami RODO
- Generowanie raportów i analiz
- Zarządzanie subskrypcjami

## Struktura projektu

Projekt jest zorganizowany w następujący sposób:

- `com.auth.jwt.controller` - Kontrolery obsługujące endpointy API
- `com.auth.jwt.data.entity` - Encje bazodanowe
- `com.auth.jwt.data.repository` - Repozytoria do dostępu do danych
- `com.auth.jwt.data.dto` - Obiekty transferu danych (DTO)
- `com.auth.jwt.security` - Konfiguracja bezpieczeństwa i filtry JWT
- `com.auth.jwt.test` - Klasy testowe

## Zaimplementowane kontrolery

### AuthController
Obsługuje logowanie użytkowników.

### RegistrationController
Obsługuje rejestrację nowych użytkowników.

### TokenController
Obsługuje weryfikację tokenów JWT.

### UserController
Obsługuje zarządzanie profilem użytkownika:
- Pobieranie danych profilu
- Aktualizacja danych profilu
- Zmiana hasła

### CompanyController
Obsługuje zarządzanie danymi firmy:
- Pobieranie danych firmy
- Aktualizacja danych firmy

### AssessmentController
Obsługuje zarządzanie ocenami RODO:
- Pobieranie listy ocen
- Pobieranie podsumowania ocen
- Pobieranie szczegółów oceny
- Pobieranie szablonu oceny
- Tworzenie nowej oceny
- Aktualizacja istniejącej oceny
- Usuwanie oceny
- Eksport oceny

### ReportController
Obsługuje generowanie raportów i analiz:
- Pobieranie danych raportu z możliwością filtrowania
- Pobieranie szczegółów obszaru zgodności
- Eksport raportu

### SubscriptionController
Obsługuje zarządzanie subskrypcjami:
- Pobieranie danych subskrypcji
- Zmiana planu subskrypcji
- Anulowanie subskrypcji
- Pobieranie dostępnych planów

## Model danych

### Użytkownicy i profile
- `Employee` - podstawowa encja użytkownika z danymi uwierzytelniającymi
- `Role` - role użytkowników w systemie
- `UserProfile` - dodatkowe dane profilowe użytkownika
- `Company` - dane firmy powiązanej z użytkownikiem

### Oceny RODO
- `Assessment` - główna encja oceny RODO
- `Chapter` - rozdziały w ramach oceny
- `Area` - obszary zgodności w ramach rozdziałów
- `Requirement` - konkretne wymagania w ramach obszarów

### Raporty
- `Report` - główna encja raportu
- `ComplianceArea` - obszary zgodności w raporcie
- `Recommendation` - rekomendacje wynikające z raportu

### Subskrypcje
- `Subscription` - dane subskrypcji użytkownika

## Bezpieczeństwo

Aplikacja wykorzystuje uwierzytelnianie oparte na tokenach JWT:
- Tokeny są generowane podczas logowania i rejestracji
- Tokeny są weryfikowane przez filtr JWT dla chronionych endpointów
- Endpointy `/login` i `/register` są dostępne bez uwierzytelnienia
- Wszystkie pozostałe endpointy wymagają ważnego tokenu JWT

## Testowanie

Zaimplementowano klasę `ApiEndpointTester`, która automatycznie testuje wszystkie endpointy API podczas uruchamiania aplikacji. Testy obejmują:
- Endpointy uwierzytelniania
- Endpointy profilu użytkownika
- Endpointy danych firmy
- Endpointy ocen RODO
- Endpointy raportów
- Endpointy subskrypcji

## Uruchomienie

Aby uruchomić aplikację, należy:
1. Skonfigurować bazę danych w pliku `application.properties`
2. Uruchomić aplikację za pomocą Gradle: `./gradlew bootRun`
3. API będzie dostępne pod adresem `http://localhost:8080`

## Uwagi implementacyjne

- Wszystkie endpointy zwracają odpowiedzi w formacie JSON
- Wszystkie endpointy obsługują walidację danych wejściowych
- Wszystkie endpointy obsługują odpowiednie kody błędów HTTP
- Wszystkie komunikaty błędów są w języku polskim
- Dane są powiązane z użytkownikiem poprzez pole `employee_id`
- Implementacja zawiera przykładowe dane dla raportów i szablonów ocen

## Dalszy rozwój

Możliwe kierunki dalszego rozwoju:
- Implementacja zaawansowanych filtrów dla raportów
- Dodanie mechanizmu eksportu do różnych formatów (PDF, Excel)
- Implementacja powiadomień e-mail
- Dodanie mechanizmu płatności dla subskrypcji
- Implementacja mechanizmu odzyskiwania hasła
