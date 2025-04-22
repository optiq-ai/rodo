# Backend - Panel do oceny zgodności z RODO

Ten katalog zawiera kod źródłowy backendu aplikacji do oceny zgodności z RODO, zbudowany przy użyciu Spring Boot.

## Struktura katalogów

- `src/main/java/com/rodoassessment/gdprassessmentpanel/` - Kod źródłowy aplikacji
  - `controller/` - Kontrolery REST API
  - `dto/` - Obiekty transferu danych
  - `model/` - Encje bazodanowe
  - `repository/` - Repozytoria JPA
  - `security/` - Konfiguracja bezpieczeństwa i JWT
  - `service/` - Warstwa usług biznesowych
  - `exception/` - Obsługa wyjątków
  - `config/` - Konfiguracja aplikacji
- `src/main/resources/` - Zasoby aplikacji
  - `application.properties` - Konfiguracja aplikacji

## Technologie

- Spring Boot 2.7
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (JSON Web Token)
- Maven

## Funkcjonalności

- REST API dla panelu oceny RODO
- Uwierzytelnianie i autoryzacja użytkowników
- Zarządzanie oceną zgodności z RODO
- Generowanie raportów
- Zabezpieczenia zgodne z najlepszymi praktykami

## Uruchomienie w trybie deweloperskim

```bash
cd backend
mvn spring-boot:run
```

Aplikacja będzie dostępna pod adresem: http://localhost:8080/api

## Budowanie do produkcji

```bash
cd backend
mvn clean package
```

Zbudowany plik JAR będzie dostępny w katalogu `target/`.

## Testy

```bash
cd backend
mvn test
```

## Zmienne środowiskowe

Aplikacja korzysta z następujących zmiennych środowiskowych:

- `SPRING_PROFILES_ACTIVE` - Aktywny profil Spring (dev, prod, test)
- `SPRING_DATASOURCE_URL` - URL do bazy danych
- `SPRING_DATASOURCE_USERNAME` - Nazwa użytkownika bazy danych
- `SPRING_DATASOURCE_PASSWORD` - Hasło do bazy danych
- `SPRING_JPA_HIBERNATE_DDL_AUTO` - Tryb inicjalizacji schematu bazy danych
- `APP_JWT_SECRET` - Sekret do generowania tokenów JWT
- `APP_JWT_EXPIRATION` - Czas wygaśnięcia tokenów JWT (w milisekundach)

## Endpointy API

### Autentykacja

- `POST /api/auth/signin` - Logowanie użytkownika
- `POST /api/auth/signup` - Rejestracja nowego użytkownika

### Ocena RODO

- `GET /api/assessments` - Pobieranie listy ocen
- `GET /api/assessments/{id}` - Pobieranie szczegółów oceny
- `POST /api/assessments` - Tworzenie nowej oceny
- `PUT /api/assessments/{id}` - Aktualizacja oceny
- `DELETE /api/assessments/{id}` - Usuwanie oceny

### Odpowiedzi

- `GET /api/assessments/{id}/responses` - Pobieranie odpowiedzi dla oceny
- `POST /api/assessments/{id}/responses` - Dodawanie odpowiedzi do oceny
- `PUT /api/assessments/{id}/responses/{responseId}` - Aktualizacja odpowiedzi
- `DELETE /api/assessments/{id}/responses/{responseId}` - Usuwanie odpowiedzi

### Wyniki

- `GET /api/assessments/{id}/results` - Pobieranie wyników oceny
- `GET /api/assessments/{id}/report` - Generowanie raportu z oceny
