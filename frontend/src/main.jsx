import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// Set the base URL globally so all axios calls work in both local dev and production.
// In production (Vercel), VITE_API_URL must be set to the Render backend URL.
// In local dev, it falls back to '' so the Vite proxy handles /api/* calls.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
