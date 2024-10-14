const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const { unlink } = require("node:fs");
const util = require("node:util");
const execFilePromisified = util.promisify(
  require("node:child_process").execFile
);

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
      properties: ["openFile", "multiSelections"],
    });

    //if user cancels
    if (filePathSelect == undefined) {
      return undefined;
    }

    let filePaths = [];
    let fileNames = [];

    //loops through selected files and adds to filePaths and fileNames arrays
    for (let i = 0; i < filePathSelect.length; i++) {
      filePaths.push(filePathSelect[i]);

      fileNames.push(path.basename(filePathSelect[i]));
    }

    //For initial single file selection
    //gets fileName from absolute path
    //const fileName = path.basename(filePath[0]);

    return { filePath: filePaths, fileName: fileNames };
  });

  ipcMain.handle("rebabelConvert", async (event, data) => {
    let conversionFailure = false;

    //Gets OS specific executable name
    const executableName = getExecutableName();

    // The arguments passed to execFile are hardcoded. They will be passed from the frontend once forms are present to receive input from the user.
    const { stdout, stderr } = await execFilePromisified(executableName, [
      "nlp_pos",
      "flextext",
      "/",
      "nlp_pos.txt",
      '{"mappings": [{"in_type": "sentence", "out_type": "phrase"},{"in_feature": "UD:upos", "out_feature": "FlexText:en:pos"},{"in_feature": "UD:form", "out_feature": "FlexText:en:txt"}]}',
    ]);

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

function getExecutableName() {
  //location and default name of executable
  const dirName = "./rebabel_scripts/";
  let executableName = "rebabel_convert";

  //checks if windows
  if (process.platform === "win32") {
    executableName = "rebabel_convert.exe";
  }

  return dirName + executableName;
}
