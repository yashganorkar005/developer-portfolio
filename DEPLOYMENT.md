# Deployment Guide — Full-Stack Developer Portfolio

This guide covers production deployment instructions for the full-stack portfolio application (React / TypeScript Vite frontend, Java 21 Spring Boot backend, and MySQL database).

---

## 1. System Requirements

- **Java Development Kit (JDK)**: Java 21 (Temurin, OpenJDK, or Oracle)
- **Node.js**: v18+ and npm v9+
- **Database**: MySQL 8.0+
- **Build Tool**: Maven 3.9+ (bundled Maven wrapper `./mvnw` or system `mvn`)

---

## 2. Environment Variables

### Backend (`backend/.env` or server environment variables)

| Variable | Description | Example Placeholder | Required |
|---|---|---|---|
| `PORT` | Backend server port (default 8080) | `8080` | No |
| `DB_HOST` | MySQL database host | `localhost` or `mysql.internal` | Yes |
| `DB_PORT` | MySQL database port | `3306` | Yes |
| `DB_NAME` | MySQL database name | `portfolio_db` | Yes |
| `DB_USER` | MySQL database username | `portfolio_user` | Yes |
| `DB_PASSWORD` | MySQL database password | `SecureDBPassword123!` | Yes |
| `JWT_SECRET` | Base64-encoded 256-bit secret key | *Generate via `openssl rand -base64 32`* | Yes |
| `JWT_EXPIRATION_MS` | Token lifespan in milliseconds | `86400000` (24h) | No |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS frontend origin | `https://yourdomain.com` | Yes |
| `CONTACT_RATE_LIMIT` | Max contact submissions per IP/hr | `5` | No |
| `PORTFOLIO_MEDIA_DIR` | Absolute path for uploaded media storage | `/var/portfolio/media` | Yes (Production) |
| `RESUME_STORAGE_DIR` | Absolute path for résumé PDF storage | `/var/portfolio/resume` | Yes (Production) |
| `ADMIN_EMAIL` | Initial admin bootstrap email | `admin@yourdomain.com` | First startup only |
| `ADMIN_PASSWORD` | Initial admin bootstrap password | `StrongAdminPassword!` | First startup only |
| `MAIL_HOST` / `MAIL_PORT` | SMTP settings for contact notifications | `smtp.sendgrid.net` | No |

### Frontend (`frontend/.env.production` or build-time variables)

| Variable | Description | Example Placeholder | Required |
|---|---|---|---|
| `VITE_API_URL` | Base URL for backend API requests | `https://api.yourdomain.com/api` (or `/api` if using reverse proxy) | Yes |

---

## 3. Database Setup (MySQL)

1. Connect to MySQL as root:
   ```sql
   CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'SecureDBPassword123!';
   GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio_db.* TO 'portfolio_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Flyway Migrations**: Flyway runs automatically on Spring Boot startup (`spring.flyway.enabled=true`), applying versioned SQL migrations (`V1` through `V6`) safely without requiring manual schema creation.

---

## 4. Build Instructions

### Backend Build
```bash
cd backend
mvn clean package -DskipTests
# Produces target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend Build
```bash
cd frontend
npm install
npm run build
# Produces static files in frontend/dist/
```

---

## 5. Running in Production

### Backend Execution
```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=portfolio_db
export DB_USER=portfolio_user
export DB_PASSWORD=SecureDBPassword123!
export JWT_SECRET=<base64-secret>
export CORS_ALLOWED_ORIGINS=https://yourdomain.com
export PORTFOLIO_MEDIA_DIR=/var/portfolio/media
export ADMIN_EMAIL=admin@yourdomain.com
export ADMIN_PASSWORD=StrongAdminPassword!

java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend Hosting
Serve the `frontend/dist/` directory via Nginx, Caddy, AWS S3 + CloudFront, or Vercel. Ensure client-side routing fallback (all requests to `index.html`) is configured so direct visits to `/admin` or `/admin/login` resolve correctly.

---

## 6. Persistent Media Storage & Backups

- Uploaded images (avatars, project thumbnails) and résumés are saved to `PORTFOLIO_MEDIA_DIR` and `RESUME_STORAGE_DIR`.
- **Production Recommendation**: Mount these directories on persistent block storage (e.g., AWS EBS, Persistent Disk, or Docker volume) so uploads survive container restarts or server migrations.
- Set up automated daily snapshots/backups of both the MySQL database and the media storage directories.

---

## 7. Troubleshooting

- **Database Connection Failure**: Verify MySQL service is running, credentials in environment variables are correct, and the database user has proper grants.
- **CORS Errors**: Ensure `CORS_ALLOWED_ORIGINS` matches the exact public URL of the frontend (including protocol and trailing slash rules).
- **Missing Images**: Check that `PORTFOLIO_MEDIA_DIR` exists, is writable by the backend process, and that `VITE_API_URL` correctly points to the public API endpoint.
- **Admin Login Fails**: On first startup, verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` were provided. If `admin_users` table is already populated, authentication validates against hashed passwords in the database.
