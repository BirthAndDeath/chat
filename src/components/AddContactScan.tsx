import { scan, Format } from '@tauri-apps/plugin-barcode-scanner';
import { BrowserQRCodeReader } from '@zxing/browser'
import { platform } from '@tauri-apps/plugin-os';

import { Link } from 'react-router-dom';
const AddContactScan = () => {
    let message = 'not set';
    let result;
    if (platform() === 'android' || platform() === 'ios') {
        result = scan({ windowed: true, formats: [Format.QRCode] });
    } else {
        const codeReader = new BrowserQRCodeReader();
        // 显示加载状态
        console.log('正在启动摄像头进行二维码扫描...');

        codeReader.decodeFromVideoDevice(undefined, 'video', (result, error) => {
            if (error && error.name === 'NotFoundException') return;
            if (result) {
                console.log(result);
                // 验证result和result.text是否存在，防止潜在错误
                if (result && result.getText()) {
                    message = result.getText();//调试用
                } else {
                    console.error('扫描结果无效');
                }
            } else if (error) {
                message = error.message;
                console.error('二维码扫描失败:', error);
                // 根据不同类型的错误给出更具体的反馈
                if (error.name === 'NotAllowedError') {
                    console.error('用户未授权访问摄像头');
                } else if (error.name === 'NotFoundError') {
                    console.error('找不到可用的摄像头设备');
                } else if (error.name === 'NotSupportedError') {
                    console.error('当前环境不支持摄像头访问');
                } else if (error.name === 'StreamApiNotSupportedError') {
                    console.error('浏览器不支持流API');
                } else {
                    console.error('其他错误:', error);
                }
            }
        });

    };
    console.log('add contact scan');
    return (

        <div>
            <Link to="/show">
                <button> show qrcode</button>
            </Link>
            <div>
                <p> {message}</p>

            </div>
        </div >
    );
}
export default AddContactScan;