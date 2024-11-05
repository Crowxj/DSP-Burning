
const { app, BrowserWindow } = require('electron')
var { setWindow, showStatus, showValue, showValue2 } = require('./ipc_main.js')
const path = require('path')

var mainWindow = undefined;
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,//设置界面全屏显示
    frame:false,//不需要框架
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.setMenu(null);//移除主窗口菜单栏
  mainWindow.loadFile('device_set.html')

}

app.whenReady().then(() => {
  createMainWindow(mainWindow);
  setWindow(mainWindow);
  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


