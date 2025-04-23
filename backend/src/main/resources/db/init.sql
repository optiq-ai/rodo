-- Inicjalizacja bazy danych dla aplikacji RODO

-- Usunięcie tabel jeśli istnieją (w odwrotnej kolejności niż tworzenie, ze względu na klucze obce)
DROP TABLE IF EXISTS recommendation CASCADE;
DROP TABLE IF EXISTS compliance_area CASCADE;
DROP TABLE IF EXISTS report CASCADE;
DROP TABLE IF EXISTS requirement CASCADE;
DROP TABLE IF EXISTS area CASCADE;
DROP TABLE IF EXISTS chapter CASCADE;
DROP TABLE IF EXISTS assessment CASCADE;
DROP TABLE IF EXISTS subscription CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS employee CASCADE;

-- Tworzenie tabeli employee (użytkownicy)
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tworzenie tabeli company (firmy)
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    nip VARCHAR(20),
    regon VARCHAR(20),
    industry VARCHAR(100),
    employee_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Tworzenie tabeli user_profile (profile użytkowników)
CREATE TABLE user_profile (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20),
    position VARCHAR(100),
    notification_email BOOLEAN NOT NULL DEFAULT TRUE,
    notification_app BOOLEAN NOT NULL DEFAULT TRUE,
    employee_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Tworzenie tabeli subscription (subskrypcje)
CREATE TABLE subscription (
    id SERIAL PRIMARY KEY,
    plan VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    next_billing_date DATE,
    payment_method VARCHAR(20),
    employee_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Tworzenie tabeli assessment (oceny RODO)
CREATE TABLE assessment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    employee_id INTEGER NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Tworzenie tabeli chapter (rozdziały oceny)
CREATE TABLE chapter (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    assessment_id INTEGER NOT NULL,
    FOREIGN KEY (assessment_id) REFERENCES assessment(id) ON DELETE CASCADE
);

-- Tworzenie tabeli area (obszary oceny)
CREATE TABLE area (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    score VARCHAR(20),
    comment TEXT,
    chapter_id INTEGER NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapter(id) ON DELETE CASCADE
);

-- Tworzenie tabeli requirement (wymagania)
CREATE TABLE requirement (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    value VARCHAR(20),
    comment TEXT,
    area_id INTEGER NOT NULL,
    FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE
);

-- Tworzenie tabeli report (raporty)
CREATE TABLE report (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    report_type VARCHAR(20) NOT NULL,
    employee_id INTEGER NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Tworzenie tabeli compliance_area (obszary zgodności w raportach)
CREATE TABLE compliance_area (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL,
    risk VARCHAR(20),
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    report_id INTEGER NOT NULL,
    FOREIGN KEY (report_id) REFERENCES report(id) ON DELETE CASCADE
);

-- Tworzenie tabeli recommendation (rekomendacje)
CREATE TABLE recommendation (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20),
    due_date DATE,
    report_id INTEGER NOT NULL,
    FOREIGN KEY (report_id) REFERENCES report(id) ON DELETE CASCADE
);

-- Dodanie indeksów dla poprawy wydajności
CREATE INDEX idx_employee_username ON employee(user_name);
CREATE INDEX idx_employee_email ON employee(email);
CREATE INDEX idx_assessment_employee ON assessment(employee_id);
CREATE INDEX idx_chapter_assessment ON chapter(assessment_id);
CREATE INDEX idx_area_chapter ON area(chapter_id);
CREATE INDEX idx_requirement_area ON requirement(area_id);
CREATE INDEX idx_report_employee ON report(employee_id);
CREATE INDEX idx_compliance_area_report ON compliance_area(report_id);
CREATE INDEX idx_recommendation_report ON recommendation(report_id);

-- Dodanie domyślnego użytkownika administratora
INSERT INTO employee (user_name, password, email, first_name, last_name, role)
VALUES ('admin', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'admin@example.com', 'Admin', 'RODO', 'ADMIN');
-- Hasło: Admin123!

-- Dodanie domyślnego użytkownika testowego
INSERT INTO employee (user_name, password, email, first_name, last_name, role)
VALUES ('user', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'user@example.com', 'Test', 'User', 'USER');
-- Hasło: Admin123!

-- Dodanie profilu dla użytkownika testowego
INSERT INTO user_profile (phone, position, notification_email, notification_app, employee_id)
VALUES ('123456789', 'Tester', TRUE, TRUE, 2);

-- Dodanie firmy dla użytkownika testowego
INSERT INTO company (name, address, city, postal_code, nip, regon, industry, employee_id)
VALUES ('Test Company', 'Test Street 123', 'Test City', '12-345', '1234567890', '123456789', 'IT', 2);

-- Dodanie subskrypcji dla użytkownika testowego
INSERT INTO subscription (plan, status, next_billing_date, payment_method, employee_id)
VALUES ('basic', 'active', CURRENT_DATE + INTERVAL '30 days', 'card', 2);

-- Dodanie przykładowej oceny RODO
INSERT INTO assessment (name, description, status, employee_id)
VALUES ('Ocena zgodności z RODO', 'Pierwsza ocena zgodności z RODO', 'W TRAKCIE', 2);

-- Dodanie przykładowych rozdziałów
INSERT INTO chapter (name, description, assessment_id)
VALUES ('Podstawowe zasady ochrony danych', 'Ocena zgodności z podstawowymi zasadami ochrony danych osobowych', 1);

INSERT INTO chapter (name, description, assessment_id)
VALUES ('Prawa osób, których dane dotyczą', 'Ocena realizacji praw osób, których dane dotyczą', 1);

-- Dodanie przykładowych obszarów
INSERT INTO area (name, description, score, comment, chapter_id)
VALUES ('Zgodność z zasadami przetwarzania danych', 'Ocena zgodności z podstawowymi zasadami przetwarzania danych osobowych', 'POZYTYWNA', 'Wszystkie zasady są przestrzegane', 1);

INSERT INTO area (name, description, score, comment, chapter_id)
VALUES ('Minimalizacja danych', 'Ocena zgodności z zasadą minimalizacji danych', 'ZASTRZEŻENIA', 'Niektóre dane są przechowywane zbyt długo', 1);

INSERT INTO area (name, description, score, comment, chapter_id)
VALUES ('Prawo dostępu do danych', 'Ocena realizacji prawa dostępu do danych', 'NEGATYWNA', 'Brak procedury realizacji prawa dostępu', 2);

-- Dodanie przykładowych wymagań
INSERT INTO requirement (text, value, comment, area_id)
VALUES ('Czy dane osobowe są przetwarzane zgodnie z zasadą legalności?', 'ZGODNY', 'Wszystkie dane są przetwarzane na podstawie zgody lub innej podstawy prawnej', 1);

INSERT INTO requirement (text, value, comment, area_id)
VALUES ('Czy dane osobowe są przetwarzane zgodnie z zasadą rzetelności?', 'ZGODNY', 'Procesy przetwarzania są transparentne', 1);

INSERT INTO requirement (text, value, comment, area_id)
VALUES ('Czy przetwarzane są tylko dane niezbędne do realizacji celu?', 'CZĘŚCIOWO ZGODNY', 'Niektóre dane nie są niezbędne', 2);

INSERT INTO requirement (text, value, comment, area_id)
VALUES ('Czy dane są usuwane po osiągnięciu celu przetwarzania?', 'NIEZGODNY', 'Brak procedury usuwania danych', 2);

INSERT INTO requirement (text, value, comment, area_id)
VALUES ('Czy organizacja posiada procedurę realizacji prawa dostępu do danych?', 'NIEZGODNY', 'Brak procedury', 3);

-- Dodanie przykładowego raportu
INSERT INTO report (name, description, report_type, employee_id)
VALUES ('Raport zgodności z RODO', 'Raport z oceny zgodności z RODO', 'compliance', 2);

-- Dodanie przykładowych obszarów zgodności
INSERT INTO compliance_area (name, score, risk, report_id)
VALUES ('Zasady przetwarzania danych', 85, 'low', 1);

INSERT INTO compliance_area (name, score, risk, report_id)
VALUES ('Minimalizacja danych', 60, 'medium', 1);

INSERT INTO compliance_area (name, score, risk, report_id)
VALUES ('Prawa osób', 40, 'high', 1);

-- Dodanie przykładowych rekomendacji
INSERT INTO recommendation (text, priority, status, due_date, report_id)
VALUES ('Opracować procedurę realizacji prawa dostępu do danych', 'high', 'open', CURRENT_DATE + INTERVAL '14 days', 1);

INSERT INTO recommendation (text, priority, status, due_date, report_id)
VALUES ('Wdrożyć mechanizm automatycznego usuwania danych po osiągnięciu celu przetwarzania', 'medium', 'open', CURRENT_DATE + INTERVAL '30 days', 1);

INSERT INTO recommendation (text, priority, status, due_date, report_id)
VALUES ('Przeszkolić pracowników w zakresie zasad przetwarzania danych osobowych', 'low', 'in_progress', CURRENT_DATE + INTERVAL '60 days', 1);

-- Dodanie przykładowej oceny RODO (zakończonej)
INSERT INTO assessment (name, description, status, employee_id)
VALUES ('Ocena zgodności z RODO - dział HR', 'Ocena zgodności z RODO dla działu HR', 'ZAKOŃCZONA', 2);

-- Dodanie przykładowych rozdziałów
INSERT INTO chapter (name, description, assessment_id)
VALUES ('Podstawy prawne przetwarzania', 'Ocena podstaw prawnych przetwarzania danych pracowników', 2);

-- Dodanie przykładowych obszarów
INSERT INTO area (name, description, score, comment, chapter_id)
VALUES ('Zgody pracowników', 'Ocena zgód pracowników na przetwarzanie danych', 'POZYTYWNA', 'Wszystkie zgody są prawidłowo zbierane i przechowywane', 3);

-- Dodanie przykładowych wymagań
INSERT INTO requirement (text, value, comment, area_id)
VALUES ('Czy zgody pracowników są dobrowolne?', 'ZGODNY', 'Zgody są dobrowolne i można je wycofać', 4);

-- Dodanie przykładowego raportu (inny typ)
INSERT INTO report (name, description, report_type, employee_id)
VALUES ('Analiza ryzyka RODO', 'Analiza ryzyka związanego z przetwarzaniem danych osobowych', 'risk', 2);

-- Dodanie przykładowych obszarów zgodności
INSERT INTO compliance_area (name, score, risk, report_id)
VALUES ('Bezpieczeństwo danych', 70, 'medium', 2);

-- Dodanie przykładowych rekomendacji
INSERT INTO recommendation (text, priority, status, due_date, report_id)
VALUES ('Wdrożyć szyfrowanie danych w spoczynku', 'high', 'open', CURRENT_DATE + INTERVAL '21 days', 2);
