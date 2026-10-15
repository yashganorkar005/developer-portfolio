CREATE TABLE media_cleanup_queue (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    asset_url VARCHAR(2048) NOT NULL,
    url_hash CHAR(64) NOT NULL,
    not_before TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attempts INT NOT NULL DEFAULT 0,
    last_error VARCHAR(1000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_media_cleanup_url_hash (url_hash),
    KEY idx_media_cleanup_not_before (not_before)
) ENGINE=InnoDB;