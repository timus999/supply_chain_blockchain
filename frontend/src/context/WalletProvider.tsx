'use client'

import { cookieStorage, createStorage } from '@wagmi/core'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi' // Remove AppKit adapter import
// import { mainnet, arbitrum, sepolia, AppKitNetwork } from '@reown/appkit/networks' // Remove AppKit networks import

// Import chains from wagmi/chains and http from wagmi
import { Chain, mainnet, arbitrum, sepolia } from 'wagmi/chains'
import { http } from 'wagmi' // Import http directly from wagmi

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import the necessary functions from wagmi and @web3modal/wagmi/react
import { createConfig } from 'wagmi'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import { createWeb3Modal } from '@web3modal/wagmi/react'

import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Get projectId from https://cloud.reown.com
// You might need to replace this with your actual project ID or an environment variable
// Use the projectId from your wallet/my-app config
// Read the projectId from the environment variable
export const projectId = '4c1e04d57f1b32eb053f1ec427f17fcc';

if (!projectId) {
  console.warn('Project ID is not defined. Wallet connection might not work.')
}

// Declare chains as a readonly tuple with at least one Chain element
export const chains: readonly [Chain, ...Chain[]] = [mainnet, arbitrum, sepolia];

// 2. Create wagmiConfig
const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({ projectId, showQrModal: false }),
    metaMask(),
    safe(),
  ],
})

// Set up queryClient
const queryClient = new QueryClient()

// 3. Create modal metadata
const metadata = {
  name: 'MediChain Tracker',
  description: 'Pharmaceutical Supply Chain Management',
  url: 'YOUR_APP_URL', // TODO: Replace with your app URL
  icons: ['https://assets.reown.com/reown-profile-pic.png'] // TODO: Replace with your app icon
}

// 4. Create Web3Modal instance
createWeb3Modal({
  wagmiConfig: wagmiConfig, // Use the wagmi config
  projectId,
  metadata,
})

function WalletProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiConfig as Config, cookies)

  return (
    // WagmiProvider and QueryClientProvider remain the same
    // The modal is managed by the createWeb3Modal call and the <w3m-button />
    <WagmiProvider config={wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
           {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default WalletProvider 