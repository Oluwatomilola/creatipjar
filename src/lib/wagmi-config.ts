import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

// Get projectId from environment or use a public one
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3fbb6bba6f1de962d911bb5b5c9ddd26';

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'CreatipJar',
  description: 'Send ETH and USDC tips on Base network',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://creatipjar.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Define chains - Base mainnet and Sepolia testnet
const chains = [base, baseSepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});

// Create modal
export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': 'hsl(160 84% 39%)',
    '--w3m-accent': 'hsl(160 84% 39%)',
  }
});
