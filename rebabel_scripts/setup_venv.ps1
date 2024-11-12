cd rebabel_scripts

Write-Host "Creating Python virtual environment (this may take a while)..."
python -m venv .venv

Write-Host "Activating Python virtual environment..."
& ".venv\Scripts\Activate.ps1"

Write-Host "Installing dependencies in requirements.txt..."
pip install -r requirements.txt

Write-Host "Deactivating Python virtual environment..."
