
const { app, BrowserWindow } = require('electron')
var { setWindow, showStatus, showValue, showValue2 } = require('./ipc_main.js')
const path = require('path')

const { init_can } = require('./CAN.js');

var mainWindow = undefined;
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, //允许远程模块使用
      // contextIsolation: false,
      enableRemoteModule: true,

    }
  })

  // mainWindow.setMenu(null);
  mainWindow.loadFile('index.html')

}

app.whenReady().then(() => {
  createMainWindow(mainWindow)
  setWindow(mainWindow);
  setTimeout(() => {
    init_can();
  }, 200);

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


