# Panel Oceny RODO (GDPR Assessment Panel)

Aplikacja webowa do przeprowadzania ocen zgodności z RODO (GDPR), zarządzania ryzykiem i śledzenia działań naprawczych.

## Funkcjonalności

### 1. Formularze Oceny RODO
- Różne formaty formularzy (standardowy, kompaktowy, animowany)
- Dynamiczne sekcje odpowiadające obszarom RODO
- Automatyczne zapisywanie odpowiedzi

### 2. System Oceny Ryzyka
- Automatyczne obliczanie poziomu ryzyka na podstawie odpowiedzi
- Historia ocen ryzyka z możliwością przeglądania poprzednich wyników
- Wizualne wskaźniki zmian poziomu ryzyka
- Szczegółowe rekomendacje działań w zależności od poziomu ryzyka
- Eksport oceny ryzyka do pliku
- Analiza trendów ryzyka w czasie

### 3. Wizualizacje Oceny
- Interaktywne wykresy z możliwością kliknięcia na elementy
- Porównanie z poprzednimi ocenami (tryb porównawczy)
- Analiza trendów w czasie dla poszczególnych obszarów
- Różne typy wykresów (słupkowe, radarowe, liniowe, polarne)
- Eksport wizualizacji do formatów PNG i PDF
- Wizualne wskaźniki zmian między ocenami

### 4. Działania Naprawcze
- Zaawansowane filtrowanie i sortowanie działań naprawczych
- Eksport listy działań do formatów CSV i PDF
- Śledzenie historii zmian statusów
- Zarządzanie załącznikami do działań naprawczych
- Powiązanie działań z artykułami RODO
- Powiadomienia o zbliżających się terminach
- Wizualizacja postępu realizacji działań

### 5. Historia Zmian
- Wizualizacja trendów zmian w czasie dla poszczególnych obszarów
- Szczegółowe widoki porównawcze między wersjami
- Funkcja przywracania poprzednich wersji oceny
- Eksport historii zmian i porównań do PDF
- System zakładek do przełączania między różnymi widokami
- Interaktywne wykresy z możliwością wyboru obszaru do analizy
- Szczegółowe statystyki i podsumowania zmian

## Technologie

### Frontend
- React 18
- React Bootstrap
- React Router
- Chart.js / React-Chartjs-2
- jsPDF (eksport do PDF)
- FontAwesome (ikony)
- Formik i Yup (walidacja formularzy)
- Axios (komunikacja z API)

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL

## Instalacja i uruchomienie

### Wymagania
- Node.js 14+
- Java 11+
- Docker i Docker Compose
- PostgreSQL

### Uruchomienie z Docker Compose
1. Sklonuj repozytorium:
```
git clone https://github.com/optiq-ai/rodo-assessment-panel.git
cd rodo-assessment-panel
```

2. Utwórz plik `.env` z odpowiednimi zmiennymi środowiskowymi:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rodo_assessment
REACT_APP_API_URL=http://localhost:8080/api
NODE_ENV=development
```

3. Uruchom aplikację za pomocą Docker Compose:
```
docker-compose up -d
```

4. Aplikacja będzie dostępna pod adresem:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

### Uruchomienie bez Dockera

#### Backend
1. Przejdź do katalogu backend:
```
cd rodo-assessment-panel/backend
```

2. Zbuduj projekt:
```
./mvnw clean package
```

3. Uruchom aplikację:
```
java -jar target/rodo-assessment-0.0.1-SNAPSHOT.jar
```

#### Frontend
1. Przejdź do katalogu frontend:
```
cd rodo-assessment-panel/frontend
```

2. Zainstaluj zależności:
```
npm install
```

3. Uruchom aplikację:
```
npm start
```

## Struktura projektu

```
rodo-assessment-panel/
├── backend/                  # Aplikacja Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── rodoassessment/
│   │   │   │           ├── config/       # Konfiguracja Spring
│   │   │   │           ├── controller/   # Kontrolery REST
│   │   │   │           ├── model/        # Encje JPA
│   │   │   │           ├── repository/   # Repozytoria Spring Data
│   │   │   │           ├── service/      # Warstwa usług
│   │   │   │           └── filter/       # Filtry HTTP
│   │   │   └── resources/                # Zasoby aplikacji
│   │   └── test/                         # Testy jednostkowe
├── frontend/                 # Aplikacja React
│   ├── public/               # Pliki statyczne
│   ├── src/
│   │   ├── components/       # Komponenty React
│   │   │   ├── assessment/   # Komponenty oceny RODO
│   │   │   ├── dashboard/    # Komponenty dashboardu
│   │   │   └── layout/       # Komponenty układu strony
│   │   ├── data/             # Dane mockowe
│   │   ├── pages/            # Strony aplikacji
│   │   ├── services/         # Usługi API
│   │   ├── tests/            # Testy komponentów
│   │   ├── App.js            # Główny komponent aplikacji
│   │   └── index.js          # Punkt wejścia aplikacji
├── database/                 # Skrypty bazy danych
│   ├── init-db.sql           # Skrypt inicjalizacji bazy
│   └── create-database.sh    # Skrypt tworzenia bazy
└── docker-compose.yml        # Konfiguracja Docker Compose
```

## Testowanie

### Frontend
```
cd frontend
npm test
```

### Backend
```
cd backend
./mvnw test
```

## Dokumentacja API

API REST dostępne jest pod adresem `/api`. Główne endpointy:

- `GET /api/assessments` - Lista ocen RODO
- `GET /api/assessments/{id}` - Szczegóły oceny RODO
- `POST /api/assessments` - Utworzenie nowej oceny
- `PUT /api/assessments/{id}` - Aktualizacja oceny
- `DELETE /api/assessments/{id}` - Usunięcie oceny

- `GET /api/remedial-actions` - Lista działań naprawczych
- `GET /api/remedial-actions/{id}` - Szczegóły działania naprawczego
- `POST /api/remedial-actions` - Utworzenie nowego działania
- `PUT /api/remedial-actions/{id}` - Aktualizacja działania
- `DELETE /api/remedial-actions/{id}` - Usunięcie działania

- `GET /api/history/{assessmentId}` - Historia zmian oceny

## Licencja

Ten projekt jest udostępniany na licencji MIT.
