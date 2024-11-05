/*最小化窗口*/
const device_set_minimize=document.getElementById("device_set_minimize");
device_set_minimize.addEventListener("click",()=>{
     window.TheIPC.ButtonPressed(1);
});
/*关闭窗口*/
const device_set_close=document.getElementById("device_set_close");
device_set_close.addEventListener("click",()=>{
     window.TheIPC.ButtonPressed(2);
});

