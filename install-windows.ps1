param(
    [string]$Python = "python"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".venv")) {
    & $Python -m venv .venv
}

$pip = Join-Path $PSScriptRoot ".venv\Scripts\pip.exe"
& $pip install --upgrade pip
& $pip install -r requirements.txt
& $pip install -e .

Write-Host ""
Write-Host "Готово. Запускайте run-liverse.cmd или .venv\Scripts\liverse.exe"
