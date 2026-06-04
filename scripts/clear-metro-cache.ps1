# Clears Metro / Expo caches (project + %TEMP%) — fixes EMFILE on Windows.
$ErrorActionPreference = "SilentlyContinue"

$projectRoot = Split-Path -Parent $PSScriptRoot
$temp = [System.IO.Path]::GetTempPath()

Write-Host "Clearing Metro caches..."

Remove-Item -Recurse -Force (Join-Path $projectRoot ".expo") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force (Join-Path $projectRoot ".metro-cache") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force (Join-Path $projectRoot "node_modules\.cache") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force (Join-Path $projectRoot "dist") -ErrorAction SilentlyContinue

# Legacy %TEMP% caches (Uniwind used to force these; still clean up stale dirs)
Get-ChildItem -Path $temp -Filter "metro-cache*" -ErrorAction SilentlyContinue |
  ForEach-Object { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue }

Get-ChildItem -Path $temp -Filter "metro-file-map*" -ErrorAction SilentlyContinue |
  ForEach-Object { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue }

Get-ChildItem -Path $temp -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like "metro-file-map-expo-*" } |
  ForEach-Object { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue }

Get-ChildItem -Path (Join-Path $projectRoot "node_modules") -Filter ".babel-preset-expo-*" -Directory -ErrorAction SilentlyContinue |
  ForEach-Object { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue }

Write-Host "Done. Caches removed from project and TEMP."
