
import { useEffect, useState } from "react";
import QRCode_show from 'qrcode'
import { Link } from 'react-router-dom';
const AddContactShow = ({ text = 'hello' }) => {

    console.log('add contact show');

    const [svg, setSvg] = useState('');

    useEffect(() => {
        QRCode_show.toString(text, { type: 'svg', width: 128, margin: 1 })
            .then(setSvg)
            .catch(console.error);
    }, [text]);


    // 使用dangerouslySetInnerHTML安全地渲染SVG内容
    return (
        <div>
            <Link to="/scan">
                <button> scan qrcode</button>
            </Link>
            <p>{text}</p>
            <div
                style={{ width: 128, height: 128 }}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
}
export default AddContactShow;