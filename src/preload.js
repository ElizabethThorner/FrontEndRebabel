const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pythonApi", {
  getFile: (isMainFileSelect) =>
    ipcRenderer.invoke("selectFile", isMainFileSelect),
  rebabelConvert: (data) => ipcRenderer.invoke("rebabelConvert", data),
  openHelpWindow: (section) => ipcRenderer.send("openHelpWindow", section),
});
