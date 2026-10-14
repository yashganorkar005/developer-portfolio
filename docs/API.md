# REST API Reference — Full-Stack Portfolio

This document outlines the REST API endpoints exposed by the Spring Boot backend application.

---

## Base URL
- **Local Development**: `http://localhost:8080`
- **Production**: Configured via `VITE_API_URL` on the frontend (e.g., `https://api.yourdomain.com/api`)

---

## 1. Public Endpoints (`/api/public`)
Unauthenticated endpoints providing portfolio content to the React frontend.

| Method | Endpoint | Description | Response Payload |
|---|---|---|---|
| `GET` | `/api/public/profile` | Retrieve portfolio owner profile details | `ProfileDto` |
| `GET` | `/api/public/projects` | List all published projects | `List<ProjectDto>` |
| `GET` | `/api/public/skills` | List all published skills | `List<SkillDto>` |
| `GET` | `/api/public/certifications` | List all published certifications | `List<CertificationDto>` |
| `GET` | `/api/public/education` | List all education records | `List<EducationDto>` |
| `GET` | `/api/public/experience` | List all professional experience records | `List<ExperienceDto>` |
| `GET` | `/api/public/achievements` | List all achievements | `List<AchievementDto>` |
| `GET` | `/api/public/social-links` | List all social links | `List<SocialLinkDto>` |
| `GET` | `/api/public/site-info` | Retrieve bundled site metadata (Profile + Social Links) | `Map<String, Object>` |

---

## 2. Authentication (`/api/auth`)
| Method | Endpoint | Description | Request Body | Response Payload |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate administrator and issue JWT | `LoginRequest` (`email`, `password`) | `LoginResponse` (`token`, `tokenType`, `expiresIn`, `email`) |

---

## 3. Contact & Communication (`/api/public/contact`)
| Method | Endpoint | Description | Request Body | Response Status |
|---|---|---|---|---|
| `POST` | `/api/public/contact` | Submit contact inquiry (Rate-limited: 5/hr/IP) | `ContactMessageRequest` (`name`, `email`, `subject`, `message`) | `200 OK` or `429 Too Many Requests` |

---

## 4. Media & Résumé (`/api`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/media/{filename}` | Public | Serve uploaded image file |
| `GET` | `/api/public/resume` | Public | Download or view professional resume PDF |
| `POST` | `/api/admin/upload/image` | Admin | Upload image file (multipart `file`, max 5MB, magic-byte verified) |
| `GET` | `/api/admin/resume` | Admin | Retrieve resume metadata |
| `POST` | `/api/admin/resume` | Admin | Upload or replace resume PDF (multipart `file`) |
| `DeleteMapping` | `/api/admin/resume` | Admin | Delete uploaded resume |

---

## 5. Administrative Endpoints (`/api/admin`)
All endpoints under `/api/admin/*` require `Authorization: Bearer <JWT_TOKEN>` header with `ROLE_ADMIN`.

### Projects
- `GET /api/admin/projects` — List all projects (including drafts/unpublished)
- `POST /api/admin/projects` — Create project
- `PUT /api/admin/projects/{id}` — Update project
- `DELETE /api/admin/projects/{id}` — Delete project

### Skills & Categories
- `GET /api/admin/skills` — List all skills
- `POST /api/admin/skills` — Create skill
- `PUT /api/admin/skills/{id}` — Update skill
- `DELETE /api/admin/skills/{id}` — Delete skill
- `GET /api/admin/skill-category-orders` — List skill category display order
- `PUT /api/admin/skill-category-orders/{category}?newOrder={n}` — Update category order

### Certifications
- `GET /api/admin/certifications` — List all certifications
- `POST /api/admin/certifications` — Create certification
- `PUT /api/admin/certifications/{id}` — Update certification
- `DELETE /api/admin/certifications/{id}` — Delete certification

### Education & Experience
- `GET /api/admin/education` / `POST` / `PUT /{id}` / `DELETE /{id}`
- `GET /api/admin/experience` / `POST` / `PUT /{id}` / `DELETE /{id}`

### Achievements & Social Links
- `GET /api/admin/achievements` / `POST` / `PUT /{id}` / `DELETE /{id}`
- `GET /api/admin/social-links` / `POST` / `PUT /{id}` / `DELETE /{id}`

### Profile
- `GET /api/admin/profile` — Get profile configuration
- `PUT /api/admin/profile` — Update profile details (Name, tagline, bio, email, location, avatarUrl, heroHeadline, resumeUrl, available)

### Contact Messages
- `GET /api/admin/contact-messages` — List all received contact inquiries
- `PUT /api/admin/contact-messages/{id}` — Update message status (e.g., mark as read/unread)
- `DELETE /api/admin/contact-messages/{id}` — Delete message

### Entity Reordering
- `PUT /api/admin/reorder/{entityType}/{id}?newOrder={n}` — Reposition entity order (`entityType`: `projects`, `certifications`, `achievements`, `education`, `experience`, `skills`, `social-links`)
