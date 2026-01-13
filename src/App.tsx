import './App.css';

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";

import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import "./App.css";
import { scan, Format } from '@tauri-apps/plugin-barcode-scanner';
import QRCode_show from 'qrcode'
import QRCode_scan, { BrowserQRCodeReader } from '@zxing/browser'
import viteUrl from '/vite.svg'
import tauriUrl from '/tauri.svg'
import myappUrl from '/myapp.svg'
import { platform } from '@tauri-apps/plugin-os';
import Chatpage from './pages/Chatpage'
import About from './pages/About'; // 导入新创建的About组件

const AddContactShow = ({ text = 'hello' }) => {
  const navigate = useNavigate();//hook
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
const AddContactScan = () => {
  const navigate = useNavigate();
  let result;
  if (platform() === 'android' || platform() === 'ios') {
    result = scan({ windowed: true, formats: [Format.QRCode] });
  } else {
    const codeReader = new BrowserQRCodeReader();

  };
  console.log('add contact scan');
  return (

    <div>
      <Link to="/show">
        <button> show qrcode</button>
      </Link>
      <div>
        <p>add successfully</p>
      </div>
    </div >
  );
}

const Home = () => {

  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <h1><strong>Welcome to Tauri + React - Myapp</strong></h1>
      <p></p>
      <div className="row">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteUrl} className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noopener noreferrer">
          <img src={tauriUrl} className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <Link to="/about">
          <img src={myappUrl
          } className="logo myapp" alt="Myapp logo" sizes='120%' />
        </Link>

      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      {/* 应用程序路由配置：定义了主页("/")和关于页面("/about")的路由规则 */}
      {/* 使用嵌套路由，根路径"/"渲染Layout组件，其中包含导航和子路由出口 */}

    </main>)
}



const Layout = () => {
  const navigate = useNavigate();

  const goback = () => navigate(-1);
  const goforward = () => navigate(1);
  return (
    <>
      <nav>
        <button onClick={() => navigate("/")} aria-label="Home"><Icon icon="mdi-light:home" /></button>
        <button onClick={goback} aria-label="Go back">&lt;</button>
        <button onClick={goforward} aria-label="Go forward">&gt;</button>
        <Link to="/">Home</Link> | <Link to="/Chatpage">Chat</Link> | <Link to="/show">add condact</Link>
      </nav >
      <hr />
      <Outlet />          {/* 子路由渲染点 */}
      <Link to="/about">About</Link> | <>Licensed under AGPL-3.0</>
    </>
  )
}
const Contacts = <h2>Contacts</h2>

import { Menu } from '@tauri-apps/api/menu';
async function exitApp() {
  //todo : 退出app功能实现，用于后台退出
  await invoke('exit_app');
}
async function app_init() {


  const menu = await Menu.new({
    items: [
      {
        id: 'settings',
        text: 'Settings',
        action: () => {
          console.log('settings pressed');

        },
      },
    ],
  });

  // 如果某个窗口未显式创建菜单，或者未显式设置菜单，那么此菜单也将被分配给它。
  menu.setAsAppMenu().then((res) => {
    console.log('menu set success', res);
  });
}

function App() {

  app_init();

  return (<Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="Chatpage" element={<Chatpage />} />
      <Route path="show" element={<AddContactShow />} />
      <Route path="scan" element={<AddContactScan />} />
      <Route path="about" element={<About />} /> {/* 添加About页面路由 */}
    </Route>
  </Routes>


  );
}

export default App;