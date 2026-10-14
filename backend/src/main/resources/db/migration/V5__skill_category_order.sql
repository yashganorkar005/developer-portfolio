-- Persist admin-controlled ordering for dynamically derived skill categories.
CREATE TABLE skill_category_orders (
    category    VARCHAR(100) NOT NULL PRIMARY KEY,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  DATETIME(6)  NOT NULL,
    updated_at  DATETIME(6)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO skill_category_orders (category, sort_order, created_at, updated_at)
SELECT category, MIN(sort_order), NOW(6), NOW(6)
FROM skills
GROUP BY category;
