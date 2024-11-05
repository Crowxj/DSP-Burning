/**
 * 选择json文件
 */
const chooseTcpFileBtn=document.getElementById("chooseTcpFileBtn");
chooseTcpFileBtn.addEventListener("click",()=>{
    window.TheIPC.toMain('btn-json');
});
/**
 * 在input显示路径地址
 */
const TcpfileInput=document.getElementById("TcpfileInput");
var TcpfileInputValue = TcpfileInput.value;
window.TheIPC.onJsonFile((text) => {
    TcpfileInput.value = text;
    TcpfileInputValue = TcpfileInput.value;
});
/**
 * 关闭Tcp客户端
 */
const closeconnectTcp_btn=document.getElementById("closeconnectTcp_btn");
closeconnectTcp_btn.addEventListener("click",()=>{
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
 * ；数据显示
 */
const statusBar = document.getElementById('status_bar');
const displayData = document.getElementById('displayData');

const thisTD = '<tr><td style = "width: 100%;">';

window.TheIPC.onStatus((text) => {
   
    statusBar.innerHTML += thisTD + text.toString() + '</td></tr>';
    displayData.scrollTop = displayData.scrollHeight;
    
});