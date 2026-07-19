import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Imported BrowserRouter
import './index.css'
import App from './App.jsx'

// Wrapped the App component inside BrowserRouter so Routing works throughout the app.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
