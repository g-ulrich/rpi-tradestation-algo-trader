const { app } = require('electron');
const Window = require('./window');

app.whenReady().then(() => {
  const window = new Window();
  window.create();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

