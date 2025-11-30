import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // Disabled StrictMode to prevent double mounting/rendering in development
  // which causes duplicate socket connections and API calls
  <App />
)
