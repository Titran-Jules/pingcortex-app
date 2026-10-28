import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, Toaster } from '@pingcortex/ui'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import { queryClient } from './lib/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AuthProvider>
          <App />
        </AuthProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} position="bottom" />}
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
