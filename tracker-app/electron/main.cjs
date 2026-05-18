const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Check if we are in dev mode by looking at an env var (which we'll inject via scripts if needed)
  // For the compiled release, we just explicitly load the built index.html from dist
  win.loadFile(path.join(__dirname, '../dist/index.html'));
  
  // Optionally open DevTools
  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS it's common for apps to stay open until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
