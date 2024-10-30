const { ipcMain } = require('electron');
module.exports = {
    setWindow, showStatus, showValue, showValue2
}
const { SetupClient, closeTcpClient } = require("./client.js")
const { dialog } = require('electron');
const { read_configuration_json, Transmission, NOT_Transmission } = require("./readfile/read_json_file.js");
const { turn_dsp_to_burn, send_restart, erase_sector } = require('./CAN.js');
const {burning_file}=require('./burning.js');

var mainWindow = null;
var dsp_file = null;
function setWindow(theWindow) {
    mainWindow = theWindow;
}

ipcMain.on('Buttoned', async (event, id) => {
    let operate;
    switch (id) {
        case 1:
            closeTcpClient();//关闭客户端
            break;
        case 2://最小化界面
            operate = "最小化窗口";
            mainWindow.minimize();
            break;
        case 3://开启透传
            operate = "开启透传"
            Transmission();
            break;
        case 4://关闭透传
            operate = "关闭透传"
            NOT_Transmission();
            break;
        case 5://进入烧写模式
            operate = "进入烧写模式"
            turn_dsp_to_burn();
            break;
        case 6://重启
            operate = "重启"
            send_restart();
            break;
        case 7:
            operate = "清除扇区"
            erase_sector();
            break;
        case 8:
            operate = "烧写文件"
            burning_file(dsp_file)
            break;


    }
    console.log(`ipc =Buttoned ${id},${operate}`);
});

ipcMain.on('toMain2', async (event, id, data) => {
    console.log(`ipc =toMain2 ${id}, ${data}`);
    switch (id) {
        case 1:
            SetupClient(id, data);//传入一个路径，连接客户端
            break;
        case 2:
            read_configuration_json(id, data);//传入一个路径，读取配置文件中的内容
            break;
        // case 3:
        //     burning_file(dsp_file)
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
                //读文件显示
                mainWindow.webContents.send('json-file', json_file);
                showStatus(`>>> Read TCP File: ${json_file}`);
            }
        }
    }).catch(err => {
        console.log(err);
        showStatus(`>>> ${err}`);
    });
});



ipcMain.on('btn-json2', (_event) => {
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
                //读文件显示
                mainWindow.webContents.send('json-file2', json_file);
                showStatus(`>>> Read TCP File: ${json_file}`);
            }
        }
    }).catch(err => {
        console.log(err);
        showStatus(`>>> ${err}`);
    });
});


/**
 * 选择dsp文件
 */
ipcMain.on('btn-dsp', (_event) => {
    dialog.showOpenDialog(mainWindow, {
        Title: 'Open DSP program file',
        properties: ['openFile'],
        filters: [
            { name: 'HEX', extensions: ['hex'] }]
    }).then(result => {
        if (result.canceled == false) {
            dsp_file = result.filePaths[0];
            console.log(`dsp_file: ${dsp_file}`);
            if (dsp_file != null) {
                mainWindow.webContents.send('dsp-file', dsp_file);

                //读取dsp文件
                showStatus(`>>> Read Dsp File: ${dsp_file}`);
            }
        }
    })
        .catch(err => {
            console.log(err);
            showStatus(`>>> ${err}`);
        });
});

