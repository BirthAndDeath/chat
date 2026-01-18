import { scan, Format } from '@tauri-apps/plugin-barcode-scanner';
import { BrowserQRCodeReader } from '@zxing/browser'
import { platform } from '@tauri-apps/plugin-os';
import AddContact from "./AddContact"
import { Link } from 'react-router-dom';
const scancode = async () => {

    let Scanresult;

    if (platform() === 'android' || platform() === 'ios') {

        Scanresult = await scan({ windowed: true, formats: [Format.QRCode] });


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
                    Scanresult = result.getText();
                } else {
                    console.error('扫描结果无效');
                }
            } else if (error) {

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
        AddContact(Scanresult);

    };

}
const AddContactScan = () => {

    console.log('add contact scan');

    return (

        <div>
            <Link to="/show">
                <button> show qrcode</button>
            </Link>
            <div>
                <p></p>
                <button aria-label="scan qrcode 扫二维码" onClick={async () => {
                    const result = await scancode();
                    console.log(result);
                }}> <p>"scan qrcode 扫二维码"</p ></button>

            </div>
        </div >
    );
}
export default AddContactScan;