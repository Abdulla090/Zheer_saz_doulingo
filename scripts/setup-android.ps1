$sdkPath = $env:ANDROID_HOME
if (-not $sdkPath) {
  $sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
}

if (-not (Test-Path $sdkPath)) {
  Write-Error "Android SDK not found. Install Android Studio or set ANDROID_HOME."
  exit 1
}

$escaped = $sdkPath -replace '\\', '\\'
$content = "sdk.dir=$escaped"
$outFile = Join-Path $PSScriptRoot "..\android\local.properties"
Set-Content -Path $outFile -Value $content -Encoding ASCII
Write-Host "Wrote android/local.properties -> $sdkPath"
