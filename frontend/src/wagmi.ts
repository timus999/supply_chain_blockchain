import { http } from 'viem';
import { createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Export chain configuration
export { sepolia };

// Configure chains & providers
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY'), // Replace with your Alchemy API key
  },
});

// Export types
export type Config = typeof config; 