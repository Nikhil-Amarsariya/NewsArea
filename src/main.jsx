import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Theme/Global.css'
import './Theme/light.css'
import './Theme/dark.css'
import './Theme/navbar.css'
import './Theme/newscard.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
