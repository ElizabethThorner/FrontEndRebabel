const { app, Menu, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const { unlink } = require("node:fs");
const { execFileSync } = require("node:child_process");
const createMenuTemplate = require("./menu");
const fs = require("fs");

const userDataPath = app.getPath("userData");
const rebabelConvertPath = path.join(process.resourcesPath, "rebabel_convert");
const tempdbPath = path.join(userDataPath, "temp.db");
const isDev = !app.isPackaged;
const FileExtensions = {
  flextext: ".flextext",
  conllu: ".conllu",
  elan: ".eaf",
  nlp_pos: ".txt",
};
let helpOpen = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createHelpWindow = (section) => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    resizable: true,
    minWidth: 900,
    minHeight: 768,
    icon: "src/icon.png",
  });

  let filePath = "HelpDocumentation/";

  if (section === "main") {
    filePath += "index.html";
  } else if (section === "import") {
    filePath += "importing.html";
  } else if (section === "export") {
    filePath += "exporting.html";
  } else if (section === "mappings") {
    filePath += "mappings.html";
  } else {
    filePath += "index.html";
  }

  if (!isDev) {
    filePath = path.join(process.resourcesPath, filePath);
  } else {
    filePath = "./src/" + filePath;
  }

  mainWindow.loadFile(filePath);
  mainWindow.setMenu(null);

  mainWindow.on("close", () => {
    helpOpen = !helpOpen;
  });
};

const createWindow = () => {
  // Create browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    resizable: true,
    minWidth: 900,
    minHeight: 768,
    icon: "src/icon.png",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.on("close", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Create and set menu bar
  const menuTemplate = createMenuTemplate(isDev);
  insertHelpWindow(menuTemplate);
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // clear database if it exists before app starts
  if (fs.existsSync(tempdbPath)) {
    try {
      fs.unlinkSync(tempdbPath);
      console.log(
        `The temp.db SQLite database was found at ${tempdbPath} and has been deleted.`
      );
    } catch (err) {
      console.error(
        `Unable to remove the temp.db SQLite database at ${tempdbPath}: ${err}`
      );
    }
  }

  ipcMain.handle("selectFile", async (event, isMainFileSelect) => {
    let filePathSelect;
    let fileNames;

    if (isMainFileSelect) {
      filePathSelect = dialog.showOpenDialogSync({
        filters: [
          {
            name: "Allowed File Types",
            extensions: [
              "txt",
              "flextext",
              "csv",
              "eaf",
              "conllu",
              "sfm",
              "xml",
            ],
          },
        ],
        properties: ["openFile", "multiSelections"],
      });
    } else {
      filePathSelect = dialog.showOpenDialogSync({
        filters: [
          {
            name: "ELAN template file type",
            extensions: ["etf"],
          },
        ],
        properties: ["openFile"],
      });
    }

    //if user cancels
    if (filePathSelect == undefined) {
      return undefined;
    }

    if (isMainFileSelect) {
      const fileName = [];

      for (let filePath of filePathSelect) {
        fileName.push(path.basename(filePath));
      }

      fileNames = fileName;
    } else {
      //gets fileName from absolute path
      const fileName = path.basename(filePathSelect[0]);

      fileNames = fileName;
    }

    return { filePath: filePathSelect, fileName: fileNames };
  });

  ipcMain.handle("rebabelConvert", async (event, data) => {
    let outPutFileNamePath = "";

    let returnData = {
      success: false,
      message: "An unexpected error occurred!",
    };

    //calls saveAs dialog if fileName and output file type aren't empty
    if (data.fileName.length === 0 || data.outFileType === "") {
      return { success: false, message: "empty" };
    } else {
      outPutFileNamePath = initiateSaveAs(data);
    }

    //user cancels saveAs
    if (outPutFileNamePath === "cancelled") {
      return { success: false, message: "cancelled" };
    }

    // get arguments from input forms
    const { filePath, inFileType, outFileType, mappings, additionalArguments } =
      data;

    let buffer = "";
    try {
      buffer = execFileSync(rebabelConvertPath, [
        inFileType,
        outFileType,
        filePath,
        outPutFileNamePath,
        JSON.stringify(mappings),
        JSON.stringify(additionalArguments),
        tempdbPath,
      ]);
      const saveAsFileName = path.basename(outPutFileNamePath);
      returnData = { success: true, convertedFileName: saveAsFileName };
    } catch (err) {
      const cleanedErrorMessage = cleanErrorMessage(err);
      returnData = { success: false, message: cleanedErrorMessage };
    }

    unlink(tempdbPath, (err) => {
      if (err) {
        //Perhaps add something here for a return
        console.error(`Error removing the temp.db SQLite database.`);
      } else {
        console.log(`The temp.db SQLite database has been removed.`);
      }
    });

    return returnData;
  });

  ipcMain.on("openHelpWindow", (event, section) => {
    if (!helpOpen) {
      createHelpWindow(section);
      helpOpen = true;
    }
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

function cleanErrorMessage(error) {
  const errorString = error.stderr.toString();
  const beginOfValueError = errorString.indexOf("ValueError:");
  const beginOfBrackets = errorString.indexOf("[", beginOfValueError);

  return errorString.substring(beginOfValueError, beginOfBrackets);
}

function insertHelpWindow(menuTemplate) {
  for (let item in menuTemplate) {
    //Help Entry in Menu bar
    if (menuTemplate[item].label === "Help") {
      for (let index in menuTemplate[item].submenu) {
        //Help entry in Help drop down
        if (menuTemplate[item].submenu[index].label === "Help") {
          menuTemplate[item].submenu[index].click = () => {
            if (!helpOpen) {
              createHelpWindow("main");
              helpOpen = true;
            }
          };
        }
      }
    }
  }
}
