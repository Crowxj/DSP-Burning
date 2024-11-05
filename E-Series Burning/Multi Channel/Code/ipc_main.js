const { ipcMain } = require('electron');
module.exports = {
    setWindow,showStatus,showValue,showValue2
}
const {SetupClient,closeTcpClient}=require("./client.js")
const { dialog } = require('electron');


var mainWindow = null;
function setWindow(theWindow) {
    mainWindow = theWindow;
}

ipcMain.on('Buttoned', async (event, id) => {
    console.log(`ipc =Buttoned ${id}`);
    switch (id) {
        case 1:
            closeTcpClient(id);//关闭客户端
            break;
    }
});

ipcMain.on('toMain2', async (event, id, data) => {
    console.log(`ipc =toMain2 ${id}, ${data}`);
    switch (id) {
        case 1:
            SetupClient(id,data);//传入一个路径
            break;
    }
});

ipcMain.on('toMain3', async (event, id, d1, d2) => {

});



function showStatus(value) {
    if (mainWindow != null) {
        mainWindow.webContents.send('status_update', value);
    }
}
function showValue(id, value) {
    if (mainWindow != null) {
        mainWindow.webContents.send('multi_data', id, value);
    }
}

function showValue2(id, value1, value2) {
    if (mainWindow != null) {
        mainWindow.webContents.send('multi_data2', id, value1, value2);
    }
}


/**
 * 选择json文件
 */
ipcMain.on('btn-json', (_event) => {
    dialog.showOpenDialog(mainWindow, {
        title: 'Open JSON File',
        properties: ['openFile'],
        filters: [
            { name: 'JSON', extensions: ['json'] }
        ]
    }).then(result => {
        if (result.canceled == false) {
            json_file = result.filePaths[0];
            if (json_file != null) {
                mainWindow.webContents.send('json-file', json_file);
            }
        }
    }).catch(err => {
        console.log(err);
    });
});