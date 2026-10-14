# Full-Stack Developer Portfolio

A production-grade, full-stack software engineer portfolio application built with a modern React/TypeScript/Three.js frontend and a secure Java 21 Spring Boot backend backed by MySQL and Flyway migrations.

This project showcases professional software engineering principles—including reactive 3D animations, stateless JWT authentication, role-based access control, secure multipart file uploads with magic-byte validation, and dynamic database-driven content management. It includes an authenticated administrator dashboard enabling the portfolio owner to manage all content without altering source code.

---

## 🌟 Project Preview

- **Live Demo**: *Coming soon (currently runs locally)*
- **Screenshots**: See [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) for capture instructions and UI tour.
- **Repository**: [GitHub Repository](https://github.com/username/portfolio-website)

---

## 🚀 Key Features

### Public Experience
- **Interactive 3D Hero**: Built with Three.js / Canvas, featuring responsive geometric particle simulations and smooth motion.
- **Dynamic Content Sections**: Fully responsive portfolio sections populated via REST APIs:
  - Featured Projects with live links, source repositories, tech stacks, and ordering controls.
  - Interactive Skills matrix categorized by domain with custom ordering.
  - Professional Experience timeline and career milestones.
  - Education and Academic credentials.
  - Certifications with credential verification links and badge images.
  - Achievements and notable awards.
  - Social links and profile metadata.
- **Contact Form**: Secure messaging with client IP tracking, server-side rate limiting (5 requests/hr/IP), and automated email notifications.
- **Resume Viewer & Download**: Direct in-browser PDF viewing and download.
- **Accessibility & Motion**: Reduced-motion query support (`motion-reduce`) and responsive mobile-first layouts using Tailwind CSS v4.

### Administrator Dashboard
- **Protected Routing**: Secure authentication workflow using Spring Security and stateless JWT bearer tokens.
- **Full CRUD Management**: Comprehensive management interfaces for projects, skills, certifications, education, experience, achievements, and social links.
- **Profile & Hero Customization**: Real-time updates for personal profile bio, avatar image, contact email, availability status, and hero headline (`hero_headline`).
- **Contact Message Inbox**: Read, inspect full multi-paragraph inquiries, mark as read/unread, and delete messages.
- **Persistent Media Management**: Secure image upload utility supporting PNG, JPEG, and WebP formats up to 5MB with magic-byte verification and path-traversal protection.
- **Resume Upload**: Secure PDF replacement and deletion.
- **Entity Reordering**: Interactive up/down controls allowing administrators to customize the display order across all portfolio collections.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations & Icons**: Framer Motion, Lucide React
- **3D Graphics**: Three.js

### Backend
- **Language & Runtime**: Java 21 (Temurin / OpenJDK)
- **Framework**: Spring Boot 3.4.4
- **Security**: Spring Security (Stateless JWT authentication, BCrypt hashing)
- **Persistence**: Spring Data JPA / Hibernate
- **Database & Migrations**: MySQL 8.0, Flyway (`V1` through `V6`)
- **Build & Dependency Management**: Apache Maven (`mvnw`)

---

## 🏗️ Architecture

```mermaid
graph TD
    Browser[React + TypeScript Frontend / Three.js] -->|HTTP / REST (JSON)| APIGateway[Spring Boot 3.4.4 REST Controllers]
    
    subgraph Spring Boot Backend
        APIGateway --> Security[Spring Security + JWT Auth Filter]
        Security --> PublicSvc[Public Services]
        Security --> AdminSvc[Admin Services (PreAuthorize ROLE_ADMIN)]
        PublicSvc --> Repos[Spring Data JPA Repositories]
        AdminSvc --> Repos
        Repos --> MySQL[(MySQL 8.0 Database + Flyway)]
    end

    subgraph Storage
        AdminSvc --> StorageUtil[StorageUtil (Magic Byte Verification)]
        StorageUtil --> MediaDir[(PORTFOLIO_MEDIA_DIR)]
        StorageUtil --> ResumeDir[(RESUME_STORAGE_DIR)]
    end
```

### Architectural Highlights
- **Layered Separation**: Clear separation of concerns across Controllers, Services, Repositories, Entities, and DTO records.
- **Stateless Authentication**: JWT bearer token authentication ensuring scalable backend scaling without server-side HTTP session state.
- **Fail-Safe Startup**: Strict `@PostConstruct` validation in `JwtUtil` preventing production startup if JWT secrets are missing or configured with insecure placeholders.
- **Robust File Upload Security**: `StorageUtil` validates actual file magic bytes (PNG, JPEG, WebP, PDF) rather than relying solely on client-provided MIME headers, safeguarding against malicious uploads and path-traversal attacks.

---

## ⚙️ Important Engineering Decisions

1. **DTO Record Pattern**: Immutable Java 14+ records are used for API data transfer objects, ensuring thread-safe, predictable payloads.
2. **Flyway Database Migrations**: Schema creation and seed data are version-controlled via SQL migration scripts (`V1` to `V6`), guaranteeing reproducible database states across local development and production.
3. **Rate-Limited Contact Form**: IP-based sliding rate-limiting protects contact endpoints against spam bots and denial-of-service attempts.
4. **Environment Isolation**: Default development configurations fall back to local directories (`./portfolio-media`), while production instances require explicit absolute environment paths (`PORTFOLIO_MEDIA_DIR`).

---

## 📁 Project Structure

```text
portfolio-website/
├── frontend/                   # React 19 + TypeScript Vite frontend
│   ├── src/
│   │   ├── api/                # Axios API clients
│   │   ├── components/         # UI components, 3D hero, and sections
│   │   ├── context/            # Auth and application state
│   │   ├── pages/              # Public portfolio and admin dashboard views
│   │   └── utils/              # Media URL resolution and formatting utilities
│   └── package.json
├── backend/                    # Java 21 Spring Boot backend
│   ├── src/main/java/com/portfolio/backend/
│   │   ├── config/             # Spring Security & CORS configuration
│   │   ├── controller/         # REST API endpoints (Public & Admin)
│   │   ├── dto/                # Immutable record DTOs
│   │   ├── entity/             # JPA entities (Profile, Project, Skill, etc.)
│   │   ├── repository/         # Spring Data JPA interfaces
│   │   ├── security/           # JWT generation, filtering, and admin bootstrap
│   │   ├── service/            # Business logic layer
│   │   └── util/               # Storage validation & date helpers
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway SQL migration scripts (V1 - V6)
│   │   └── application.properties
│   ├── pom.xml
│   └── run-local.ps1           # Automated local backend runner script
├── database/                   # Database setup documentation and scripts
├── docs/                       # Detailed documentation (Architecture, API, Environment)
├── DEPLOYMENT.md               # Production deployment guide
└── README.md                   # Root project entry point
```

---

## 🚀 Getting Started (Windows PowerShell)

### Prerequisites
- **Java Development Kit (JDK)**: Java 21
- **Node.js**: v18+ and npm v9+
- **Database**: MySQL 8.0+

### 1. Database Setup
Log into MySQL and create the database:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'SecureDBPassword123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Backend Environment
Create a `backend/.env` file (copied from `backend/.env.example`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio_db
DB_USER=portfolio_user
DB_PASSWORD=SecureDBPassword123!
JWT_SECRET=your_base64_encoded_256_bit_secret_key_here_min_32_bytes
CORS_ALLOWED_ORIGINS=http://localhost:5173
PORTFOLIO_MEDIA_DIR=./portfolio-media
RESUME_STORAGE_DIR=./resume-storage
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=AdminPassword123!
```

### 3. Start the Backend
Using the provided PowerShell helper script or Maven:
```powershell
cd backend
./run-local.ps1
# Or manual: mvn spring-boot:run
```
*The backend starts at `http://localhost:8080`. Flyway automatically runs migrations and seeds initial data.*

### 4. Start the Frontend
In a separate PowerShell terminal:
```powershell
cd frontend
npm install
npm run dev
```
*The frontend development server starts at `http://localhost:5173`.*

---

## 📚 Detailed Documentation

- **[Architecture & Design Decisions](docs/ARCHITECTURE.md)**
- **[REST API Reference](docs/API.md)**
- **[Environment Variables Reference](docs/ENVIRONMENT.md)**
- **[Production Deployment Guide](DEPLOYMENT.md)**
- **[Database Setup & Migration Guide](database/SETUP.md)**
- **[Screenshot Tour & Capture Instructions](docs/SCREENSHOTS.md)**

---

## 🧪 Testing & Verification

- **Backend Unit & Integration Tests**:
  ```powershell
  cd backend
  mvn clean verify
  ```
- **Frontend Production Build**:
  ```powershell
  cd frontend
  npm run build
  ```

---

## 📄 License

This repository currently has no explicit open-source license. All rights reserved by the author.
