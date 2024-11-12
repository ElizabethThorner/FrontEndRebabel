cd rebabel_scripts

Write-Host "Activating Python virtual environment..."
& ".venv\Scripts\Activate.ps1"

Write-Host "Creating executable from rebabel_convert.py..."
python -m PyInstaller --onefile --collect-all rebabel_format rebabel_convert.py

Write-Host "Deactivating Python virtual environment..."
