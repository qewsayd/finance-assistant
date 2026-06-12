# Full Firebase setup - Finance Assistant
$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  FinPomoshchnik - Full Firebase Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$loggedIn = $false
try {
    $loginOut = npx firebase-tools login:list 2>&1 | Out-String
    if ($loginOut -match "@") { $loggedIn = $true }
} catch {}

if (-not $loggedIn) {
    Write-Host "[1/6] Login to Firebase CLI (browser will open)..." -ForegroundColor Yellow
    npx firebase-tools login
} else {
    Write-Host "[1/6] Firebase CLI: already logged in" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/6] Your projects:" -ForegroundColor Yellow
$projectsOut = npx firebase-tools projects:list 2>&1 | Out-String
Write-Host $projectsOut

$defaultId = "finance-helper-babe8"
if ($projectsOut -match "finance-helper-babe8") {
    Write-Host "Detected project: finance-helper-babe8" -ForegroundColor Green
    $input = Read-Host "Press Enter to use it, or type another Project ID"
    $projectId = if ([string]::IsNullOrWhiteSpace($input)) { $defaultId } else { $input }
} else {
    $projectId = Read-Host "Enter Project ID from the list above"
}

if ([string]::IsNullOrWhiteSpace($projectId)) {
    throw "Project ID is required (NOT a number like 228 - use full ID e.g. finance-helper-babe8)"
}

Write-Host ""
Write-Host "[3/6] Creating Web app (skip if exists)..." -ForegroundColor Yellow
npx firebase-tools apps:create WEB "FinPomoshchnik" --project $projectId 2>&1 | Out-Null

Write-Host ""
Write-Host "[4/6] Generating .env..." -ForegroundColor Yellow
$sdkOutput = npx firebase-tools apps:sdkconfig WEB --project $projectId 2>&1 | Out-String

if ($sdkOutput -match "Error:") {
    Write-Host $sdkOutput -ForegroundColor Red
    throw "Failed to get Firebase config. Check Project ID."
}

$sdkOutput | Set-Content -Path "firebase-config.json" -Encoding UTF8
node scripts/apply-firebase-config.mjs

if (-not (Test-Path ".env")) {
    throw ".env was not created. Check firebase-config.json"
}
Write-Host "      .env created!" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] Deploying Firestore rules..." -ForegroundColor Yellow
@{ projects = @{ default = $projectId } } | ConvertTo-Json | Set-Content ".firebaserc" -Encoding UTF8
npx firebase-tools deploy --only firestore:rules --project $projectId
Write-Host "      Rules deployed!" -ForegroundColor Green

Write-Host ""
Write-Host "[6/6] Open Authentication and enable Email + Google:" -ForegroundColor Yellow
Start-Process "https://console.firebase.google.com/project/$projectId/authentication/providers"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  DONE! Run start.bat" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
