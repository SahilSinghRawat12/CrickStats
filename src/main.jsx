import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppContextProvider from './context/AppContext.jsx'
import { FetchContextProvider } from './context/FetchContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AuthProvider>
    <FetchContextProvider>
    <AppContextProvider>
      <App />
      <Toaster/>
    </AppContextProvider>
    </FetchContextProvider>
    </AuthProvider>
  </HashRouter>
 
)
