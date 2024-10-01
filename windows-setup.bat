cd rebabel_scripts
python -m venv .venv
call ".venv/Scripts/activate.bat"
pip install -r requirements.txt
python -m PyInstaller --onefile --collect-all rebabel_format rebabel_convert.py
cd dist
move rebabel_convert.exe ..