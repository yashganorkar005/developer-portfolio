# Environment Variable Reference — Full-Stack Portfolio

This document details all configuration environment variables required for running the backend and frontend in development and production environments.

---

## 1. Backend Environment Variables (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` for local development. In production, supply these variables directly through your hosting environment (e.g., Docker, systemd environment files, or cloud secrets manager).

| Variable Name | Description | Example Value / Placeholder | Required | Default |
|---|---|---|---|---|
| `PORT` | Spring Boot server port | `8080` | No | `8080` |
| `DB_HOST` | MySQL database hostname or IP | `localhost` | Yes | — |
| `DB_PORT` | MySQL database port | `3306` | Yes | `3306` |
| `DB_NAME` | MySQL database schema name | `portfolio_db` | Yes | — |
| `DB_USER` | MySQL database username | `portfolio_user` | Yes | — |
| `DB_PASSWORD` | MySQL database password | `SecureDBPassword123!` | Yes | — |
| `JWT_SECRET` | Base64-encoded 256-bit secret key for signing JWT tokens | *Generate via `openssl rand -base64 32`* | Yes | — |
| `JWT_EXPIRATION_MS` | JWT token lifespan in milliseconds | `86400000` (24 hours) | No | `86400000` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins for frontend requests | `https://yourdomain.com` | Yes | `http://localhost:5173` |
| `PORTFOLIO_MEDIA_DIR` | Absolute or relative path for storing uploaded images | `/var/portfolio/media` | Yes (Production) | `./portfolio-media` |
| `RESUME_STORAGE_DIR` | Absolute or relative path for storing resume PDFs | `/var/portfolio/resume` | Yes (Production) | `./resume-storage` |
| `ADMIN_EMAIL` | Bootstrap admin email created on first startup | `admin@yourdomain.com` | First startup only | `admin@portfolio.local` |
| `ADMIN_PASSWORD` | Bootstrap admin password created on first startup | `StrongAdminPassword!` | First startup only | `AdminPassword123!` |
| `MAIL_HOST` | SMTP mail server host for contact notifications | `smtp.sendgrid.net` | No | — |
| `MAIL_PORT` | SMTP mail server port | `587` | No | `587` |

---

## 2. Frontend Environment Variables (`frontend/.env` / `.env.production`)

Frontend variables prefixed with `VITE_` are embedded into the client-side bundle during build time by Vite.

| Variable Name | Description | Example Value | Required | Default |
|---|---|---|---|---|
| `VITE_API_URL` | Base URL for backend API requests | `https://api.yourdomain.com/api` (or `/api` if using a reverse proxy) | Yes | `http://localhost:8080/api` |

> ⚠️ **Security Warning**: Frontend variables are exposed publicly in browser bundles. Never store database credentials, API secrets, or private keys in `VITE_*` variables.
