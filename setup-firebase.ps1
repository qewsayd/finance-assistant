# Firebase setup for Finance Assistant
$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\nodejs;" + $env:Path

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== Firebase Setup ===" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example" -ForegroundColor Yellow
}

Write-Host "Steps in Firebase Console:"
Write-Host "  1. Open https://console.firebase.google.com/"
Write-Host "  2. Create or select a project"
Write-Host "  3. Authentication - enable Email/Password and Google"
Write-Host "  4. Firestore Database - create database"
Write-Host "  5. Project settings - Your apps - Web - copy config"
Write-Host ""

$apiKey = Read-Host "VITE_FIREBASE_API_KEY"
$authDomain = Read-Host "VITE_FIREBASE_AUTH_DOMAIN"
$projectId = Read-Host "VITE_FIREBASE_PROJECT_ID"
$storageBucket = Read-Host "VITE_FIREBASE_STORAGE_BUCKET"
$messagingSenderId = Read-Host "VITE_FIREBASE_MESSAGING_SENDER_ID"
$appId = Read-Host "VITE_FIREBASE_APP_ID"

$envContent = @"
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
VITE_FIREBASE_APP_ID=$appId
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host ""
Write-Host ".env saved!" -ForegroundColor Green
Write-Host ""

$deploy = Read-Host "Deploy firestore.rules now? (y/n)"
if ($deploy -eq "y") {
    npx firebase-tools login
    npx firebase-tools use $projectId
    npx firebase-tools deploy --only firestore:rules
}

Write-Host ""
Write-Host "Done! Restart the app: npm run dev" -ForegroundColor Green
Write-Host ""
