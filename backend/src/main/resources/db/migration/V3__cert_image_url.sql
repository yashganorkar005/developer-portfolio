-- Forward-only: add cert image column (separate from credential verification URL)
ALTER TABLE certifications ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;
