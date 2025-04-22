# Frontend - Panel do oceny zgodności z RODO

Ten katalog zawiera kod źródłowy frontendu aplikacji do oceny zgodności z RODO, zbudowany przy użyciu React i Material-UI.

## Struktura katalogów

- `src/` - Kod źródłowy aplikacji
  - `assets/` - Zasoby statyczne (obrazy, ikony, itp.)
  - `components/` - Komponenty wielokrotnego użytku
    - `common/` - Wspólne komponenty (przyciski, formularze, itp.)
    - `layout/` - Komponenty układu (nagłówek, stopka, itp.)
  - `contexts/` - Konteksty React (autoryzacja, itp.)
  - `hooks/` - Niestandardowe hooki React
  - `pages/` - Komponenty stron
  - `services/` - Usługi do komunikacji z API
  - `utils/` - Funkcje pomocnicze

## Technologie

- React 18
- React Router 6
- Material-UI 5
- Axios
- React Hook Form
- Recharts (do wizualizacji danych)

## Funkcjonalności

- System logowania i rejestracji użytkowników
- Panel do przeprowadzania oceny RODO
- Wizualizacja wyników oceny
- Zarządzanie profilami użytkowników
- Responsywny interfejs użytkownika

## Uruchomienie w trybie deweloperskim

```bash
cd frontend
npm install
npm start
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## Budowanie do produkcji

```bash
cd frontend
npm install
npm run build
```

Zbudowane pliki będą dostępne w katalogu `build/`.

## Testy

```bash
cd frontend
npm test
```

## Zmienne środowiskowe

Aplikacja korzysta z następujących zmiennych środowiskowych:

- `REACT_APP_API_URL` - URL do API backendu
- `REACT_APP_NAME` - Nazwa aplikacji
- `NODE_ENV` - Środowisko uruchomieniowe (development, production, test)
