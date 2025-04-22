#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

# Wyświetlenie zmiennych środowiskowych (bez hasła) do debugowania
echo "Trying to connect to PostgreSQL at $host with user $POSTGRES_USER and database $POSTGRES_DB"

# Dodanie domyślnych wartości, jeśli zmienne środowiskowe nie są ustawione
if [ -z "$POSTGRES_USER" ]; then
  POSTGRES_USER="postgres"
  echo "POSTGRES_USER not set, using default: $POSTGRES_USER"
fi

if [ -z "$POSTGRES_DB" ]; then
  POSTGRES_DB="gdpr_assessment"
  echo "POSTGRES_DB not set, using default: $POSTGRES_DB"
fi

if [ -z "$POSTGRES_PASSWORD" ]; then
  POSTGRES_PASSWORD="postgres"
  echo "POSTGRES_PASSWORD not set, using default: [hidden]"
fi

# Próba połączenia z bazą danych z jawnym przekazaniem hasła
until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$host" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
