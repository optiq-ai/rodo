# Changelog

## [1.2.0] - 2025-04-17

### Dodano
- Przeprojektowano formularz oceny RODO z przyciskami radio zamiast list wyboru
- Dodano animacje i efekty przejścia dla elementów formularza
- Zaimplementowano kolorowe wskaźniki statusu i postępu
- Dodano nawigację między sekcjami formularza (przyciski Następna/Poprzednia sekcja)
- Dodano funkcję eksportu oceny do pliku JSON
- Dodano wizualne potwierdzenie zapisania zmian
- Stworzono plik assessment-animations.css z kompleksowymi animacjami dla formularza

## [1.1.0] - 2025-04-17

### Dodano
- Animowane komponenty UI z efektami przejścia i wskaźnikami procentowymi
- Plik `animations.css` z kompleksowymi animacjami i efektami wizualnymi
- Komponent `AnimatedAssessmentForm` do formularza oceny RODO
- Komponent `CompactDashboard` dla bardziej kompaktowego layoutu
- Reużywalne komponenty animowane w `AnimatedElements.jsx`:
  - `AnimatedPercentageIndicator` - kołowy wskaźnik procentowy
  - `AnimatedProgressBar` - pasek postępu z animacją
  - `AnimatedSelect` - select z kolorowym oznaczeniem wybranej opcji
  - `AnimatedButton` - przycisk z efektami animacji

### Zmieniono
- Usunięto stronę główną (Home) - aplikacja rozpoczyna się od ekranu logowania/rejestracji
- Przeprojektowano dashboard, aby zajmował mniej miejsca
- Zaktualizowano routing aplikacji
- Dodano kolorowe wskaźniki statusu i postępu
- Ulepszono wygląd formularza oceny RODO
- Dodano efekty przejścia między elementami interfejsu

### Naprawiono
- Problem z uprawnieniami w kontenerze frontendu
- Problem z konfiguracją bazy danych w backendu
- Problem z przekierowaniem na nieistniejącą stronę główną

## [1.0.0] - 2025-04-16

### Dodano
- Szkielet aplikacji Panel Oceny RODO
- Podstawowy interfejs użytkownika
- Funkcjonalność logowania i rejestracji
- Formularz oceny zgodności z RODO
- Dashboard z podsumowaniem ocen
- Konfiguracja Docker Compose
- Integracja Spring Boot z PostgreSQL
