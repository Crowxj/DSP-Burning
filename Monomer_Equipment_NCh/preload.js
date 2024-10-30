const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld('TheIPC', {

    ButtonPressed: (btn) => ipcRenderer.send('Buttoned', btn),
    toMain: (name) => ipcRenderer.send(name),
    toMain2: (id, data) => ipcRenderer.send('toMain2', id, data),
    toMain3: (id, d1, d2) => ipcRenderer.send('toMain3', id, d1, d2),


    
    onStatus: (callback) => ipcRenderer.on('status_update', (_event, status) => callback(status)),//
    onMultiData: (callback) => ipcRenderer.on('multi_data', (_event, id, val) => callback(id, val)),//
    onMultiData2: (callback) => ipcRenderer.on('multi_data2', (_event, id, val1, val2) => callback(id, val1, val2)),
    
    //json文件选择
    onJsonFile: (callback) => ipcRenderer.on('json-file', (_event, value) => callback(value)),
    onJsonFile2: (callback) => ipcRenderer.on('json-file2', (_event, value) => callback(value)),
    //选择dsp文件
    onDspFile: (callback) => ipcRenderer.on('dsp-file', (_event, value) => callback(value)),

});
