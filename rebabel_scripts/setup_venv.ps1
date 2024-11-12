cd rebabel_scripts

Write-Host ""
Write-Host "--------------------------------------"
Write-Host "Creating Python virtual environment..."
Write-Host "--------------------------------------"
Write-Host ""
python -m venv .venv

Write-Host ""
Write-Host "----------------------------------------"
Write-Host "Activating Python virtual environment..."
Write-Host "----------------------------------------"
Write-Host ""
& ".venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "----------------------------------------------"
Write-Host "Installing dependencies in requirements.txt..."
Write-Host "----------------------------------------------"
Write-Host ""
pip install -r requirements.txt
