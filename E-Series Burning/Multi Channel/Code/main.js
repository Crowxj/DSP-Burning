
const {app, BrowserWindow} = require('electron')
var { setWindow,showStatus,showValue,showValue2} = require('./ipc_main.js')
const path = require('path')

var mainWindow = undefined;
function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // mainWindow.setMenu(null);
  mainWindow.loadFile('index.html')

}

app.whenReady().then(() => {
  createMainWindow(mainWindow)
  setWindow(mainWindow)

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


