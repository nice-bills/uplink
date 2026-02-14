import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import App from './App'
import { config } from './lib/wallet'
import './index.css'

const queryClient = new QueryClient()

/* Industrial dark theme for RainbowKit */
const genesisTheme = darkTheme({
  accentColor: '#FF4D4D',
  accentColorForeground: '#000',
  borderRadius: 'none',
  fontStack: 'system',
})

// Override specific token values to match our zinc palette
genesisTheme.colors.connectButtonBackground = '#18181B'
genesisTheme.colors.connectButtonInnerBackground = '#27272A'
genesisTheme.colors.connectButtonText = '#FAFAFA'
genesisTheme.colors.modalBackground = '#18181B'
genesisTheme.colors.modalBorder = '#3F3F46'
genesisTheme.fonts.body = "'IBM Plex Mono', monospace"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={genesisTheme}>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
