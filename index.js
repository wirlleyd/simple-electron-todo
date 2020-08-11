const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true } })
  mainWindow.loadURL(`file://${__dirname}/views/main.html`);
  mainWindow.on('close', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    width: 300,
    height: 200,
    title: "Add new Todo"
  });
  addWindow.loadURL(`file://${__dirname}/views/add.html`);
  addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, value) => {
  mainWindow.webContents.send('todo:add', value);
  addWindow.close();
})

const isOsxPlatform = process.platform === 'darwin';
const isProduction = process.env.NODE_ENV === 'prod';

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Clear Todo",
        click() {
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: "Quit",
        accelerator: isOsxPlatform
          ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (isOsxPlatform) {
  menuTemplate.unshift({})
}

if (!isProduction) {
  menuTemplate.push({
    label: "DEVELOPER",
    submenu: [
      {
        role: "reload"
      },
      {
        label: "Toggle Developer Tools",
        accelerator: isOsxPlatform ? "Command+Alt+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}