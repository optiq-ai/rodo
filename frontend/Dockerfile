FROM node:16-alpine

# Instalacja dodatkowych pakietów
RUN apk add --no-cache git

# Utworzenie katalogu aplikacji
WORKDIR /app

# Kopiowanie plików konfiguracyjnych
COPY package*.json ./
COPY disable-codegen.js ./
COPY fix-ajv.js ./

# Nadanie uprawnień wykonywania dla skryptów
RUN chmod +x /app/disable-codegen.js
RUN chmod +x /app/fix-ajv.js

# Tworzenie mocka dla ajv/dist/compile/codegen
RUN mkdir -p /tmp/mock-modules/ajv/dist/compile
RUN echo 'module.exports = { _ : { getCode: () => "return {}" } };' > /tmp/mock-modules/ajv/dist/compile/codegen.js

# Tworzenie mocka dla ajv/lib/compile/codegen
RUN mkdir -p /tmp/mock-modules/ajv/lib/compile
RUN cp /tmp/mock-modules/ajv/dist/compile/codegen.js /tmp/mock-modules/ajv/lib/compile/codegen.js

# Instalacja zależności z użyciem NODE_PATH
ENV NODE_PATH=/tmp/mock-modules
RUN npm install --legacy-peer-deps

# Kopiowanie kodu źródłowego
COPY . .

# Uruchomienie skryptu modyfikującego webpack
RUN node /app/disable-codegen.js
RUN node /app/fix-ajv.js

# Ustawienie zmiennych środowiskowych
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV ESLINT_NO_DEV_ERRORS=true
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
ENV SKIP_PREFLIGHT_CHECK=true
ENV WDS_SOCKET_PORT=0
ENV GENERATE_SOURCEMAP=false
ENV FAST_REFRESH=false

# Ekspozycja portu 3000
EXPOSE 3000

# Uruchomienie aplikacji z dodatkowym skryptem wyłączającym codegen
CMD ["sh", "-c", "node /app/disable-codegen.js && node /app/fix-ajv.js && DISABLE_MINIMIZE=true npm start"]
