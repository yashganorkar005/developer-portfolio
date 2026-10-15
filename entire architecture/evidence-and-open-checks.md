# Evidence and Open Checks

Date of documentation: 15 October 2026 (Asia/Kolkata)

## Verified from project history or user-provided output

- Public site: `https://yashganorkardev.vercel.app/`.
- Backend base URL: `https://portfolio-backend-y9yf.onrender.com`.
- Public profile endpoint: `/api/public/profile`.
- GitHub repository: `https://github.com/yashganorkar005/developer-portfolio.git`; branch `main`.
- Commit `379c312` was pushed after changing `SecurityConfig.java` to permit `HEAD` for `/api/public/profile` and adding `HEAD` to the CORS method list.
- The reported response to `curl.exe -I --max-time 90 https://portfolio-backend-y9yf.onrender.com/api/public/profile` was `HTTP/1.1 200 OK` on 15 October 2026.
- `mvn -f .\backend\pom.xml test` returned `BUILD SUCCESS` after the security change.
- Frontend build command successfully used: `npm --prefix .\frontend run build`; Vite emitted a large-chunk warning but the build succeeded.
- Confirmed application stack from project history: React, TypeScript, Vite, Axios, Java 21, Spring Boot 3.5.x, Maven, MySQL 8.4.11, Flyway, Spring Security/JWT.
- Hosting/services from the project history: Vercel (frontend), Render (backend), Aiven (MySQL), Cloudinary (new media uploads), Brevo HTTPS API (contact notifications), UptimeRobot (HTTP monitoring).
- Aiven database name: `portfolio_db`; the service was reported in the `blr`/Bengaluru region.
- Recent incident: Aiven MySQL service was powered off/unreachable; its service logs showed controlled MySQL shutdown messages and subsequent starts. The exact provider-side trigger was not proven.
- Existing local-media migration was intentionally skipped when Cloudinary storage was introduced. Existing older assets may therefore need URL-by-URL verification.
- Cloudinary environment variable names reported in the live service: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Brevo-related environment variable names reported in Render: `BREVO_API_KEY`, `MAIL_FROM`, `MAIL_TO`.
- `SecurityConfig.java` was pasted into the conversation. It configures stateless sessions, CORS, a JWT filter before `UsernamePasswordAuthenticationFilter`, BCrypt password encoding, public GET routes, public POST contact/login, and `anyRequest().authenticated()`.

## Official platform facts referenced

- Render Free web services spin down after 15 minutes without inbound traffic; wake-up takes about a minute; free web service filesystems are ephemeral; 750 free instance hours are shared per workspace per calendar month. See [Render Free](https://render.com/docs/free).
- Aiven MySQL Free has no fixed expiry but may power off services after inactivity; it includes 1 GB disk, 1 GB RAM, one node, and `max_connections` of 76, and has no 99.99% SLA. See [Aiven MySQL Free tier](https://aiven.io/docs/products/mysql/concepts/mysql-free-tier).
- Vercel supports automatic deployments from connected Git repositories when the configured production branch is pushed. Actual project settings should still be checked. See [Vercel Git deployments](https://vercel.com/docs/git).
- Cloudinary advises never exposing the API secret in client-side code. See [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images).
- UptimeRobot's public pricing page advertises a free tier, but the account UI shown during setup said changing the HTTP method and API Monitoring required an upgrade. Treat the exact features visible in the user's account as authoritative until reconciled with current plan documentation. See [UptimeRobot pricing](https://uptimerobot.com/pricing/).

## Must verify from the repo or hosting dashboard before treating as final implementation truth

1. Render backend Build Command and Start Command, health-check path, root directory, runtime instance type, and latest deployed commit.
2. Vercel Root Directory (`frontend` was previously reported), build command, output directory (`dist` is the Vite default but must be confirmed in settings), production environment variables, and production branch.
3. Exact `pom.xml` Java/Spring Boot/dependency versions and whether `mvnw` is committed.
4. Exact datasource environment variable names and whether a separate Spring production profile is active.
5. Full V1-V7 Flyway migration contents, entity mappings, table names, foreign keys, indexes, and cascade rules.
6. Exact list of uploadable file types, server-side content-type/signature validation, and any actual image/PDF size limits. A 5 MB upload limit was reported in the project context, but the controller implementation was not inspected here.
7. Whether all legacy image/resume references point to Cloudinary, or whether any old references still point to application-local storage.
8. Exact current CORS value in Render. The supplied code reads `CORS_ALLOWED_ORIGINS` as a single string and wraps it in `List.of(...)`; do not set a comma-separated list unless code is changed to split it.
9. Whether Vercel and Render are both connected to the same repository/branch and whether every push triggers each service. Historical deployments suggest this, but settings were not accessible during this audit.
10. UptimeRobot's current monitor method/result after Render has deployed commit `379c312`. The direct HEAD request returned 200 in the reported output, but the UptimeRobot incident should be confirmed resolved in its activity log.

## No secrets included

Actual passwords, JDBC URLs containing credentials, Cloudinary API secret, Brevo API key, JWT signing secret, admin credentials, and database passwords are intentionally excluded. Environment variable **names** may be listed; values must remain in hosting secret settings, not documentation or Git.
