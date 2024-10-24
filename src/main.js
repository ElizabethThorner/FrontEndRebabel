const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const { unlink } = require("node:fs");
const util = require("node:util");
const execFilePromisified = util.promisify(
  require("node:child_process").execFile
);

const FileExtensions = {
  flextext: ".flextext",
  conllu: ".conllu",
  elan: ".eaf",
  nlp_pos: ".txt",
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    resizable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("selectFile", async () => {
    const filePathSelect = dialog.showOpenDialogSync({
      properties: ["openFile"],
    });

    //if user cancels
    if (filePathSelect == undefined) {
      return undefined;
    }

    //gets fileName from absolute path
    const fileName = path.basename(filePathSelect[0]);

    return { filePath: filePathSelect, fileName: fileName };
  });

  ipcMain.handle("rebabelConvert", async (event, data) => {
    let conversionFailure = false;
    let outPutFileNamePath = "";

    //calls saveAs dialog if fileName and output file type aren't empty
    if (data.fileName.length === 0 || data.outFileType === "") {
      return "error";
    } else {
      outPutFileNamePath = initiateSaveAs(data);
    }

    //user cancels
    if (outPutFileNamePath === "cancelled") {
      return "cancelled";
    }

    const {
      filePath,
      fileName,
      inFileType,
      outFileType,
      delimiter,
      nlpFileType,
      partOfSpeechFile,
      languageFile,
      mappings,
      root,
      skip,
    } = data;

    // The arguments passed to execFile are hardcoded. They will be passed from the frontend once forms are present to receive input from the user.
    const { stdout, stderr } = await execFilePromisified(
      "./rebabel_scripts/rebabel_convert",
      [
        inFileType,
        outFileType,
        filePath,
        outPutFileNamePath,
        nlpFileType,
        partOfSpeechFile,
        languageFile,
        delimiter,
        JSON.stringify(mappings),
        root,
        skip,
      ]
    );

    if (stderr) {
      console.log(error); // This is temporary minimum error handling.
      conversionFailure = true;
    } else {
      console.log("The file conversion process completed.");
    }

    unlink("./temp.db", (err) => {
      if (err) {
        console.error(`Error removing the temp.db SQLite database.`);
        conversionFailure = true;
      } else {
        console.log(`The temp.db SQLite database has been removed.`);
      }
    });

    return conversionFailure;
  });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function initiateSaveAs(data) {
  //Calls a function to create initial output fileName for SaveAs dialog
  //I.e. takes an infile abc.inExt and turns into abc.outExt
  let outputFileName = setOutputFileName(data);

  //Gets absolute path
  let outputFileNamePath = dialog.showSaveDialogSync({
    defaultPath: outputFileName,
  });

  //user cancels SaveAs
  if (outputFileNamePath === undefined) {
    return "cancelled";
  }

  return outputFileNamePath;
}

//Takes an input FileName and creates a default fileName
//Ex: file1.eaf => file1.flextext
function setOutputFileName(data) {
  let inputFileName = data.fileName[0];

  let extension = path.extname(inputFileName);
  let nameBeforePeriod = path.basename(inputFileName, extension);

  let outputFileType = data.outFileType;

  let outputFileName = nameBeforePeriod + FileExtensions[outputFileType];

  return outputFileName;
}
