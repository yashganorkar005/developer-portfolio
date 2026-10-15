# Verification report

Date: 2026-10-15. Method: static inspection of this repository. No production host, database, or Cloudinary account was contacted. No application code, migration, or data was changed.

## Corrections made to ARCHITECTURE_SHEET.md

| Previous claim | Correction | Why |
|---|---|---|
| MySQL 8.0 | Server version is **not in git**. Connector/J is Boot-managed; `pom.xml` comments say 8.4.x for the **driver** | A stated production server of 8.4.11 must be read from the database dashboard |
| Six Flyway migrations and a round "ten tables" | **Seven** scripts, `V1`–`V7`. **Twelve** application tables plus `flyway_schema_history` | `V1` creates 10 tables. `V5` adds `skill_category_orders`. `V7` adds `media_cleanup_queue` |
| Three.js 3D hero | **Not a dependency.** Motion is Framer Motion | `frontend/package.json` has no `three` package. `HeroSection.tsx` imports `framer-motion` |
| Uploads stored on `PORTFOLIO_MEDIA_DIR` / `RESUME_STORAGE_DIR` | **New** images and résumés go to **Cloudinary**. Disk remains only for legacy `/api/media/{file}` | `CloudinaryStorageService`, `StorageUtil.storeImage`, `ResumeController` |
| `RESUME_STORAGE_DIR` env var | Not referenced. Local résumé path is an internal `ResumeService` path; new uploads ignore it | Resume upload calls `cloudinaryStorageService.uploadResume` |
| CI/CD pipeline and CDN boxes in the diagram | Removed. No `.github/workflows`. No CDN config | Drawing them made an unconfigured service look real |
| UptimeRobot / health checks | No monitor config. `GET /api/health` and `/api/actuator/health` are **permit rules only** | No Actuator dependency, no health controller |
| Swagger available | Security config permits `/swagger-ui/**` and `/v3/api-docs`. **springdoc is not a dependency** | Those URLs are not an API console |
| `CONTACT_RATE_LIMIT` is the live limit | The controller passes the literal `5`. The property is unused by that call | `ContactController` line calling `isRateLimited(ip, 5)` |
| CORS supports a list of origins | One origin string, not split on commas | `SecurityConfig.corsConfigurationSource` |
| Backend always listens on 8080 | Bare JAR default **8080** (`PORT`). Docker default **10000** | `application.properties`, `backend/Dockerfile` |
| "Production start command" as a verified host command | Documented the JAR command and the Dockerfile `ENTRYPOINT`. The host's actual command is unverified | No platform config file (Render, Fly, Railway, etc.) |
| ER diagram implied relationships | Replaced with an explicit "no foreign keys" note | `V1__initial_schema.sql` has no `FOREIGN KEY` clauses |
| Frontend stack omitted Router, Hook Form, Zod, Axios | Added with versions from `package.json` | They are real dependencies |
| JWT "contains roles" | Token subject is the email. Role checks are server-side | `JwtUtil.generateToken` |

## Verified from source

- Spring Boot **3.4.4**, Java **21**, JJWT **0.12.6**, Cloudinary HTTP5 **2.3.2** (`backend/pom.xml`).
- React **^19.2.8**, TypeScript **~6.0.2**, Vite **^8.3.0**, Tailwind **^4.3.3** (`frontend/package.json`).
- BCrypt via `BCryptPasswordEncoder` bean; admin hash written in `AdminBootstrap`.
- Stateless sessions, public GET allowlist, `POST /api/auth/login` and `POST /api/public/contact` public, everything else authenticated (`SecurityConfig`).
- Admin controllers annotated `@PreAuthorize("hasRole('ADMIN')")`.
- JWT startup guard against blank/`CHANGE_ME` secrets except profile `test` (`JwtUtil`).
- Contact limit: count of rows for that IP in the last 3600 seconds, compared to 5 (`ContactMessageService`).
- Image magic-byte checks and 5 MB cap (`StorageUtil`). PDF `%PDF` check and 5 MB cap (`ResumeController`).
- Flyway enabled, locations `classpath:db/migration`, `baseline-on-migrate=true`, Hibernate `ddl-auto=validate`.
- Dockerfile: multi-stage Temurin 21, non-root user, `PORT` default 10000, `MaxRAMPercentage=75`, build context is the repo root.

## Requires deployment-dashboard verification

- Frontend host, backend host, and database host (vendor, plan, region).
- MySQL **server** version, storage size, backups, and whether connections require a CA.
- That production runs `backend/Dockerfile` rather than a native buildpack.
- Cloudinary credentials present in the host environment (names only; do not copy values into git).
- Custom domain and TLS.
- Any uptime monitor configured outside the repo.
- Any deploy-on-push webhook configured outside the repo.

## PDF

Not generated. This environment has no verified PDF renderer wired up for this document, and a broken export would be worse than the Markdown source. The sheet and the `.mmd` files are the deliverable.

## Secrets

No `.env` values, JDBC passwords, JWT secrets, or Cloudinary secrets were read into this report.
