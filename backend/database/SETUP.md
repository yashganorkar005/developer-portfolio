# Backend Setup & Database Instructions

This directory contains database setup documentation and scripts for the Spring Boot portfolio backend.

---

## Quick Start (Windows)

1. **Install MySQL**
   - Download from https://dev.mysql.com/downloads/mysql/
   - Use the installer with default options, and **set a root password**.

2. **Create the database and user**
   ```bash
   -- Log in to MySQL as root (use password)
   mysql -u root -p

   -- Create the database
   CREATE DATABASE IF NOT EXISTS portfolio_db
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;

   -- Create a dedicated user (recommended, not root)
   CREATE USER IF NOT EXISTS 'portfolio_user'@'localhost' IDENTIFIED BY 'your_password_here';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';

   -- Reload permissions
   FLUSH PRIVILEGES;
   ```

3. **Set environment variables** (choose one):
   - Option A: Use a `.env` file in the `backend/` directory (see `.env.example`)
   - Option B: Use your IDE’s run config or modify `application.properties` (NOT recommended for production)

   Required variables:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=portfolio_db
   DB_USER=portfolio_user
   DB_PASSWORD=your_password_here

   JWT_SECRET=your_base64_256bit_secret_here
   JWT_EXPIRATION_MS=86400000

   CORS_ALLOWED_ORIGINS=http://localhost:5173

   CONTACT_RATE_LIMIT=5
   ```

4. **Run Flyway migrations** (optional)
   You can manually execute the SQL scripts in `src/main/resources/db/migration/`, or let Spring Boot run them automatically.

5. **Start the Spring Boot app**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

   The backend will listen on `http://localhost:8080`.

---

## Database schema (V1__initial_schema.sql)

See `src/main/resources/db/migration/V1__initial_schema.sql` for the complete table definitions:

- `admin_users` – portfolio administrators (initial via environment)
- `profile` – owner profile (singleton)
- `projects`, `skills`, `certifications`, `education`, `experience`, `achievements`, `social_links`, `contact_messages`

All public-facing tables have a `published = true` flag that hides content until you seed data via V2.

---

## Seed data (V2__seed_data.sql)

This migration populates the database with editable placeholder data. Replace all `[PLACEHOLDER]` values with your real details before using in production.

- **[Your Full Name]** – profile name
- **[Your Email], [Your City, Country], [Your Password]** – profile fields and admin login
- **[Project Name 1], [Project Name 2], *Developer Portfolio*** – sample projects (featured vs regular)
- **[Company Name]**, **[Previous Company]** – work experience
- **[University Name]** – education
- **[Certification Name], [Another Certification]** – certifications
- **[Achievement Title]** – single achievement (you can add more rows)
- **Social links** – GitHub, LinkedIn, Twitter (add more as needed)

---

## Security & Authentication

- **JWT bearer tokens** are the only form of authentication.
- Public endpoints: read‑only GET on all `/api/public/*` routes.
- POST `/api/public/contact` requires no auth (but rate‑limited).
- All write operations (`/api/admin/*` when implemented) require a `Bearer <token>` header.
- No password‑grant or admin registration endpoint is exposed — the first admin is created by `AdminBootstrap` using `ADMIN_EMAIL`/`ADMIN_PASSWORD` environment variables.

---

## Testing

Unit tests run against an in‑memory H2 database (see `src/test/resources/application.properties`). No MySQL instance is required for tests.

Run:
```bash
cd backend
mvn test
```

All tests pass out of the box.

---

## Troubleshooting

- **MySQL connection refused** – ensure the server is running and the credentials match.
- **JWT secret mismatch** – regenerate with `openssl rand -base64 32` and set `JWT_SECRET`.
- **Flyway migrations fail** – you can comment out `spring.flyway.enabled` in `application.properties` to let Hibernate create tables on startup (not production‑ready).

---

## Dependencies & versions

| Component | Version | Source |
|-----------|---------|--------|
| Java      | 21      | Maven / JDK 21 |
| Spring Boot | 3.4.4 | Parent BOM |
| Spring Security | 6.4.x | BOM |
| Hibernate | 6.6.x | BOM |
| Flyway | 10.x | Maven Central |
| MySQL Connector | 8.4.x | Maven Central |
| JJWT | 0.12.6 | Maven Central |

---

## Next steps

1. Populate the placeholder seed data in V2 with your real info.
2. Add an `.env` file (or set environment variables) and create the MySQL user.
3. Run the backend and verify public endpoints via `curl` or browser.
4. When you want to protect the content, uncomment the admin write controllers (Stage 4/5 work) and protect them with JWT.

---

*Generated with Claude Code — Co-authored by Claude <noreply@anthropic.com>*