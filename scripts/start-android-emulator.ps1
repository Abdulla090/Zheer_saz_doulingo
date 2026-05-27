$ErrorActionPreference = "Stop"

$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot

Write-Host "Checking Android emulator/device..."
$devices = adb devices | Select-String "device$" | Where-Object { $_ -notmatch "List of devices" }
if (-not $devices) {
  Write-Error "No Android emulator or device found. Start the emulator in Android Studio first."
  exit 1
}

Write-Host "Setting up port forwarding (emulator localhost -> PC localhost)..."
adb reverse --remove-all 2>$null
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8082 tcp:8082
adb reverse --list

Write-Host ""
Write-Host "Starting Expo on localhost (port 8081)..."
Write-Host ""
Write-Host "After Metro starts:"
Write-Host "  - Dev build app: press R twice in emulator, or shake -> Reload"
Write-Host "  - If still blue screen: shake -> Change bundle location -> http://localhost:8081"
Write-Host "  - Expo Go: open Expo Go app manually (SDK 56 required for this project)"
Write-Host ""

$env:REACT_NATIVE_PACKAGER_HOSTNAME = "localhost"
$env:EXPO_DEV_SERVER_HOST = "localhost"

$enableMcp = $false
$forwardArgs = @()
foreach ($arg in $args) {
  if ($arg -eq "mcp") {
    $enableMcp = $true
  } else {
    $forwardArgs += $arg
  }
}

if ($enableMcp) {
  $env:EXPO_UNSTABLE_MCP_SERVER = "1"
}

# Do not pass --android: it tries to auto-install Expo Go and can fail on emulators.
npx expo start --localhost @forwardArgs
