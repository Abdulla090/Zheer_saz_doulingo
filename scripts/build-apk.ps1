# Build Android APK via EAS (Expo Application Services)
# Usage:
#   .\scripts\build-apk.ps1
#   .\scripts\build-apk.ps1 -Profile production
#
# Auth (pick one):
#   eas login
#   $env:EXPO_TOKEN = "<token from https://expo.dev/settings/access-tokens>"

param(
    [ValidateSet("preview", "production")]
    [string]$Profile = "preview",

    [switch]$Wait
)

$ErrorActionPreference = "Stop"

function Ensure-EasCli {
    $easCmd = Get-Command eas -ErrorAction SilentlyContinue
    if ($easCmd) { return $easCmd.Source }
    Write-Host "Installing eas-cli globally (one-time)..."
    npm install -g eas-cli@latest
    return (Get-Command eas).Source
}

Ensure-EasCli | Out-Null

if (-not $env:EXPO_TOKEN) {
    Write-Host "Checking Expo account..."
    eas whoami 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Not logged in. Run one of:"
        Write-Host "  eas login"
        Write-Host '  $env:EXPO_TOKEN = "your-access-token"'
        Write-Host ""
        Write-Host "Create a token: https://expo.dev/settings/access-tokens"
        exit 1
    }
}

$args = @(
    "build",
    "--platform", "android",
    "--profile", $Profile,
    "--non-interactive"
)

if (-not $Wait) {
    $args += "--no-wait"
}

Write-Host "Starting EAS build (profile: $Profile, output: APK)..."
Push-Location $PSScriptRoot\..
try {
    eas @args
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host ""
    Write-Host "Build queued. Open https://expo.dev/accounts/abdulla001/projects/duolingo-clone/builds to download the APK."
}
finally {
    Pop-Location
}
