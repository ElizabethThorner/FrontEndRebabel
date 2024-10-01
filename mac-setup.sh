#!/bin/bash
cd rebabel_scripts
python3 -m venv .venv
/bin/bash ".venv/bin/activate"
pip install -r requirements.txt
python -m PyInstaller --onefile --collect-all rebabel_format rebabel_convert.py
cd dist
mv rebabel_convert.exe ..