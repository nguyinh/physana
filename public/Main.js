const {
  app,
  BrowserWindow
} = require('electron');

function createWindow() {
  // Create the browser window.  
  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.webContents.openDevTools();

  win.loadURL('http://localhost:3000/');
}

app.on('ready', createWindow);