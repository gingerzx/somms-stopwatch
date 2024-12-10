const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 768,
        height: 500,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('src/index.html');
    win.setMenuBarVisibility(false);


    win.webContents.on('context-menu', (e, params) => {
   
        win.webContents.send('show-custom-menu', params.x, params.y);
    });

  
    ipcMain.on('go-back', () => {
        win.loadFile('src/index.html');
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
