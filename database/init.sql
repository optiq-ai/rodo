-- Initialize database schema for GDPR Assessment Panel

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    organization VARCHAR(200),
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles junction table
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create assessments table
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create chapters table
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    order_number INT NOT NULL
);

-- Create areas table
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    chapter_id INT NOT NULL,
    order_number INT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- Create requirements table
CREATE TABLE requirements (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    area_id INT NOT NULL,
    order_number INT NOT NULL,
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
);

-- Create responses table
CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    assessment_id INT NOT NULL,
    requirement_id INT NOT NULL,
    value VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (requirement_id) REFERENCES requirements(id) ON DELETE CASCADE,
    UNIQUE (assessment_id, requirement_id)
);

-- Create area_scores table
CREATE TABLE area_scores (
    id SERIAL PRIMARY KEY,
    assessment_id INT NOT NULL,
    area_id INT NOT NULL,
    score VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE,
    UNIQUE (assessment_id, area_id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Insert chapters based on RODO assessment form
INSERT INTO chapters (name, description, order_number) VALUES 
('Zasady ogólne', 'Ocena zgodności z ogólnymi zasadami RODO', 1),
('Podstawy przetwarzania', 'Ocena zgodności z podstawami prawnymi przetwarzania danych', 2),
('Prawa osób', 'Ocena zgodności z prawami osób, których dane dotyczą', 3),
('Obowiązki administratora', 'Ocena zgodności z obowiązkami administratora danych', 4),
('Bezpieczeństwo danych', 'Ocena zgodności z wymogami bezpieczeństwa danych', 5),
('Przekazywanie danych', 'Ocena zgodności z zasadami przekazywania danych', 6);

-- Insert areas for chapter 1: Zasady ogólne
INSERT INTO areas (name, description, chapter_id, order_number) VALUES 
('Zgodność z prawem', 'Ocena zgodności z zasadą legalności przetwarzania', 1, 1),
('Rzetelność i przejrzystość', 'Ocena zgodności z zasadą rzetelności i przejrzystości', 1, 2),
('Minimalizacja danych', 'Ocena zgodności z zasadą minimalizacji danych', 1, 3),
('Prawidłowość danych', 'Ocena zgodności z zasadą prawidłowości danych', 1, 4),
('Ograniczenie przechowywania', 'Ocena zgodności z zasadą ograniczenia przechowywania', 1, 5),
('Integralność i poufność', 'Ocena zgodności z zasadą integralności i poufności', 1, 6);

-- Insert areas for chapter 2: Podstawy przetwarzania
INSERT INTO areas (name, description, chapter_id, order_number) VALUES 
('Zgoda', 'Ocena zgodności z wymogami dotyczącymi zgody', 2, 1),
('Umowa', 'Ocena zgodności z podstawą prawną umowy', 2, 2),
('Obowiązek prawny', 'Ocena zgodności z podstawą prawną obowiązku prawnego', 2, 3),
('Żywotne interesy', 'Ocena zgodności z podstawą prawną żywotnych interesów', 2, 4),
('Zadanie publiczne', 'Ocena zgodności z podstawą prawną zadania publicznego', 2, 5),
('Prawnie uzasadniony interes', 'Ocena zgodności z podstawą prawną prawnie uzasadnionego interesu', 2, 6);

-- Insert areas for chapter 3: Prawa osób
INSERT INTO areas (name, description, chapter_id, order_number) VALUES 
('Prawo do informacji', 'Ocena zgodności z prawem do informacji', 3, 1),
('Prawo dostępu', 'Ocena zgodności z prawem dostępu do danych', 3, 2),
('Prawo do sprostowania', 'Ocena zgodności z prawem do sprostowania danych', 3, 3),
('Prawo do usunięcia', 'Ocena zgodności z prawem do usunięcia danych', 3, 4),
('Prawo do ograniczenia', 'Ocena zgodności z prawem do ograniczenia przetwarzania', 3, 5),
('Prawo do przenoszenia', 'Ocena zgodności z prawem do przenoszenia danych', 3, 6),
('Prawo do sprzeciwu', 'Ocena zgodności z prawem do sprzeciwu', 3, 7);

-- Insert areas for chapter 4: Obowiązki administratora
INSERT INTO areas (name, description, chapter_id, order_number) VALUES 
('Rejestr czynności', 'Ocena zgodności z obowiązkiem prowadzenia rejestru czynności przetwarzania', 4, 1),
('Privacy by design', 'Ocena zgodności z zasadą privacy by design', 4, 2),
('Privacy by default', 'Ocena zgodności z zasadą privacy by default', 4, 3),
('Ocena skutków', 'Ocena zgodności z obowiązkiem przeprowadzania oceny skutków dla ochrony danych', 4, 4),
('Inspektor ochrony danych', 'Ocena zgodności z wymogami dotyczącymi inspektora ochrony danych', 4, 5),
('Zgłaszanie naruszeń', 'Ocena zgodności z obowiązkiem zgłaszania naruszeń', 4, 6);

-- Insert areas for chapter 5: Bezpieczeństwo danych
INSERT INTO areas (name, description, chapter_id, order_number) VALUES 
('Środki techniczne', 'Ocena zgodności z wymogami dotyczącymi środków technicznych', 5, 1),
('Środki organizacyjne', 'Ocena zgodności z wymogami dotyczącymi środków organizacyjnych', 5, 2),
('Pseudonimizacja i szyfrowanie', 'Ocena zgodności z wymogami dotyczącymi pseudonimizacji i szyfrowania', 5, 3),
('Testowanie zabezpieczeń', 'Ocena zgodności z wymogami dotyczącymi testowania zabezpieczeń', 5, 4),
('Zarządzanie incydentami', 'Ocena zgodności z wymogami dotyczącymi zarządzania incydentami', 5, 5);

-- Insert areas for chapter 6: Przekazywanie danych
INSERT INTO areas (name, description, chapter_id, order_number) VALUES 
('Przekazywanie w UE/EOG', 'Ocena zgodności z zasadami przekazywania danych w UE/EOG', 6, 1),
('Przekazywanie poza UE/EOG', 'Ocena zgodności z zasadami przekazywania danych poza UE/EOG', 6, 2),
('Standardowe klauzule umowne', 'Ocena zgodności z wymogami dotyczącymi standardowych klauzul umownych', 6, 3),
('Wiążące reguły korporacyjne', 'Ocena zgodności z wymogami dotyczącymi wiążących reguł korporacyjnych', 6, 4);

-- Insert requirements for area 1.1: Zgodność z prawem
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przetwarzanie danych osobowych odbywa się na podstawie co najmniej jednej z podstaw prawnych określonych w art. 6 RODO?', 1, 1),
('Czy w przypadku przetwarzania szczególnych kategorii danych osobowych, spełnione są warunki określone w art. 9 RODO?', 1, 2),
('Czy w przypadku przetwarzania danych dotyczących wyroków skazujących i czynów zabronionych, spełnione są warunki określone w art. 10 RODO?', 1, 3);

-- Insert requirements for area 1.2: Rzetelność i przejrzystość
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy osoby, których dane dotyczą, są informowane o przetwarzaniu ich danych w sposób przejrzysty, zrozumiały i łatwo dostępny?', 2, 1),
('Czy informacje przekazywane osobom, których dane dotyczą, są sformułowane jasnym i prostym językiem?', 2, 2),
('Czy administrator danych jest transparentny odnośnie do celów i zakresu przetwarzania danych?', 2, 3);

-- Insert requirements for area 1.3: Minimalizacja danych
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przetwarzane są tylko te dane, które są niezbędne do osiągnięcia określonych celów?', 3, 1),
('Czy zakres zbieranych danych jest adekwatny do celów przetwarzania?', 3, 2),
('Czy istnieją procedury regularnego przeglądu zakresu zbieranych danych pod kątem ich niezbędności?', 3, 3);

-- Insert requirements for area 1.4: Prawidłowość danych
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury zapewniające prawidłowość przetwarzanych danych?', 4, 1),
('Czy dane są regularnie aktualizowane?', 4, 2),
('Czy istnieją procedury usuwania lub korygowania nieprawidłowych danych?', 4, 3);

-- Insert requirements for area 1.5: Ograniczenie przechowywania
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy określono okresy przechowywania danych dla różnych kategorii danych?', 5, 1),
('Czy istnieją procedury regularnego przeglądu przechowywanych danych pod kątem ich dalszej przydatności?', 5, 2),
('Czy istnieją procedury usuwania lub anonimizacji danych po upływie okresu ich przechowywania?', 5, 3);

-- Insert requirements for area 1.6: Integralność i poufność
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy wdrożono odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych?', 6, 1),
('Czy istnieją procedury regularnego testowania, mierzenia i oceniania skuteczności środków bezpieczeństwa?', 6, 2),
('Czy pracownicy są regularnie szkoleni w zakresie bezpieczeństwa danych?', 6, 3);

-- Insert requirements for area 2.1: Zgoda
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy zgoda jest wyrażana w sposób dobrowolny, konkretny, świadomy i jednoznaczny?', 7, 1),
('Czy zgoda jest dokumentowana i przechowywana w sposób umożliwiający jej weryfikację?', 7, 2),
('Czy istnieją procedury umożliwiające wycofanie zgody w dowolnym momencie?', 7, 3),
('Czy w przypadku przetwarzania danych dzieci, zgoda jest uzyskiwana od rodziców lub opiekunów prawnych?', 7, 4);

-- Insert requirements for area 2.2: Umowa
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przetwarzanie danych na podstawie umowy jest ograniczone do danych niezbędnych do wykonania umowy?', 8, 1),
('Czy w przypadku przetwarzania danych przed zawarciem umowy, przetwarzanie jest ograniczone do działań niezbędnych do zawarcia umowy?', 8, 2);

-- Insert requirements for area 2.3: Obowiązek prawny
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przetwarzanie danych na podstawie obowiązku prawnego jest ograniczone do zakresu wymaganego przez przepisy prawa?', 9, 1),
('Czy istnieje dokumentacja identyfikująca konkretne przepisy prawa stanowiące podstawę przetwarzania?', 9, 2);

-- Insert requirements for area 2.4: Żywotne interesy
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przetwarzanie danych na podstawie żywotnych interesów jest stosowane tylko w wyjątkowych sytuacjach?', 10, 1),
('Czy istnieje dokumentacja uzasadniająca przetwarzanie danych na podstawie żywotnych interesów?', 10, 2);

-- Insert requirements for area 2.5: Zadanie publiczne
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przetwarzanie danych na podstawie zadania publicznego jest ograniczone do zakresu niezbędnego do wykonania tego zadania?', 11, 1),
('Czy istnieje dokumentacja identyfikująca konkretne zadania publiczne stanowiące podstawę przetwarzania?', 11, 2);

-- Insert requirements for area 2.6: Prawnie uzasadniony interes
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przeprowadzono test równowagi interesów przed rozpoczęciem przetwarzania danych na podstawie prawnie uzasadnionego interesu?', 12, 1),
('Czy istnieje dokumentacja uzasadniająca przetwarzanie danych na podstawie prawnie uzasadnionego interesu?', 12, 2),
('Czy osoby, których dane dotyczą, są informowane o przetwarzaniu ich danych na podstawie prawnie uzasadnionego interesu?', 12, 3);

-- Insert requirements for area 3.1: Prawo do informacji
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy osoby, których dane dotyczą, są informowane o tożsamości i danych kontaktowych administratora?', 13, 1),
('Czy osoby, których dane dotyczą, są informowane o celach przetwarzania i podstawie prawnej przetwarzania?', 13, 2),
('Czy osoby, których dane dotyczą, są informowane o odbiorcach danych?', 13, 3),
('Czy osoby, których dane dotyczą, są informowane o okresie przechowywania danych?', 13, 4),
('Czy osoby, których dane dotyczą, są informowane o przysługujących im prawach?', 13, 5);

-- Insert requirements for area 3.2: Prawo dostępu
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, uzyskanie dostępu do ich danych?', 14, 1),
('Czy osoby, których dane dotyczą, mogą uzyskać kopię przetwarzanych danych?', 14, 2),
('Czy informacje o przetwarzaniu są przekazywane osobom, których dane dotyczą, w zwięzłej, przejrzystej, zrozumiałej i łatwo dostępnej formie?', 14, 3);

-- Insert requirements for area 3.3: Prawo do sprostowania
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, sprostowanie nieprawidłowych danych?', 15, 1),
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, uzupełnienie niekompletnych danych?', 15, 2),
('Czy sprostowanie danych jest dokonywane bez zbędnej zwłoki?', 15, 3);

-- Insert requirements for area 3.4: Prawo do usunięcia
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, usunięcie ich danych w określonych przypadkach?', 16, 1),
('Czy usunięcie danych jest dokonywane bez zbędnej zwłoki?', 16, 2),
('Czy w przypadku upublicznienia danych, podejmowane są rozsądne działania w celu poinformowania innych administratorów o żądaniu usunięcia danych?', 16, 3);

-- Insert requirements for area 3.5: Prawo do ograniczenia
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, ograniczenie przetwarzania ich danych w określonych przypadkach?', 17, 1),
('Czy w przypadku ograniczenia przetwarzania, dane są przetwarzane wyłącznie za zgodą osoby, której dane dotyczą, lub w celu ustalenia, dochodzenia lub obrony roszczeń?', 17, 2),
('Czy osoby, których dane dotyczą, są informowane przed zniesieniem ograniczenia przetwarzania?', 17, 3);

-- Insert requirements for area 3.6: Prawo do przenoszenia
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, otrzymanie ich danych w ustrukturyzowanym, powszechnie używanym formacie nadającym się do odczytu maszynowego?', 18, 1),
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, przesłanie ich danych innemu administratorowi?', 18, 2),
('Czy przenoszenie danych jest dokonywane bez zbędnej zwłoki?', 18, 3);

-- Insert requirements for area 3.7: Prawo do sprzeciwu
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury umożliwiające osobom, których dane dotyczą, wniesienie sprzeciwu wobec przetwarzania ich danych?', 19, 1),
('Czy w przypadku wniesienia sprzeciwu, przetwarzanie danych jest zaprzestawane, chyba że istnieją ważne prawnie uzasadnione podstawy do przetwarzania?', 19, 2),
('Czy osoby, których dane dotyczą, są informowane o prawie do sprzeciwu w sposób wyraźny i odrębny od innych informacji?', 19, 3);

-- Insert requirements for area 4.1: Rejestr czynności
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy prowadzony jest rejestr czynności przetwarzania?', 20, 1),
('Czy rejestr czynności przetwarzania zawiera wszystkie wymagane informacje?', 20, 2),
('Czy rejestr czynności przetwarzania jest regularnie aktualizowany?', 20, 3);

-- Insert requirements for area 4.2: Privacy by design
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy ochrona danych jest uwzględniana już na etapie projektowania systemów i procesów?', 21, 1),
('Czy wdrożono odpowiednie środki techniczne i organizacyjne w celu skutecznej realizacji zasad ochrony danych?', 21, 2),
('Czy wdrożono odpowiednie środki techniczne i organizacyjne w celu ochrony praw osób, których dane dotyczą?', 21, 3);

-- Insert requirements for area 4.3: Privacy by default
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy domyślnie przetwarzane są tylko te dane, które są niezbędne dla osiągnięcia określonego celu?', 22, 1),
('Czy domyślnie dane nie są udostępniane nieokreślonej liczbie osób?', 22, 2),
('Czy domyślne ustawienia systemów i aplikacji zapewniają maksymalną ochronę prywatności?', 22, 3);

-- Insert requirements for area 4.4: Ocena skutków
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przeprowadzana jest ocena skutków dla ochrony danych w przypadku przetwarzania mogącego powodować wysokie ryzyko naruszenia praw lub wolności osób fizycznych?', 23, 1),
('Czy ocena skutków dla ochrony danych zawiera wszystkie wymagane elementy?', 23, 2),
('Czy w przypadku stwierdzenia wysokiego ryzyka, konsultowane jest ono z organem nadzorczym?', 23, 3);

-- Insert requirements for area 4.5: Inspektor ochrony danych
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy wyznaczono inspektora ochrony danych, jeśli jest to wymagane?', 24, 1),
('Czy inspektor ochrony danych posiada odpowiednie kwalifikacje?', 24, 2),
('Czy inspektor ochrony danych jest właściwie zaangażowany we wszystkie sprawy dotyczące ochrony danych osobowych?', 24, 3),
('Czy inspektor ochrony danych ma zapewnioną niezależność w wykonywaniu swoich zadań?', 24, 4);

-- Insert requirements for area 4.6: Zgłaszanie naruszeń
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury zgłaszania naruszeń ochrony danych osobowych organowi nadzorczemu?', 25, 1),
('Czy naruszenia ochrony danych osobowych są zgłaszane organowi nadzorczemu bez zbędnej zwłoki, w miarę możliwości nie później niż w terminie 72 godzin?', 25, 2),
('Czy w przypadku naruszenia mogącego powodować wysokie ryzyko naruszenia praw lub wolności osób fizycznych, osoby te są o tym informowane?', 25, 3);

-- Insert requirements for area 5.1: Środki techniczne
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy wdrożono odpowiednie środki techniczne zapewniające bezpieczeństwo danych?', 26, 1),
('Czy środki techniczne są regularnie testowane, mierzone i oceniane pod kątem ich skuteczności?', 26, 2),
('Czy środki techniczne są dostosowane do ryzyka związanego z przetwarzaniem danych?', 26, 3);

-- Insert requirements for area 5.2: Środki organizacyjne
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy wdrożono odpowiednie środki organizacyjne zapewniające bezpieczeństwo danych?', 27, 1),
('Czy środki organizacyjne są regularnie testowane, mierzone i oceniane pod kątem ich skuteczności?', 27, 2),
('Czy środki organizacyjne są dostosowane do ryzyka związanego z przetwarzaniem danych?', 27, 3);

-- Insert requirements for area 5.3: Pseudonimizacja i szyfrowanie
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy stosowana jest pseudonimizacja danych osobowych, gdy jest to możliwe?', 28, 1),
('Czy stosowane jest szyfrowanie danych osobowych, gdy jest to możliwe?', 28, 2),
('Czy klucze szyfrujące są odpowiednio zabezpieczone?', 28, 3);

-- Insert requirements for area 5.4: Testowanie zabezpieczeń
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy regularnie przeprowadzane są testy zabezpieczeń?', 29, 1),
('Czy wyniki testów zabezpieczeń są analizowane i wykorzystywane do poprawy bezpieczeństwa?', 29, 2),
('Czy testy zabezpieczeń obejmują zarówno środki techniczne, jak i organizacyjne?', 29, 3);

-- Insert requirements for area 5.5: Zarządzanie incydentami
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy istnieją procedury zarządzania incydentami bezpieczeństwa?', 30, 1),
('Czy incydenty bezpieczeństwa są dokumentowane?', 30, 2),
('Czy po wystąpieniu incydentu bezpieczeństwa przeprowadzana jest analiza jego przyczyn i wdrażane są działania naprawcze?', 30, 3);

-- Insert requirements for area 6.1: Przekazywanie w UE/EOG
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przekazywanie danych w ramach UE/EOG odbywa się zgodnie z ogólnymi zasadami RODO?', 31, 1),
('Czy istnieje dokumentacja dotycząca przekazywania danych w ramach UE/EOG?', 31, 2);

-- Insert requirements for area 6.2: Przekazywanie poza UE/EOG
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy przekazywanie danych poza UE/EOG odbywa się na podstawie decyzji stwierdzającej odpowiedni stopień ochrony, odpowiednich zabezpieczeń lub wyjątków?', 32, 1),
('Czy istnieje dokumentacja dotycząca przekazywania danych poza UE/EOG?', 32, 2),
('Czy osoby, których dane dotyczą, są informowane o przekazywaniu ich danych poza UE/EOG?', 32, 3);

-- Insert requirements for area 6.3: Standardowe klauzule umowne
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy w przypadku przekazywania danych poza UE/EOG na podstawie standardowych klauzul umownych, klauzule te są w pełni wdrożone?', 33, 1),
('Czy standardowe klauzule umowne są regularnie aktualizowane zgodnie z najnowszymi wytycznymi?', 33, 2),
('Czy istnieje dokumentacja dotycząca wdrożenia standardowych klauzul umownych?', 33, 3);

-- Insert requirements for area 6.4: Wiążące reguły korporacyjne
INSERT INTO requirements (text, area_id, order_number) VALUES 
('Czy w przypadku przekazywania danych poza UE/EOG na podstawie wiążących reguł korporacyjnych, reguły te są zatwierdzone przez właściwy organ nadzorczy?', 34, 1),
('Czy wiążące reguły korporacyjne są w pełni wdrożone w organizacji?', 34, 2),
('Czy istnieje dokumentacja dotycząca wdrożenia wiążących reguł korporacyjnych?', 34, 3);

-- Insert example user
INSERT INTO users (username, email, password, first_name, last_name, organization, position) VALUES 
('admin', 'admin@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsXR.pZ3klkVOGSCCdR.SHGcq7C9v7uZTXNO', 'Admin', 'User', 'Example Organization', 'Administrator');

-- Insert user roles
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);

-- Insert example assessment
INSERT INTO assessments (name, description, status, user_id) VALUES 
('Przykładowa ocena RODO', 'Przykładowa ocena zgodności z RODO dla organizacji XYZ', 'DRAFT', 1);

-- Insert example responses
INSERT INTO responses (assessment_id, requirement_id, value, comment) VALUES 
(1, 1, 'TAK', 'Przetwarzanie odbywa się na podstawie zgody i umowy'),
(1, 2, 'NIE', 'Nie przetwarzamy szczególnych kategorii danych'),
(1, 3, 'NIE', 'Nie przetwarzamy danych dotyczących wyroków skazujących');

-- Insert example area scores
INSERT INTO area_scores (assessment_id, area_id, score, comment) VALUES 
(1, 1, 'ZGODNY', 'Organizacja jest zgodna z zasadą zgodności z prawem'),
(1, 2, 'CZĘŚCIOWO_ZGODNY', 'Organizacja jest częściowo zgodna z zasadą rzetelności i przejrzystości'),
(1, 3, 'NIEZGODNY', 'Organizacja nie jest zgodna z zasadą minimalizacji danych');
