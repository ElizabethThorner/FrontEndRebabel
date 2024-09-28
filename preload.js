const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("py", {
  fireText: (data) => ipcRenderer.invoke("testText", [data]),
  rebabelImportExport: () => ipcRenderer.invoke('rebabelImportExport').then(result => result)
});