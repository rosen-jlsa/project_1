# Luxe Salon - Launch Verification Script
# This script verifies the health of the project before launch.

Write-Host " Starting Launch Verification..." -ForegroundColor Cyan

# 1. Check for node_modules
if (!(Test-Path "node_modules")) {
    Write-Host " node_modules not found. Running npm install..." -ForegroundColor Yellow
    cmd /c npm install
}

# 2. Run Linting
Write-Host " Running Lint Check..." -ForegroundColor Cyan
$lintResult = cmd /c npm run lint 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host " Linting failed! Please fix errors before launching." -ForegroundColor Red
    $lintResult | Out-String | Write-Host
    exit 1
} else {
    Write-Host " Linting passed!" -ForegroundColor Green
}

# 3. Run Build
Write-Host " Running Production Build..." -ForegroundColor Cyan
$buildResult = cmd /c npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host " Build failed! The site cannot be launched in its current state." -ForegroundColor Red
    exit 1
} else {
    Write-Host " Build successful!" -ForegroundColor Green
}

Write-Host "`n VERIFICATION COMPLETE! The project is healthy and ready for launch." -ForegroundColor Green
Write-Host " You can now run: git push origin master" -ForegroundColor Cyan
