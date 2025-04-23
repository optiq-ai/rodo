# RODO - Dokumentacja API

Ten dokument zawiera specyfikację wszystkich endpointów API wymaganych do obsługi aplikacji RODO. Endpointy są pogrupowane według sekcji funkcjonalnych aplikacji.

## Spis treści

1. [Autentykacja](#autentykacja)
2. [Dashboard](#dashboard)
3. [Oceny RODO](#oceny-rodo)
4. [Szczegółowe raporty](#szczegółowe-raporty)
5. [Wyniki ocen](#wyniki-ocen)
6. [Ustawienia użytkownika](#ustawienia-użytkownika)
7. [Subskrypcje](#subskrypcje)

## Autentykacja

### Logowanie użytkownika
- **Endpoint:** `POST /login`
- **Opis:** Logowanie użytkownika do systemu
- **Dane wejściowe:**
  ```json
  {
    "login": "string",
    "password": "string"
  }
  ```
- **Dane wyjściowe:**
  ```json
  {
    "token": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  }
  ```

### Rejestracja użytkownika
- **Endpoint:** `POST /register`
- **Opis:** Rejestracja nowego użytkownika
- **Dane wejściowe:**
  ```json
  {
    "userName": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
  ```
- **Dane wyjściowe:**
  ```json
  {
    "token": "string",
    "username": "string",
    "email": "string"
  }
  ```

### Weryfikacja tokenu
- **Endpoint:** `GET /verify-token`
- **Opis:** Weryfikacja ważności tokenu JWT
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  {
    "valid": "boolean",
    "username": "string",
    "email": "string",
    "role": "string"
  }
  ```

## Dashboard

### Pobieranie listy ocen
- **Endpoint:** `GET /assessments`
- **Opis:** Pobieranie listy wszystkich ocen RODO dla zalogowanego użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  [
    {
      "id": "number",
      "name": "string",
      "createdAt": "date",
      "status": "string", // "W TRAKCIE", "ZAKOŃCZONA", "DRAFT"
      "progress": "number", // 0-100
      "positiveAreas": "number",
      "warningAreas": "number",
      "negativeAreas": "number"
    }
  ]
  ```

### Usuwanie oceny
- **Endpoint:** `DELETE /assessments/{id}`
- **Opis:** Usuwanie oceny RODO
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry ścieżki:** `id` - identyfikator oceny
- **Dane wyjściowe:**
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

### Pobieranie podsumowania ocen
- **Endpoint:** `GET /assessments/summary`
- **Opis:** Pobieranie podsumowania wszystkich ocen RODO (liczby, statystyki)
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  {
    "totalAssessments": "number",
    "inProgressAssessments": "number",
    "completedAssessments": "number",
    "positiveAreas": "number",
    "warningAreas": "number",
    "negativeAreas": "number",
    "totalAreas": "number",
    "compliancePercentage": "number"
  }
  ```

## Oceny RODO

### Pobieranie szczegółów oceny
- **Endpoint:** `GET /assessments/{id}`
- **Opis:** Pobieranie szczegółów oceny RODO
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry ścieżki:** `id` - identyfikator oceny
- **Dane wyjściowe:**
  ```json
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date",
    "chapters": [
      {
        "id": "number",
        "name": "string",
        "description": "string",
        "areas": [
          {
            "id": "number",
            "name": "string",
            "description": "string",
            "score": "string", // "POZYTYWNA", "ZASTRZEŻENIA", "NEGATYWNA", "W REALIZACJI", "NIE DOTYCZY"
            "comment": "string",
            "requirements": [
              {
                "id": "number",
                "text": "string",
                "value": "string", // "TAK", "NIE", "W REALIZACJI", "ND"
                "comment": "string"
              }
            ]
          }
        ]
      }
    ]
  }
  ```

### Pobieranie szablonu oceny
- **Endpoint:** `GET /assessments/template`
- **Opis:** Pobieranie szablonu nowej oceny RODO
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:** Taka sama struktura jak w `GET /assessments/{id}`, ale z pustymi wartościami dla pól oceny

### Zapisywanie oceny
- **Endpoint:** `POST /assessments`
- **Opis:** Tworzenie nowej oceny RODO
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wejściowe:** Taka sama struktura jak w `GET /assessments/{id}`
- **Dane wyjściowe:**
  ```json
  {
    "id": "number",
    "success": "boolean",
    "message": "string"
  }
  ```

### Aktualizacja oceny
- **Endpoint:** `PUT /assessments/{id}`
- **Opis:** Aktualizacja istniejącej oceny RODO
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry ścieżki:** `id` - identyfikator oceny
- **Dane wejściowe:** Taka sama struktura jak w `GET /assessments/{id}`
- **Dane wyjściowe:**
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

### Eksport oceny
- **Endpoint:** `GET /assessments/{id}/export`
- **Opis:** Eksport oceny RODO do formatu JSON
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry ścieżki:** `id` - identyfikator oceny
- **Dane wyjściowe:** Plik JSON z pełną strukturą oceny

## Szczegółowe raporty

### Pobieranie danych raportu
- **Endpoint:** `GET /reports`
- **Opis:** Pobieranie danych do szczegółowych raportów RODO
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry zapytania:**
  - `dateRange` - zakres dat (opcjonalnie)
  - `riskCategory` - kategoria ryzyka (opcjonalnie)
  - `riskLevel` - poziom ryzyka (opcjonalnie)
  - `sortBy` - sortowanie (opcjonalnie)
- **Dane wyjściowe:**
  ```json
  {
    "complianceAreas": [
      {
        "id": "number",
        "name": "string",
        "score": "number", // 0-100
        "risk": "string" // "low", "medium", "high"
      }
    ],
    "riskAssessment": {
      "beforeMitigation": ["number[]"], // wartości dla każdego obszaru
      "afterMitigation": ["number[]"] // wartości dla każdego obszaru
    },
    "trends": {
      "labels": ["string[]"], // etykiety dla osi X (np. miesiące)
      "data": ["number[]"] // wartości zgodności w czasie
    },
    "recommendations": [
      {
        "id": "number",
        "area": "string",
        "action": "string",
        "priority": "string", // "high", "medium", "low"
        "estimatedTime": "string",
        "estimatedCost": "string"
      }
    ],
    "upcomingDeadlines": [
      {
        "id": "number",
        "task": "string",
        "deadline": "date",
        "daysLeft": "number"
      }
    ],
    "benchmarks": {
      "industry": "number",
      "yourScore": "number",
      "topPerformer": "number"
    }
  }
  ```

### Pobieranie szczegółów obszaru
- **Endpoint:** `GET /reports/areas/{id}`
- **Opis:** Pobieranie szczegółowych informacji o obszarze zgodności
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry ścieżki:** `id` - identyfikator obszaru
- **Dane wyjściowe:**
  ```json
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "score": "number",
    "risk": "string",
    "lastUpdated": "date",
    "requirements": [
      {
        "id": "number",
        "text": "string",
        "status": "string", // "zgodny", "częściowo zgodny", "niezgodny"
        "comment": "string"
      }
    ],
    "progressHistory": [
      {
        "date": "date",
        "score": "number"
      }
    ],
    "recommendations": [
      {
        "id": "number",
        "text": "string",
        "priority": "string", // "wysoki", "średni", "niski"
        "status": "string" // "nowy", "w trakcie", "zakończony"
      }
    ]
  }
  ```

### Eksport raportu
- **Endpoint:** `GET /reports/export`
- **Opis:** Eksport raportu do wybranego formatu
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry zapytania:**
  - `format` - format eksportu (pdf, xlsx)
- **Dane wyjściowe:** Plik w wybranym formacie

## Wyniki ocen

### Pobieranie wyników oceny
- **Endpoint:** `GET /results/{id}`
- **Opis:** Pobieranie wyników oceny RODO
- **Nagłówki:** `Authorization: Bearer {token}`
- **Parametry ścieżki:** `id` - identyfikator oceny
- **Dane wyjściowe:**
  ```json
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date",
    "chapters": [
      {
        "id": "number",
        "name": "string",
        "description": "string",
        "areas": [
          {
            "id": "number",
            "name": "string",
            "description": "string",
            "score": "string",
            "comment": "string",
            "requirements": [
              {
                "id": "number",
                "text": "string",
                "value": "string",
                "comment": "string"
              }
            ]
          }
        ]
      }
    ],
    "summary": {
      "positiveAreas": "number",
      "warningAreas": "number",
      "negativeAreas": "number",
      "inProgressAreas": "number",
      "notApplicableAreas": "number",
      "totalAreas": "number",
      "positiveRequirements": "number",
      "negativeRequirements": "number",
      "inProgressRequirements": "number",
      "notApplicableRequirements": "number",
      "totalRequirements": "number"
    }
  }
  ```

## Ustawienia użytkownika

### Pobieranie danych użytkownika
- **Endpoint:** `GET /users/profile`
- **Opis:** Pobieranie danych profilu użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  {
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "position": "string",
    "notifications": "boolean"
  }
  ```

### Aktualizacja danych użytkownika
- **Endpoint:** `PUT /users/profile`
- **Opis:** Aktualizacja danych profilu użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wejściowe:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "position": "string",
    "notifications": "boolean"
  }
  ```
- **Dane wyjściowe:**
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

### Zmiana hasła
- **Endpoint:** `PUT /users/password`
- **Opis:** Zmiana hasła użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wejściowe:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Dane wyjściowe:**
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

### Pobieranie danych firmy
- **Endpoint:** `GET /users/company`
- **Opis:** Pobieranie danych firmy użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  {
    "name": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "nip": "string",
    "regon": "string",
    "industry": "string"
  }
  ```

### Aktualizacja danych firmy
- **Endpoint:** `PUT /users/company`
- **Opis:** Aktualizacja danych firmy użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wejściowe:**
  ```json
  {
    "name": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "nip": "string",
    "regon": "string",
    "industry": "string"
  }
  ```
- **Dane wyjściowe:**
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

## Subskrypcje

### Pobieranie danych subskrypcji
- **Endpoint:** `GET /subscriptions`
- **Opis:** Pobieranie danych subskrypcji użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  {
    "plan": "string", // "basic", "premium"
    "status": "string", // "active", "canceled"
    "nextBillingDate": "date",
    "paymentMethod": "string" // "card", "transfer"
  }
  ```

### Zmiana planu subskrypcji
- **Endpoint:** `PUT /subscriptions/plan`
- **Opis:** Zmiana planu subskrypcji użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wejściowe:**
  ```json
  {
    "plan": "string" // "basic", "premium"
  }
  ```
- **Dane wyjściowe:**
  ```json
  {
    "success": "boolean",
    "message": "string",
    "plan": "string",
    "nextBillingDate": "date"
  }
  ```

### Anulowanie subskrypcji
- **Endpoint:** `PUT /subscriptions/cancel`
- **Opis:** Anulowanie subskrypcji użytkownika
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  {
    "success": "boolean",
    "message": "string",
    "validUntil": "date"
  }
  ```

### Pobieranie dostępnych planów
- **Endpoint:** `GET /subscriptions/plans`
- **Opis:** Pobieranie listy dostępnych planów subskrypcji
- **Nagłówki:** `Authorization: Bearer {token}`
- **Dane wyjściowe:**
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "currency": "string",
      "period": "string", // "month", "year"
      "features": ["string[]"]
    }
  ]
  ```
