-- V6: Add editable landing-page headline to the singleton profile.
-- Existing profiles keep the current public headline as their initial value.

ALTER TABLE profile
    ADD COLUMN hero_headline VARCHAR(160) NOT NULL DEFAULT 'Building calm, capable digital products.' AFTER avatar_url;
