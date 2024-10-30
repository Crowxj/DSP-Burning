const { ipcMain, webContents } = require('electron');
const fs = require('fs');
const path = require('path');
module.exports = {
    read_configuration_json, Transmission,NOT_Transmission,Need_readDta
}
const { showStatus } = require("../ipc_main.js")
const { Enable_transparent_transmission,Close_Enable_transparent_transmission} = require("../client.js")





/**
 * 设置配置文件
 */
var jsonData;//存放参数
//读取JSON文件中的内容
function read_configuration_json(_event, file_path) {
    showStatus(`>>> Read the DSP port configuration file: ${file_path} content`);
    try {
        const data = fs.readFileSync(path.resolve(file_path), 'utf8');
        jsonData = JSON.parse(data); // 读取文件内容解析为JSON  
        showStatus(`>>> The configuration parameter content is  ${JSON.stringify(jsonData)}`);
        Need_readDta(jsonData);
        // return jsonData;
    } catch (error) {
        showStatus(`>>>  Error reading JSON file: ${error}`);
    }
}


function Need_readDta(neddData){
    jsonData==neddData;
    return jsonData
}

var Tran_Addr = [];//存放透传地址
/**
 * 开启透传
 */
//处理透传命令
function Transmission() {
    Tran_Addr = [];
    const Tran_data = jsonData.DSP_Config_Parameter;
    const Tran_data_length = Tran_data.length;//jsonData存放的参数个数  2个
    console.log(`Length of Tran_data: ${Tran_data_length}`);//打印长度  2
    console.log(Tran_data);
    const DSP_SportValues = Tran_data.map(item => item.DSP_Sport);//配置了[ 61001, 61002 ]2个端口
    console.log(DSP_SportValues);

    let Tran_Add_Data;
    if (DSP_SportValues.includes(61001)) {
        Tran_Add_Data = 128;
        Tran_Addr.push(Tran_Add_Data);
    } 
    if (DSP_SportValues.includes(61002)) {
        Tran_Add_Data = 129;
        Tran_Addr.push(Tran_Add_Data);
    } 
    if (DSP_SportValues.includes(61003)) {
        Tran_Add_Data = 130;
        Tran_Addr.push(Tran_Add_Data);
    } 
    if (DSP_SportValues.includes(61004)) {
        Tran_Add_Data = 131;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61005)) {
        Tran_Add_Data = 132;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61006)) {
        Tran_Add_Data = 133;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61007)) {
        Tran_Add_Data = 134;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61008)) {
        Tran_Add_Data = 135;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61009)) {
        Tran_Add_Data = 136;
        Tran_Addr.push(Tran_Add_Data);
    } 
     if (DSP_SportValues.includes(61010)) {
        Tran_Add_Data = 137;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61011)) {
        Tran_Add_Data = 138;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61012)) {
        Tran_Add_Data = 139;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61013)) {
        Tran_Add_Data = 140;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61014)) {
        Tran_Add_Data = 141;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61015)) {
        Tran_Add_Data = 142;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61016)) {
        Tran_Add_Data = 143;
        Tran_Addr.push(Tran_Add_Data);
    }
    // else {
    //     //无DSP端口配置信息
    //     showStatus(`>>> No DSP port configuration information available`);
    // }
    console.log('61001 is included', Tran_Addr);
    Tran_Addr.forEach(function(value, index) {
        // setTimeout(function() {
        //     console.log(`Index ${index}: Value ${value}`);
        //     Enable_transparent_transmission(value);
        // }, 2000); // 每次调用间隔1秒

        console.log(`Index ${index}: Value ${value}`);
        // setTimeout(Enable_transparent_transmission(value),1000)
        Enable_transparent_transmission(value);
    });
}

/**
 * 关闭透传
 */
function NOT_Transmission() {
    Tran_Addr = [];
    const Tran_data = jsonData.DSP_Config_Parameter;
    const Tran_data_length = Tran_data.length;//jsonData存放的参数个数  2个
    console.log(`Length of Tran_data: ${Tran_data_length}`);//打印长度  2
    console.log(Tran_data);
    const DSP_SportValues = Tran_data.map(item => item.DSP_Sport);//配置了[ 61001, 61002 ]2个端口
    console.log(DSP_SportValues);

    let Tran_Add_Data;
    if (DSP_SportValues.includes(61001)) {
        Tran_Add_Data = 128;
        Tran_Addr.push(Tran_Add_Data);
    } 
    if (DSP_SportValues.includes(61002)) {
        Tran_Add_Data = 129;
        Tran_Addr.push(Tran_Add_Data);
    } 
    if (DSP_SportValues.includes(61003)) {
        Tran_Add_Data = 130;
        Tran_Addr.push(Tran_Add_Data);
    } 
    if (DSP_SportValues.includes(61004)) {
        Tran_Add_Data = 131;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61005)) {
        Tran_Add_Data = 132;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61006)) {
        Tran_Add_Data = 133;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61007)) {
        Tran_Add_Data = 134;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61008)) {
        Tran_Add_Data = 135;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61009)) {
        Tran_Add_Data = 136;
        Tran_Addr.push(Tran_Add_Data);
    } 
     if (DSP_SportValues.includes(61010)) {
        Tran_Add_Data = 137;
        Tran_Addr.push(Tran_Add_Data);
    }
    if (DSP_SportValues.includes(61011)) {
        Tran_Add_Data = 138;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61012)) {
        Tran_Add_Data = 139;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61013)) {
        Tran_Add_Data = 140;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61014)) {
        Tran_Add_Data = 141;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61015)) {
        Tran_Add_Data = 142;
        Tran_Addr.push(Tran_Add_Data);
    }
     if (DSP_SportValues.includes(61016)) {
        Tran_Add_Data = 143;
        Tran_Addr.push(Tran_Add_Data);
    }
    // else {
    //     //无DSP端口配置信息
    //     showStatus(`>>> No DSP port configuration information available`);
    // }
    console.log('61001 is included', Tran_Addr);
    Tran_Addr.forEach(function(value, index) {
        // setTimeout(function() {
        //     console.log(`Index ${index}: Value ${value}`);
        //     Enable_transparent_transmission(value);
        // }, 2000); // 每次调用间隔1秒

        console.log(`Index ${index}: Value ${value}`);
        // setTimeout(Enable_transparent_transmission(value),1000)
        Close_Enable_transparent_transmission(value);
    });


}