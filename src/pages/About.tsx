import React from 'react';
import '../App.css';

const About: React.FC = () => {
  return (
    <div className="container">
      <h1>About Myapp</h1>
      <p>Myapp is a cross-platform desktop application built with Tauri and React.</p>

      <h2>Features</h2>
      <ul>
        <li>Barcode scanning capabilities</li>
        <li>Command-line interface support</li>
        <li>System operations using OS, Shell, and Opener plugins</li>
        <li>QR code generation</li>
        <li>Modern UI with React 19</li>
      </ul>

      <h2>Technology Stack</h2>
      <p>Myapp utilizes:</p>
      <ul>
        <li>Tauri framework for secure native functionality</li>
        <li>Rust backend for performance and safety</li>
        <li>React 19 for modern frontend development</li>
        <li>Vite as the build tool</li>
        <li>TypeScript for type safety</li>
      </ul>

      <h2>License</h2>
      <p>This project is licensed under AGPL-3.0.</p>

      {/* Removed iframe due to security concerns - loading local .md files can lead to XSS */}
      <h2>Documentation</h2>
      <p>For detailed documentation, please check the README file in the project repository.</p>

      <hr />

      <section aria-labelledby="personal-links">
        <h2 id="personal-links">Personal Links</h2>
        <p>Learning and testing purposes - for test and study use</p>
        <p>Thanks to these tutorials:</p>
        <ul>
          <li><a href="https://www.runoob.com/" target="_blank" rel="noopener noreferrer">菜鸟教程</a></li>
          <li><a href="https://mdn.org.cn/en-US/" target="_blank" rel="noopener noreferrer">MDN Web Docs</a></li>
          <li><a href="https://www.rustwiki.org.cn/" target="_blank" rel="noopener noreferrer">Rust中文教程</a></li>
        </ul>

        <h3>My Profile:</h3>
        <img src="./mylife.jpg" width="250" height="auto" alt="Personal photo" />
        <p>
          <a href="https://space.bilibili.com/3494362084280927/" target="_blank" rel="noopener noreferrer" title="Bilibili account">
            Bilibili Account
          </a> Consider supporting me 🥰
        </p>
        <ul>
          <li><a href="https://github.com/BirthAndDeath" target="_blank" title="GitHub Profile" rel="noopener noreferrer">GitHub Profile</a></li>
          <li><a href="https://github.com/BirthAndDeath/myapp-p2pchat" target="_blank" title="GitHub Repository" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>

      </section>
    </div>
  );
};

export default About;