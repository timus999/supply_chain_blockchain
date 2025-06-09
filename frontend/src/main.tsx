import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import WalletProvider from './context/WalletProvider.tsx'

// Get cookies from the document
const cookies = typeof document !== 'undefined' ? document.cookie : null;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider cookies={cookies}>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
