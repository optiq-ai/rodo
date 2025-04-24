-- Skrypt SQL do dodania brakujących kolumn w istniejącej bazie danych

-- Dodanie kolumny 'progress' do tabeli 'assessment'
ALTER TABLE assessment ADD COLUMN progress INT DEFAULT 0;

-- Dodanie kolumny 'status' do tabeli 'requirement'
ALTER TABLE requirement ADD COLUMN status VARCHAR(20) DEFAULT NULL;

-- Aktualizacja istniejących rekordów, aby ustawić status na podstawie wartości
UPDATE requirement SET status = 'COMPLETED' WHERE value = 'ZGODNY' OR value = 'yes';
UPDATE requirement SET status = 'NOT_APPLICABLE' WHERE value = 'NIEZGODNY' OR value = 'no';
UPDATE requirement SET status = 'IN_PROGRESS' WHERE value = 'CZĘŚCIOWO ZGODNY' OR value = 'partial';
UPDATE requirement SET status = 'NOT_STARTED' WHERE value IS NULL OR value = '';

-- Aktualizacja progress w tabeli assessment na podstawie statusu wymagań
-- To jest uproszczona wersja, w rzeczywistości potrzebny byłby bardziej złożony skrypt
UPDATE assessment a
SET progress = (
    SELECT COALESCE(
        ROUND(
            (COUNT(CASE WHEN r.status IN ('COMPLETED', 'NOT_APPLICABLE') THEN 1 ELSE NULL END) * 100.0) / 
            NULLIF(COUNT(r.id), 0)
        ), 
        0
    )
    FROM chapter c
    JOIN area ar ON c.id = ar.chapter_id
    JOIN requirement r ON ar.id = r.area_id
    WHERE c.assessment_id = a.id
);
