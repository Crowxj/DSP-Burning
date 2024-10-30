module.exports = { burning_file,burning_state_machine };
const fs = require("fs");
const readline = require('node:readline');
const path = require('path');
const {showStatus}=require("./ipc_main");

var dsp_code=null;//存放烧写文件内容
var line=null;//文件内容的行数组
function burning_state_machine(data) {

}

function  burning_file(dsp){//dsp为路径
    if(dsp==null){//请先选择要烧写的的文件
        showStatus(`>>> Please select the file to burn first`);
        return;
    }else{
        //已选择要烧写的文件dsp
        showStatus(`>>> Selected file to burn ${dsp}`);
        //读取DSP配置文件的完整内容
        dsp_code=fs.re
        console.log("burning_file",dsp);
    }


}