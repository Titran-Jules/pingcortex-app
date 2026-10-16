import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, Toaster } from '@pingcortex/ui'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
