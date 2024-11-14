const { BrowserWindow, app, dialog, shell } = require("electron");

//menu elements that are created when app run in development mode
const getDevMenu = (isDev) => {
  if (!isDev) return [];
  return [
    {
      label: "Reload",
      accelerator: "CmdOrCtrl+R",
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.reload();
        }
      },
    },
    {
      label: "Force Reload",
      accelerator: "CmdOrCtrl+Shift+R",
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.webContents.reloadIgnoringCache();
        }
      },
    },
    {
      label: "Toggle Developer Tools",
      accelerator: "CmdOrCtrl+I",
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.webContents.toggleDevTools();
        }
      },
    },
    { type: "separator" },
  ];
};

const createMenuTemplate = (isDev) => {
  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          role: "quit",
        },
      ],
    },
    {
      label: "View",
      submenu: [
        ...getDevMenu(isDev),
        {
          label: "Zoom In",
          accelerator: "CmdOrCtrl+Plus",
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.setZoomLevel(
                focusedWindow.webContents.getZoomLevel() + 0.5
              );
            }
          },
        },
        {
          label: "Zoom Out",
          accelerator: "CmdOrCtrl+-",
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.setZoomLevel(
                focusedWindow.webContents.getZoomLevel() - 0.5
              );
            }
          },
        },
        {
          label: "Reset Zoom",
          accelerator: "CmdOrCtrl+0",
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.setZoomLevel(0);
            }
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Documentation",
          click: () => {
            shell.openExternal(
              "https://github.com/mr-martian/rebabel-format/blob/master/docs/README.md"
            );
          },
        },
        { type: "separator" },
        {
          label: "Help",
          accelerator: "CmdOrCtrl+H",
          click: "",
        },
        {
          label: "About",
          click: "",
        },
      ],
    },
  ];

  return menuTemplate;
};

module.exports = createMenuTemplate;
