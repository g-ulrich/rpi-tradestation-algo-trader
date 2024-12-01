const { BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

class Window {
    constructor(width, height){
        this.w = width || 800;
        this.h = height || 800;
        this.mainWindow;
        this.indexPath = path.join(__dirname, '/renderer/index.html');
        this.iconPath = path.join(__dirname, '/images/icon.png');
        this.preloadPath = path.join(__dirname, 'preload.js');
    }

    initIpc(){
        //  // tradestation
        // ipcMain.on('getRefreshToken', async (event, _) => {
        //     const tokenObj = await tsAuth.triggerRefresh();
        //     event.reply('sendRefreshToken', {ts: tokenObj});
        // });
        // ipcMain.on('getNewAccessToken', async (event, _) => {
        //     const tokenObj = await tsAuth.getNewAccessToken();
        //     event.reply('sendNewAccessToken', {ts: tokenObj});
        // });

        // WINDOW
        ipcMain.on('minimize-window', () => {
            if (this.mainWindow) {
                this.mainWindow.minimize();
            }
        });
    
        ipcMain.on('maximize-window', () => {
            if (this.mainWindow) {
                if (this.mainWindow.isMaximized()) {
                    this.mainWindow.restore();
                } else {
                    this.mainWindow.maximize();
                }
            }
        });
        
        ipcMain.on('close-window', () => {
            if (this.mainWindow) {
                this.mainWindow.close();
            }
        });
    }
    
    create() {
      this.initIpc();
      this.mainWindow = new BrowserWindow({
        icon: this.iconPath,
        width: this.w,
        height: this.h,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: this.preloadPath
        },
        frame: false,
      });
      this.mainWindow.loadFile(this.indexPath);
      // mainWindow.webContents.openDevTools()
    }

  }


  module.exports = Window;