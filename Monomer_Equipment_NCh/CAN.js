module.exports = {
    init_can, turn_dsp_to_burn, send_restart, erase_sector
}
const { showStatus } = require("./ipc_main.js")
const dgram = require('dgram');// 引入UDP模块
const { Need_readDta } = require('./readfile/read_json_file.js');
var sock = null;
const { burning_state_machine } = require('./burning.js');
const { crc16_2, } = require('./crc16.js');

var canID = 0x001; // CAN ID设置canid
var send_buf = new Uint8Array(69);//设置一个69字节长度的无符号整数数组，存储要发送的数据
var send_dv = new DataView(send_buf.buffer);//对send_buf进行字节级操作
var remote_ip = '192.168.1.134';//远程设备的ip地址，设置网络的时候用这个
var fid = 0x400 + canID;//fid是0401，canid是上面设置的
var isDspInBurningMode = false;//判断dsp是否处于烧录模式
var erase_sec_id = 1;//表示要擦出的扇区
var m_remote_port = 0;//远程端口，dps默认61001
var m_remote_channel = 0;//当前通道号
var burn_buffer=null;//储存烧录数据的缓冲区
var burn_len = 0;//烧录的数据的长度
var flash_addr = 0;//烧录的地址 
var flash_idx = 0;//烧录的索引

var sector_name = null;//扇区名







function init_can() {
    //初始化UDP套接字
    if (sock == null) {
        sock = dgram.createSocket('udp4');
        if (sock == null) {
            return -1;
        }
    }
    sock.bind(50000);//绑定到50009端口，这里是本机端口

    sock.on('message', function (msg, rinfo) {
        var m_state = msg[5];//监听
        switch (m_state) {
            case 0xe7:
                isDspInBurningMode = true;//进入烧录状态
                showStatus(`>>> Verification successful`);//返回报文
                break;
            case 0xe8://扇区擦除，这里运行了七次，因为28335擦出了七个扇区。
                if ((msg[6] == 0) && (msg[7] == 0) && (msg[8] == 0)) {
                    if (erase_sec_id < 8) {
                        return erase_sector();
                    }
                    return showStatus(`>>> Sector erase failed`);//扇区擦除成功
                }
                showStatus(`>>> Sector erase failed`);//扇区擦除失败
                break;
            case 0xe6://内存写入
                if (msg[8] == 0) {
                    let crc = msg.readUInt16BE(6);
                    let this_crc = crc16_2(burn_buffer, burn_len);
                    if (crc == this_crc)
                        return send_burn_cmd();
                    else
                        showStatus(`>>> RxCRC= ${crc.toString(16)} LxCRC = ${this_crc.toString(16)}`);
                }
                break;//状态码为0xe6时，如果消息的第8个字节为0，则计算接收到的消息的CRC值并与本地计算的CRC值进行比较，如果相等则发送烧写命令，否则显示两个CRC值。
            case 0xe9://烧录完成
                if (msg[6] == 0) {
                    showStatus(`>>> Burn successfully`);
                    burning_state_machine();
                }
                break;//状态码为0xe9时，如果消息的第6个字节为0，则显示“烧写成功”并调用burning_state_machine函数。
        }

    });

}


//将所有进入烧录模式
function turn_dsp_to_burn() {
    const needData = Need_readDta();
    const burn_ModeData = needData.DSP_Config_Parameter;//存放模式的数据
    // console.log("burn_ModeData:", burn_ModeData,burn_ModeData.length);//长度为1
    if (needData == null || needData == undefined) {
        //选择配置文件后，请先读取设置的参数值
        showStatus(`>>> After selecting the configuration file, please first read the parameter values set`);
    } else {
        for (let i = 0; i < burn_ModeData.length; i++) {//element存的是两个端口
            const element = burn_ModeData[i];
            //  console.log(`第${i+1}个配置：`, element);
            m_remote_port = element.DSP_Sport;
            // console.log(`第${i+1}个配置的端口：`, m_remote_port);
            //配置的通道
            const Channelkeys = Object.keys(element.DSP_Channel[0]);
            const channelNum = Channelkeys.length;
            console.log(`第${i + 1}个配置的通道个数：`, channelNum);
            for (let j = 1; j <= channelNum; j++) {
                const key = `Channel_${j}`;
                m_remote_channel = Number(element.DSP_Channel[0][key]);
                console.log(`进入烧录模式_端口号：${m_remote_port},设置了通道：${key},通道为${m_remote_channel}`);
                showStatus(`>>> Enter burning mode, Port：${m_remote_port},Channel has been set up：${key},Start channel${m_remote_channel}`);
                canID = m_remote_channel;
                fid = m_remote_channel + 0x400; //算出fid的值，在是canid加上0x400 
                send_buf[0] = 8;//send_buf[0]被设为8，命令的长度前缀
                send_dv.setUint32(1, fid);//设置fid的值
                send_buf[5] = 0xe7;//将send_buf的第5个字节设置为0xe7
                // setTimeout(function () {
                sock.send(send_buf, 0, 69, m_remote_port, remote_ip);//buffer，位置0，位置69，端口，ip地址
                showStatus(`>>> Send verification command ${send_buf}`);
                // }, 4000); 
            }

        }
    }

}
/**
 * 清除扇区
 */
//擦除指定扇区（sec_id）的数据
function erase_sector() {
    const needData = Need_readDta();
    const clear_SectorData = needData.DSP_Config_Parameter;//存放模式的数据
    // console.log("burn_ModeData:", burn_ModeData,burn_ModeData.length);//长度为1
    if (needData == null || needData == undefined) {
        //选择配置文件后，请先读取设置的参数值
        showStatus(`>>> After selecting the configuration file, please first read the parameter values set`);
    } else {
        for (let i = 0; i < clear_SectorData.length; i++) {//element存的是两个端口
            const element = clear_SectorData[i];
            //  console.log(`第${i+1}个配置：`, element);
            m_remote_port = element.DSP_Sport;
            // console.log(`第${i+1}个配置的端口：`, m_remote_port);
            //配置的通道
            const Channelkeys = Object.keys(element.DSP_Channel[0]);
            const channelNum = Channelkeys.length;
            console.log(`第${i + 1}个配置的通道个数：`, channelNum);
            for (let j = 1; j <= channelNum; j++) {
                const key = `Channel_${j}`;
                m_remote_channel = Number(element.DSP_Channel[0][key]);
                console.log(`清除扇区_端口号：${m_remote_port},设置了通道：${key},通道为${m_remote_channel}`);
                showStatus(`>>> Clear sector, Port：${m_remote_port},Channel has been set up：${key},Start channel${m_remote_channel}`);
                const sec_id = 1;
                erase_sec_id = sec_id + 1;//表示要擦出的扇区
                //canID = m_remote_channel;
                fid = m_remote_channel + 0x400;
                send_buf[0] = 8;//send_buf[0]被设为8，命令的长度前缀。
                send_dv.setUint32(1, fid);//使用DataView对象send_dv，在缓冲区索引1开始的4字节处设置fid的值，用于指定目标功能或命令
                send_buf[5] = 0xe8;//send_buf[5]设置为e8，擦除指令
                send_buf[6] = erase_sec_id;//起始扇区
                send_buf[7] = erase_sec_id + 0x40;//结束标记
                send_buf[8] = 0x17;//起始扇区地址，这块我也不清楚，可以看看协议，规定的17,是什么
                send_dv.setUint32(9, 1 << sec_id);//在缓冲区索引9开始的4字节处，使用位操作设置一个值（1 << sec_id）
                sock.send(send_buf, 0, 69, m_remote_port, remote_ip);//发送，和上面一样，这里不说了
                showStatus(`>>> Send sector clearing command ${send_buf}`);
                switch (sec_id) {
                    case 0:
                        sector_name = 'A';
                        break;
                    case 1:
                        sector_name = 'B';
                        break;
                    case 2:
                        sector_name = 'C';
                        break;
                    case 3:
                        sector_name = 'D';
                        break;
                    case 4:
                        sector_name = 'E';
                        break;
                    case 5:
                        sector_name = 'F';
                        break;
                    case 6:
                        sector_name = 'G';
                        break;
                    case 7:
                        sector_name = 'H';
                        break;
                    default:
                        showStatus(`>>> Erasing sector failed, and is in Port：${m_remote_port},Channel has been set up：${key},Start channel${m_remote_channel},${sector_name}sector`);
                }
                showStatus(`>>> Request to erase the sector ${sector_name}`);
            }
        }
    }

}
/**
 * 发送烧录命令
 */
function send_burn_cmd() {
    const needData = Need_readDta();
    const burn_cmdData = needData.DSP_Config_Parameter;//存放重启的数据
    console.log("burn_cmdData:", burn_cmdData, burn_cmdData.length);//长度为1
    if (needData == null || needData == undefined) {
        //选择配置文件后，请先读取设置的参数值
        showStatus(`>>> After selecting the configuration file, please first read the parameter values set`);
    } else {
        for (let i = 0; i < restart_ModeData.length; i++) {//element存的是两个端口
            const element = restart_ModeData[i];
            //  console.log(`第${i+1}个配置：`, element);
            m_remote_port = element.DSP_Sport;
            // console.log(`第${i+1}个配置的端口：`, m_remote_port);
            //配置的通道
            const Channelkeys = Object.keys(element.DSP_Channel[0]);
            const channelNum = Channelkeys.length;
            console.log(`第${i + 1}个配置的通道个数：`, channelNum);
            for (let j = 1; j <= channelNum; j++) {
                flash_addr = 0;
                burn_len = 0;

                const key = `Channel_${j}`;
                m_remote_channel = Number(element.DSP_Channel[0][key]);
                console.log(`进入烧录_端口号：${m_remote_port},设置了通道：${key},通道为${m_remote_channel}`);
                showStatus(`>>> Enter to send burning, Port：${m_remote_port},Channel has been set up：${key},Start channel${m_remote_channel}`);
                canID = m_remote_channel
                fid = m_remote_channel + 0x400;
                // 这里利用setUint32方法存储无符号32位整数，用于指定命令或目标标识
                // 使用DataView对象send_dv设置send_buf中从索引1开始的4个字节为fid值，
                send_dv.setUint32(1, fid);
                // 设置烧录的起始地址到send_buf中的相应位置，flash_addr为烧录操作的起始内存地址
                send_dv.setUint32(5, flash_addr);
                // 设置特定命令代码或标志到send_buf的第5个字节，这里使用0xe9可能代表烧录命令或相关控制码
                send_buf[5] = 0xe9;
                // 计算实际烧录数据的长度（burn_len/2是因为数据是以字节为单位，需要以半字即16位为单位发送）
                // 然后将该长度设置到send_buf的第9和第10字节位置
                send_dv.setUint16(9, burn_len / 2);
                sock.send(send_buf, 0, 69, m_remote_port, remote_ip);
                showStatus(`>>> Send burning command ${send_buf}`);
                showStatus(`>>> Burn address${flash_addr.toString(16)}`);
            }
        }

    }

}


/**
 * 开始烧写
 */
function burn_buf(){
    
}

//重启DSP
function send_restart() {
    const needData = Need_readDta();
    const restart_ModeData = needData.DSP_Config_Parameter;//存放重启的数据
    console.log("restart_ModeData:", restart_ModeData, restart_ModeData.length);//长度为1
    if (needData == null || needData == undefined) {
        //选择配置文件后，请先读取设置的参数值
        showStatus(`>>> After selecting the configuration file, please first read the parameter values set`);
    } else {
        for (let i = 0; i < restart_ModeData.length; i++) {//element存的是两个端口
            const element = restart_ModeData[i];
            //  console.log(`第${i+1}个配置：`, element);
            m_remote_port = element.DSP_Sport;
            // console.log(`第${i+1}个配置的端口：`, m_remote_port);
            //配置的通道
            const Channelkeys = Object.keys(element.DSP_Channel[0]);
            const channelNum = Channelkeys.length;
            console.log(`第${i + 1}个配置的通道个数：`, channelNum);
            for (let j = 1; j <= channelNum; j++) {
                const key = `Channel_${j}`;
                m_remote_channel = Number(element.DSP_Channel[0][key]);
                console.log(`进入重启模式_端口号：${m_remote_port},设置了通道：${key},通道为${m_remote_channel}`);
                showStatus(`>>> Enter restart mode, Port：${m_remote_port},Channel has been set up：${key},Start channel${m_remote_channel}`);
                canID = m_remote_channel
                fid = m_remote_channel + 0x400;
                send_buf[0] = 1;
                send_dv.setUint32(1, fid);
                send_buf[5] = 0xea;
                sock.send(send_buf, 0, 69, m_remote_port, remote_ip);
                showStatus(`>>> Send restart command ${send_buf}`);

            }
        }
    }
}
