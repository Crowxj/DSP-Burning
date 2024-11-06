/*预先加载*/
document.addEventListener("DOMContentLoaded", () => {
     const device_upgrade = document.getElementById("device_upgrade");
     device_upgrade.style.backgroundColor = "#f1f1f1";
     // 设置设备升级按钮为不可点击状态
     device_upgrade.style.pointerEvents = 'none';
});
/*最小化窗口*/
const device_upgrade_minimize = document.getElementById("device_upgrade_minimize");
device_upgrade_minimize.addEventListener("click", () => {
     window.TheIPC.ButtonPressed(1);
});
/*关闭窗口*/
const device_upgrade_close = document.getElementById("device_upgrade_close");
device_upgrade_close.addEventListener("click", () => {
     window.TheIPC.ButtonPressed(2);
});
const device_set = document.getElementById("device_set");
device_set.addEventListener("click", () => {
     //跳转到设备管理页面
     let PAGE = "device_set.html";
     window.TheIPC.toMain2(1, PAGE)
});


