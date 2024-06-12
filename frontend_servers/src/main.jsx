import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import VSRC from './VideoSrc.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VSRC>
      <App />
    </VSRC>
  </React.StrictMode>,
)
