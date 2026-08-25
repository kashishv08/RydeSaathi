import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/styles.css'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
      gcTime: 0,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="bottom-center" richColors />
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
