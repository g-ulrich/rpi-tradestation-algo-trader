const { BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const {TSAuthentication} = require('./tradestation/authentication');


class Window {
    constructor(width, height){
        this.w = width || 480;
        this.h = height || 320;
        this.mainWindow;
        this.indexPath = path.join(__dirname, '/renderer/index.html');
        this.iconPath = path.join(__dirname, '/images/icon.png');
        this.preloadPath = path.join(__dirname, 'preload.js');
        this.tsAuth = new TSAuthentication();

    }

    initIpc(){
         // tradestation
        ipcMain.on('getRefreshToken', async (event, _) => {
            const tokenObj = await this.tsAuth.triggerRefresh();
            event.reply('sendRefreshToken', {ts: tokenObj});
        });
        ipcMain.on('getNewAccessToken', async (event, _) => {
            const tokenObj = await this.tsAuth.getNewAccessToken();
            event.reply('sendNewAccessToken', {ts: tokenObj});
        });

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
        fullscreen: process.platform.includes('win') ? false : true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            sandbox: false,
            preload: this.preloadPath,
            csp: false,
        },
        frame: false,
        contentSecurityPolicy: "script-src 'self' 'unsafe-inline'; object-src 'self'"

      });
      this.mainWindow.loadFile(this.indexPath);
      // mainWindow.webContents.openDevTools()
    }

  }


  module.exports = Window;