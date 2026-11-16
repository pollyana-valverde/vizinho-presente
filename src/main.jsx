import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ProvedorAvisos from './components/ProvedorAvisos'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProvedorAvisos>
        <App />
      </ProvedorAvisos>
    </BrowserRouter>
  </StrictMode>,
)
