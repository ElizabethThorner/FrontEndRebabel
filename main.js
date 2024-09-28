const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require('fs');
const util = require('node:util');
const execFile = util.promisify(require("node:child_process").execFile);
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
  ipcMain.handle("testText", (event, value) => {
    return new Promise((resolve, reject) => {
      execFile(
        "./resources/main.exe",
        [`${value}`, "resources/config.toml"],
        (error, stdout, stderror) => {
          if (error) {
            console.log(error);
          }
          resolve(stdout ? stdout : stderror);
        }
      );
    });
  });

  ipcMain.handle('rebabelImportExport', async (event, someArgument) => {
    const result = await execFile(
      "./rebabel_import_export",
      ["nlp_pos", "flextext", "/", "nlp_pos.txt", '{"mappings": [{"in_type": "sentence", "out_type": "phrase"},{"in_feature": "UD:upos", "out_feature": "FlexText:en:pos"},{"in_feature": "UD:form", "out_feature": "FlexText:en:txt"}]}'],
    );

    console.log("File conversion has taken place.")

    fs.unlink("./temp.db", (err) => {
      if (err) {
        console.error(`Error removing the temp.db SQLite database.`);
      } else {
        console.log(`The temp.db SQLite database has been successfully removed.`);
      }
    });
    return result;
  })

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

});
