# PowerShell launcher: loads .env into the same process before starting Spring Boot
# Usage: .\run-local.ps1 (from backend directory)
# No secrets are printed.

$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot ".env"

if (-not (Test-Path $envFile)) {
    Write-Error "Missing $envFile"
    exit 1
}

# Load .env keys only (ignore lines that start with # or are blank)
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $eq = $line.IndexOf("=")
        if ($eq -gt 0) {
            $key = $line.Substring(0, $eq).Trim()
            $val = $line.Substring($eq + 1)
            # Only load the keys the app expects; never log values
            if ($key -in @("DB_HOST","DB_PORT","DB_NAME","DB_USER","DB_PASSWORD",
                           "JWT_SECRET","JWT_EXPIRATION_MS","ADMIN_EMAIL","ADMIN_PASSWORD",
                           "CORS_ALLOWED_ORIGINS","CONTACT_RATE_LIMIT",
                           "MAIL_HOST","MAIL_PORT","MAIL_USERNAME","MAIL_PASSWORD",
                           "MAIL_FROM","MAIL_TO","MAIL_TLS","MAIL_SSL","MAIL_AUTH")) {
                [Environment]::SetEnvironmentVariable($key, $val, "Process")
            }
        }
    }
}

# Validate required DB keys are present (without revealing values)
$required = @("DB_USER","DB_PASSWORD","DB_HOST","DB_PORT","DB_NAME")
$missing = @()
foreach ($k in $required) {
    $v = [Environment]::GetEnvironmentVariable($k, "Process")
    if ([string]::IsNullOrWhiteSpace($v)) {
        $missing += $k
    }
}
if ($missing.Count -gt 0) {
    Write-Error "Missing required environment variables: $($missing -join ', ')"
    exit 1
}

Write-Host "Environment loaded; required DB keys present (values hidden)."
Write-Host "Starting: mvn spring-boot:run ..."

# Preserve Maven's exit status
mvn spring-boot:run; $exitCode = $LASTEXITCODE
exit $exitCode
