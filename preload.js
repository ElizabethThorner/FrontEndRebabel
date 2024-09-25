const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("py", {
  fireText: (data) => ipcRenderer.invoke("testText", [data]),
  runPython: () => ipcRenderer.invoke('runPython').then(result => result)
});