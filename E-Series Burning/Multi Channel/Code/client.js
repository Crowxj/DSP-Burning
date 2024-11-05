const { ipcMain, webContents } = require('electron');
const net = require('net');//创建Tcp服务器和客户端
const fs = require('fs');//对文件系统的操作
const {showStatus } = require('./ipc_main');

module.exports = {
    closeTcpClient,SetupClient
}

//客户端参数
var client = null;

/**
 * 连接客户端
 */
function SetupClient(id, jsonURL) {
    if (client != null) {
        //上次连接未断开
        showStatus(`Last connection was not disconnected`);
        client.close();
        delete client;
        client = null;
        
    }

    fs.readFile(jsonURL, 'utf8', (err, data) => {
        if (err) {
            showStatus(`Error reading config file ${err}`);
            return;
        }
        try {
            // 解析 JSON 数据
            const config = JSON.parse(data).client;

            // 创建 TCP 客户端
            client = new net.Socket();

            // 连接服务器
            client.connect(config.port, config.host, () => {
                showStatus(`Connected to ${config.host}:${config.port}`);
            });

            // 监听数据接收
            client.on('data', (data) => {

            });
            // 监听连接关闭
            client.on('end', () => {
                showStatus(`Disconnect ${config.host}:${config.port}`);
            });

            // 监听错误事件
            client.on('error', (error) => {
                showStatus(`error ${error}`);
            });

        } catch (error) {
            showStatus(`Error parsing JSON: ${error}`);

        }

    });


}



/***
 * 关闭Tcp客户端
 */
function closeTcpClient() {
  
    if (client != null) {
        client.end();
        delete client;
        client = null;
        //关闭连接
        showStatus(`Connection closed`);
    }else{
        //未连接Tcp  请先连接TCP
        showStatus(` Currently not connected to TCP, please connect first`);
       
    }
}