# Architecture & Design Decisions — Full-Stack Portfolio

This document provides a detailed technical breakdown of the full-stack portfolio application architecture, component interactions, security model, and key engineering decisions.

---

## 1. System Architecture Overview

The application follows a decoupled client-server architecture communicating via stateless REST APIs.

```
┌────────────────────────────────────────────────────────┐
│                      Browser / Client                  │
│     React 19 + TypeScript + Vite + Tailwind CSS v4     │
│             Three.js Interactive 3D Canvas             │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / REST (JSON)
                           │ Bearer JWT for Admin Routes
                           ▼
┌────────────────────────────────────────────────────────┐
│                Spring Boot 3.4.4 Backend               │
│                  Java 21 / Apache Maven                │
├────────────────────────────────────────────────────────┤
│ • SecurityFilter (JWT Validation & Role Authorization) │
│ • Public Controllers (/api/public/*)                   │
│ • Admin Controllers (/api/admin/*, PreAuthorize ADMIN) │
│ • Business Services & Spring Data JPA Repositories     │
│ • StorageUtil (Magic-Byte Verification & Sanitization) │
└──────────────────────────┬─────────────────────────────┘
                           │ JDBC / HikariCP Connection Pool
                           ▼
┌────────────────────────────────────────────────────────┐
│                   MySQL 8.0 Database                   │
│         Managed Schemas & Flyway Migrations            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture (`frontend/`)

- **Component Hierarchy**: Organized into modular domain components under `src/components/` (sections for Hero, About, Projects, Skills, Experience, Certifications, Education, Achievements, Contact) and reusable UI primitives under `src/components/ui/`.
- **Interactive 3D Canvas**: The landing page hero integrates Three.js to render responsive particle and geometric animations, respecting user reduced-motion preferences (`motion-reduce`).
- **Centralized API Client**: Axios instance configured with request/response interceptors to attach JWT bearer tokens for administrative requests and handle error boundaries cleanly.
- **State Management**: React hooks (`useState`, `useEffect`, custom hooks) combined with React Context (`AuthContext`) for authentication state persistence in `localStorage`.

---

## 3. Backend Architecture (`backend/`)

The backend is structured into clear architectural layers:

1. **Controllers (`com.portfolio.backend.controller`)**:
   - `PublicController`: Exposes unauthenticated read endpoints for portfolio content (`/api/public/*`).
   - `AuthController`: Handles administrator authentication and JWT issuance (`/api/auth/login`).
   - `AdminController`: Secured administrative endpoints (`/api/admin/*`, annotated with `@PreAuthorize("hasRole('ADMIN')")`) for full CRUD operations and reordering.
   - `ContactController`: Public contact submission endpoint with IP-based rate limiting (`/api/public/contact`).
   - `MediaController` & `ResumeController`: Handle secure file uploads, serving, and deletion.

2. **Services (`com.portfolio.backend.service`)**:
   - Encapsulates business logic, transactional boundaries (`@Transactional`), and mapping between JPA entities and DTO records.

3. **Repositories (`com.portfolio.backend.repository`)**:
   - Spring Data JPA interfaces extending `JpaRepository` for type-safe database access.

4. **Entities & DTOs (`com.portfolio.backend.entity` & `dto`)**:
   - JPA entities mapped to MySQL tables with Bean Validation annotations (`@NotBlank`, `@Size`, `@Email`).
   - Java records (`record`) for immutable data transfer across API boundaries.

---

## 4. Security Model

- **Stateless JWT Authentication**: Upon successful authentication at `/api/auth/login`, the backend issues a signed HMAC-SHA JWT containing the administrator's email and roles. Subsequent admin requests present this token in the `Authorization: Bearer <token>` header.
- **Fail-Safe Startup Verification**: `JwtUtil` includes `@PostConstruct` validation that inspects the configured secret key on application startup. In production profiles, missing secrets or insecure placeholder values (`CHANGE_ME`, `default_secret`) trigger an immediate `IllegalStateException` to prevent silent misconfigurations.
- **BCrypt Hashing**: Administrator passwords are securely hashed using BCrypt.
- **IP-Based Rate Limiting**: The contact form controller extracts client IP addresses (respecting `X-Forwarded-For` proxy headers) and enforces a maximum of 5 submissions per hour per IP.
- **Secure File Uploads (`StorageUtil`)**:
  - Validates file extensions and restricts uploads to permitted MIME types.
  - Inspects file **magic bytes** (e.g., PNG header `89 50 4E 47`, JPEG header `FF D8 FF`, PDF header `%PDF`) to prevent malicious executable disguises.
  - Sanitizes filenames and enforces absolute path normalization within `PORTFOLIO_MEDIA_DIR` and `RESUME_STORAGE_DIR` to block directory traversal attacks.

---

## 5. Persistence & Database Migrations

- **Database**: MySQL 8.0 relational database with UTF-8mb4 character encoding.
- **Flyway Migrations**: All schema definitions and seed data are version-controlled under `src/main/resources/db/migration/`:
  - `V1__initial_schema.sql`: Core tables (`admin_user`, `profile`, `projects`, `skills`, `certifications`, `education`, `experience`, `achievements`, `social_links`, `contact_messages`).
  - `V2__seed_data.sql`: Initial professional seed records.
  - `V3__cert_image_url.sql` & `V4__achievement_image_url.sql`: Added image attachment columns.
  - `V5__skill_category_order.sql`: Added persistent category ordering support.
  - `V6__profile_hero_headline.sql`: Added `hero_headline` to the singleton profile table.
- **Automatic Execution**: Spring Boot executes Flyway migrations automatically upon startup, ensuring database schemas are always synchronized with the application codebase.
