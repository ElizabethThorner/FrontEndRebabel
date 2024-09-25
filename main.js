const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const execFile = require("node:child_process").execFile;
let {PythonShell} = require('python-shell')

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

  ipcMain.handle('runPython', async (event, someArgument) => {
    const result = await PythonShell.run('hello_world.py', null)
    return result;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
