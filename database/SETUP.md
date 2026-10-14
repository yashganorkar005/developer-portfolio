# Database Setup

## Prerequisites

- MySQL 8.0+ running locally (already confirmed installed)

## 1. Create the database and user

Connect to MySQL as root (replace `YOUR_ROOT_PASSWORD` with your actual root password):

```bash
mysql -u root -p
```

Then run these SQL commands:

```sql
CREATE DATABASE portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'choose_a_strong_password';

GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

## 2. Configure environment variables

Copy the example file and fill in your values:

```bash
# From the backend/ directory
copy .env.example .env
```

Edit `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio_db
DB_USER=portfolio_user
DB_PASSWORD=choose_a_strong_password

# Generate a secure secret: openssl rand -base64 32
JWT_SECRET=your_generated_base64_secret_here
JWT_EXPIRATION_MS=86400000

CORS_ALLOWED_ORIGINS=http://localhost:5173
CONTACT_RATE_LIMIT=5
```

## 3. Create the initial admin account

Set these additional environment variables **before** the first startup:

```
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=choose_a_very_strong_password
```

On Windows (Command Prompt):
```cmd
set ADMIN_EMAIL=admin@yourdomain.com
set ADMIN_PASSWORD=your_strong_password
```

Or PowerShell:
```powershell
$env:ADMIN_EMAIL = "admin@yourdomain.com"
$env:ADMIN_PASSWORD = "your_strong_password"
```

The `AdminBootstrap` runner creates the admin on first startup and is a no-op on all subsequent starts. **Do not expose an admin-creation endpoint over HTTP.**

## 4. Start the backend

```bash
# From the backend/ directory
mvn spring-boot:run
```

Flyway will automatically:
1. Run `V1__initial_schema.sql` — creates all tables
2. Run `V2__seed_data.sql` — inserts placeholder seed content

The API will be available at: http://localhost:8080

## 5. Verify the setup

Test a public endpoint (should return the profile JSON):

```bash
curl http://localhost:8080/api/public/profile
```

## Migration notes

- Flyway scripts live in `src/main/resources/db/migration/`
- File naming convention: `V{number}__{description}.sql`
- **Never edit a deployed migration** — add a new `V3__...sql` file instead
- Tests use H2 in-memory with `spring.flyway.enabled=false` — no MySQL required to run tests
