import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, Toaster } from '@pingcortex/ui'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
