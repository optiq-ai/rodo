# Baza danych - Panel do oceny zgodności z RODO

Ten katalog zawiera skrypty inicjalizacyjne dla bazy danych PostgreSQL używanej w aplikacji do oceny zgodności z RODO.

## Struktura bazy danych

### Tabele główne

- `users` - Użytkownicy systemu
- `roles` - Role użytkowników
- `user_roles` - Powiązania użytkowników z rolami
- `assessments` - Oceny zgodności z RODO
- `chapters` - Rozdziały formularza oceny
- `areas` - Obszary w ramach rozdziałów
- `requirements` - Wymagania w ramach obszarów
- `responses` - Odpowiedzi na wymagania
- `area_scores` - Wyniki oceny dla poszczególnych obszarów

### Relacje

- Użytkownik może mieć wiele ról
- Użytkownik może przeprowadzić wiele ocen
- Ocena składa się z wielu odpowiedzi
- Rozdział zawiera wiele obszarów
- Obszar zawiera wiele wymagań
- Odpowiedź jest powiązana z konkretnym wymaganiem i oceną
- Wynik obszaru jest powiązany z konkretnym obszarem i oceną

## Skrypty

- `init.sql` - Skrypt inicjalizacyjny tworzący schemat bazy danych i wypełniający ją początkowymi danymi

## Dane początkowe

Skrypt inicjalizacyjny tworzy:
- Domyślne role (ROLE_USER, ROLE_ADMIN)
- Domyślnego użytkownika administratora (login: admin, hasło: admin123)
- Strukturę formularza oceny RODO (rozdziały, obszary, wymagania)
- Przykładową ocenę z odpowiedziami

## Uruchomienie bazy danych

Baza danych jest uruchamiana automatycznie przez Docker Compose. Możesz również uruchomić ją ręcznie:

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_DB=gdpr_assessment \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v ./database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  postgres:14-alpine
```

## Dostęp do bazy danych

- Host: localhost
- Port: 5432
- Baza danych: gdpr_assessment
- Użytkownik: postgres
- Hasło: postgres

## Narzędzia do zarządzania bazą danych

Zalecane narzędzia do zarządzania bazą danych:
- pgAdmin 4
- DBeaver
- DataGrip

## Kopie zapasowe i przywracanie

### Tworzenie kopii zapasowej

```bash
docker exec -t postgres pg_dump -U postgres gdpr_assessment > backup.sql
```

### Przywracanie z kopii zapasowej

```bash
cat backup.sql | docker exec -i postgres psql -U postgres -d gdpr_assessment
```
