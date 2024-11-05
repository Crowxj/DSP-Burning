/*预先加载*/
document.addEventListener("DOMContentLoaded", () => {
    const device_set = document.getElementById("device_set");
    device_set.style.backgroundColor = "#f1f1f1";
    // 设置设备设置按钮为不可点击状态
    device_set.style.pointerEvents = 'none';
});
/*最小化窗口*/
const device_set_minimize = document.getElementById("device_set_minimize");
device_set_minimize.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(1);
});
/*关闭窗口*/
const device_set_close = document.getElementById("device_set_close");
device_set_close.addEventListener("click", () => {
    window.TheIPC.ButtonPressed(2);
});
/* 设备升级界面*/
const device_upgrade = document.getElementById("device_upgrade");
device_upgrade.addEventListener("click", () => {
    //跳转到设备升级页面
    let PAGE = "device_upgrade.html";
    window.TheIPC.toMain2(1, PAGE)
});

/*选中json文件*/
const chooseTcpFileBtn= document.getElementById("chooseTcpFileBtn");
chooseTcpFileBtn.addEventListener("click", () => {
    window.TheIPC.toMain('btn-json');
});

/*显示TCP配置文件路径*/
const TcpfileInput= document.getElementById("TcpfileInput");
var TcpfileInputValue=TcpfileInput.value;
window.TheIPC.onJsonFile((text)=>{
    TcpfileInput.value=text;
    TcpfileInputValue=TcpfileInput.value;
})
