-- Forward-only: add achievement image column
ALTER TABLE achievements ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;
