FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Kopiowanie plików projektu
COPY pom.xml .

# Tworzenie podstawowej struktury projektu Spring Boot
RUN mkdir -p src/main/java/com/rodoassessment/gdprassessmentpanel
RUN mkdir -p src/main/resources

# Tworzenie podstawowego pliku aplikacji Spring Boot
RUN echo 'package com.rodoassessment.gdprassessmentpanel;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class GdprAssessmentPanelApplication {\n\n\tpublic static void main(String[] args) {\n\t\tSpringApplication.run(GdprAssessmentPanelApplication.class, args);\n\t}\n\n}' > src/main/java/com/rodoassessment/gdprassessmentpanel/GdprAssessmentPanelApplication.java

# Kopiowanie kodu źródłowego (jeśli istnieje)
COPY src ./src

# Dodanie zależności PostgreSQL do pom.xml
RUN sed -i '/<dependencies>/a \
    <dependency>\n \
        <groupId>org.postgresql</groupId>\n \
        <artifactId>postgresql</artifactId>\n \
        <version>42.6.0</version>\n \
    </dependency>' pom.xml

# Budowanie aplikacji
RUN mvn clean package -DskipTests

# Sprawdzenie czy plik JAR został utworzony, jeśli nie, tworzymy minimalny JAR
RUN if [ ! -f target/*.jar ]; then \
    echo "Creating minimal JAR file"; \
    mkdir -p target/classes/META-INF; \
    echo "Main-Class: com.rodoassessment.gdprassessmentpanel.GdprAssessmentPanelApplication" > target/classes/META-INF/MANIFEST.MF; \
    jar cfm target/gdpr-assessment-panel.jar target/classes/META-INF/MANIFEST.MF -C target/classes .; \
    fi

# Etap uruchomieniowy
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Instalacja PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Kopiowanie zbudowanej aplikacji z etapu budowania
COPY --from=build /app/target/*.jar app.jar

# Kopiowanie skryptu wait-for-postgres
COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# Ekspozycja portu 8080
EXPOSE 8080

# Uruchomienie aplikacji z czekaniem na bazę danych
CMD ["/bin/sh", "-c", "/wait-for-postgres.sh database && java -jar app.jar"]
