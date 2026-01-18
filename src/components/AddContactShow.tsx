import "../App.css"
import { useEffect, useState } from "react";
import QRCode_show from 'qrcode'
import { Link } from 'react-router-dom';
/* webhint-enable no-inline-styles */
const AddContactShow = ({ text = 'hello' }) => {

    console.log('add contact show');

    const [svg, setSvg] = useState('');
    const [scale, setScale] = useState(1); // 缩放比例

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
                className="center-xy"
                style={{
                    width: 128,
                    height: 128,


                    transform: `scale(${scale})`,
                }}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
            {/* 缩放滑块 */}
            <div style={{ margin: '20px 0' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                    缩放: {scale.toFixed(1)}倍
                </label>
                <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={scale}
                    aria-label="缩放"
                    onChange={(e) => setScale(parseFloat(e.target.value))}

                />
                <button
                    onClick={() => setScale(1)}
                    style={{ marginLeft: '15px', padding: '5px 10px' }}
                >
                    重置
                </button>
            </div>
        </div>
    );
}
/* webhint-enable no-inline-styles */
export default AddContactShow;