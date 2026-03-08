$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$clientDir = Resolve-Path (Join-Path $scriptDir "..")

Push-Location $clientDir
try {
    $env:INTEGRATION_BASE_URL = "https://localhost:7156"
    $env:INTEGRATION_INSECURE_TLS = "1"
    $env:INTEGRATION_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiUlVUIEJBU1RPTkkiLCJVc2VyTmFtZSI6InJ1dC5iYXN0b25pIiwiZXhwIjoxNzcyOTY4NzE1LCJpc3MiOiJodHRwczovL2VwcG9pLnVuaWNhbS5pdCJ9.IE52pfz1WUQ64KIDDNaAirbRLUaa8rZ9P0O_1XpL23c"

    npm run test:integration
}
finally {
    Pop-Location
}