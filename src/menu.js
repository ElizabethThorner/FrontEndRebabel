const { BrowserWindow, app, dialog, shell } = require("electron");

const createMenuTemplate = (isDev) => {
  const menuTemplate = [
  {
    label: 'File',
    submenu: [
    {
      label: 'Exit',
      role: 'quit',
    }],
  },
  {
    label: 'View',
    submenu: [
    {
      label: 'Zoom In',
      accelerator: 'CmdOrCtrl+Plus',
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.webContents.setZoomLevel(
            focusedWindow.webContents.getZoomLevel() + 0.5
          );
        }
      }
    },
    {
      label: 'Zoom Out',
      accelerator: 'CmdOrCtrl+-',
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.webContents.setZoomLevel(
            focusedWindow.webContents.getZoomLevel() - 0.5
          );
        }
      }
    },
    {
      label: 'Reset Zoom',
      accelerator: 'CmdOrCtrl+0',
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.webContents.setZoomLevel(0);
        }
      }
    },
    { type: 'separator' },
    ...(isDev ? [{
      label: 'Toggle Developer Tools',
      accelerator: 'CmdOrCtrl+I',
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.webContents.toggleDevTools();
        }
      }
    }] : [])],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Getting Started',
        click: () => {
          dialog.showMessageBox({
            type: 'info',
            title: 'Getting Started',
            message: 'Getting Started',
            detail: `1. Select the file(s) to be converted.\n` +
                    `2. Choose the desired input and output file formats.\n` +
                    `3. Configure mappings or additional settings, if applicable.\n` +
                    `4. Click "Convert" and specify the destination for the converted file.`,
            buttons: ['OK'],
          });
        },
      },
      {
        label: 'Documentation',
        click: () => {
          shell.openExternal('https://github.com/mr-martian/rebabel-format/blob/master/docs/README.md');
        },
      },
      { type: 'separator' },
      {
        label: 'About',
        click: () => {
          dialog.showMessageBox({
            type: 'info',
            title: 'About reBabel',
            message: `reBabel (Version: ${app.getVersion()})`,
            detail: `Welcome to reBabel!\n` +
                    `\n` +
                    `This tool is designed to simplify file format conversions between various language data files. ` +
                    `reBabel currently supports conversions between the following formats: \n` +
                    `- ELAN (.eaf)\n` +
                    `- Fieldworks Language Explorer (.flextext)\n` +
                    `- Universal Dependencies (.conllu)\n` +
                    `- Natural Language Processing (.txt)\n` +
                    `\n` +
                    `Team Members:\n` +
                    `- Joseph Barron: Backend Developer/Scrum Master\n` +
                    `- Adassa Coimin: Frontend/Backend Developer\n` +
                    `- Matthew Denslinger: Frontend Developer\n` +
                    `- Elizabeth Thorner: Backend Developer/Project Manager\n` +
                    `- Darren Wang: Frontend Developer`,
            buttons: ['OK'],
          });
        },
      },
    ],
  }];

  return menuTemplate;
};

module.exports = createMenuTemplate;
