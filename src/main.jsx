// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 1. Import Bootstrap CSS (Bạn đã có)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. THÊM DÒNG NÀY: Import Bootstrap JS (Bundle)
// Nó sẽ tự động xử lý tất cả các sự kiện như click menu, dropdown,...
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 3. Import file CSS tùy chỉnh (Bạn đã có)
import './assets/css/style.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)