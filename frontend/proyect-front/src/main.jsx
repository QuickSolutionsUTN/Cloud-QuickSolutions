import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext.jsx';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { BackendURLProvider } from './contexts/BackendURLContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BackendURLProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BackendURLProvider>
  </StrictMode>,
)
