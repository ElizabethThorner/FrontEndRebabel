### reBabel

reBabel is a desktop application built with Electron.js that helps linguists convert between language data file formats they use in their research. The application uses the [rebabel-format](https://github.com/mr-martian/rebabel-format) package to convert between file formats like ELAN, flextext, and CoNLL-U. Details about the application's architecture can be found in the Docs folder.

### Run in Development Mode
1. Clone the repository from GitHub:
    - `git clone https://github.com/ElizabethThorner/FrontEndRebabel.git`
2. Install the necessary Node.js packages for reBabel:
    - `npm install`
3. Generate the **rebabel_convert** executable:
    - `npm run rebabel_convert`
4. Start the application in development mode:
    - `npm run start`

### Troubleshooting
- Issues with the virtual environment
    - If your virtual environment is corrupted, you may need to manually delete the **rebabel_scripts/.venv** folder and run `npm run rebabel_convert` to create a new one
- Issues with the rebabel_convert executable
    - Follow the instructions in **rebabel_scripts/README.md** to generate the rebabel_convert executable manually

### Installation 

The installation package files can be found on the [GitHub Releases](https://github.com/ElizabethThorner/FrontEndRebabel/releases) page. 

![Screen Shot 2024-11-23 at 11 11 46 AM](https://github.com/user-attachments/assets/18742676-8500-4565-a03b-7c437ea27b58)

- #### Mac 
  - zip folder

https://github.com/user-attachments/assets/c6f9fcc4-7cbc-4c31-b89d-6f3a4a64a186

- #### Linux (Debian-based distributions only)
  - .deb package

https://github.com/user-attachments/assets/8a2e8899-2cf1-421b-a0fd-76f046e0b421

- #### Windows 
  - .Setup.exe

https://github.com/user-attachments/assets/564b73ed-9eaa-42bd-aee8-db6f99e1a3e2
