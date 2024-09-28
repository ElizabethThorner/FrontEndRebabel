## Gap App - Senior Project (CIS4914)

### Group Members
- Joseph Barron: Backend Developer/Scrum Master 
- Adassa Coimin: Frontend/Backend Developer 
- Matthew Denslinger: Frontend Developer  
- Elizabeth Thorner: Backend Developer/Project Manager  
- Darren Wang: Frontend Developer


### Abstract 

Linguists use a variety of software tools to document endangered languages. They frequently need to move language data stored in one program into another, a process for which no automated and user-friendly tool exists. There is also no efficient way to import language data from the output of natural language processing (NLP) models into these software tools. The Gap App desktop application will enable linguists to convert between NLP output files and language data file formats used by software like Fieldworks Language Explorer (FLEx) and ELAN. The app will facilitate the speedy conversion between language data formats through an easy-to-use interface. 


### Help

run <code>npm install</code>

This repo requires a rebabel executable named main.exe in the main directory. If on a different operating system from windows, after putting the executable in, be sure to edit the name of the executable in main.js and forge.config.js to match your file. The electron application runs this executable from the command line along with an ACTION and a config.toml file. Right now, there are 2 working buttons: import and export. These buttons are hardcoded to run <code>./resources/main.exe import resources/config.toml</code> and <code>./resources/main.exe export resources/config.toml</code> respectively.

Use the command <code>npm run start</code> to run the app. Use the command <code>npm run make</code> to build.

If you build the app, you should find the electron-test executable at out/electron-test-[linux windows mac].


### Steps to create single file executable from rebabel_import_export.py using PyInstaller
1. Create and activate Python [virtual environment](https://docs.python.org/3/library/venv.html) in top level of FrontendGapApp folder. 
    - macOS commands
        - `python3 -m venv .venv`
        - `source .venv/bin/activate`
2. Run `pip install -r requirements.txt`
3. Change directory to 'rebabel_scripts'
4. Run `pyinstaller --onefile --collect-all rebabel_format rebabel_import_export.py`
5. The executable will be located in the 'dist' folder that is generated. The JavaScript looks for the executable in the top level of the 'rebabel_scripts' directory, so move the executable one directory up.