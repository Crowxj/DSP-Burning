
/**
 * 关闭页面
 * closePage_btn
 */
const closePage_btn = document.getElementById("closePage_btn");
closePage_btn.addEventListener("click", () => {
    window.close();//页面关闭
});
/**
 * 最小化界面
 */
const minimizePage_btn = document.getElementById("minimizePage_btn");
minimizePage_btn.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(2);
});
/**
 * 操作指南下载
 * downloadManual_btn
 */
const downloadManual_btn = document.getElementById("downloadManual_btn");
downloadManual_btn.addEventListener("click", () => {
    const Manual = document.getElementById("Manual");//操作指南
    Manual.click();
});

/**
 * TCP operation
 * 选择json文件
 */
const chooseTcpFileBtn = document.getElementById("chooseTcpFileBtn");
chooseTcpFileBtn.addEventListener("click", () => {
    window.TheIPC.toMain('btn-json');
});
/**
 * 在input显示路径地址
 */
const TcpfileInput = document.getElementById("TcpfileInput");
var TcpfileInputValue = TcpfileInput.value;
window.TheIPC.onJsonFile((text) => {
    TcpfileInput.value = text.toString();
    TcpfileInputValue = TcpfileInput.value;
});
/**
 * 关闭Tcp客户端
 */
const closeconnectTcp_btn = document.getElementById("closeconnectTcp_btn");
closeconnectTcp_btn.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(1);
});
/**
 * 连接客户端
 */
const connectTcp_btn = document.getElementById('connectTcp_btn');
connectTcp_btn.addEventListener('click', () => {
    window.TheIPC.toMain2(1, TcpfileInputValue);
})


/**
 * DSP operation
 */
const dspConFileBtn=document.getElementById("dspConFileBtn");
dspConFileBtn.addEventListener("click", () => {
    window.TheIPC.toMain('btn-json2');//读取json配置文件
});

const DspConFileInput=document.getElementById("DspConFileInput");
var DspConFileInputValue = DspConFileInput.value;
window.TheIPC.onJsonFile2((text) => {
    DspConFileInput.value = text.toString();
    DspConFileInputValue = DspConFileInput.value;
});
//读取josn文件中的值
const ConFile_takebtn=document.getElementById("ConFile_takebtn");
ConFile_takebtn.addEventListener("click", () => {
    if(DspConFileInputValue!=""){
        window.TheIPC.toMain2(2,DspConFileInputValue);
        console.log("读取成功",DspConFileInputValue);
    }else{
        console.log("请先选择json文件");
    }
});

/**
 * 选择DSP.HEX文件
 */
const chooseDspFileBtn = document.getElementById("chooseDspFileBtn");
chooseDspFileBtn.addEventListener("click", () => {
    window.TheIPC.toMain('btn-dsp');
});
/**
 * 显示文件路径
 */
const DspfileInput = document.getElementById("DspfileInput");//显示hex文件框
var DspfileInputValue = DspfileInput.value;
window.TheIPC.onDspFile((text) => {
    DspfileInput.value = text.toString();
    DspfileInputValue = DspfileInput.value;
})

/**
 * 透传
 */
const StartPass_btn=document.getElementById("StartPass_btn");
StartPass_btn.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(3);
});

/**
 * 关闭透传
 */
const classPass_btn=document.getElementById("classPass_btn");
classPass_btn.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(4);
});



/**
 * 操作显示
 */
const statusBar = document.getElementById('status_bar');
const displayData = document.getElementById('displayData');//滚动条
const thisTD = '<tr><td style = "width: 100%;">';
window.TheIPC.onStatus((text) => {
    statusBar.innerHTML += thisTD + text.toString() + '</td></tr>';
    //滚动条到最底端
    displayData.scrollTop = displayData.scrollHeight;
});


/**
 * 进入烧录模式
 */

const btn_mode=document.getElementById("btn_mode");
btn_mode.addEventListener("click", () => {
  window.TheIPC.ButtonPressed(5);
});



/**
 * 擦除扇区
 */
const btn_erase=document.getElementById("btn_erase");
btn_erase.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(7);
});
/**
 * 烧写文件
 */

const btn_start=document.getElementById("btn_start");
btn_start.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(8);
});

/**
 * 重启
 */
const sendrestart=document.getElementById("sendrestart");
sendrestart.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(6);
});
