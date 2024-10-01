### Steps to create the single file executable from rebabel_convert.py using PyInstaller
1. `cd rebabel_scripts` 
2. Create and activate Python [virtual environment](https://docs.python.org/3/library/venv.html). 
    - macOS commands
        - `python3 -m venv .venv`
        - `source .venv/bin/activate`
    - Windows commands 
        - `python -m venv .venv`
        - `.venv\Scripts\activate.bat`
3. Run `pip install -r requirements.txt`
4. Run `python -m PyInstaller --onefile --collect-all rebabel_format rebabel_convert.py`
5. The executable will be located in the 'dist' folder that is generated. The JavaScript looks for the executable in the top level of the 'rebabel_scripts' directory, so move the executable one directory up.
6. The executable will run by clicking the 'Convert' button on the user interface after running `npm run start`.