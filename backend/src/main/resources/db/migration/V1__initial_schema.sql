-- ─────────────────────────────────────────────────────────────
-- V1: Initial schema
-- ─────────────────────────────────────────────────────────────

CREATE TABLE admin_users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL,
    INDEX idx_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE profile (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    tagline       VARCHAR(150),
    bio           TEXT,
    email         VARCHAR(255),
    location      VARCHAR(100),
    avatar_url    VARCHAR(500),
    resume_url    VARCHAR(500),
    is_available  TINYINT(1)   NOT NULL DEFAULT 1,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE projects (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    category    VARCHAR(100),
    tech_stack  TEXT,
    github_url  VARCHAR(500),
    live_url    VARCHAR(500),
    image_url   VARCHAR(500),
    featured    TINYINT(1)  NOT NULL DEFAULT 0,
    published   TINYINT(1)  NOT NULL DEFAULT 1,
    sort_order  INT         NOT NULL DEFAULT 0,
    created_at  DATETIME(6) NOT NULL,
    updated_at  DATETIME(6) NOT NULL,
    INDEX idx_project_published (published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE skills (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    category    VARCHAR(100) NOT NULL,
    proficiency INT          NOT NULL DEFAULT 0,
    sort_order  INT          NOT NULL DEFAULT 0,
    published   TINYINT(1)  NOT NULL DEFAULT 1,
    created_at  DATETIME(6) NOT NULL,
    updated_at  DATETIME(6) NOT NULL,
    INDEX idx_skill_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE certifications (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(200) NOT NULL,
    issuer         VARCHAR(150) NOT NULL,
    issue_date     DATE,
    expiry_date    DATE,
    credential_url VARCHAR(500),
    sort_order     INT         NOT NULL DEFAULT 0,
    published      TINYINT(1) NOT NULL DEFAULT 1,
    created_at     DATETIME(6) NOT NULL,
    updated_at     DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE education (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution         VARCHAR(200) NOT NULL,
    degree              VARCHAR(100) NOT NULL,
    field               VARCHAR(150) NOT NULL,
    start_date          DATE,
    end_date            DATE,
    currently_enrolled  TINYINT(1)  NOT NULL DEFAULT 0,
    description         TEXT,
    sort_order          INT         NOT NULL DEFAULT 0,
    published           TINYINT(1) NOT NULL DEFAULT 1,
    created_at          DATETIME(6) NOT NULL,
    updated_at          DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE experience (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    company      VARCHAR(200) NOT NULL,
    role         VARCHAR(150) NOT NULL,
    start_date   DATE,
    end_date     DATE,
    current_role TINYINT(1)  NOT NULL DEFAULT 0,
    description  TEXT,
    tech_stack   TEXT,
    sort_order   INT         NOT NULL DEFAULT 0,
    published    TINYINT(1) NOT NULL DEFAULT 1,
    created_at   DATETIME(6) NOT NULL,
    updated_at   DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE achievements (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    date        VARCHAR(7),
    sort_order  INT         NOT NULL DEFAULT 0,
    published   TINYINT(1) NOT NULL DEFAULT 1,
    created_at  DATETIME(6) NOT NULL,
    updated_at  DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE social_links (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    platform    VARCHAR(50)  NOT NULL,
    url         VARCHAR(500) NOT NULL,
    icon_name   VARCHAR(50),
    sort_order  INT         NOT NULL DEFAULT 0,
    published   TINYINT(1) NOT NULL DEFAULT 1,
    created_at  DATETIME(6) NOT NULL,
    updated_at  DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_messages (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(200) NOT NULL,
    message    TEXT         NOT NULL,
    ip_address VARCHAR(45),
    `read`     TINYINT(1)  NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL,
    INDEX idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
