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
